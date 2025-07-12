'use client';
import React, { useState } from 'react';
import { Syne } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function Dashboard() {
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [diaSeleccionado, setDiaSeleccionado] = useState(0);

  const hoy = new Date();
  const startOfWeek = new Date(hoy);
  const diff = hoy.getDate() - hoy.getDay() + 1;
  startOfWeek.setDate(diff + semanaOffset * 7);

  const mes = startOfWeek.toLocaleString('es-ES', { month: 'long' });

  const diasConFechas = dias.map((dia, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return { nombre: dia, numero: d.getDate() };
  });

  const esSemanaActual = semanaOffset === 0;

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
          className={`dia ${syne.className} ${i === diaSeleccionado ? 'activo' : ''}`}
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
    <h2 className={syne.className}>
      {diasConFechas[diaSeleccionado].nombre}, {diasConFechas[diaSeleccionado].numero}
    </h2>
    <p className={syne.className}>No hay entrenamiento de este día.</p>
  </div>
</div>
  );
}