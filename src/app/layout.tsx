import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="text-sm text-center text-gray-500 p-4">
          <a href="/privacy" className="underline hover:text-blue-600">Política de privacidad</a>
        </footer>
      </body>

    </html>
  );
}
