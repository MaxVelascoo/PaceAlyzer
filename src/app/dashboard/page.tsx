'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Syne } from 'next/font/google';
import { useUser } from '@/context/userContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import WeekHeader from '@/components/WeekHeader';
import { useDashboardData } from '@/hooks/useDashboardData';
import PlannedWorkoutCard from '@/components/PlannedWorkoutCard';
import { usePlannedWorkout } from '@/hooks/usePlannedWorkout';
import DoneWorkoutCard from '@/components/DoneWorkoutCard';


import styles from './dashboard.module.css';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function DashboardContent() {
  const hoy = new Date();
  const hoyDia = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;

  const [semanaOffset, setSemanaOffset] = useState(0);
  const [diaSeleccionado, setDiaSeleccionado] = useState(hoyDia);

  useEffect(() => {
    setDiaSeleccionado(semanaOffset === 0 ? hoyDia : 0);
  }, [semanaOffset, hoyDia]);

  const user = useUser()?.user;

  // ✅ hook "limpio" (trainingsByDate)
  const { hasStrava, loading, trainingsByDate, startOfWeek, refetch } = useDashboardData(user?.id, semanaOffset);

  const mes = startOfWeek.toLocaleString('es-ES', { month: 'long' });

  const diasConFechas = useMemo(() => {
    return dias.map((dia, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      // clave LOCAL YYYY-MM-DD
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return {
        nombre: dia,
        numero: d.getDate(),
        esHoy: semanaOffset === 0 && i === hoyDia,
        key,
      };
    });
  }, [startOfWeek, semanaOffset, hoyDia]);

  const selectedKey = diasConFechas[diaSeleccionado]?.key;
  const { loading: loadingPlanned, workout: plannedWorkout } = usePlannedWorkout(user?.id, selectedKey);
  const entreno = selectedKey ? (trainingsByDate[selectedKey] || [])[0] : undefined;

  /** --------- REFRESH / SYNC (PRO) ---------
   * Estrategia recomendada:
   * - API server-side: calcula last training date en DB y pide a Strava desde lastDate-1 día
   * - upsert por activity_id
   * Aquí en UI solo dispara la sync y luego refetch.
   */
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const handleSync = async () => {
    if (!user?.id || syncing) return;
    setSyncError(null);

    try {
      setSyncing(true);

      // Calcular fechas de inicio y fin de la semana actual
      const startStr = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`;
      const endDate = new Date(startOfWeek);
      endDate.setDate(startOfWeek.getDate() + 6);
      const endStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

      const res = await fetch('/api/strava/sync-trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          startDate: startStr,
          endDate: endStr
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Error sincronizando entrenos');

      // Refetch data sin recargar la página
      refetch();
    } catch (e) {
      const error = e as Error;
      console.error(error);
      setSyncError(error?.message ?? 'Error sincronizando entrenos');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={`${styles.mes} ${syne.className}`}>
          {mes.charAt(0).toUpperCase() + mes.slice(1)}
        </div>

        {/* ✅ WeekHeader + botón refresh a la derecha */}
        <div className={styles.weekHeaderRow}>
          <WeekHeader
            diasConFechas={diasConFechas}
            diaSeleccionado={diaSeleccionado}
            semanaOffset={semanaOffset}
            onDiaClick={setDiaSeleccionado}
            onPrev={() => setSemanaOffset(o => o - 1)}
            onNext={() => setSemanaOffset(o => o + 1)}
          />

          <button
            type="button"
            className={styles.refreshButton}
            onClick={handleSync}
            disabled={syncing || !user?.id || hasStrava === false}
            title={hasStrava === false ? 'Conecta Strava para sincronizar' : 'Sincronizar entrenos'}
            aria-label="Sincronizar entrenos"
          >
            <img
              src="/refresh-icon.png"
              alt=""
              className={syncing ? `${styles.refreshIcon} ${styles.spin}` : styles.refreshIcon}
            />
          </button>
        </div>

        {syncError && <div className={styles.syncError}>{syncError}</div>}

        <div className={styles.contenidoDia}>
          <div className={styles.twoCardsLayout}>
            {/* IZQUIERDA: Planificado */}
            <section className={styles.cardBlock}>
              <h3 className={`${styles.cardHeading} ${syne.className}`}>ENTRENO PLANIFICADO</h3>

              <div className={`${styles.cardShell} ${styles.planned}`}>
                {!user?.id ? (
                  <div className={styles.emptyState}><p>No hay usuario</p></div>
                ) : loadingPlanned ? (
                  <div className={styles.emptyState}><p>Cargando…</p></div>
                ) : plannedWorkout ? (
                  <div className={syne.className}>
                    <PlannedWorkoutCard workout={plannedWorkout} />
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <p>No hay entreno planificado este día</p>
                  </div>
                )}
              </div>
            </section>

            {/* DERECHA: Hecho */}
            <section className={styles.cardBlock}>
              <h3 className={`${styles.cardHeading} ${syne.className}`}>ENTRENO HECHO</h3>

              <div className={`${styles.cardShell} ${styles.done}`}>
                {loading ? (
                  <div className={styles.emptyState}>
                    <p>Cargando…</p>
                  </div>
                ) : !user?.id ? (
                  <div className={styles.emptyState}>
                    <p>No hay usuario</p>
                  </div>
                ) : hasStrava === false ? (
                  <div className={styles.emptyState}>
                    <p>Conecta Strava para ver tus entrenos</p>
                  </div>
                ) : entreno ? (
                  <div className={syne.className}>
                    <DoneWorkoutCard training={entreno} className={syne.className} />
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <p>No hay entreno registrado este día</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
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
