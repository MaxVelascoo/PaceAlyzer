// app/terms/page.tsx

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Términos y Condiciones – WattCoach</h1>
      <p className="mb-4">
        Bienvenido a WattCoach. Estos Términos y Condiciones rigen tu uso de nuestra aplicación y servicios.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Aceptación de los Términos</h2>
      <p className="mb-4">
        Al acceder o usar WattCoach, aceptas estar sujeto a estos Términos y a nuestra Política de Privacidad.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Servicios</h2>
      <p className="mb-4">
        WattCoach proporciona análisis personalizados de entrenamientos de ciclismo conectándose a tu cuenta de Strava mediante OAuth. No garantizamos resultados específicos ni desempeños.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Uso de Datos</h2>
      <p className="mb-4">
        Usamos únicamente los datos que autorizas vía Strava para generar informes. No compartimos tus datos con terceros ni los vendemos.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Limitación de Responsabilidad</h2>
      <p className="mb-4">
        WattCoach no se hace responsable de decisiones tomadas basadas en nuestros análisis. Estos son solo informativos y no sustituyen consejo profesional.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Cambios en los Términos</h2>
      <p className="mb-4">
        Podemos actualizar estos Términos en cualquier momento. Te notificaremos en la app o vía email. El uso continuado tras cambios implica aceptación.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contacto</h2>
      <p className="mb-4">
        Si tienes preguntas sobre estos Términos, contáctanos en <a href="mailto:max.velasco.rajo@gmail.com" className="text-blue-600 underline">max.velasco.rajo@gmail.com</a>.
      </p>

      <p className="text-sm text-gray-500">Última actualización: 9 de julio de 2025.</p>
    </main>
  );
}
