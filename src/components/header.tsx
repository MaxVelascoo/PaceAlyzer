'use client';
import Link from 'next/link';
import { useUser } from '@/context/userContext';
import { Syne } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], weight: ['700'] });

export default function Header() {
  const userContext = useUser();
  const user = userContext?.user;

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link href="/" className={`logo ${syne.className}`}>PaceAlyzer</Link>
        </div>

        <div className="header-center">
          <Link href="/">
            <img src="/logo.png" alt="Logo" className="header-logo" />
          </Link>
        </div>

        <div className="header-right">
          <nav className="nav">
            {user ? (
              <>
                <Link href="/dashboard" className={`nav-link dashboard-link ${syne.className}`}>
                  Dashboard
                </Link>
                <Link href="/profile" className={`nav-link ${syne.className}`}>
                  Perfil
                </Link>
              </>
            ) : (
              <>
                <Link href="/start/login" className={`nav-link ${syne.className}`}>
                  Iniciar sesión
                </Link>
                <Link href="/start/register" className={`nav-link ${syne.className}`}>
                  Registrarse
                </Link>
              </>
            )}
            <Link href="/" className={`nav-link ${syne.className}`}>Inicio</Link>
            <Link href="#acerca-del-producto" className={`nav-link ${syne.className}`}>
              Acerca del producto
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
