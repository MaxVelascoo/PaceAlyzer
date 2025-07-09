// app/page.tsx
"use client";

import Image from "next/image";

export default function Home() {
  const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID!;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI!;
  const authUrl = [
    `https://www.strava.com/oauth/authorize`,
    `?client_id=${STRAVA_CLIENT_ID}`,
    `&response_type=code`,
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    `&approval_prompt=auto`,
    `&scope=read,activity:read_all`,
  ].join("");

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-gray-50 overflow-hidden px-4">
      {/* Fondo decorativo con degradados */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full
                   bg-gradient-to-tr from-orange-500 to-pink-500
                   opacity-20 -top-80 -left-80"
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full
                   bg-gradient-to-br from-pink-500 to-orange-500
                   opacity-20 -bottom-80 -right-80"
      />

      {/* Tarjeta principal */}
      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Pacealyzer Logo"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />

        {/* Título */}
        <h1
          className="text-3xl sm:text-4xl font-extrabold mb-2
                     bg-clip-text text-transparent
                     bg-gradient-to-r from-orange-500 to-pink-500"
        >
          Pacealyzer
        </h1>

        {/* Slogan */}
        <p className="text-xl text-gray-800 font-medium mb-4">
          Analiza. Optimiza. Supera tus límites.
        </p>

        {/* Descripción */}
        <p className="text-gray-600 mb-6">
          Transforma tus datos de Strava en planes de entrenamiento inteligentes  
          basados en IA, diseñados para maximizar tu rendimiento.
        </p>

        {/* Strava Connect Button */}
        <a
          href={authUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transition-transform hover:scale-105"
        >
          <img
            src="/strava-connect-button-orange.svg"
            alt="Connect with Strava"
            width={180}
            height={54}
          />
        </a>
      </div>
    </main>
  );
}
