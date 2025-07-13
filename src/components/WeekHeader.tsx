import React from 'react';
import { Syne } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });

export default function WeekHeader({
  diasConFechas,
  diaSeleccionado,
  semanaOffset,
  onDiaClick,
  onPrev,
  onNext
}: {
  diasConFechas: { nombre: string; key: string; numero: number }[];
  diaSeleccionado: number;
  semanaOffset: number;
  onDiaClick: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="week-header">
      <button className="nav-button" onClick={onPrev}>‹</button>
      <div className="days-scroll">
        {diasConFechas.map((d, i) => (
          <button
            key={d.key}
            className={`day-pill ${syne.className} ${i === diaSeleccionado ? 'active' : ''}`}
            onClick={() => onDiaClick(i)}
            >
            <div style={{ fontSize: '0.8rem', lineHeight: '1rem', marginBottom: '2px' }}>{d.numero}</div>
            <div>{d.nombre}</div>
         </button>
        ))}
      </div>
      <button className="nav-button" onClick={onNext} disabled={semanaOffset === 0}>›</button>
    </div>
  );
}
