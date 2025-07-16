'use client';
import React, { useState } from 'react';
import { Syne } from 'next/font/google';
import { useUser } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import WeekHeader from '@/components/WeekHeader';
import TrainingSummaryCard from '@/components/TrainingSummaryCard';
import LapsBarChart from '@/components/LapsBarChart';
import AnalysisBox from '@/components/AnalysisBox';
import { useDashboardData } from '@/hooks/useDashboardData';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function DashboardContent() {
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [diaSeleccionado, setDiaSeleccionado] = useState(0);

  const user = useUser()?.user;
  const router = useRouter();

  const {
    hasStrava,
    loading,
    trainingsByDate,
    lapsByActivity,
    analysisByActivity,
    startOfWeek,
  } = useDashboardData(user?.id, semanaOffset);

  const hoy = new Date();
  const hoyDia = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;

  const mes = startOfWeek.toLocaleString('es-ES', { month: 'long' });
  const diasConFechas = dias.map((dia, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const key = d.toISOString().split('T')[0];
    return { nombre: dia, numero: d.getDate(), esHoy: semanaOffset === 0 && i === hoyDia, key };
  });

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
        {loading ? (
          <p className={syne.className}>Cargando entrenamientos…</p>
        ) : hasStrava === false ? (
          <div className="strava-warning">
            <p className={syne.className}>
              Para ver tus entrenamientos, necesitas conectar tu cuenta de Strava.
            </p>
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
                    style={{ maxWidth: '320px', opacity: 0.7, marginBottom: '20px' }}
                  />
                  <p className={syne.className}>No hay ningun entreno registrado este día</p>
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
