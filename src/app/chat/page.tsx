'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Syne } from 'next/font/google';
import styles from './chat.module.css';
import { useUser } from '@/context/userContext';
import { usePlannedWorkout } from '@/hooks/usePlannedWorkout';
import { supabase } from '@/lib/supabaseClient';

import ChatSidebar, { WeekDay } from '@/components/chat/ChatSideBar';
import ChatThread, { ChatMessage } from '@/components/chat/ChatThread';
import MessageComposer from '@/components/chat/MessageComposer';

const syne = Syne({ subsets: ['latin'], weight: ['700', '800'] });

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

  const weekDays: WeekDay[] = useMemo(
    () => [
      { key: 'L', label: 'L', date: '2026-02-16' },
      { key: 'M', label: 'M', date: '2026-02-17' },
      { key: 'X', label: 'X', date: '2026-02-18' },
      { key: 'J', label: 'J', date: '2026-02-19' },
      { key: 'V', label: 'V', date: '2026-02-20' },
    ],
    []
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'u1',
      role: 'user',
      content: '¿Me puedes mover el entreno del jueves al viernes?',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'a1',
      role: 'assistant',
      content:
        'Claro! He movido el entrenamiento planificado del jueves al viernes. Así tendrás más tiempo para recuperarte.',
      createdAt: new Date().toISOString(),
      actionCard: {
        title: 'Viernes 26 abril',
        workoutTitle: 'Fuerza + Sprints Neuromusculares',
        zone: 'Zona 2',
        duration: '44m',
        bullets: [
          { label: 'Calentamiento', detail: '20 min' },
          { label: 'Sprint', detail: '10s', sub: 'Repeat explosividad' },
          { label: 'Recuperación', detail: '2 min', sub: 'Zona 2' },
          { label: 'Tempo Final', detail: '15 min', sub: 'Zona 3' },
        ],
        actions: [
          { id: 'apply_1', label: 'Aplicar cambios', variant: 'primary' },
          { id: 'undo_1', label: 'Deshacer', variant: 'ghost' },
        ],
      },
    },
    {
      id: 'u2',
      role: 'user',
      content: 'Vale, ¡aplica los cambios!',
      createdAt: new Date().toISOString(),
    },
  ]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: `u_${crypto.randomUUID()}`, role: 'user', content: trimmed, createdAt: new Date().toISOString() },
      {
        id: `a_${crypto.randomUUID()}`,
        role: 'assistant',
        content: 'Perfecto. Tengo la propuesta lista para aplicar. ¿Confirmas?',
        createdAt: new Date().toISOString(),
        actionCard: {
          title: 'Cambios propuestos',
          workoutTitle: 'Mover sesión J → V',
          zone: 'Impacto: bajo',
          duration: '—',
          bullets: [
            { label: 'Jueves', detail: 'Descanso / Z1-Z2', sub: 'Recuperación activa' },
            { label: 'Viernes', detail: 'Fuerza + Sprints', sub: 'Mantiene calidad' },
          ],
          actions: [
            { id: 'apply_2', label: 'Aplicar cambios', variant: 'primary' },
            { id: 'undo_2', label: 'Deshacer', variant: 'ghost' },
          ],
        },
      },
    ]);
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
      <div className={`${styles.page} ${syne.className}`}>
        <div className={styles.shell}>
          <ChatSidebar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            weekDays={weekDays}
            plannedWorkout={plannedWorkout}
            loading={loadingPlanned}
          />

          <div className={styles.threadCol}>
            <ChatThread messages={messages} onAction={handleAction} userAvatarUrl={userAvatarUrl} />
            <MessageComposer onSend={handleSend} placeholder="Escribe tu petición…" />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
