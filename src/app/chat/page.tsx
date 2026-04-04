'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './chat.module.css';
import { useUser } from '@/context/userContext';
import { usePlannedWorkout } from '@/hooks/usePlannedWorkout';
import { supabase } from '@/lib/supabaseClient';

import ChatSidebar, { WeekDay } from '@/components/chat/ChatSideBar';
import ChatThread, { ChatMessage } from '@/components/chat/ChatThread';
import MessageComposer from '@/components/chat/MessageComposer';


function isoTodayLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ChatPage() {
  const user = useUser()?.user;
  const [selectedDate, setSelectedDate] = useState<string>(isoTodayLocal());
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);

  // Obtener entreno planificado del día seleccionado
  const { loading: loadingPlanned, workout: plannedWorkout } = usePlannedWorkout(user?.id, selectedDate);

  // Obtener avatar del usuario
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user avatar:', error);
          return;
        }

        if (data?.avatar_url) {
          // Generar signed URL para el avatar
          const { data: signedData, error: signedError } = await supabase.storage
            .from('avatars')
            .createSignedUrl(data.avatar_url, 60 * 60); // 1 hora

          if (signedError) {
            console.error('Error generating signed URL:', signedError);
            return;
          }

          setUserAvatarUrl(signedData?.signedUrl ?? null);
        }
      } catch (err) {
        console.error('Exception fetching user avatar:', err);
      }
    };

    fetchUserAvatar();
  }, [user]);

  const weekDays: WeekDay[] = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=dom, 1=lun...
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const labels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    return labels.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return { key: label, label, date };
    });
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // Cargar historial de la sesión activa al montar
  useEffect(() => {
    if (!user?.id) return;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';
    fetch(`${backendUrl}/api/chat/history?user_id=${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.messages?.length) {
          setMessages(data.messages.map((m: { role: string; content: string; created_at: string }) => ({
            id: `hist_${crypto.randomUUID()}`,
            role: m.role as 'user' | 'assistant',
            content: m.content,
            createdAt: m.created_at,
          })));
        }
      })
      .catch(() => {}); // silencioso si falla
  }, [user?.id]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !user?.id) return;

    setMessages((prev) => [
      ...prev,
      { id: `u_${crypto.randomUUID()}`, role: 'user', content: trimmed, createdAt: new Date().toISOString() },
    ]);

    setIsThinking(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          message: trimmed,
          date: selectedDate,
        }),
      });

      const data = await res.json();
      const reply: string = res.ok
        ? data.reply
        : `Error del servidor: ${data.detail ?? res.statusText}`;

      setMessages((prev) => [
        ...prev,
        { id: `a_${crypto.randomUUID()}`, role: 'assistant', content: reply, createdAt: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error('Backend connection error:', err);
      setMessages((prev) => [
        ...prev,
        { id: `a_${crypto.randomUUID()}`, role: 'assistant', content: 'No pude conectar con el servidor.', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleAction = async (actionId: string) => {
    // TODO: aquí llamarás a /api/chat/apply-action con trace_id + actionId
    if (actionId.startsWith('apply')) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a_ok_${crypto.randomUUID()}`,
          role: 'assistant',
          content: '✅ Cambios aplicados. Ya lo verás reflejado en el calendario.',
          createdAt: new Date().toISOString(),
        },
      ]);
      return;
    }
    if (actionId.startsWith('undo')) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a_undo_${crypto.randomUUID()}`,
          role: 'assistant',
          content: '↩️ He deshecho la propuesta. Dime qué prefieres hacer.',
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.page}>
        <div className={styles.shell}>
          <ChatSidebar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            weekDays={weekDays}
            plannedWorkout={plannedWorkout}
            loading={loadingPlanned}
          />

          <div className={styles.threadCol}>
            <ChatThread messages={messages} onAction={handleAction} userAvatarUrl={userAvatarUrl} isThinking={isThinking} />
            <MessageComposer onSend={handleSend} placeholder="Escribe tu petición…" />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
