import './styles.css';
import Link from 'next/link';
import { Syne } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });

export const metadata = {
  title: 'PaceAlyzer',
  description: 'Entrenador virtual inteligente para ciclistas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <span className={`logo ${syne.className}`}>PaceAlyzer</span>
            <nav className="nav">
              <Link href="/" className="nav-link">Inicio</Link>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-left">
            <h2 className={syne.className}>PaceAlyzer</h2>

            <p>651-677-748</p>
            <p>max.velaso.rajo@gmail.com</p>
            <p>Barcelona</p>
          </div>
          <div className="footer-right">
            <ul>
              <li><Link href="/privacy">Política de Privacidad</Link></li>
              <li><Link href="#">Declaración de Accesibilidad</Link></li>
              <li><Link href="/terms">Términos y Condiciones</Link></li>
              <li><Link href="#">Política de Reembolso</Link></li>
            </ul>
          </div>
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>© 2025 by PaceAlyzer.</p>
              <img
                src="/api_logo_pwrdBy_strava_stack_white.png"
                alt="Powered by Strava"
                width={120}
                height={30}
                className="strava-logo"
              />
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}



