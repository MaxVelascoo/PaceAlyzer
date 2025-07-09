export default function Home() {
  // Usa la variable de entorno en lugar de hardcodear el client ID
  const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID!;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI!;
  const authUrl = [
    `https://www.strava.com/oauth/authorize`,
    `?client_id=${STRAVA_CLIENT_ID}`,
    `&response_type=code`,
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    `&approval_prompt=auto`,
    `&scope=read,activity:read_all`,
  ].join('');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-gray-900">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a WattCoach ⚡</h1>
      <p className="text-lg text-center max-w-xl">
        Tu entrenador virtual inteligente conectado a Strava. Recibe análisis personalizados de tus entrenamientos por WhatsApp 📈🚴‍♂️
      </p>
      <div className="mt-8">
        <a
          href={authUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/strava-connect-button-orange.svg"
            alt="Connect with Strava"
            width={160}
            height={48}
          />
        </a>
      </div>
    </main>
  );
}
