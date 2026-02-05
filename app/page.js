"use client";
import Link from "next/link";
import { ClipboardList, Settings, Database, Activity, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Приветствие */}
      <div className="text-center py-10 space-y-4">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
          Vortex Collector
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          Автономная система сбора полевых данных. Версия 2.0
        </p>
      </div>

      {/* Основная сетка */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Карточка опроса */}
        <Link href="/survey" className="group">
          <div className="glass-panel h-full p-8 rounded-[2rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ClipboardList size={32} />
              </div>
              
              <h2 className="text-3xl font-bold mb-2 text-white">Начать опрос</h2>
              <p className="text-slate-400 mb-8">
                Запуск стандартной анкеты (Сургутский район). Поддержка оффлайн режима и GPS-трекинга.
              </p>
              
              <div className="flex items-center gap-2 text-blue-400 font-bold group-hover:gap-4 transition-all">
                ЗАПУСТИТЬ ТЕРМИНАЛ <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* Карточка конструктора */}
        <Link href="/admin/builder" className="group">
          <div className="glass-panel h-full p-8 rounded-[2rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-all" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Settings size={32} />
              </div>
              
              <h2 className="text-3xl font-bold mb-2 text-white">Конструктор форм</h2>
              <p className="text-slate-400 mb-8">
                Создание динамических опросников, редактирование логики и управление базой данных.
              </p>
              
              <div className="flex items-center gap-2 text-purple-400 font-bold group-hover:gap-4 transition-all">
                ОТКРЫТЬ ПАНЕЛЬ <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Статистика (подвал) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Статус сети" value="Online" icon={Activity} color="text-emerald-400" />
        <StatCard label="База данных" value="Connected" icon={Database} color="text-blue-400" />
        <div className="col-span-2 glass-panel p-4 rounded-2xl flex items-center justify-center text-slate-500 text-sm font-mono uppercase">
          ID сессии: VTX-{Math.floor(Math.random() * 9000) + 1000}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xs text-slate-500 font-bold uppercase">{label}</div>
        <div className="text-white font-bold">{value}</div>
      </div>
    </div>
  );
}
