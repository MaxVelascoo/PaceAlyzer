'use client';
import { Syne, Inter } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400'] });

export default function TermsPage() {
  return (
    <main className="privacy-container">
      <div className="privacy-content">
        <h1 className={`privacy-title ${syne.className}`}>
          Términos y Condiciones – PaceAlyzer
        </h1>

        <p className={`privacy-paragraph ${inter.className}`}>
          Bienvenido a PaceAlyzer. Estos Términos y Condiciones regulan tu uso de nuestra aplicación y servicios.
        </p>

        <section>
          <div>
            <h2 className={`privacy-subtitle ${syne.className}`}>1. Aceptación de los Términos</h2>
            <p className={`privacy-paragraph ${inter.className}`}>
              Al acceder o usar PaceAlyzer, aceptas estar sujeto a estos Términos y a nuestra Política de Privacidad.
            </p>
          </div>

          <div>
            <h2 className={`privacy-subtitle ${syne.className}`}>2. Servicios</h2>
            <p className={`privacy-paragraph ${inter.className}`}>
              PaceAlyzer proporciona análisis inteligentes de tus entrenamientos de ciclismo conectándose a tu cuenta de Strava mediante OAuth. Los resultados mostrados tienen fines informativos y no constituyen asesoramiento profesional.
            </p>
          </div>

          <div>
            <h2 className={`privacy-subtitle ${syne.className}`}>3. Uso de Datos</h2>
            <p className={`privacy-paragraph ${inter.className}`}>
              Solo utilizamos los datos que autorizas a compartir desde Strava. Estos datos son necesarios para ofrecerte análisis personalizados de tus sesiones. No compartimos tu información con terceros ni la utilizamos con fines comerciales.
            </p>
          </div>

          <div>
            <h2 className={`privacy-subtitle ${syne.className}`}>4. Limitación de Responsabilidad</h2>
            <p className={`privacy-paragraph ${inter.className}`}>
              PaceAlyzer no se responsabiliza por decisiones de entrenamiento tomadas exclusivamente a partir de nuestros análisis. Te recomendamos complementar la información con orientación profesional.
            </p>
          </div>

          <div>
            <h2 className={`privacy-subtitle ${syne.className}`}>5. Cambios en los Términos</h2>
            <p className={`privacy-paragraph ${inter.className}`}>
              Podremos actualizar estos Términos ocasionalmente. Te notificaremos en la app o por email. El uso continuado implica tu aceptación de los cambios.
            </p>
          </div>

          <div>
            <h2 className={`privacy-subtitle ${syne.className}`}>6. Contacto</h2>
            <p className={`privacy-paragraph ${inter.className}`}>
              Si tienes dudas o inquietudes sobre estos Términos, escríbenos a{' '}
              <a href="mailto:max.velasco.rajo@gmail.com" className="text-blue-600 underline">
                max.velasco.rajo@gmail.com
              </a>.
            </p>
          </div>
        </section>

        <p className={`privacy-footer ${inter.className}`}>
          Última actualización: 9 de julio de 2025.
        </p>
      </div>
    </main>
  );
}
