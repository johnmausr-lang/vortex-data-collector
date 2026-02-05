"use client";
import Link from "next/link";
import { ClipboardList, Settings, Wifi, Database, ArrowRight } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 animate-enter pt-10">
      
      {/* Заголовок */}
      <div className="space-y-2 mb-4">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Vortex <span className="text-blue-500">Collector</span>
        </h1>
        <p className="text-slate-400">Система полевых исследований v2.0</p>
      </div>

      {/* Статус системы */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-1">
            <Wifi size={14} /> Online
          </div>
          <div className="text-lg font-bold text-white">Связь есть</div>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase mb-1">
            <Database size={14} /> Storage
          </div>
          <div className="text-lg font-bold text-white">Local DB OK</div>
        </div>
      </div>

      {/* Кнопки навигации */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* КНОПКА ЗАПУСКА ОПРОСА - ведет на вашу логику */}
        <Link href="/survey" className="group">
          <div className="glass-card p-8 rounded-[2rem] border-l-4 border-l-blue-500 hover:bg-white/5 transition-all relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-blue-500/20 p-3 rounded-full text-blue-400">
              <ClipboardList size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Начать опрос</h3>
            <p className="text-slate-400 text-sm mb-4">Запуск стандартной анкеты Сургутского района.</p>
            <div className="flex items-center text-blue-400 font-bold text-sm">
              ПЕРЕЙТИ <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* КНОПКА КОНСТРУКТОРА */}
        <Link href="/admin/builder" className="group">
          <div className="glass-card p-8 rounded-[2rem] border-l-4 border-l-purple-500 hover:bg-white/5 transition-all relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-purple-500/20 p-3 rounded-full text-purple-400">
              <Settings size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Конструктор</h3>
            <p className="text-slate-400 text-sm mb-4">Создание новых динамических форм.</p>
            <div className="flex items-center text-purple-400 font-bold text-sm">
              НАСТРОИТЬ <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
