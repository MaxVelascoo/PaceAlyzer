'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Syne, Inter } from 'next/font/google';
import './styles.css';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400'] });

const HomePage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="hero">
      <div className="overlay">
        <h1 className={`title ${syne.className}`}>
          ¡Analiza, Optimiza y <br /> supera tus límites!
        </h1>
        <p className={`subtitle ${inter.className}`}>
          Bienvenido a PaceAlyzer, tu entrenador virtual inteligente para ciclistas. <br />
          Maximiza tu rendimiento con informes personalizados impulsados por IA.
        </p>
        <button className="start-button" onClick={() => router.push('/start')}>
          Empezar
        </button>
      </div>
    </div>
  );
};

export default HomePage;
