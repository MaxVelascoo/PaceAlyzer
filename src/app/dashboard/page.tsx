'use client';
import React, { useEffect, useState } from 'react';
import { Syne } from 'next/font/google';
import { useUser } from '@/context/userContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import WeekHeader from '@/components/WeekHeader';
import TrainingSummaryCard from '@/components/TrainingSummaryCard';
import LapsBarChart from '@/components/LapsBarChart';
import AnalysisBox from '@/components/AnalysisBox';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function DashboardContent() {
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [diaSeleccionado, setDiaSeleccionado] = useState(0);
  const [hasStrava, setHasStrava] = useState<boolean | null>(null);
  const [trainingsByDate, setTrainingsByDate] = useState<Record<string, any[]>>({});
  const [lapsByActivity, setLapsByActivity] = useState<Record<number, any[]>>({});
  const [analysisByActivity, setAnalysisByActivity] = useState<Record<number, string>>({});
  const [loadingTrainings, setLoadingTrainings] = useState(false);

  const user = useUser()?.user;
  const router = useRouter();

  const hoy = new Date();
  const hoyDia = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;
  const startOfWeek = new Date(hoy);
  startOfWeek.setDate(hoy.getDate() - hoyDia + semanaOffset * 7);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const mes = startOfWeek.toLocaleString('es-ES', { month: 'long' });

  const diasConFechas = dias.map((dia, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const key = d.toISOString().split('T')[0];
    return { nombre: dia, numero: d.getDate(), esHoy: semanaOffset === 0 && i === hoyDia, key };
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from('strava_accounts')
      .select('strava_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => setHasStrava(!error && !!data?.strava_id));
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      setLoadingTrainings(true);
      const start = startOfWeek.toISOString().split('T')[0];
      const end = endOfWeek.toISOString().split('T')[0];

      const { data: trainings, error: tErr } = await supabase
        .from('trainings')
        .select(`
          activity_id, name, date, distance, duration, avgheartrate, avgpower, weighted_average_watts
        `)
        .eq('user_id', user.id)
        .gte('date', start)
        .lte('date', end);
      setLoadingTrainings(false);
      if (tErr) return console.error('Fetch trainings:', tErr);

      const grouped: Record<string, any[]> = {};
      trainings.forEach(t => {
        grouped[t.date] = grouped[t.date] || [];
        grouped[t.date].push(t);
      });
      setTrainingsByDate(grouped);

      const ids = trainings.map(t => t.activity_id);
      if (ids.length === 0) return;

      const { data: laps, error: lErr } = await supabase
        .from('laps')
        .select('activity_id, lap_index, duration_seconds, average_watts, average_heartrate')
        .in('activity_id', ids);
      if (lErr) return console.error('Fetch laps:', lErr);

      const lapsMap: Record<number, any[]> = {};
      laps.forEach(l => {
        lapsMap[l.activity_id] = lapsMap[l.activity_id] || [];
        lapsMap[l.activity_id].push(l);
      });
      setLapsByActivity(lapsMap);

      const { data: analyses, error: aErr } = await supabase
        .from('training_analyses')
        .select('training_id, html_analysis')
        .in('training_id', ids);
      if (aErr) return console.error('Fetch analyses:', aErr);

      const analysisMap: Record<number, string> = {};
      analyses.forEach(a => {
        analysisMap[a.training_id] = a.html_analysis;
      });
      setAnalysisByActivity(analysisMap);
    };

    fetchAll();
  }, [user, semanaOffset]);

  return (
    <div className="dashboard">
      <div className={`mes ${syne.className}`}>{mes.charAt(0).toUpperCase() + mes.slice(1)}</div>

      <WeekHeader
        diasConFechas={diasConFechas}
        diaSeleccionado={diaSeleccionado}
        semanaOffset={semanaOffset}
        onDiaClick={setDiaSeleccionado}
        onPrev={() => setSemanaOffset(o => o - 1)}
        onNext={() => setSemanaOffset(o => o + 1)}
      />

      <div className="contenido-dia">
        {loadingTrainings ? (
          <p className={syne.className}>Cargando entrenamientos…</p>
        ) : hasStrava === false ? (
          <div className="strava-warning">
            <p className={syne.className}>Para ver tus entrenamientos, necesitas conectar tu cuenta de Strava.</p>
            <button className="form-button" onClick={() => router.push('/connect-strava')}>
              Conectar con Strava
            </button>
          </div>
        ) : (
          (() => {
            const key = diasConFechas[diaSeleccionado].key;
            const entrenos = trainingsByDate[key] || [];
            if (!entrenos.length) {
              return (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <img
                    src="/no-training.png"
                    alt="No training"
                    style={{ maxWidth: '220px', opacity: 0.7, marginBottom: '20px' }}
                  />
                  <p className={syne.className}>No hay entrenamiento en este día.</p>
                </div>
              );
            }

            return entrenos.map(t => (
              <div className="training-row" key={t.activity_id}>
                <div className="column-left">
                  <TrainingSummaryCard training={t} />
                  {lapsByActivity[t.activity_id] && (
                    <LapsBarChart laps={lapsByActivity[t.activity_id]} />
                  )}
                </div>
                <div className="column-right">
                  {analysisByActivity[t.activity_id] && (
                    <AnalysisBox html={analysisByActivity[t.activity_id]} />
                  )}
                </div>
              </div>
            ));

          })()
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
