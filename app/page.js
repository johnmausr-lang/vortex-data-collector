"use client";

import { useState } from "react";
import { SETTLEMENTS } from "@/lib/constants";
import schema from "@/data/survey_schema.json";
import { ChevronRight, ChevronLeft, Save, CheckCircle2 } from "lucide-react";

export default function SurveyPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = schema[step];
  const totalSteps = schema.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateData = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    const response = await fetch("/api/submit", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (response.ok) setIsFinished(true);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold">Данные сохранены!</h2>
        <p className="text-slate-400">Анкета готова к выгрузке в Vortex.</p>
        <button onClick={() => window.location.reload()} className="bg-blue-600 px-8 py-3 rounded-xl font-bold">Новая анкета</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
          <span>Вопрос {step + 1} из {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl min-h-[400px] flex flex-col">
        <div className="flex-grow">
          <h2 className="text-2xl font-semibold leading-tight mb-8">
            {currentQuestion.label}
          </h2>

          <div className="space-y-3">
            {currentQuestion.type === "select" && (
              <select 
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 text-lg focus:border-blue-500 outline-none"
                onChange={(e) => updateData(currentQuestion.vortex_code, e.target.value)}
                value={formData[currentQuestion.vortex_code] || ""}
              >
                <option value="">Выберите...</option>
                {SETTLEMENTS.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
              </select>
            )}

            {currentQuestion.type === "radio" && currentQuestion.options.map(opt => (
              <button
                key={opt.code}
                onClick={() => updateData(currentQuestion.vortex_code, opt.code)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  formData[currentQuestion.vortex_code] === opt.code 
                  ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/20" 
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"
                }`}
              >
                {opt.text}
              </button>
            ))}

            {currentQuestion.type === "matrix" && (
              <div className="space-y-6">
                {currentQuestion.rows.map(row => (
                  <div key={row.vortex_code} className="space-y-3">
                    <p className="text-sm font-bold text-slate-500 uppercase">{row.text}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {currentQuestion.columns.map(col => (
                        <button
                          key={col.code}
                          onClick={() => updateData(row.vortex_code, col.code)}
                          className={`p-3 rounded-xl border-2 text-sm transition-all ${
                            formData[row.vortex_code] === col.code 
                            ? "bg-blue-600 border-blue-400 text-white" 
                            : "bg-slate-950 border-slate-800 text-slate-400"
                          }`}
                        >
                          {col.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between gap-4">
          <button 
            onClick={handleBack}
            disabled={step === 0}
            className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-slate-800 text-slate-400 hover:bg-slate-800 disabled:opacity-0 transition-all"
          >
            <ChevronLeft size={20} /> Назад
          </button>
          <button 
            onClick={handleNext}
            disabled={currentQuestion.required && !formData[currentQuestion.vortex_code] && currentQuestion.type !== 'matrix'}
            className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all"
          >
            {step === totalSteps - 1 ? "Завершить" : "Далее"} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
