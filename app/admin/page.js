"use client";

import { useState, useEffect } from "react";
import { Download, Users, MapPin, Database, RefreshCcw } from "lucide-react";
import { SETTLEMENTS } from "@/lib/constants";

export default function AdminPage() {
  const [stats, setStats] = useState({ total: 0, bySettlement: {} });
  const [loading, setLoading] = useState(true);

  // Имитация загрузки статистики из БД
  useEffect(() => {
    const fetchStats = async () => {
      // В реальном приложении: fetch('/api/admin/stats')
      setTimeout(() => {
        setStats({
          total: 42,
          bySettlement: { 1: 5, 4: 12, 11: 25 } // Код поселения: количество анкет
        });
        setLoading(false);
      }, 1000);
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    // Вызываем API экспорта, который мы создали ранее (Файл 4)
    window.location.href = "/api/export";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Заголовок админки */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Панель управления</h2>
          <p className="text-slate-400 mt-1">Мониторинг опроса Сургутского района 2025</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/40 transition-all active:scale-95"
        >
          <Download size={20} /> Скачать для Vortex (.txt)
        </button>
      </div>

      {/* Карточки быстрой статистики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-4 text-blue-400 mb-2">
            <Users size={24} />
            <span className="text-sm font-medium uppercase tracking-wider text-slate-500">Всего анкет</span>
          </div>
          <div className="text-4xl font-black">{loading ? "..." : stats.total}</div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-4 text-indigo-400 mb-2">
            <MapPin size={24} />
            <span className="text-sm font-medium uppercase tracking-wider text-slate-500">Поселений активно</span>
          </div>
          <div className="text-4xl font-black">{Object.keys(stats.bySettlement).length} / 13</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-4 text-emerald-400 mb-2">
            <Database size={24} />
            <span className="text-sm font-medium uppercase tracking-wider text-slate-500">Статус БД</span>
          </div>
          <div className="text-xl font-bold text-emerald-500 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Подключено
          </div>
        </div>
      </div>

      {/* Таблица по поселениям */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold">Сбор данных по территориям</h3>
          <button className="text-slate-500 hover:text-white transition"><RefreshCcw size={18} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-widest">
                <th className="px-6 py-4 text-left">Код</th>
                <th className="px-6 py-4 text-left">Поселение</th>
                <th className="px-6 py-4 text-right">Кол-во анкет</th>
                <th className="px-6 py-4 text-right">Прогресс</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {SETTLEMENTS.map((s) => {
                const count = stats.bySettlement[s.code] || 0;
                const percent = Math.min((count / 50) * 100, 100); // Допустим, план 50 анкет
                return (
                  <tr key={s.code} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono text-sm">{s.code}</td>
                    <td className="px-6 py-4 font-medium">{s.name}</td>
                    <td className="px-6 py-4 text-right font-bold">{count}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-1000" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-8">{Math.round(percent)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
