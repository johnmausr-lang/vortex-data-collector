import "./globals.css";
import { Inter } from "next/font/google";
import { ShieldCheck, UserCircle2 } from "lucide-react";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-inter',
});

export const metadata = {
  title: "Vortex Collector 2025 | Сургутский район",
  description: "Enterprise-система сбора социологических данных",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0", // Запрет зума для UX
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} font-sans antialiased text-slate-200 min-h-screen flex flex-col`}>
        
        {/* Глобальный анимированный фон (дизайн-токен 5.2) */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        </div>

        {/* Навигация уровня Premium GovTech */}
        <header className="sticky top-0 z-50 w-full px-6 py-4">
          <div className="max-w-7xl mx-auto glass-card rounded-3xl px-6 py-3 flex justify-between items-center border-white/10 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40">
                <ShieldCheck className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <span className="font-black tracking-tighter text-lg uppercase italic">
                Vortex<span className="text-blue-500">2025</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest">
              <a href="/" className="text-blue-500 transition-colors">Интервьюер</a>
              <a href="/admin" className="text-slate-500 hover:text-white transition-colors">Аналитика</a>
            </nav>

            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <div className="hidden sm:block text-right">
                <div className="text-[10px] font-black text-slate-500 uppercase leading-none mb-1 tracking-tighter">Account</div>
                <div className="text-xs font-bold text-white leading-none">ID_SURGUT_01</div>
              </div>
              <UserCircle2 className="text-slate-400" size={24} strokeWidth={1.5} />
            </div>
          </div>
        </header>

        {/* Основной контент (Motion Container) */}
        <main className="flex-grow flex flex-col relative z-10">
          {children}
        </main>

        {/* Footer (Минимализм 8.0) */}
        <footer className="py-10 px-6 text-center">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]">
              © 2025 Resource Information Center | Surgut District
            </p>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
              <span>Security verified</span>
              <span>Vortex_DM Compatible</span>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
