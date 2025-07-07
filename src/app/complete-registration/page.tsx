'use client'; // Para habilitar React client-side (hooks, estado)

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


export default function CompleteRegistration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stravaId = searchParams.get('strava_id') || '';

  // Estados para los campos del formulario
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [ftp, setFtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para manejar submit del formulario
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validación muy básica
    if (!email || !phone) {
      setError('Por favor, rellena email y teléfono.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Aquí enviarías los datos a tu backend o Supabase
      // Ejemplo fetch POST a /api/complete-registration (tienes que crearla)
      const res = await fetch('/api/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strava_id: stravaId,
          email,
          phone,
          weight: weight ? Number(weight) : null,
          height: height ? Number(height) : null,
          ftp: ftp ? Number(ftp) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error enviando datos.');
      } else {
        // Redirigir o mostrar mensaje éxito
        router.push('/welcome'); 
      }
    } catch (err) {
      setError('Error de red o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Últimos pasos para registrarte</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
          required
        />

        <div className="w-full">
          <PhoneInput
            country={'es'}
            value={phone}
            onChange={(value) => setPhone(value)}
            inputClass="!w-full !p-3 !rounded !border !border-gray-300"
            buttonClass="!border-gray-300"
            containerClass="!w-full"
            inputProps={{
              name: 'phone',
              required: true,
            }}
          />
        </div>



        <input
          type="number"
          placeholder="Peso (kg)"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
          min="30"
          max="200"
          step="0.1"
        />

        <input
          type="number"
          placeholder="Altura (cm)"
          value={height}
          onChange={e => setHeight(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
          min="100"
          max="250"
          step="0.1"
        />

        <input
          type="number"
          placeholder="FTP (watts)"
          value={ftp}
          onChange={e => setFtp(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
          min="50"
          max="1000"
          step="1"
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Finalizar registro'}
        </button>
      </form>
    </main>
  );
}
