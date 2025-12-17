"use client";

import { useState, useEffect } from "react";
import { SETTLEMENTS } from "@/lib/constants";
import schema from "@/data/survey_schema.json";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function SurveyPage() {
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  // Обработка обычных ответов
  const handleRadioChange = (questionId, value) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));
  };

  // Обработка матричных вопросов
  const handleMatrixChange = (vortexCode, value) => {
    setFormData((prev) => ({ ...prev, [vortexCode]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({}); // Очистка формы
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Новая анкета</h2>
        <p className="text-slate-400 text-sm">Все данные автоматически кодируются для Vortex_DM</p>
      </div>

      {status === "success" && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 p-4 rounded-xl flex items-center gap-3 text-emerald-400">
          <CheckCircle2 size={20} /> Анкета успешно сохранена!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Выбор поселения — Всегда первый */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <label className="block text-lg font-medium mb-4 text-blue-400">
            1. Выберите поселение
          </label>
          <select 
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => handleRadioChange("P_SETTLEMENT", parseInt(e.target.value))}
            value={formData.P_SETTLEMENT || ""}
          >
            <option value="">-- Выберите из списка 13 поселений --</option>
            {SETTLEMENTS.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </section>

        {/* Динамическая генерация вопросов из схемы */}
        {schema.filter(q => q.id !== 'P_SETTLEMENT').map((q) => (
          <section key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all hover:border-slate-700">
            <h3 className="text-lg font-medium mb-4 leading-snug">{q.label}</h3>

            {q.type === "radio" && (
              <div className="grid gap-3">
                {q.options.map((opt) => (
                  <label key={opt.code} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${formData[q.vortex_code] === opt.code ? 'bg-blue-600/20 border-blue-500 text-blue-100' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}>
                    <input 
                      type="radio" 
                      name={q.vortex_code} 
                      required={q.required}
                      className="w-5 h-5 accent-blue-500"
                      onChange={() => handleRadioChange(q.vortex_code, opt.code)}
                      checked={formData[q.vortex_code] === opt.code}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === "matrix" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Структура</th>
                      {q.columns.map(col => <th key={col.code} className="p-2 text-center text-[10px] uppercase text-slate-500">{col.text}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {q.rows.map(row => (
                      <tr key={row.vortex_code} className="border-t border-slate-800">
                        <td className="py-3 pr-2 font-medium">{row.text}</td>
                        {q.columns.map(col => (
                          <td key={col.code} className="text-center p-2">
                            <input 
                              type="radio" 
                              name={row.vortex_code}
                              required={q.required}
                              className="w-5 h-5 accent-blue-500"
                              onChange={() => handleMatrixChange(row.vortex_code, col.code)}
                              checked={formData[row.vortex_code] === col.code}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {q.type === "textarea" && (
              <textarea 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 h-32 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Введите текст ответа..."
                onChange={(e) => handleRadioChange(q.vortex_code, e.target.value)}
                value={formData[q.vortex_code] || ""}
              />
            )}
          </section>
        ))}

        <button 
          type="submit" 
          disabled={status === "loading"}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 text-xl transition-all active:scale-95"
        >
          {status === "loading" ? "Сохранение..." : <><Save /> Сохранить анкету</>}
        </button>
      </form>
    </div>
  );
}
