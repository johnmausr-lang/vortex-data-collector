"use client";
import { Download, BarChart3, Database, ShieldCheck, Activity } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between gap-6 items-end">
        <div>
          <div className="flex items-center gap-2 text-blue-500 mb-2 font-bold tracking-widest text-sm uppercase">
            <ShieldCheck size={16} /> Secure Admin Access
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Центр управления</h1>
        </div>
        <button className="premium-button px-10 py-4 rounded-2xl font-black flex items-center gap-3 text-lg">
          <Download size={22} /> ВЫГРУЗИТЬ VORTEX DATA
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Анкет собрано", val: "1,284", icon: BarChart3, color: "text-blue-500" },
          { label: "Поселений", val: "13/13", icon: MapPin, color: "text-indigo-500" },
          { label: "Активность", val: "98.2%", icon: Activity, color: "text-emerald-500" },
          { label: "Сервер", val: "Online", icon: Database, color: "text-cyan-500" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[2rem] relative overflow-hidden group">
            <div className={`mb-4 ${stat.color} p-3 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-3xl font-black text-white">{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
           <h3 className="text-xl font-bold">Мониторинг территорий</h3>
           <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <span className="text-xs font-bold text-slate-400 italic">Live Syncing</span>
           </div>
        </div>
        <div className="p-4 overflow-x-auto">
          {/* Таблица с прозрачными строками и hover эффектами */}
        </div>
      </div>
    </div>
  );
}
