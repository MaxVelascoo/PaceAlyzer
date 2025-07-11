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
        className="absolute z-0 w-[420px] h-[420px] md:w-[520px] md:h-[520px] rounded-full
                   bg-gradient-to-tr from-orange-400 to-pink-400
                   opacity-30 blur-2xl animate-pulse
                   top-[-120px] left-[-120px]"
      />
      <div
        className="absolute z-0 w-[320px] h-[320px] md:w-[420px] md:h-[420px] rounded-full
                   bg-gradient-to-br from-pink-400 to-orange-400
                   opacity-30 blur-2xl animate-pulse
                   bottom-[-100px] right-[-100px]"
      />

      {/* tarjeta */}
      <div className="relative z-10 max-w-lg w-full bg-white/90 rounded-3xl shadow-2xl border border-gray-100 p-8 text-center backdrop-blur-md">
        {/* símbolo y wordmark juntos */}
        <div className="flex flex-col items-center mb-6 space-y-2">
          {/* símbolo */}
          <Image
            src="/symbol.png"
            alt="PaceAlyzer Icon"
            width={96}
            height={96}
          />
          {/* wordmark */}
          <Image
            src="/wordmark.png"
            alt="PaceAlyzer Wordmark"
            width={240}
            height={60}
          />
        </div>

        {/* slogan */}
        <p className="text-xl text-gray-800 font-semibold mb-4">
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