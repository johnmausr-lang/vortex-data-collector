"use client";
import { useState, useEffect } from "react";
import { 
  Download, 
  BarChart3, 
  Database, 
  ShieldCheck, 
  Activity, 
  MapPin, 
  User, 
  LogOut,
  RefreshCcw
} from "lucide-react";
import { SETTLEMENTS } from "@/lib/constants";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleExport = () => {
    window.location.href = "/api/export";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 animate-in fade-in duration-1000">
      {/* Навигационная панель админа */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-4 px-4">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <div className="text-white font-bold text-sm">Администратор</div>
            <div className="text-slate-500 text-[10px] uppercase tracking-widest font-black">Surgut District Center</div>
          </div>
        </div>
        <button className="flex items-center gap-2 text-slate-400 hover:text-white px-6 py-2 transition-all group">
          <span className="text-sm font-bold">Выйти</span>
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <header className="flex flex-col lg:flex-row justify-between gap-8 items-start lg:items-end px-2">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
            Аналитика <span className="text-blue-600">.</span>
          </h1>
          <p className="text-slate-400 font-medium italic">Система мониторинга общественного мнения 2025</p>
        </div>
        <button 
          onClick={handleExport}
          className="premium-button px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 text-lg leading-none"
        >
          <Download size={22} /> ВЫГРУЗИТЬ ДЛЯ VORTEX_DM
        </button>
      </header>

      {/* Сетка метрик */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Всего анкет", val: "1,284", icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Территории", val: "13/13", icon: MapPin, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: "Валидность", val: "99.1%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "БД Статус", val: "Online", icon: Database, color: "text-cyan-500", bg: "bg-cyan-500/10" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group hover:bg-white/[0.07] transition-all">
            <div className={`mb-6 ${stat.color} ${stat.bg} p-4 w-fit rounded-[1.5rem] group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon size={32} />
            </div>
            <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</div>
            <div className="text-4xl font-black text-white tracking-tighter">{loading ? "..." : stat.val}</div>
          </div>
        ))}
      </div>

      {/* Таблица мониторинга */}
      <div className="glass-card rounded-[3rem] overflow-hidden border border-white/5">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
           <div>
             <h3 className="text-xl font-bold text-white">Статус сбора данных</h3>
             <p className="text-xs text-slate-500 mt-1">Данные обновляются каждые 5 минут</p>
           </div>
           <button className="p-3 rounded-2xl bg-slate-800/50 text-slate-400 hover:text-white transition-all active:rotate-180 duration-500">
             <RefreshCcw size={20} />
           </button>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-6">
                <th className="px-8 py-4">Код</th>
                <th className="px-8 py-4">Поселение</th>
                <th className="px-8 py-4 text-center">Анкет</th>
                <th className="px-8 py-4">Прогресс квоты</th>
              </tr>
            </thead>
            <tbody>
              {SETTLEMENTS.map((s) => (
                <tr key={s.code} className="group hover:bg-white/[0.03] transition-all">
                  <td className="px-8 py-6 rounded-l-3xl bg-white/[0.01] text-slate-500 font-mono text-xs">{s.code}</td>
                  <td className="px-8 py-6 bg-white/[0.01] font-bold text-slate-200">{s.name}</td>
                  <td className="px-8 py-6 bg-white/[0.01] text-center font-black text-blue-500">{(Math.random() * 100).toFixed(0)}</td>
                  <td className="px-8 py-6 rounded-r-3xl bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                      <div className="flex-grow h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
