// app/privacy/page.tsx
'use client';
import { Syne, Inter } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400'] });

export default function PrivacyPage() {
  return (
    <main className="privacy-container">
      <div className="privacy-content">

        <h1 className={`privacy-title ${syne.className}`}>
          Política de Privacidad – PaceAlyzer
        </h1>

        <p className={`privacy-paragraph ${inter.className}`}>
          PaceAlyzer es una plataforma de planificación y análisis de entrenamiento deportivo 
          orientada a ciclismo. La aplicación puede integrarse con servicios de terceros como 
          Strava y, en el futuro, Garmin Connect, siempre bajo autorización expresa del usuario.
        </p>

        <h2 className={`privacy-subtitle ${syne.className}`}>
          1. Datos que recopilamos
        </h2>

        <p className={`privacy-paragraph ${inter.className}`}>
          Cuando conectas tu cuenta de Strava (y eventualmente Garmin), podemos acceder a:
        </p>

        <ul className={`privacy-list ${inter.className}`}>
          <li>Nombre y foto de perfil.</li>
          <li>Actividades deportivas (tiempo, distancia, potencia, frecuencia cardiaca, etc.).</li>
          <li>Métricas agregadas de entrenamiento.</li>
          <li>Indicadores de recuperación (si se habilita integración con wearable).</li>
        </ul>

        <p className={`privacy-paragraph ${inter.className}`}>
          También almacenamos datos introducidos manualmente como peso, FTP, fecha de nacimiento 
          y frecuencia cardiaca máxima.
        </p>

        <h2 className={`privacy-subtitle ${syne.className}`}>
          2. Finalidad del tratamiento
        </h2>

        <p className={`privacy-paragraph ${inter.className}`}>
          Utilizamos estos datos exclusivamente para:
        </p>

        <ul className={`privacy-list ${inter.className}`}>
          <li>Generar análisis personalizados de rendimiento.</li>
          <li>Adaptar dinámicamente planes de entrenamiento.</li>
          <li>Optimizar la carga en función de la recuperación.</li>
          <li>Mejorar la experiencia de planificación deportiva.</li>
        </ul>

        <p className={`privacy-paragraph ${inter.className}`}>
          No vendemos ni redistribuimos tus datos a terceros.
        </p>

        <h2 className={`privacy-subtitle ${syne.className}`}>
          3. Integraciones con terceros
        </h2>

        <p className={`privacy-paragraph ${inter.className}`}>
          PaceAlyzer utiliza APIs oficiales (como Strava API y, en caso de aprobación, Garmin Connect Developer Program).
          El acceso a estos datos se realiza únicamente mediante autorización OAuth proporcionada por el usuario.
        </p>

        <p className={`privacy-paragraph ${inter.className}`}>
          Los datos obtenidos se utilizan únicamente dentro de la aplicación para análisis y personalización.
          No se comparten con otras plataformas externas.
        </p>

        <h2 className={`privacy-subtitle ${syne.className}`}>
          4. Almacenamiento y seguridad
        </h2>

        <p className={`privacy-paragraph ${inter.className}`}>
          Los datos se almacenan en infraestructura segura (Supabase) con control de acceso mediante 
          autenticación y políticas de seguridad (Row Level Security).
        </p>

        <p className={`privacy-paragraph ${inter.className}`}>
          Las imágenes de perfil se almacenan en un bucket privado con acceso restringido.
          Las URLs generadas para visualización son temporales y expiran automáticamente.
        </p>

        <p className={`privacy-paragraph ${inter.className}`}>
          No almacenamos contraseñas de servicios externos. Solo conservamos tokens de acceso 
          necesarios para realizar solicitudes autorizadas a las APIs.
        </p>

        <h2 className={`privacy-subtitle ${syne.className}`}>
          5. Uso de Inteligencia Artificial
        </h2>

        <p className={`privacy-paragraph ${inter.className}`}>
          PaceAlyzer puede utilizar modelos de inteligencia artificial para generar recomendaciones 
          y adaptar entrenamientos. Estos modelos procesan datos de forma automatizada, 
          pero no toman decisiones médicas ni sustituyen asesoramiento profesional.
        </p>

        <h2 className={`privacy-subtitle ${syne.className}`}>
          6. Derechos del usuario
        </h2>

        <p className={`privacy-paragraph ${inter.className}`}>
          Puedes solicitar en cualquier momento:
        </p>

        <ul className={`privacy-list ${inter.className}`}>
          <li>Acceso a tus datos.</li>
          <li>Corrección de datos incorrectos.</li>
          <li>Eliminación completa de tu cuenta y datos asociados.</li>
        </ul>

        <p className={`privacy-paragraph ${inter.className}`}>
          Para ejercer estos derechos, puedes escribir a:
          <br />
          <a href="mailto:max.velasco.rajo@gmail.com" className="text-blue-600 underline">
            max.velasco.rajo@gmail.com
          </a>
        </p>

        <h2 className={`privacy-subtitle ${syne.className}`}>
          7. Conservación de datos
        </h2>

        <p className={`privacy-paragraph ${inter.className}`}>
          Conservamos tus datos mientras tu cuenta permanezca activa.
          Si eliminas tu cuenta o solicitas la eliminación, los datos serán borrados permanentemente.
        </p>

        <p className={`privacy-footer ${inter.className}`}>
          Última actualización: 19 de febrero de 2026.
        </p>

      </div>
    </main>
  );
}