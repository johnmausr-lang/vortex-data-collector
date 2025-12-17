import "./globals.css";
import { Inter } from "next/font/google";
import { ShieldCheck, UserCircle2 } from "lucide-react";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-inter',
});

// ПРАВИЛЬНЫЙ СПОСОБ ДЛЯ NEXT.JS 14
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#020617",
};

export const metadata = {
  title: "Vortex Collector 2025 | Сургутский район",
  description: "Enterprise-система сбора социологических данных",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} font-sans antialiased text-slate-200 min-h-screen flex flex-col`}>
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        </div>

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
            <div className="flex items-center gap-4">
              <UserCircle2 className="text-slate-400" size={24} strokeWidth={1.5} />
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
