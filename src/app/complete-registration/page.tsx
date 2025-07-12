'use client';
import React from 'react';
import { Syne, Inter } from 'next/font/google';
import Link from 'next/link';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400'] });

export default function DashboardPage() {
  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white px-6 py-20"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="max-w-3xl mx-auto text-left">
        <h1 className={`text-4xl mb-6 ${syne.className}`}>
          ¡Bienvenido a PaceAlyzer!
        </h1>
        <p className={`text-lg mb-8 leading-relaxed ${inter.className}`}>
          Has conectado exitosamente tu cuenta de Strava. A partir de ahora, PaceAlyzer podrá analizar tus entrenamientos, generar informes personalizados y ayudarte a alcanzar tus objetivos ciclistas con inteligencia adaptativa.
        </p>

        <div className="space-y-4">
          <p className={inter.className}>✅ Analiza tu progreso en tiempo real</p>
          <p className={inter.className}>✅ Recibe recomendaciones de entrenamiento</p>
          <p className={inter.className}>✅ Explora tus mejores rendimientos</p>
        </div>

        <Link href="/profile">
          <button className="mt-10 px-6 py-3 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-200 transition">
            Ver mi perfil
          </button>
        </Link>
      </div>
    </main>
  );
}
