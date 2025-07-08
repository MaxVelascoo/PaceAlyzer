export default function Home() {
  const STRAVA_CLIENT_ID = 165942; // <-- Sustituye esto
  
  const REDIRECT_URI = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI!;
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=read,activity:read_all`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-gray-900">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a WattCoach ⚡</h1>
      <p className="text-lg text-center max-w-xl">
        Tu entrenador virtual inteligente conectado a Strava. Recibe análisis personalizados de tus entrenamientos por WhatsApp 📈🚴‍♂️
      </p>
      <div className="mt-8">
        <a
          href={authUrl}
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          Conectar con Strava
        </a>
      </div>
    </main>
  );
}
