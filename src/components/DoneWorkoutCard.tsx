    'use client';
    import React from 'react';
    import styles from '@/app/dashboard/dashboard.module.css';
    import { Space_Grotesk } from 'next/font/google';

    const spaceGrotesk = Space_Grotesk({
        subsets: ['latin'],
        weight: ['500','600','700'], // recomendable para números
    });


    export type DoneTraining = {
    activity_id: number;
    name?: string | null;

    duration?: number | null; // segundos
    distance?: number | null; // metros
    weighted_average_watts?: number | null; // Pot. Norm
    avgheartrate?: number | null; // FC media
    total_elevation_gain?: number | null; // opcional si lo tienes
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
        icon: <span aria-hidden className={styles.statIcon}>❤️</span>,
        value: formatBpm(training.avgheartrate),
        label: 'FC Media',
        tone: 'pink',
        },
        {
        icon: <span aria-hidden className={styles.statIcon}>⚡️</span>,
        value: formatWatts(training.weighted_average_watts),
        label: 'Pot. Norm.',
        tone: 'yellow',
        },
    ];

    return (
        <div className={`${styles.doneNew} ${className ?? ''}`}>
        {/* Header */}
        <div className={styles.doneNewHeader}>
            <h4 className={styles.doneNewTitle}>{training.name || 'Entreno de ciclismo'}</h4>
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

        {/* Power chart placeholder */}
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
            <h5 className={styles.chartTitle}>Potencia</h5>
            <span className={styles.chartMeta}>
                Pot. Norm. <strong className={spaceGrotesk.className}>{formatWatts(training.weighted_average_watts)}</strong>
            </span>
            </div>

            <div className={styles.chartPlaceholder}>
            <div className={styles.chartSkeleton} />
            <p className={styles.chartHint}>Próximamente: gráfica de potencia (stream de Strava).</p>
            </div>
        </div>

        {/* HR chart placeholder */}
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
            <h5 className={styles.chartTitle}>Frecuencia cardíaca</h5>
            <span className={styles.chartMeta}>
                FC media <strong className={spaceGrotesk.className}>{formatBpm(training.avgheartrate)}</strong>
            </span>
            </div>

            <div className={styles.chartPlaceholder}>
            <div className={styles.chartSkeleton} />
            <p className={styles.chartHint}>Próximamente: gráfica de FC (stream de Strava).</p>
            </div>
        </div>

        {/* Footer / extra row (opcional) */}
        <div className={styles.doneFooterRow}>
            <span className={styles.footerLabel}>Altitud</span>
            <span className={`${styles.footerValue} ${spaceGrotesk.className}`}>{formatElevation(training.total_elevation_gain)}</span>
        </div>
        </div>
    );
    }
