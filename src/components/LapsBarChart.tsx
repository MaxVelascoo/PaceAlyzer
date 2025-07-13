'use client';
import React, { useEffect, useState } from 'react';
import { Syne } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useUser } from '@/context/userContext';
import { supabase } from '@/lib/supabaseClient';

export default function LapsBarChart({ laps }: { laps: any[] }) {
  const userContext = useUser();
  const user = userContext?.user;
  const [ftp, setFtp] = useState<number | null>(null);

  // 1. Fetch FTP from the database
  useEffect(() => {
    if (!user) return;
    const fetchFtp = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('ftp')
        .eq('id', user.id)
        .maybeSingle();

      if (data?.ftp) setFtp(data.ftp);
    };

    fetchFtp();
  }, [user]);

  // 2. Prepare chart data
  const data = laps.map((lap) => ({
    lap: `Lap ${lap.lap_index}`,
    potencia: Math.round(lap.average_watts),
  }));

  // 3. Function to calculate color based on FTP
  const getColor = (watts: number): string => {
    if (ftp === null) return '#ccc';
    const ratio = watts / ftp;

    if (ratio < 0.7) return '#A2D2FF'; // Azul claro (muy suave)
    if (ratio < 0.9) return '#FFC8A2'; // Naranja suave (tempo)
    if (ratio < 1.05) return '#FFB347'; // Naranja intenso (umbral)
    if (ratio < 1.2) return '#FF6B00'; // Naranja fuerte
    return '#FF3B3B'; // Rojo (zona muy alta)
  };

  return (
    <>
      <div className="card laps-bar-chart">
        <h4 className={`card-title ${syne.className}`}>Potencia por lap</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="lap" />
          <YAxis label={{ value: 'W', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => `${value} W`} />
          <Bar dataKey="potencia">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.potencia)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    </>
  );
}
