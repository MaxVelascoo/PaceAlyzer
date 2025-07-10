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
      {/* fondos degradados */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full
                   bg-gradient-to-tr from-orange-500 to-pink-500
                   opacity-20 -top-32 -left-32 pointer-events-none"
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full
                   bg-gradient-to-br from-pink-500 to-orange-500
                   opacity-20 -bottom-32 -right-32 pointer-events-none"
      />

      {/* tarjeta */}
      <div className="relative z-10 max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        {/* símbolo y wordmark juntos */}
        <div className="flex flex-col items-center mb-6 space-y-2">
          {/* símbolo */}
          <Image
            src="/symbol.png"           // tu icono de producto
            alt="PaceAlyzer Icon"
            width={96}
            height={96}
          />
          {/* wordmark */}
          <Image
            src="/wordmark.png"         // tu “PaceAlyzer” como imagen
            alt="PaceAlyzer Wordmark"
            width={240}
            height={60}
          />
        </div>

        {/* slogan */}
        <p className="text-xl text-gray-800 font-medium mb-4">
          Analiza. Optimiza. Supera tus límites.
        </p>

        {/* descripción */}
        <p className="text-gray-600 mb-6">
          Transforma tus datos de Strava en planes de entrenamiento inteligentes  
          basados en IA, diseñados para maximizar tu rendimiento.
        </p>

        {/* botón Strava */}
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
