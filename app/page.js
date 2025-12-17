"use client";
import { useState, useEffect } from "react";
import { SETTLEMENTS } from "@/lib/constants";
import schema from "@/data/survey_schema.json";
import { offlineStorage } from "@/lib/offline-storage";
import { ChevronRight, ChevronLeft, Check, Send, WifiOff, CloudSync } from "lucide-react";

export default function InterviewerFlow() {
  const [step, setStep] = useState(-1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const currentQuestion = schema[step];
  const progress = ((step + 1) / schema.length) * 100;

  // Мониторинг сети
  useEffect(() => {
    setIsOnline(navigator.onLine);
    setPendingCount(offlineStorage.getPendingSurveys().length);

    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const handleUpdate = (vortexCode, value) => {
    setFormData(prev => ({ ...prev, [vortexCode]: value }));
    if (currentQuestion.type === "radio" && step < schema.length - 1) {
      setTimeout(() => setStep(s => s + 1), 300);
    }
  };

  const submitSurvey = async () => {
    setIsSubmitting(true);
    
    if (navigator.onLine) {
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          setIsSuccess(true);
        } else {
          throw new Error('Server error');
        }
      } catch (e) {
        offlineStorage.saveSurvey(formData);
        setIsSuccess(true); // Показываем успех, т.к. данные сохранены локально
      }
    } else {
      offlineStorage.saveSurvey(formData);
      setIsSuccess(true);
    }
    
    setIsSubmitting(false);
  };

  if (step === -1) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
      <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-600/30">
        <CloudSync className="text-white" size={48} />
      </div>
      <h1 className="text-4xl font-black mb-2 tracking-tighter">Vortex Live Collector</h1>
      
      {/* Статус офлайна */}
      <div className="mb-8 flex items-center gap-2 justify-center">
        {isOnline ? (
          <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold uppercase tracking-widest">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Online
          </span>
        ) : (
          <span className="flex items-center gap-1 text-amber-500 text-xs font-bold uppercase tracking-widest">
            <WifiOff size={14} /> Offline Mode
          </span>
        )}
      </div>

      {pendingCount > 0 && (
        <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-2xl text-sm font-bold mb-8 border border-blue-500/20">
          Ожидают отправки: {pendingCount} анкет
        </div>
      )}

      <button onClick={() => setStep(0)} className="premium-button bg-blue-600 w-full max-w-sm py-6 text-xl">
        Начать опрос
      </button>
    </div>
  );

  if (isSuccess) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 question-enter">
      <div className="w-32 h-32 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-8">
        <Check size={64} strokeWidth={3} />
      </div>
      <h2 className="text-4xl font-black mb-4">Готово!</h2>
      <p className="text-slate-500 mb-12">
        {isOnline ? "Анкета отправлена на сервер." : "Связи нет. Анкета сохранена в памяти устройства."}
      </p>
      <button onClick={() => window.location.reload()} className="premium-button bg-white text-black px-12 py-6 text-xl">
        Следующая анкета
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-10 flex items-center gap-4">
        <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Шаг {step + 1}</span>
      </div>

      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden question-enter">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-tight">
            {currentQuestion.label}
          </h2>

          <div className="space-y-3">
            {currentQuestion.type === "radio" && currentQuestion.options.map(opt => (
              <button
                key={opt.code}
                onClick={() => handleUpdate(currentQuestion.vortex_code, opt.code)}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex justify-between items-center ${
                  formData[currentQuestion.vortex_code] === opt.code 
                  ? "bg-blue-600 border-blue-400 text-white shadow-lg" 
                  : "bg-slate-950/40 border-slate-800/50 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="text-lg font-bold">{opt.text}</span>
                <div className={`w-5 h-5 rounded-full border-2 ${formData[currentQuestion.vortex_code] === opt.code ? "border-white bg-white" : "border-slate-700"}`} />
              </button>
            ))}

            {currentQuestion.type === "select" && (
              <select 
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-5 text-lg text-white"
                onChange={(e) => handleUpdate(currentQuestion.vortex_code, e.target.value)}
                value={formData[currentQuestion.vortex_code] || ""}
              >
                <option value="">Выберите поселение...</option>
                {SETTLEMENTS.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
              </select>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-12 relative z-10">
          <button 
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
            className="flex-1 py-5 rounded-2xl bg-slate-800/50 text-slate-400 font-bold disabled:opacity-0"
          >
            Назад
          </button>
          <button 
            onClick={step === schema.length - 1 ? submitSurvey : () => setStep(s => s + 1)}
            disabled={currentQuestion.required && !formData[currentQuestion.vortex_code]}
            className="flex-[2] premium-button py-5 rounded-2xl font-black uppercase tracking-widest"
          >
            {isSubmitting ? "Синхронизация..." : step === schema.length - 1 ? "Завершить" : "Далее"}
          </button>
        </div>
      </div>
    </div>
  );
}
