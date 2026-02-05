import "./globals.css";
import { Inter } from "next/font/google";
import { ShieldCheck } from "lucide-react";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata = {
  title: "Vortex Data Collector",
  description: "Система сбора социологических данных",
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#020617] text-slate-100 antialiased selection:bg-blue-500/30`}>
        {/* Глобальный анимированный фон для всего приложения */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        {/* Шапка, общая для всех страниц */}
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
          <div className="max-w-7xl mx-auto glass-card rounded-2xl px-5 py-3 flex justify-between items-center shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ShieldCheck className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <span className="font-black tracking-tighter text-lg uppercase italic">
                Vortex<span className="text-blue-500">.App</span>
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse" />
          </div>
        </header>

        <main className="pt-24 pb-10 px-4 min-h-screen flex flex-col relative z-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
