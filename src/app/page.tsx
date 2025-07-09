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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="Pacealyzer Logo"
          width={120}
          height={120}
          className="rounded-full"
        />
      </div>

      {/* Hero Text */}
      <h1
        className="text-5xl font-extrabold text-center mb-4 
                   bg-clip-text text-transparent
                   bg-gradient-to-r from-orange-500 to-pink-500"
      >
        Bienvenido a Pacealyzer
      </h1>
      <p className="text-lg text-gray-700 text-center max-w-2xl mb-8">
        Tu entrenador virtual inteligente conectado a Strava.  
        Recibe análisis personalizados de tus entrenamientos vía WhatsApp 📈🚴‍♂️
      </p>

      {/* Strava Connect Button */}
      <a
        href={authUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-opacity hover:opacity-80"
      >
        <img
          src="/strava-connect-button-orange.svg"
          alt="Connect with Strava"
          width={160}
          height={48}
        />
      </a>
    </main>
  );
}
