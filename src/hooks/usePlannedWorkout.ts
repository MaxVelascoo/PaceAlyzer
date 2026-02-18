'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { PlannedWorkout } from '@/components/PlannedWorkoutCard';

export function usePlannedWorkout(userId: string | undefined, dateKey: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState<PlannedWorkout | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!userId || !dateKey) {
        setWorkout(null);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('planned_workouts')
        .select('id,user_id,date,title,description,planned_duration_s,planned_distance_m,structure,status,source,created_at,updated_at')
        .eq('user_id', userId)
        .eq('date', dateKey)
        .maybeSingle();

      if (error) {
        setError(error.message);
        setWorkout(null);
      } else {
        setWorkout((data as PlannedWorkout) ?? null);
      }

      setLoading(false);
    };

    run();
  }, [userId, dateKey]);

  return { loading, workout, error };
}
