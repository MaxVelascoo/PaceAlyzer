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
            <span className="text-2xl font-bold text-blue-600">⚡ WattCoach</span>
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
              className="underline hover:text-blue-600 transition-colors"
            >
              Política de privacidad
            </a>
            <span>|</span>
            <a
              href="/terms"
              className="underline hover:text-blue-600 transition-colors"
            >
              Términos y condiciones
            </a>
          </div>
          <div className="flex gap-3">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg width="20" height="20" fill="currentColor" className="text-blue-400 hover:text-blue-600 transition-colors"><path d="M20 3.924a8.19 8.19 0 0 1-2.357.646A4.118 4.118 0 0 0 19.448 2.3a8.224 8.224 0 0 1-2.605.996A4.107 4.107 0 0 0 9.85 7.03a11.65 11.65 0 0 1-8.457-4.287a4.106 4.106 0 0 0 1.27 5.482A4.073 4.073 0 0 1 .8 7.13v.052a4.108 4.108 0 0 0 3.292 4.025a4.095 4.095 0 0 1-1.085.144c-.265 0-.522-.026-.772-.075a4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 0 17.544a11.616 11.616 0 0 0 6.29 1.844c7.547 0 11.675-6.155 11.675-11.495c0-.175-.004-.349-.012-.522A8.18 8.18 0 0 0 20 3.924z"/></svg>
            </a>
            {/* Puedes agregar más íconos aquí */}
          </div>
          <div className="mt-2 text-xs text-gray-400">© 2025 WattCoach</div>
        </footer>
      </body>
    </html>
  );
}