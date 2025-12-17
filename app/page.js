"use client";
import { useState, useMemo } from "react";
import { SETTLEMENTS } from "@/lib/constants";
import schema from "@/data/survey_schema.json";
import { ChevronRight, ChevronLeft, Check, Send, LayoutDashboard } from "lucide-react";

export default function InterviewerFlow() {
  const [step, setStep] = useState(-1); // -1: Welcome screen
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentQuestion = schema[step];
  const isLastStep = step === schema.length - 1;
  const progress = ((step + 1) / schema.length) * 100;

  const handleUpdate = (vortexCode, value) => {
    setFormData(prev => ({ ...prev, [vortexCode]: value }));
    // Auto-advance for simple radio questions (Speed UX)
    if (currentQuestion.type === "radio" && !isLastStep) {
      setTimeout(() => setStep(s => s + 1), 300;
    }
  };

  const submitSurvey = async () => {
    setIsSubmitting(true);
    // Имитация задержки сети для Skeleton/Loading состояния
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (step === -1) return <WelcomeScreen onStart={() => setStep(0)} />;
  if (isSuccess) return <SuccessScreen onRestart={() => window.location.reload()} />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Progress UX */}
      <div className="mb-12 flex items-center gap-6">
        <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-black text-slate-500 tracking-tighter w-12">{Math.round(progress)}%</span>
      </div>

      {/* Question Card (Step-by-step) */}
      <div className="glass-card rounded-[3rem] p-8 md:p-14 relative overflow-hidden question-enter">
        <div className="absolute top-0 right-0 p-8 text-blue-500/20 font-black text-6xl select-none">
          {step + 1}
        </div>

        <div className="relative z-10 min-h-[320px] flex flex-col justify-center">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-10 leading-[1.2]">
            {currentQuestion.label}
          </h2>

          <div className="space-y-4">
            {currentQuestion.type === "select" && (
              <select 
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 text-xl outline-none focus:border-blue-500 transition-all"
                onChange={(e) => handleUpdate(currentQuestion.vortex_code, e.target.value)}
              >
                <option value="">Выбрать из списка...</option>
                {SETTLEMENTS.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
              </select>
            )}

            {currentQuestion.type === "radio" && currentQuestion.options.map(opt => (
              <button
                key={opt.code}
                onClick={() => handleUpdate(currentQuestion.vortex_code, opt.code)}
                className={`w-full group text-left p-6 rounded-[2rem] border-2 transition-all duration-300 flex justify-between items-center ${
                  formData[currentQuestion.vortex_code] === opt.code 
                  ? "bg-blue-600 border-blue-400 text-white shadow-xl scale-[1.02]" 
                  : "bg-slate-950/50 border-slate-800/50 text-slate-400 hover:border-slate-600"
                }`}
              >
                <span className="text-xl font-medium">{opt.text}</span>
                {formData[currentQuestion.vortex_code] === opt.code && <Check size={24} />}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="mt-16 flex items-center gap-4">
          <button 
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
            className="p-6 rounded-3xl bg-slate-900 text-slate-500 hover:text-white disabled:opacity-0 transition-all"
          >
            <ChevronLeft size={28} />
          </button>
          
          <button 
            onClick={isLastStep ? submitSurvey : () => setStep(s => s + 1)}
            disabled={currentQuestion.required && !formData[currentQuestion.vortex_code]}
            className="flex-1 premium-button bg-blue-600 shadow-blue-900/40 text-white"
          >
            {isSubmitting ? "Отправка..." : isLastStep ? "ЗАВЕРШИТЬ" : "ДАЛЕЕ"}
            {!isSubmitting && !isLastStep && <ChevronRight size={24} />}
            {!isSubmitting && isLastStep && <Send size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// Micro-components for UX States
function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 question-enter">
      <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-12 shadow-2xl shadow-blue-600/30">
        <LayoutDashboard className="text-white" size={48} />
      </div>
      <h1 className="text-5xl font-black mb-4 tracking-tighter">Vortex Collector <span className="text-blue-600">2025</span></h1>
      <p className="text-slate-400 text-xl max-w-md mb-12 font-medium">Сургутский район: Система оперативного мониторинга данных.</p>
      <button onClick={onStart} className="premium-button bg-blue-600 px-12 py-6 text-2xl">Начать работу</button>
    </div>
  );
}

function SuccessScreen({ onRestart }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 question-enter">
      <div className="w-32 h-32 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
        <Check size={64} strokeWidth={3} />
      </div>
      <h2 className="text-4xl font-black mb-4">Анкета принята!</h2>
      <p className="text-slate-500 mb-12">Данные успешно закодированы и сохранены в базе.</p>
      <button onClick={onRestart} className="premium-button bg-white text-black px-12 py-6 text-xl">Новая анкета</button>
    </div>
  );
}
