import { Inter } from "next/font/google";
import "./globals.css";
import { ShieldCheck } from "lucide-react";

// Загружаем шрифт с поддержкой кириллицы
const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: "Vortex Data Collector",
  description: "Enterprise Survey System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 bg-mesh font-sans">
        
        {/* Хедер */}
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Vortex<span className="text-blue-500">.App</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-slate-400 uppercase">System Online</span>
            </div>
          </div>
        </nav>

        {/* Контент */}
        <main className="pt-24 px-4 pb-10 max-w-7xl mx-auto">
          {children}
        </main>
        
      </body>
    </html>
  );
}
