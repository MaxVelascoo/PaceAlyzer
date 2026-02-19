    'use client';
    import React from 'react';
    import styles from '@/app/dashboard/dashboard.module.css';
    import { Space_Grotesk } from 'next/font/google';
    import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

    const spaceGrotesk = Space_Grotesk({
        subsets: ['latin'],
        weight: ['500','600','700'], // recomendable para números
    });

    // Función para formatear tiempo en formato hh:mm:ss o mm:ss
    function formatTime(seconds: number): string {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        
        if (h > 0) {
            return `${h}h${m}min`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    // Función para calcular ticks del eje X basado en duración
    function calculateXTicks(dataLength: number): number[] {
        const totalSeconds = dataLength;
        const totalMinutes = totalSeconds / 60;
        
        let intervalMinutes: number;
        
        if (totalMinutes <= 15) {
            intervalMinutes = 5; // cada 5 min
        } else if (totalMinutes <= 30) {
            intervalMinutes = 10; // cada 10 min
        } else if (totalMinutes <= 60) {
            intervalMinutes = 15; // cada 15 min
        } else if (totalMinutes <= 120) {
            intervalMinutes = 30; // cada 30 min
        } else {
            intervalMinutes = 60; // cada 1 hora
        }
        
        const ticks: number[] = [0];
        let current = intervalMinutes * 60;
        
        while (current < totalSeconds) {
            ticks.push(current);
            current += intervalMinutes * 60;
        }
        
        return ticks;
    }


    export type DoneTraining = {
    activity_id: number;
    name?: string | null;

    duration?: number | null; // segundos
    distance?: number | null; // metros
    weighted_average_watts?: number | null; // Pot. Norm
    avgheartrate?: number | null; // FC media
    altitude?: number | null; // altitud ganada
    power_stream?: number[] | null;
    hr_stream?: number[] | null;
    };

    function formatDuration(totalSec: number | null | undefined) {
    if (totalSec == null) return '—';
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    if (h > 0) return `${h}h ${m}min`;
    return `${m}min`;
    }

    function formatKm(distanceMeters: number | null | undefined, digits = 1) {
    if (distanceMeters == null) return '—';
    const km = distanceMeters / 1000;
    return `${km.toFixed(digits)} km`;
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
    if (m == null) return '—';
    return `${Math.round(m)} m`;
    }

    function formatSpeed(distanceMeters: number | null | undefined, durationSec: number | null | undefined) {
    if (distanceMeters == null || durationSec == null || durationSec === 0) return '—';
    const kmh = (distanceMeters / 1000) / (durationSec / 3600);
    return `${kmh.toFixed(1)} km/h`;
    }

    type StatCard = {
    icon: React.ReactNode;
    value: string;
    label: string;
    tone: 'violet' | 'orange' | 'pink' | 'yellow';
    };

    export default function DoneWorkoutCard({
    training,
    className,
    }: {
    training: DoneTraining;
    className?: string; // para aplicar Syne desde fuera
    }) {
    const statCards: StatCard[] = [
        {
        icon: <span aria-hidden className={styles.statIcon}>🕒</span>,
        value: formatDuration(training.duration),
        label: 'Duración',
        tone: 'violet',
        },
        {
        icon: <span aria-hidden className={styles.statIcon}>📍</span>,
        value: formatKm(training.distance, 1),
        label: 'Distancia',
        tone: 'orange',
        },
        {
        icon: <span aria-hidden className={styles.statIcon}>🚴</span>,
        value: formatSpeed(training.distance, training.duration),
        label: 'Vel. Media',
        tone: 'pink',
        },
        {
        icon: <span aria-hidden className={styles.statIcon}>⛰️</span>,
        value: formatElevation(training.altitude),
        label: 'Altitud',
        tone: 'yellow',
        },
    ];

    return (
        <div className={`${styles.doneNew} ${className ?? ''}`}>
        {/* Header */}
        <div className={styles.doneNewHeader}>
            <h4 className={styles.doneNewTitle}>{training.name || 'Entreno de ciclismo'}</h4>
            <a 
                href={`https://www.strava.com/activities/${training.activity_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.stravaButton}
                title="Ver en Strava"
            >
                <img 
                    src="/view_on_strava_Button.png" 
                    alt="Ver en Strava" 
                    className={styles.stravaButtonImg}
                />
            </a>
        </div>

        {/* Stats grid */}
        <div className={styles.statsGrid}>
            {statCards.map((c) => (
            <div key={c.label} className={`${styles.statCard} ${styles[`tone_${c.tone}`]}`}>
                <div className={styles.statTop}>
                {c.icon}
                <div className={`${styles.statValue} ${spaceGrotesk.className}`}>
                    {c.value}
                </div>
                </div>
                <div className={styles.statLabel}>{c.label}</div>
            </div>
            ))}
        </div>

        {/* Power chart */}
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
            <h5 className={styles.chartTitle}>Potencia</h5>
            <span className={styles.chartMeta}>
                Pot. Norm. <strong className={spaceGrotesk.className}>{formatWatts(training.weighted_average_watts)}</strong>
            </span>
            </div>

            {training.power_stream && training.power_stream.length > 0 ? (
              <div className={`${styles.chartContainer} ${spaceGrotesk.className}`}>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={training.power_stream.map((watts, idx) => ({ time: idx, watts }))}>
                    <defs>
                      <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#999"
                      tick={{ fontSize: 11 }}
                      ticks={calculateXTicks(training.power_stream.length)}
                      tickFormatter={(val) => formatTime(val)}
                    />
                    <YAxis 
                      stroke="#999"
                      tick={{ fontSize: 11 }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                      labelFormatter={(val) => formatTime(Number(val))}
                      formatter={(value: number) => [`${value} W`, 'Potencia']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="watts" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      fill="url(#powerGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className={styles.chartPlaceholder}>
                <p className={styles.chartHint}>No hay datos de potencia disponibles.</p>
              </div>
            )}
        </div>

        {/* HR chart */}
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
            <h5 className={styles.chartTitle}>Frecuencia cardíaca</h5>
            <span className={styles.chartMeta}>
                FC media <strong className={spaceGrotesk.className}>{formatBpm(training.avgheartrate)}</strong>
            </span>
            </div>

            {training.hr_stream && training.hr_stream.length > 0 ? (
              <div className={`${styles.chartContainer} ${spaceGrotesk.className}`}>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={training.hr_stream.map((bpm, idx) => ({ time: idx, bpm }))}>
                    <defs>
                      <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#999"
                      tick={{ fontSize: 11 }}
                      ticks={calculateXTicks(training.hr_stream.length)}
                      tickFormatter={(val) => formatTime(val)}
                    />
                    <YAxis 
                      stroke="#999"
                      tick={{ fontSize: 11 }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                      labelFormatter={(val) => formatTime(Number(val))}
                      formatter={(value: number) => [`${value} ppm`, 'FC']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="bpm" 
                      stroke="#dc2626" 
                      strokeWidth={2}
                      fill="url(#hrGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className={styles.chartPlaceholder}>
                <p className={styles.chartHint}>No hay datos de frecuencia cardíaca disponibles.</p>
              </div>
            )}
        </div>
        </div>
    );
    }
