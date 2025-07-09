import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: 'WattCoach ⚡',
  description: 'Tu entrenador virtual inteligente conectado a Strava. Recibe análisis personalizados de tus entrenamientos vía Mail.',
  openGraph: {
    title: 'WattCoach ⚡',
    description: 'Tu entrenador virtual inteligente conectado a Strava. Recibe análisis personalizados de tus entrenamientos vía Mail.',
    url: 'https://strava-training-analyzer.onrender.com',
    siteName: 'WattCoach',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'WattCoach ⚡',
    description: 'Tu entrenador virtual inteligente conectado a Strava. Recibe análisis personalizados de tus entrenamientos vía Mail.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-white text-gray-900 antialiased font-sans">
        {children}
        <footer className="text-sm text-center text-gray-500 p-4 space-x-4">
          <a
            href="/privacy"
            className="underline hover:text-blue-600"
          >
            Política de privacidad
          </a>
          <span>|</span>
          <a
            href="/terms"
            className="underline hover:text-blue-600"
          >
            Términos y condiciones
          </a>
        </footer>
      </body>
    </html>
  );
}
