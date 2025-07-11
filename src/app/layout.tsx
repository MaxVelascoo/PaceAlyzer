import './styles.css';
import Link from 'next/link';

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
            <span className="logo">PaceAlyzer</span>
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
            <h2>PaceAlyzer</h2>
            <p>651-677-748</p>
            <p>max.velaso.rajo@gmail.com</p>
            <p>Barcelona</p>
          </div>
          <div className="footer-right">
            <ul>
              <li><Link href="#">Política de Privacidad</Link></li>
              <li><Link href="#">Declaración de Accesibilidad</Link></li>
              <li><Link href="#">Términos y Condiciones</Link></li>
              <li><Link href="#">Política de Reembolso</Link></li>
            </ul>
          </div>
          <div className="footer-bottom">
            <p>© 2025 by PaceAlyzer.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
