'use client';
import React from 'react';

export default function TermsPage() {
  return (
    <main className="bg-custom text-white flex items-start justify-start px-6 md:px-16 py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 leading-snug">
          Términos y Condiciones – WattCoach
        </h1>

        <section className="space-y-6 text-lg leading-relaxed">
          <p>
            Bienvenido a WattCoach. Estos Términos y Condiciones rigen tu uso de nuestra aplicación y servicios.
          </p>

          <div>
            <h2 className="text-2xl font-semibold mb-2">1. Aceptación de los Términos</h2>
            <p>
              Al acceder o usar WattCoach, aceptas estar sujeto a estos Términos y a nuestra Política de Privacidad.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">2. Servicios</h2>
            <p>
              WattCoach proporciona análisis personalizados de entrenamientos de ciclismo conectándose a tu cuenta de Strava mediante OAuth. No garantizamos resultados específicos ni desempeños.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">3. Uso de Datos</h2>
            <p>
              Usamos únicamente los datos que autorizas vía Strava para generar informes. No compartimos tus datos con terceros ni los vendemos.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">4. Limitación de Responsabilidad</h2>
            <p>
              WattCoach no se hace responsable de decisiones tomadas basadas en nuestros análisis. Estos son solo informativos y no sustituyen consejo profesional.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">5. Cambios en los Términos</h2>
            <p>
              Podemos actualizar estos Términos en cualquier momento. Te notificaremos en la app o vía email. El uso continuado tras cambios implica aceptación.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">6. Contacto</h2>
            <p>
              Si tienes preguntas sobre estos Términos, contáctanos en{' '}
              <a href="mailto:max.velasco.rajo@gmail.com" className="underline text-white hover:text-gray-300">
                max.velasco.rajo@gmail.com
              </a>.
            </p>
          </div>
        </section>

        <p className="mt-12 text-sm text-gray-200">Última actualización: 9 de julio de 2025.</p>
      </div>
    </main>
  );
}
