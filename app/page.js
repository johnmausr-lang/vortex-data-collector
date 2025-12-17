"use client";
import { useState, useEffect } from "react";
import { SETTLEMENTS } from "@/lib/constants";
import schema from "@/data/survey_schema.json";
import { offlineStorage } from "@/lib/offline-storage";
// Заменили CloudSync на Cloud
import { ChevronRight, ChevronLeft, Check, Send, WifiOff, Cloud } from "lucide-react";

export default function InterviewerFlow() {
  const [step, setStep] = useState(-1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  // Проверка сети
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

  const currentQuestion = schema[step];
  const progress = ((step + 1) / schema.length) * 100;

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
        if (response.ok) setIsSuccess(true);
        else throw new Error();
      } catch (e) {
        offlineStorage.saveSurvey(formData);
        setIsSuccess(true);
      }
    } else {
      offlineStorage.saveSurvey(formData);
      setIsSuccess(true);
    }
    setIsSubmitting(false);
  };

  if (step === -1) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl">
        <Cloud className="text-white" size={48} />
      </div>
      <h1 className="text-4xl font-black mb-2 tracking-tighter">Vortex Live Collector</h1>
      
      <div className="mb-8">
        {isOnline ? (
          <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 justify-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Online
          </span>
        ) : (
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 justify-center">
            <WifiOff size={14} /> Offline Mode
          </span>
        )}
      </div>

      <button onClick={() => setStep(0)} className="premium-button bg-blue-600 w-full max-w-sm py-6 text-xl">
        Начать опрос
      </button>
    </div>
  );

  if (isSuccess) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-32 h-32 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-8">
        <Check size={64} strokeWidth={3} />
      </div>
      <h2 className="text-4xl font-black mb-4">Готово!</h2>
      <button onClick={() => window.location.reload()} className="premium-button bg-white text-black px-12 py-6">
        Новая анкета
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-10 h-1.5 bg-slate-900 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
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
            </button>
          ))}
        </div>

        <div className="flex gap-4 mt-12">
          <button disabled={step === 0} onClick={() => setStep(s => s - 1)} className="flex-1 py-5 rounded-2xl bg-slate-800/50 text-slate-400">Назад</button>
          <button 
            onClick={step === schema.length - 1 ? submitSurvey : () => setStep(s => s + 1)}
            disabled={currentQuestion.required && !formData[currentQuestion.vortex_code]}
            className="flex-[2] premium-button bg-blue-600 text-white font-black"
          >
            {isSubmitting ? "Синхронизация..." : step === schema.length - 1 ? "Завершить" : "Далее"}
          </button>
        </div>
      </div>
    </div>
  );
}
