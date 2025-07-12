import './styles.css';
import Link from 'next/link';
import { Syne } from 'next/font/google';
import { UserProvider } from '@/context/userContext'; // Asegúrate de que la ruta sea correcta

const syne = Syne({ subsets: ['latin'], weight: ['700'] });

export const metadata = {
  title: 'PaceAlyzer',
  description: 'Entrenador virtual inteligente para ciclistas',
  icons: {
    icon: '/symbol.png',
  },
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
            <div className="header-left">
              <Link href="/" className={`logo ${syne.className}`}>PaceAlyzer</Link>
            </div>

            <div className="header-center">
              <Link href="/">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="header-logo"
                />
              </Link>
            </div>

            <div className="header-right">
              <nav className="nav">
                <Link href="/profile" className={`nav-link ${syne.className}`}>
                  Perfil
                </Link>
                <Link href="/dashboard" className={`nav-link dashboard-link ${syne.className}`}>
                  Dashboard
                </Link>
                <Link href="/" className={`nav-link ${syne.className}`}>Inicio</Link>
                <Link href="#acerca-del-producto" className={`nav-link ${syne.className}`}>
                  Acerca del producto
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main envuelto en UserProvider */}
        <UserProvider>
          <main>{children}</main>
        </UserProvider>

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
