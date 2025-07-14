// hooks/useDashboardData.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Training, Lap } from '@/types/training';

export function useDashboardData(userId: string | undefined, semanaOffset: number) {
  const [hasStrava, setHasStrava] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [trainingsByDate, setTrainingsByDate] = useState<Record<string, Training[]>>({});
  const [lapsByActivity, setLapsByActivity] = useState<Record<number, Lap[]>>({});
  const [analysisByActivity, setAnalysisByActivity] = useState<Record<number, string>>({});

  const hoy = new Date();
  const hoyDia = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;
  const startOfWeek = new Date(hoy);
  startOfWeek.setDate(hoy.getDate() - hoyDia + semanaOffset * 7);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);

      // 1. Strava conectado
      const { data: stravaAccount } = await supabase
        .from('strava_accounts')
        .select('strava_id')
        .eq('user_id', userId)
        .maybeSingle();
      setHasStrava(!!stravaAccount?.strava_id);

      // 2. Trainings
      const { data: trainings } = await supabase
        .from('trainings')
        .select('activity_id, name, date, distance, duration, avgheartrate, avgpower, weighted_average_watts')
        .eq('user_id', userId)
        .gte('date', startOfWeek.toISOString().split('T')[0])
        .lte('date', endOfWeek.toISOString().split('T')[0]);

      const grouped: Record<string, Training[]> = {};
      trainings?.forEach(t => {
        grouped[t.date] = grouped[t.date] || [];
        grouped[t.date].push(t);
      });
      setTrainingsByDate(grouped);

      const ids = trainings?.map(t => t.activity_id) || [];

      // 3. Laps
      const { data: laps } = await supabase
        .from('laps')
        .select('activity_id, lap_index, duration_seconds, average_watts, average_heartrate')
        .in('activity_id', ids);
      const lapsMap: Record<number, Lap[]> = {};
      laps?.forEach(l => {
        lapsMap[l.activity_id] = lapsMap[l.activity_id] || [];
        lapsMap[l.activity_id].push(l);
      });
      setLapsByActivity(lapsMap);

      // 4. Analyses
      const { data: analyses } = await supabase
        .from('training_analyses')
        .select('training_id, html_analysis')
        .in('training_id', ids);
      const analysisMap: Record<number, string> = {};
      analyses?.forEach(a => {
        analysisMap[a.training_id] = a.html_analysis;
      });
      setAnalysisByActivity(analysisMap);

      setLoading(false);
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
