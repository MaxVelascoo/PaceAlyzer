'use client';
import React, { useEffect, useState } from 'react';
import { Syne } from 'next/font/google';
import { useUser } from '@/context/userContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
function DashboardContent() {
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [diaSeleccionado, setDiaSeleccionado] = useState(0);
  const [hasStrava, setHasStrava] = useState<boolean | null>(null);

  const userContext = useUser();
  const user = userContext?.user;
  const router = useRouter();

  const hoy = new Date();
  const hoyDia = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1; // convertir domingo(0) en 6
  const startOfWeek = new Date(hoy);
  const diff = hoy.getDate() - hoy.getDay() + 1;
  startOfWeek.setDate(diff + semanaOffset * 7);

  const mes = startOfWeek.toLocaleString('es-ES', { month: 'long' });

  const diasConFechas = dias.map((dia, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return { nombre: dia, numero: d.getDate(), esHoy: semanaOffset === 0 && i === hoyDia };
  });

  const esSemanaActual = semanaOffset === 0;

  useEffect(() => {
    const checkStrava = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('strava_accounts')
        .select('strava_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !data?.strava_id) {
        setHasStrava(false);
      } else {
        setHasStrava(true);
      }
    };

    checkStrava();
  }, [user]);

  return (
    <div className="dashboard">
      <div className={`mes ${syne.className}`}>
        {mes.charAt(0).toUpperCase() + mes.slice(1)}
      </div>

      <div className="week-control">
        <button className="arrow" onClick={() => setSemanaOffset(semanaOffset - 1)}>‹</button>

        <div className="dias-semana">
          {diasConFechas.map((d, i) => (
            <button
              key={d.nombre}
              className={`dia ${syne.className} ${i === diaSeleccionado ? 'activo' : ''} ${d.esHoy ? 'hoy' : ''}`}
              onClick={() => setDiaSeleccionado(i)}
            >
              <div className="dia-num">{d.numero}</div>
              <div>{d.nombre}</div>
            </button>
          ))}
        </div>

        <button
          className="arrow"
          onClick={() => setSemanaOffset(semanaOffset + 1)}
          disabled={esSemanaActual}
        >
          ›
        </button>
      </div>

      <div className="contenido-dia">
        {/* Línea eliminada: ya no mostramos el título con el nombre del día */}

        <p className={syne.className}>No hay entrenamiento de este día.</p>

        {hasStrava === false && (
          <div className="strava-warning">
            <p className={syne.className}>
              Para ver tus entrenamientos, necesitas conectar tu cuenta de Strava.
            </p>
            <button className="form-button" onClick={() => router.push('/connect-strava')}>
              Conectar con Strava
            </button>
          </div>
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
