'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useUser } from '@/context/userContext';
import { supabase } from '@/lib/supabaseClient';
import styles from './calendario.module.css';

type PlannedDay = { date: string; title: string; duration_s: number };
type DoneDay = { date: string; name: string; distance: number | null; duration: number | null };
type WeekSummary = {
  iso_year: number; iso_week: number;
  completed_distance_km: number; completed_hours: number; completed_tss: number;
  ctl_end: number | null; atl_end: number | null; tsb_end: number | null;
};

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function isoToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function fmtDuration(s: number) {
  const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function fmtKm(m: number | null) { return m ? `${(m / 1000).toFixed(0)}km` : ''; }
function fmtHours(h: number) {
  const hh = Math.floor(h); const mm = Math.round((h - hh) * 60);
  return hh > 0 ? `${hh}h ${mm}m` : `${mm}m`;
}

export default function CalendarioPage() {
  const user = useUser()?.user;
  const router = useRouter();
  const today = isoToday();

  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [planned, setPlanned] = useState<PlannedDay[]>([]);
  const [done, setDone] = useState<DoneDay[]>([]);
  const [weekSummaries, setWeekSummaries] = useState<WeekSummary[]>([]);

  const { totalDays, startOffset } = useMemo(() => {
    const first = new Date(year, month, 1);
    const total = new Date(year, month + 1, 0).getDate();
    const dow = first.getDay();
    return { totalDays: total, startOffset: dow === 0 ? 6 : dow - 1 };
  }, [year, month]);

  const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(totalDays).padStart(2, '0')}`;

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      const [plannedRes, doneRes, weekRes] = await Promise.all([
        supabase.from('planned_workouts').select('date, title, planned_duration_s')
          .eq('user_id', user.id).gte('date', monthStart).lte('date', monthEnd),
        supabase.from('trainings').select('date, name, distance, duration')
          .eq('user_id', user.id).gte('date', monthStart).lte('date', monthEnd),
        supabase.from('weekly_summaries')
          .select('iso_year, iso_week, completed_distance_km, completed_hours, completed_tss, ctl_end, atl_end, tsb_end')
          .eq('user_id', user.id)
          .gte('week_start_date', monthStart).lte('week_start_date', monthEnd),
      ]);
      setPlanned((plannedRes.data ?? []).map(r => ({ date: r.date, title: r.title, duration_s: r.planned_duration_s })));
      setDone((doneRes.data ?? []).map(r => ({ date: r.date, name: r.name ?? '', distance: r.distance, duration: r.duration })));
      setWeekSummaries(weekRes.data ?? []);
    };
    load();
  }, [user?.id, monthStart, monthEnd]);

  const plannedByDate = useMemo(() => {
    const m: Record<string, PlannedDay[]> = {};
    planned.forEach(p => { (m[p.date] ||= []).push(p); });
    return m;
  }, [planned]);

  const doneByDate = useMemo(() => {
    const m: Record<string, DoneDay[]> = {};
    done.forEach(d => { (m[d.date] ||= []).push(d); });
    return m;
  }, [done]);

  // Mapa de semanas ISO → summary
  const summaryByWeek = useMemo(() => {
    const m: Record<string, WeekSummary> = {};
    weekSummaries.forEach(w => { m[`${w.iso_year}-${w.iso_week}`] = w; });
    return m;
  }, [weekSummaries]);

  const monthName = new Date(year, month, 1).toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  // Construir filas de semanas: cada fila = 7 días + 1 columna de resumen
  const weeks = useMemo(() => {
    const cells: (number | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    const rows: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [startOffset, totalDays]);

  const handleDayClick = (day: number) => {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    router.push(`/calendario/dia?date=${iso}`);
  };

  // Obtener ISO week de un día del mes
  const getIsoWeek = (day: number) => {
    const d = new Date(year, month, day);
    const jan4 = new Date(d.getFullYear(), 0, 4);
    const startOfWeek1 = new Date(jan4);
    startOfWeek1.setDate(jan4.getDate() - (jan4.getDay() || 7) + 1);
    const weekNum = Math.floor((d.getTime() - startOfWeek1.getTime()) / (7 * 86400000)) + 1;
    return `${d.getFullYear()}-${weekNum}`;
  };

  return (
    <ProtectedRoute>
      <div className={styles.calPage}>
        <div className={styles.calContainer}>

          <div className={styles.calHeader}>
            <button className={styles.calNavBtn} onClick={prevMonth}>‹</button>
            <h1 className={styles.calTitle}>{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</h1>
            <button className={styles.calNavBtn} onClick={nextMonth}>›</button>
          </div>

          {/* Cabecera: 7 días + columna resumen */}
          <div className={styles.calWeekRow}>
            {DAYS.map(d => <div key={d} className={styles.calWeekLabel}>{d}</div>)}
            <div className={styles.calWeekLabel} style={{ textAlign: 'center' }}>Resumen</div>
          </div>

          {/* Filas de semanas */}
          {weeks.map((row, rowIdx) => {
            // Encontrar el primer día real de la fila para obtener la semana ISO
            const firstReal = row.find(d => d !== null);
            const weekKey = firstReal ? getIsoWeek(firstReal) : null;
            const summary = weekKey ? summaryByWeek[weekKey] : null;

            return (
              <div key={rowIdx} className={styles.calRow}>
                {row.map((day, colIdx) => {
                  if (!day) return <div key={`e-${rowIdx}-${colIdx}`} className={styles.calCellEmpty} />;
                  const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isToday = iso === today;
                  const pList = plannedByDate[iso] ?? [];
                  const dList = doneByDate[iso] ?? [];
                  return (
                    <div key={iso}
                      className={`${styles.calCell} ${isToday ? styles.calCellToday : ''}`}
                      onClick={() => handleDayClick(day)}
                    >
                      <span className={styles.calDayNum}>{day}</span>
                      {pList.map((p, j) => (
                        <div key={`p-${j}`} className={styles.calPill} title={p.title}>
                          <span className={styles.calPillDot} style={{ background: '#6366f1' }} />
                          <span className={styles.calPillText}>{p.title}</span>
                          <span className={styles.calPillMeta}>{fmtDuration(p.duration_s)}</span>
                        </div>
                      ))}
                      {dList.map((d, j) => (
                        <div key={`d-${j}`} className={`${styles.calPill} ${styles.calPillDone}`} title={d.name}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
                            <span className={styles.calPillDot} style={{ background: '#FC4C02', flexShrink: 0 }} />
                            <span className={styles.calPillText}>{d.name || 'Entreno'}</span>
                          </div>
                          <span className={styles.calPillMeta}>{fmtKm(d.distance)}{d.duration ? ` · ${fmtDuration(d.duration)}` : ''}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}

                {/* Columna resumen semanal */}
                {(() => {
                  // Mostrar resumen solo si la semana ya ha empezado
                  const firstRealDay = row.find(d => d !== null);
                  if (!firstRealDay) return <div className={styles.calWeekSummary} />;
                  const weekStartIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(firstRealDay).padStart(2, '0')}`;
                  const weekHasStarted = weekStartIso <= today;
                  return (
                    <div className={styles.calWeekSummary}>
                      {summary && weekHasStarted ? (
                    <>
                      <div className={styles.calWeekRow1}>
                        <div className={styles.calWeekStat}>
                          <span className={styles.calWeekStatVal}>{Math.round(summary.completed_distance_km)}</span>
                          <span className={styles.calWeekStatLbl}>km</span>
                        </div>
                        <div className={styles.calWeekStat}>
                          <span className={styles.calWeekStatVal}>{fmtHours(summary.completed_hours)}</span>
                        </div>
                        <div className={styles.calWeekStat}>
                          <span className={styles.calWeekStatVal}>{Math.round(summary.completed_tss)}</span>
                          <span className={styles.calWeekStatLbl}>TSS</span>
                        </div>
                      </div>
                      <div className={styles.calWeekDivider} />
                      <div className={styles.calWeekRow2}>
                        <div className={styles.calWeekStat}>
                          <span className={styles.calWeekStatVal} style={{ color: '#4a90d9' }}>{summary.ctl_end?.toFixed(0) ?? '—'}</span>
                          <span className={styles.calWeekStatLbl}>CTL</span>
                        </div>
                        <div className={styles.calWeekStat}>
                          <span className={styles.calWeekStatVal} style={{ color: '#e05c5c' }}>{summary.atl_end?.toFixed(0) ?? '—'}</span>
                          <span className={styles.calWeekStatLbl}>ATL</span>
                        </div>
                        <div className={styles.calWeekStat}>
                          <span className={styles.calWeekStatVal} style={{ color: '#5cb85c' }}>{summary.tsb_end != null ? (summary.tsb_end > 0 ? '+' : '') + summary.tsb_end.toFixed(0) : '—'}</span>
                          <span className={styles.calWeekStatLbl}>TSB</span>
                        </div>
                      </div>
                    </>
                  ) : (
                        <span className={styles.calWeekEmpty}>—</span>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })}

        </div>
      </div>
    </ProtectedRoute>
  );
}
