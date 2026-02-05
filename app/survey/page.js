"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, RefreshCw } from "lucide-react";
import Link from "next/link";

// --- ИСПРАВЛЕННЫЕ ИМПОРТЫ ---
import schema from "@/lib/survey_schema.json"; 
import { offlineStorage } from "@/lib/offline-storage"; 
// ----------------------------

export default function SurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState(-1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Обработка выбора ответа
  const handleOptionSelect = (code, value) => {
    setFormData(prev => ({ ...prev, [code]: value }));
    
    // Авто-переход для радио кнопок
    if (currentQuestion.type === "radio" && step < schema.length - 1) {
      setTimeout(() => {
        setStep(s => s + 1);
      }, 250);
    }
  };

  // Выбор из списка (select)
  const handleSelectChange = (code, value) => {
    setFormData(prev => ({ ...prev, [code]: value }));
  };

  const currentQuestion = schema[step] || {};
  const progress = step >= 0 ? ((step + 1) / schema.length) * 100 : 0;

  const handleNext = () => {
    if (step < schema.length - 1) setStep(s => s + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
    else setStep(-1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800)); // Имитация
    offlineStorage.saveSurvey(formData);
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  // --- ЭКРАН 1: ПРИВЕТСТВИЕ ---
  if (step === -1) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in text-center px-4">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full" />
          <div className="relative glass-panel w-24 h-24 rounded-3xl flex items-center justify-center border-blue-500/30">
            <RefreshCw size={40} className="text-blue-400 animate-spin-slow" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Анкета <span className="text-blue-500">2025</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-md mb-10 leading-relaxed">
          Стандартный опросник для мониторинга социально-политической ситуации.
        </p>
        <button 
          onClick={() => setStep(0)}
          className="btn-primary text-xl px-12 py-5 w-full max-w-xs"
        >
          НАЧАТЬ ОПРОС
        </button>
        <Link href="/" className="mt-8 text-slate-500 text-sm font-bold uppercase hover:text-white transition-colors flex items-center gap-2">
          <ChevronLeft size={16} /> На главную
        </Link>
      </div>
    );
  }

  // --- ЭКРАН 2: УСПЕХ ---
  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in text-center px-4">
        <div className="w-32 h-32 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(16,185,129,0.2)]">
          <Check size={64} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Анкета сохранена!</h2>
        <p className="text-slate-400 mb-8 max-w-sm">Данные записаны локально.</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button 
            onClick={() => window.location.reload()} 
            className="glass-panel py-4 rounded-xl font-bold hover:bg-white/10 text-white"
          >
            Новая анкета
          </button>
          <Link href="/" className="text-slate-500 py-3 font-bold hover:text-white transition-colors text-sm">
            Вернуться в меню
          </Link>
        </div>
      </div>
    );
  }

  // --- ЭКРАН 3: ВОПРОСЫ ---
  return (
    <div className="max-w-2xl mx-auto min-h-[80vh] flex flex-col justify-center animate-fade-in py-10">
      
      {/* Навигация */}
      <div className="mb-8 flex items-center justify-between">
        <button onClick={handleBack} className="p-3 glass-panel rounded-full text-slate-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          Вопрос {step + 1} из {schema.length}
        </div>
        <div className="w-10" />
      </div>

      <div className="h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] relative">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-snug">
          {currentQuestion.label}
        </h2>

        <div className="space-y-3">
          {/* RADIO */}
          {currentQuestion.type === "radio" && currentQuestion.options.map(opt => {
            const isSelected = formData[currentQuestion.vortex_code] === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => handleOptionSelect(currentQuestion.vortex_code, opt.code)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex justify-between items-center group ${
                  isSelected
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30 scale-[1.02]" 
                  : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <span className="font-medium text-lg">{opt.text}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "border-white bg-white text-blue-600" : "border-slate-600 group-hover:border-slate-400"
                }`}>
                  {isSelected && <div className="w-3 h-3 bg-current rounded-full" />}
                </div>
              </button>
            )
          })}
          
          {/* SELECT (простой пример для поселений) */}
          {currentQuestion.type === "select" && (
            <div className="relative">
              <select 
                className="w-full bg-black/20 border border-white/10 rounded-2xl p-5 text-white outline-none appearance-none focus:border-blue-500"
                onChange={(e) => handleSelectChange(currentQuestion.vortex_code, e.target.value)}
                value={formData[currentQuestion.vortex_code] || ""}
              >
                <option value="">Выберите вариант...</option>
                {/* В реальном проекте тут нужно подгружать SETTLEMENTS из constants.js */}
                <option value="1">г.п. Федоровский</option>
                <option value="2">г.п. Белый Яр</option>
                <option value="3">с.п. Солнечный</option>
                <option value="4">г.п. Лянтор</option>
              </select>
            </div>
          )}

           {/* TEXTAREA */}
          {currentQuestion.type === "textarea" && (
             <textarea 
               className="w-full bg-black/20 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[150px]"
               placeholder="Введите текст..."
               value={formData[currentQuestion.vortex_code] || ''}
               onChange={(e) => setFormData({...formData, [currentQuestion.vortex_code]: e.target.value})}
             />
          )}
        </div>

        <div className="mt-10 flex justify-end">
           <button 
            onClick={handleNext}
            disabled={currentQuestion.required && !formData[currentQuestion.vortex_code]}
            className="btn-primary px-8 py-4 disabled:opacity-50 disabled:grayscale"
          >
            {isSubmitting ? "..." : step === schema.length - 1 ? "ЗАВЕРШИТЬ" : "ДАЛЕЕ"}
            {!isSubmitting && <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
