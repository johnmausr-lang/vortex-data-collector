"use client";
import { useState } from "react";
import { SETTLEMENTS } from "@/lib/constants";
import schema from "@/data/survey_schema.json";
import { ChevronRight, ChevronLeft, CheckCircle2, User, MapPin } from "lucide-react";

export default function InterviewerDashboard() {
  const [step, setStep] = useState(-1); // -1 для стартового экрана приветствия
  const [formData, setFormData] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = schema[step];
  const progress = step === -1 ? 0 : ((step + 1) / schema.length) * 100;

  if (step === -1) return (
    <div className="max-w-xl mx-auto mt-10 animate-in fade-in zoom-in duration-700">
      <div className="glass-card rounded-[2.5rem] p-10 text-center">
        <div className="w-20 h-20 bg-blue-600/20 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
          <User size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Личный кабинет</h1>
        <p className="text-slate-400 mb-8 text-lg">Интервьюер: <span className="text-white font-medium">Сургут_01</span></p>
        <button 
          onClick={() => setStep(0)}
          className="premium-button w-full py-5 rounded-2xl font-bold text-xl"
        >
          Начать новый опрос
        </button>
      </div>
    </div>
  );

  // ... (логика переключения шагов остается прежней, но оборачиваем в новый UI)
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 border border-white/5">
              <MapPin size={18} />
            </div>
            <span className="text-sm font-semibold tracking-wide text-slate-300">СУРГУТСКИЙ РАЙОН</span>
         </div>
         <span className="text-xs font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase italic">Vortex Live</span>
      </div>

      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
        <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="glass-card rounded-[3rem] p-8 md:p-12 min-h-[500px] flex flex-col relative overflow-hidden">
        {/* Декоративный эффект свечения */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px]" />
        
        <div className="relative z-10 flex-grow">
          <span className="text-blue-500 font-bold text-sm mb-4 block uppercase tracking-[0.2em]">Вопрос {step + 1}</span>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-10 text-white">
            {currentQuestion.label}
          </h2>

          <div className="grid gap-4">
             {/* Рендеринг вариантов (Radio/Select/Matrix) с улучшенными стилями */}
             {currentQuestion.type === "radio" && currentQuestion.options.map(opt => (
                <button
                  key={opt.code}
                  onClick={() => setFormData({...formData, [currentQuestion.vortex_code]: opt.code})}
                  className={`group flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 ${
                    formData[currentQuestion.vortex_code] === opt.code 
                    ? "bg-blue-600/20 border-blue-500 text-white" 
                    : "bg-slate-950/40 border-slate-800/50 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="text-lg font-medium">{opt.text}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    formData[currentQuestion.vortex_code] === opt.code ? "border-white bg-white" : "border-slate-700"
                  }`}>
                    {formData[currentQuestion.vortex_code] === opt.code && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                  </div>
                </button>
             ))}
          </div>
        </div>

        <div className="flex gap-4 mt-12 relative z-10">
          <button onClick={() => setStep(step-1)} className="flex-1 py-5 rounded-2xl bg-slate-800/50 text-slate-300 font-bold hover:bg-slate-800 transition-all border border-white/5">Назад</button>
          <button onClick={handleNext} className="flex-[2] premium-button py-5 rounded-2xl font-bold flex items-center justify-center gap-3">
            Далее <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
