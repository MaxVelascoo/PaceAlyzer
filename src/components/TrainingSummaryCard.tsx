import React from 'react';
import { Syne } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });

export default function TrainingSummaryCard({ training }: { training: any }) {
  return (
    <div className="card training-summary">
      <h3 className={`card-title ${syne.className}`}>{training.name}</h3>
      <ul className="summary-list">
        <li>
          <span className="label">Distancia:</span>
          <span>{(training.distance / 1000).toFixed(1)} km</span>
        </li>
        <li>
          <span className="label">Duración:</span>
          <span>{Math.floor(training.duration / 60)}h {Math.round(training.duration % 60)}min</span>
        </li>
        {training.avgheartrate && (
          <li>
            <span className="label">FC media:</span>
            <span>{training.avgheartrate} ppm</span>
          </li>
        )}
        {training.avgpower && (
          <li>
            <span className="label">Potencia media:</span>
            <span>{training.avgpower} W</span>
          </li>
        )}
        {training.weighted_average_watts && (
          <li>
            <span className="label">Potencia normalizada:</span>
            <span>{Math.round(training.weighted_average_watts)} W</span>
          </li>
        )}
      </ul>
    </div>
  );
}
