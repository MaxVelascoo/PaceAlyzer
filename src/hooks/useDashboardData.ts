import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Training, Lap } from '@/types/training';

export function useDashboardData(userId: string | undefined, semanaOffset: number) {
  const [hasStrava, setHasStrava] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [trainingsByDate, setTrainingsByDate] = useState<Record<string, Training[]>>({});
  const [lapsByActivity, setLapsByActivity] = useState<Record<number, Lap[]>>({});
  const [analysisByActivity, setAnalysisByActivity] = useState<
  Record<number, { analysis?: string; nutrition?: string; recuperation?: string }>
>({});

  const hoy = new Date();
  const hoyDia = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;
  const startOfWeek = new Date(hoy);
  startOfWeek.setDate(hoy.getDate() - hoyDia + semanaOffset * 7);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('📆 Semana desde:', startOfWeek.toISOString(), 'hasta:', endOfWeek.toISOString());

        // 1. Verifica si el usuario tiene Strava conectado
        const { data: stravaAccount, error: stravaError } = await supabase
          .from('strava_accounts')
          .select('strava_id')
          .eq('user_id', userId)
          .maybeSingle();

        if (stravaError) {
          console.error('❌ Error obteniendo cuenta Strava:', stravaError.message);
        }
        setHasStrava(!!stravaAccount?.strava_id);

        // 2. Obtiene entrenamientos de esa semana
        const { data: trainings, error: trainingsError } = await supabase
          .from('trainings')
          .select('activity_id, name, date, distance, duration, avgheartrate, avgpower, weighted_avg_watts')
          .eq('user_id', userId)
          .gte('date', startOfWeek.toISOString().split('T')[0])
          .lte('date', endOfWeek.toISOString().split('T')[0]);

        if (trainingsError) {
          console.error('❌ Error obteniendo trainings:', trainingsError.message);
        } else {
          console.log('✅ Entrenamientos:', trainings);
        }

        const grouped: Record<string, Training[]> = {};
        trainings?.forEach(t => {
          grouped[t.date] = grouped[t.date] || [];
          grouped[t.date].push(t);
        });
        setTrainingsByDate(grouped);

        const ids = trainings?.map(t => t.activity_id) || [];

        // 3. Obtiene las vueltas (laps)
        const { data: laps, error: lapsError } = await supabase
          .from('laps')
          .select('activity_id, lap_index, duration_seconds, average_watts, average_heartrate')
          .in('activity_id', ids);

        if (lapsError) {
          console.error('❌ Error obteniendo laps:', lapsError.message);
        } else {
          console.log('✅ Laps:', laps);
        }

        const lapsMap: Record<number, Lap[]> = {};
        laps?.forEach(l => {
          lapsMap[l.activity_id] = lapsMap[l.activity_id] || [];
          lapsMap[l.activity_id].push(l);
        });
        setLapsByActivity(lapsMap);

        // 4. Obtiene análisis (html)
        const { data: analyses, error: analysisError } = await supabase
          .from('training_analyses')
          .select('training_id, analysis, nutrition, recuperation')
          .in('training_id', ids);

        if (analysisError) {
          console.error('❌ Error obteniendo analyses:', analysisError.message);
        }

        const analysisMap: Record<number, { analysis: string; nutrition: string; recuperation: string }> = {};
        analyses?.forEach(a => {
          analysisMap[a.training_id] = {
            analysis: a.analysis,
            nutrition: a.nutrition,
            recuperation: a.recuperation,
          };
        });
        setAnalysisByActivity(analysisMap);


      } catch (err) {
        console.error('🔥 Error inesperado en fetchData:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, semanaOffset]);

  return {
    hasStrava,
    loading,
    trainingsByDate,
    lapsByActivity,
    analysisByActivity,
    startOfWeek,
  };
}
