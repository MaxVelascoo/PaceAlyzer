'use client';
import React from 'react';
import Image from 'next/image';
import styles from '@/app/calendario/calendario.module.css';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ─── Sport classification ────────────────────────────────────────────────────

type SportKind = 'cycling' | 'running' | 'gym' | 'other';

const CYCLING_TYPES = ['Ride', 'VirtualRide', 'EBikeRide', 'eBikeRide', 'MountainBikeRide', 'GravelRide'];
const RUNNING_TYPES = ['Run', 'VirtualRun', 'TrailRun'];
const GYM_TYPES    = ['WeightTraining', 'Workout', 'Crossfit', 'Yoga', 'Pilates', 'Stretching', 'StairStepper', 'Elliptical'];

function getSportKind(type: string | null | undefined): SportKind {
  if (!type) return 'other';
  if (CYCLING_TYPES.includes(type)) return 'cycling';
  if (RUNNING_TYPES.includes(type)) return 'running';
  if (GYM_TYPES.includes(type))    return 'gym';
  return 'other';
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h${m}min`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDuration(totalSec: number | null | undefined) {
  if (totalSec == null) return '—';
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

function formatKm(distanceMeters: number | null | undefined, digits = 1) {
  if (distanceMeters == null || distanceMeters === 0) return '—';
  return `${(distanceMeters / 1000).toFixed(digits)} km`;
}

function formatBpm(bpm: number | null | undefined) {
  if (bpm == null) return '—';
  return `${Math.round(bpm)} ppm`;
}

function formatWatts(w: number | null | undefined) {
  if (w == null) return '—';
  return `${Math.round(w)} W`;
}

function formatElevation(m: number | null | undefined) {
  if (m == null || m === 0) return '—';
  return `${Math.round(m)} m`;
}

function formatSpeed(distanceMeters: number | null | undefined, durationSec: number | null | undefined) {
  if (!distanceMeters || !durationSec || durationSec === 0) return '—';
  const kmh = (distanceMeters / 1000) / (durationSec / 3600);
  return `${kmh.toFixed(1)} km/h`;
}

function formatPace(distanceMeters: number | null | undefined, durationSec: number | null | undefined) {
  if (!distanceMeters || !durationSec || distanceMeters === 0) return '—';
  const secPerKm = durationSec / (distanceMeters / 1000);
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, '0')} /km`;
}

function formatTSS(tss: number | null): string {
  return tss == null ? '—' : String(tss);
}

function calculateTSS(
  duration_sec: number | null | undefined,
  np: number | null | undefined,
  ftp: number | null | undefined,
): number | null {
  if (!duration_sec || !np || !ftp || ftp === 0) return null;
  const IF = np / ftp;
  return Math.round((duration_sec * np * IF) / (ftp * 3600) * 100);
}

// ─── Stream helpers ──────────────────────────────────────────────────────────

function smoothStream(stream: number[], windowSec = 10): { time: number; watts: number }[] {
  const result: { time: number; watts: number }[] = [];
  for (let i = 0; i < stream.length; i += windowSec) {
    const slice = stream.slice(i, i + windowSec);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    result.push({ time: i, watts: Math.round(avg) });
  }
  return result;
}

function calculateXTicks(dataLength: number): number[] {
  const totalMinutes = dataLength / 60;
  let intervalMinutes: number;
  if (totalMinutes <= 15)       intervalMinutes = 5;
  else if (totalMinutes <= 30)  intervalMinutes = 10;
  else if (totalMinutes <= 60)  intervalMinutes = 15;
  else if (totalMinutes <= 120) intervalMinutes = 30;
  else                          intervalMinutes = 60;

  const ticks: number[] = [0];
  let current = intervalMinutes * 60;
  while (current < dataLength) { ticks.push(current); current += intervalMinutes * 60; }
  return ticks;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function HrChart({ hrStream, avgHr }: { hrStream: number[]; avgHr: number | null | undefined }) {
  const data = smoothStream(hrStream).map(p => ({ time: p.time, bpm: p.watts }));
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h5 className={styles.chartTitle}>Frecuencia cardíaca</h5>
        <span className={styles.chartMeta}>
          FC media <strong>{formatBpm(avgHr)}</strong>
        </span>
      </div>
      {hrStream.length > 0 ? (
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#999" tick={{ fontSize: 11 }}
                ticks={calculateXTicks(hrStream.length)} tickFormatter={(v) => formatTime(Number(v))} />
              <YAxis stroke="#999" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                labelFormatter={(v) => formatTime(Number(v))}
                formatter={(value: number | undefined) => [`${value ?? 0} ppm`, 'FC']} />
              <Area type="monotone" dataKey="bpm" stroke="#dc2626" strokeWidth={2} fill="url(#hrGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className={styles.chartHint}>No hay datos de frecuencia cardíaca disponibles.</p>
      )}
    </div>
  );
}

function PowerChart({ powerStream, np }: { powerStream: number[]; np: number | null | undefined }) {
  const data = smoothStream(powerStream);
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h5 className={styles.chartTitle}>Potencia</h5>
        <span className={styles.chartMeta}>
          Pot. Norm. <strong>{formatWatts(np)}</strong>
        </span>
      </div>
      {powerStream.length > 0 ? (
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#999" tick={{ fontSize: 11 }}
                ticks={calculateXTicks(powerStream.length)} tickFormatter={(v) => formatTime(Number(v))} />
              <YAxis stroke="#999" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                labelFormatter={(v) => formatTime(Number(v))}
                formatter={(value: number | undefined) => [`${value ?? 0} W`, 'Potencia']} />
              <Area type="monotone" dataKey="watts" stroke="#8b5cf6" strokeWidth={2} fill="url(#powerGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className={styles.chartHint}>No hay datos de potencia disponibles.</p>
      )}
    </div>
  );
}

// ─── Stats strip helpers ──────────────────────────────────────────────────────

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.doneStatItem}>
      <span className={styles.doneStatValue}>{value}</span>
      <span className={styles.doneStatLabel}>{label}</span>
    </div>
  );
}

function Divider() {
  return <div className={styles.doneStatDivider} />;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type DoneTraining = {
  activity_id: number;
  name?: string | null;
  type?: string | null;
  duration?: number | null;
  distance?: number | null;
  weighted_average_watts?: number | null;
  avgheartrate?: number | null;
  altitude?: number | null;
  power_stream?: number[] | null;
  hr_stream?: number[] | null;
};

// ─── Sport-specific layouts ───────────────────────────────────────────────────

function CyclingCard({ training, ftp }: { training: DoneTraining; ftp?: number | null }) {
  const tss = calculateTSS(training.duration, training.weighted_average_watts, ftp);
  const hasPower = (training.power_stream?.length ?? 0) > 0;
  const hasHr    = (training.hr_stream?.length ?? 0) > 0;

  return (
    <>
      <div className={styles.doneStatsCard}>
        <StatItem value={formatDuration(training.duration)} label="Duración" />
        <Divider />
        <StatItem value={formatKm(training.distance)} label="Distancia" />
        <Divider />
        <StatItem value={formatSpeed(training.distance, training.duration)} label="Vel. Media" />
        <Divider />
        <StatItem value={formatElevation(training.altitude)} label="Desnivel" />
      </div>

      <PowerChart
        powerStream={training.power_stream ?? []}
        np={training.weighted_average_watts}
      />

      <HrChart hrStream={training.hr_stream ?? []} avgHr={training.avgheartrate} />

      {/* TSS — solo si hay potencia o FTP */}
      {(hasPower || hasHr) && (
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h5 className={styles.chartTitle}>Carga de entrenamiento</h5>
            <span className={styles.chartMeta}>
              TSS <strong>{formatTSS(tss)}</strong>
            </span>
          </div>
        </div>
      )}
    </>
  );
}

function RunningCard({ training }: { training: DoneTraining }) {
  return (
    <>
      <div className={styles.doneStatsCard}>
        <StatItem value={formatDuration(training.duration)} label="Duración" />
        <Divider />
        <StatItem value={formatKm(training.distance)} label="Distancia" />
        <Divider />
        <StatItem value={formatPace(training.distance, training.duration)} label="Ritmo" />
        <Divider />
        <StatItem value={formatElevation(training.altitude)} label="Desnivel" />
      </div>

      <HrChart hrStream={training.hr_stream ?? []} avgHr={training.avgheartrate} />
    </>
  );
}

function GymCard({ training }: { training: DoneTraining }) {
  return (
    <>
      <div className={styles.doneStatsCard}>
        <StatItem value={formatDuration(training.duration)} label="Duración" />
        {training.avgheartrate != null && (
          <>
            <Divider />
            <StatItem value={formatBpm(training.avgheartrate)} label="FC Media" />
          </>
        )}
      </div>

      <HrChart hrStream={training.hr_stream ?? []} avgHr={training.avgheartrate} />
    </>
  );
}

function OtherCard({ training }: { training: DoneTraining }) {
  return (
    <div className={styles.doneStatsCard}>
      <StatItem value={formatDuration(training.duration)} label="Duración" />
      {(training.distance ?? 0) > 0 && (
        <>
          <Divider />
          <StatItem value={formatKm(training.distance)} label="Distancia" />
        </>
      )}
      {training.avgheartrate != null && (
        <>
          <Divider />
          <StatItem value={formatBpm(training.avgheartrate)} label="FC Media" />
        </>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DoneWorkoutCard({
  training,
  className,
  ftp,
}: {
  training: DoneTraining;
  className?: string;
  ftp?: number | null;
}) {
  const kind = getSportKind(training.type);

  return (
    <div className={`${styles.doneNew} ${className ?? ''}`}>
      {/* Header */}
      <div className={styles.doneNewHeader}>
        <h4 className={styles.doneNewTitle}>{training.name || 'Entreno'}</h4>
        <a
          href={`https://www.strava.com/activities/${training.activity_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.stravaButton}
          title="Ver en Strava"
        >
          <Image src="/view_on_strava_Button.png" alt="Ver en Strava" width={120} height={32} className={styles.stravaButtonImg} />
        </a>
      </div>

      {/* Sport-specific content */}
      {kind === 'cycling' && <CyclingCard training={training} ftp={ftp} />}
      {kind === 'running' && <RunningCard training={training} />}
      {kind === 'gym'     && <GymCard training={training} />}
      {kind === 'other'   && <OtherCard training={training} />}
    </div>
  );
}
