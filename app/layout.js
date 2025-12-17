import "./globals.css"; // Стандартные стили Tailwind
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata = {
  title: "Vortex Collector 2025 | Сургутский район",
  description: "Система быстрого ввода данных для Vortex_DM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen`}>
        <header className="border-b border-slate-800 p-4 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              VORTEX_DM <span className="text-slate-500 font-light">Collector</span>
            </h1>
            <nav className="space-x-4 text-sm font-medium">
              <a href="/" className="hover:text-blue-400 transition">Ввод анкеты</a>
              <a href="/admin" className="text-slate-400 hover:text-white transition">Админ-панель</a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto py-8 px-4">
          {children}
        </main>
        <footer className="border-t border-slate-900 py-6 text-center text-slate-600 text-xs">
          © 2025 Сургутский район. Оптимизировано для Vortex_DM.
        </footer>
      </body>
    </html>
  );
}
