import './styles.css';
import Link from 'next/link';
import { Syne } from 'next/font/google';
import { UserProvider } from '@/context/userContext';
import Header from '@/components/header';

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
        <UserProvider>
          <Header />
          <main>{children}</main>
        </UserProvider>

        <footer className="footer">
          <div className="footer-left">
            <h2 className={syne.className}>PaceAlyzer</h2>
            <p>123-456-789</p>
            <p>max.velaso.rajo@gmail.com</p>
            <p>Barcelona</p>
          </div>
          <div className="footer-right">
            <ul>
              <li><Link href="/privacy">Política de Privacidad</Link></li>
              <li><Link href="/terms">Términos y Condiciones</Link></li>
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
