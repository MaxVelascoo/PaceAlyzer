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
  // ...existing code...
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
      <body className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 text-gray-900 antialiased font-sans min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full py-6 bg-white/80 shadow-md flex items-center justify-center mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-pink-600">⚡ PaceAlyzer</span>
            <span className="text-sm text-gray-500">Tu entrenador virtual inteligente</span>
          </div>
        </header>
        {/* Main content */}
        <main className="flex-1 flex justify-center items-center px-4">
          <div className="max-w-2xl w-full bg-white/80 rounded-xl shadow-lg p-8">
            {children}
          </div>
        </main>
        {/* Footer */}
        <footer className="text-sm text-center text-gray-500 p-4 space-x-4 bg-white/80 shadow-inner rounded-t-xl mt-8 flex flex-col items-center">
          <div className="mb-2 flex gap-4">
            <a
              href="/privacy"
              className="underline hover:text-pink-600 transition-colors"
            >
              Política de privacidad
            </a>
            <span>|</span>
            <a
              href="/terms"
              className="underline hover:text-pink-600 transition-colors"
            >
              Términos y condiciones
            </a>
          </div>
          {/* Powered by Strava SVG */}
          <div className="flex items-center justify-center mt-2">
            <img
              src="/api_logo_pwrdBy_strava_stack_black.svg"
              alt="Powered by Strava"
              width={120}
              height={40}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-400">© 2025 PaceAlyzer</div>
        </footer>
      </body>
    </html>
  );
}