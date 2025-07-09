// app/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Política de Privacidad – WattCoach</h1>
      <p className="mb-4">
        WattCoach es una aplicación que analiza tus entrenamientos deportivos conectándose con tu cuenta de Strava. Recogemos los siguientes datos a través de la API de Strava:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Tu nombre y foto de perfil.</li>
        <li>Tus actividades deportivas (tiempo, distancia, potencia, etc.).</li>
        <li>Información básica de tu cuenta (ID, género, país).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">¿Para qué usamos tus datos?</h2>
      <p className="mb-4">
        Usamos estos datos exclusivamente para ofrecerte análisis personalizados de tus entrenamientos. No los compartimos con terceros ni los vendemos.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">¿Cómo puedes eliminar tus datos?</h2>
      <p className="mb-4">
        Puedes solicitar la eliminación de todos tus datos escribiéndonos a: <a href="mailto:max.velasco.rajo@gmail.com" className="text-blue-600 underline">max.velasco.rajo@gmail.com</a>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Seguridad</h2>
      <p className="mb-4">
        Almacenamos tus datos en bases de datos protegidas. No accedemos a tus credenciales de Strava, solo al token de acceso proporcionado tras autorizar la app.
      </p>

      <p className="text-sm text-gray-500">Última actualización: 9 de julio de 2025.</p>
    </main>
  );
}
