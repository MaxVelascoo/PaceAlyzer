// app/privacy/page.tsx
'use client';
import { Syne, Inter } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400'] });

export default function PrivacyPage() {
  return (
    <main className="privacy-container">
      <div className="privacy-content">
        <h1 className={`privacy-title ${syne.className}`}>Política de Privacidad – WattCoach</h1>

        <p className={`privacy-paragraph ${inter.className}`}>
          WattCoach es una aplicación que analiza tus entrenamientos deportivos conectándose con tu cuenta de Strava. Recogemos los siguientes datos a través de la API de Strava:
        </p>

        <ul className={`privacy-list ${inter.className}`}>
          <li>Tu nombre y foto de perfil.</li>
          <li>Tus actividades deportivas (tiempo, distancia, potencia, etc.).</li>
          <li>Información básica de tu cuenta (ID, género, país).</li>
        </ul>

        <h2 className={`privacy-subtitle ${syne.className}`}>¿Para qué usamos tus datos?</h2>
        <p className={`privacy-paragraph ${inter.className}`}>
          Usamos estos datos exclusivamente para ofrecerte análisis personalizados de tus entrenamientos. No los compartimos con terceros ni los vendemos.
        </p>

        <h2 className={`privacy-subtitle ${syne.className}`}>¿Cómo puedes eliminar tus datos?</h2>
        <p className={`privacy-paragraph ${inter.className}`}>
          Puedes solicitar la eliminación de todos tus datos escribiéndonos a:{' '}
          <a href="mailto:max.velasco.rajo@gmail.com" className="text-blue-600 underline">
            max.velasco.rajo@gmail.com
          </a>
        </p>

        <h2 className={`privacy-subtitle ${syne.className}`}>Seguridad</h2>
        <p className={`privacy-paragraph ${inter.className}`}>
          Almacenamos tus datos en bases de datos protegidas. No accedemos a tus credenciales de Strava, solo al token de acceso proporcionado tras autorizar la app.
        </p>

        <p className={`privacy-footer ${inter.className}`}>Última actualización: 9 de julio de 2025.</p>
      </div>
    </main>
  );
}
