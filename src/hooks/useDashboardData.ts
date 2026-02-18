import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Training } from '@/types/training';

function formatYMDLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function useDashboardData(userId: string |undefined, semanaOffset: number) {
  const [hasStrava, setHasStrava] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [trainingsByDate, setTrainingsByDate] = useState<Record<string, Training[]>>({});

  const { startOfWeek, endOfWeek } = useMemo(() => {
    const hoy = new Date();
    const hoyDia = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;

    const start = new Date(hoy);
    start.setHours(0, 0, 0, 0);
    start.setDate(hoy.getDate() - hoyDia + semanaOffset * 7);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { startOfWeek: start, endOfWeek: end };
  }, [semanaOffset]);

  useEffect(() => {
    if (!userId) {
      console.warn('[useDashboardData] ❗ No userId, abortando fetch');
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);

        const startStr = formatYMDLocal(startOfWeek);
        const endStr = formatYMDLocal(endOfWeek);

        console.groupCollapsed('[useDashboardData] 🧪 Debug');
        console.log('userId:', userId);
        console.log('semanaOffset:', semanaOffset);
        console.log('startOfWeek (Date):', startOfWeek);
        console.log('endOfWeek (Date):', endOfWeek);
        console.log('startStr (YYYY-MM-DD):', startStr);
        console.log('endStr (YYYY-MM-DD):', endStr);
        console.groupEnd();

        // 1) Strava conectado
        const { data: stravaAccount, error: stravaError } = await supabase
          .from('strava_accounts')
          .select('strava_id')
          .eq('user_id', userId)
          .maybeSingle();

        if (stravaError) console.error('[useDashboardData] ❌ Strava error:', stravaError);
        if (cancelled) return;

        console.log('[useDashboardData] ✅ Strava account:', stravaAccount);
        setHasStrava(!!stravaAccount?.strava_id);

        // 2) Trainings (solo columnas necesarias)
        const { data: trainings, error: trainingsError } = await supabase
          .from('trainings')
          .select('activity_id, date, duration, distance, avgheartrate, weighted_average_watts')
          .eq('user_id', userId)
          .gte('date', startStr)
          .lte('date', endStr);

        if (trainingsError) {
          console.error('[useDashboardData] ❌ Trainings error:', trainingsError);
        } else {
          console.groupCollapsed('[useDashboardData] ✅ Trainings OK');
          console.log('count:', trainings?.length ?? 0);
          console.log('rows:', trainings);
          // ayuda extra: ver qué date viene realmente
          if (trainings?.length) {
            console.log('sample date:', trainings[0]?.date);
            console.log('all dates:', trainings.map(t => t.date));
          }
          console.groupEnd();
        }

        if (cancelled) return;

        const grouped: Record<string, Training[]> = {};
        (trainings ?? []).forEach((t: Training) => {
          (grouped[t.date] ||= []).push(t);
        });

        console.groupCollapsed('[useDashboardData] 🗂 grouped trainingsByDate');
        console.log('keys:', Object.keys(grouped));
        console.log('grouped:', grouped);
        console.groupEnd();

        setTrainingsByDate(grouped);
      } catch (err) {
        console.error('[useDashboardData] 🔥 Error inesperado:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [userId, semanaOffset, startOfWeek, endOfWeek]);

  useEffect(() => {
    console.groupCollapsed('[useDashboardData] 📦 state update');
    console.log('loading:', loading);
    console.log('hasStrava:', hasStrava);
    console.log('trainingsByDate keys:', Object.keys(trainingsByDate));
    console.groupEnd();
  }, [loading, hasStrava, trainingsByDate]);

  return {
    hasStrava,
    loading,
    trainingsByDate,
    startOfWeek,
  };
}