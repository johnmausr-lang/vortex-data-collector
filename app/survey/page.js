"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

// Импорт данных и утилит
import schema from "@/lib/survey_schema.json";
import { offlineStorage } from "@/lib/offline-storage";
import { SETTLEMENTS } from "@/lib/constants";

export default function SurveyPage() {
  const router = useRouter();
  
  // Состояния
  const [step, setStep] = useState(-1); // -1 = Приветственный экран
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Текущий вопрос и прогресс
  const currentQuestion = schema[step] || {};
  const progress = step >= 0 ? ((step + 1) / schema.length) * 100 : 0;

  // --- ЛОГИКА ОБРАБОТКИ ОТВЕТОВ ---

  // 1. Простой выбор (Radio)
  const handleRadioSelect = (code, value) => {
    setFormData(prev => ({ ...prev, [code]: value }));
    
    // Авто-переход только если это не последний вопрос
    if (step < schema.length - 1) {
      setTimeout(() => setStep(s => s + 1), 250);
    }
  };

  // 2. Выбор из списка (Select)
  const handleSelectChange = (code, value) => {
    setFormData(prev => ({ ...prev, [code]: value }));
  };

  // 3. Матрица (Табличные вопросы)
  const handleMatrixSelect = (rowCode, colCode) => {
    setFormData(prev => ({ ...prev, [rowCode]: colCode }));
  };

  // 4. Текст (Textarea)
  const handleTextChange = (code, value) => {
    setFormData(prev => ({ ...prev, [code]: value }));
  };

  // --- НАВИГАЦИЯ ---

  const handleNext = () => {
    if (step < schema.length - 1) {
      setStep(s => s + 1);
      // Скролл вверх при переходе к новому вопросу
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
    else setStep(-1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Имитация задержки (для UX)
    await new Promise(r => setTimeout(r, 1000));
    
    // Сохранение анкеты
    const success = offlineStorage.saveSurvey(formData);
    
    if (success) {
      setIsSuccess(true);
    } else {
      alert("Ошибка сохранения данных. Проверьте память устройства.");
    }
    setIsSubmitting(false);
  };

  // --- ВАЛИДАЦИЯ (ПРОВЕРКА ОБЯЗАТЕЛЬНОСТИ) ---
  
  const isStepValid = () => {
    if (!currentQuestion) return false;
    if (!currentQuestion.required) return true;

    if (currentQuestion.type === "radio" || currentQuestion.type === "select" || currentQuestion.type === "textarea") {
      return !!formData[currentQuestion.vortex_code];
    }

    if (currentQuestion.type === "matrix") {
      // Проверяем, что на КАЖДУЮ строку (row) дан ответ
      return currentQuestion.rows.every(row => !!formData[row.vortex_code]);
    }

    return true;
  };

  // --- РЕНДЕРИНГ ЭКРАНОВ ---

  // 1. ЭКРАН ПРИВЕТСТВИЯ
  if (step === -1) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center animate-fade-in text-center px-4 py-10">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full" />
          <div className="relative glass-panel w-24 h-24 rounded-3xl flex items-center justify-center border border-white/10 bg-white/5 shadow-2xl">
            <RefreshCw size={40} className="text-blue-400 animate-spin-slow" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
          Мониторинг <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">2026</span>
        </h1>
        
        <div className="glass-panel p-6 rounded-2xl max-w-md w-full mb-10 border-l-4 border-blue-500 text-left">
          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
            <AlertCircle size={18} className="text-blue-400"/> Инструкция:
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Опрос проводится для определения уровня удовлетворенности деятельностью органов власти Сургутского района. Анкета анонимна.
          </p>
        </div>

        <button 
          onClick={() => setStep(0)}
          className="btn-primary w-full max-w-xs text-lg py-5 shadow-blue-900/50"
        >
          НАЧАТЬ АНКЕТИРОВАНИЕ
        </button>
        
        <Link href="/" className="mt-8 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
          <ChevronLeft size={14} /> Вернуться в меню
        </Link>
      </div>
    );
  }

  // 2. ЭКРАН УСПЕХА
  if (isSuccess) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center animate-fade-in text-center px-6">
        <div className="w-32 h-32 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_80px_rgba(16,185,129,0.3)] animate-pulse-slow">
          <Check size={64} strokeWidth={4} />
        </div>
        <h2 className="text-4xl font-black text-white mb-4">Анкета принята!</h2>
        <p className="text-slate-400 mb-10 max-w-sm text-lg">
          Данные успешно сохранены в локальную базу. Синхронизация произойдет автоматически при появлении сети.
        </p>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={() => window.location.reload()} 
            className="glass-panel py-4 rounded-xl font-bold hover:bg-white/10 text-white transition-all active:scale-95 border border-white/20"
          >
            + Новая анкета
          </button>
          <Link href="/" className="py-4 text-slate-500 font-bold hover:text-white transition-colors text-sm uppercase tracking-wider">
            Выйти в главное меню
          </Link>
        </div>
      </div>
    );
  }

  // 3. ЭКРАН ВОПРОСА
  return (
    <div className="max-w-3xl mx-auto min-h-[85vh] flex flex-col pt-4 pb-12 animate-fade-in px-4 md:px-0">
      
      {/* Верхняя навигация */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={handleBack} 
          className="w-10 h-10 flex items-center justify-center glass-panel rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5">
          Вопрос {step + 1} / {schema.length}
        </div>
        <div className="w-10" /> {/* Пустой блок для баланса */}
      </div>

      {/* Прогресс бар */}
      <div className="h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 transition-all duration-500 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Карточка вопроса */}
      <div className="glass-panel p-6 md:p-10 rounded-[2rem] relative border border-white/10 bg-[#0f172a]/60 backdrop-blur-xl">
        
        {/* Текст вопроса */}
        <h2 className="text-xl md:text-3xl font-bold text-white mb-8 leading-snug">
          {currentQuestion.label}
          {currentQuestion.required && <span className="text-red-500 ml-1" title="Обязательный вопрос">*</span>}
        </h2>

        {/* --- РЕНДЕР ТИПОВ ВОПРОСОВ --- */}
        <div className="space-y-4">
          
          {/* ТИП: RADIO (Одиночный выбор) */}
          {currentQuestion.type === "radio" && currentQuestion.options.map(opt => {
            const isSelected = formData[currentQuestion.vortex_code] === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => handleRadioSelect(currentQuestion.vortex_code, opt.code)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 flex justify-between items-center group active:scale-[0.98] ${
                  isSelected
                  ? "bg-blue-600/90 border-blue-500 text-white shadow-lg shadow-blue-900/40" 
                  : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <span className="font-medium text-lg">{opt.text}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "border-white bg-white" : "border-slate-600 group-hover:border-slate-400"
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                </div>
              </button>
            )
          })}

          {/* ТИП: SELECT (Выбор поселения с квотами) */}
          {currentQuestion.type === "select" && (
            <div className="relative group">
              <select 
                className="w-full bg-[#0a0f1e] border border-white/20 rounded-2xl p-5 text-white outline-none appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-lg cursor-pointer hover:border-white/30"
                onChange={(e) => handleSelectChange(currentQuestion.vortex_code, e.target.value)}
                value={formData[currentQuestion.vortex_code] || ""}
              >
                <option value="" className="text-slate-500">Выберите из списка...</option>
                {/* Динамическая подгрузка поселений, если указано options: "SETTLEMENTS" */}
                {currentQuestion.options === "SETTLEMENTS" && SETTLEMENTS.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name} (Квота: {city.quota})
                  </option>
                ))}
              </select>
              {/* Кастомная стрелочка */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-white transition-colors">
                ▼
              </div>
              <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200 flex gap-2 items-start">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>Соблюдайте квоту выборки. При достижении лимита, переходите к следующему населенному пункту или завершайте работу.</span>
              </div>
            </div>
          )}

          {/* ТИП: MATRIX (Таблица вопросов) */}
          {currentQuestion.type === "matrix" && (
            <div className="space-y-8">
              {currentQuestion.rows.map((row) => {
                const isRowAnswered = !!formData[row.vortex_code];
                return (
                  <div key={row.vortex_code} className={`p-4 rounded-2xl border transition-colors ${isRowAnswered ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/5 bg-white/5'}`}>
                    <div className="text-white font-bold mb-4 text-lg border-b border-white/10 pb-2">
                      {row.text}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentQuestion.columns.map((col) => {
                        const isSelected = formData[row.vortex_code] === col.code;
                        return (
                          <button
                            key={`${row.vortex_code}_${col.code}`}
                            onClick={() => handleMatrixSelect(row.vortex_code, col.code)}
                            className={`p-3 rounded-xl text-sm font-medium transition-all text-left flex items-center gap-3 ${
                              isSelected 
                              ? "bg-blue-600 text-white shadow-md" 
                              : "bg-black/20 text-slate-400 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "border-white bg-white" : "border-slate-500"}`}>
                                {isSelected && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                            </div>
                            {col.text}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ТИП: TEXTAREA (Текстовый ответ) */}
          {currentQuestion.type === "textarea" && (
            <div className="space-y-2">
              <textarea 
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[160px] text-lg placeholder-slate-600 resize-none"
                placeholder="Напишите подробный комментарий респондента здесь..."
                value={formData[currentQuestion.vortex_code] || ''}
                onChange={(e) => handleTextChange(currentQuestion.vortex_code, e.target.value)}
              />
              <p className="text-xs text-slate-500 pl-2">Нажмите Enter для переноса строки. Поле не обязательно.</p>
            </div>
          )}

        </div>

        {/* Кнопка действия (Далее / Завершить) */}
        <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
          <button 
            onClick={handleNext}
            disabled={!isStepValid() || isSubmitting}
            className={`
              relative flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg tracking-wide transition-all duration-300
              ${!isStepValid() 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50" 
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/40 hover:scale-[1.02] active:scale-95"
              }
            `}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                <span>{step === schema.length - 1 ? "ЗАВЕРШИТЬ ОПРОС" : "СЛЕДУЮЩИЙ ВОПРОС"}</span>
                {step < schema.length - 1 && <ChevronRight size={20} strokeWidth={3} />}
              </>
            )}
          </button>
        </div>

      </div>
      
      {/* Футер с копирайтом */}
      <div className="mt-12 text-center text-slate-600 text-xs font-mono uppercase tracking-widest">
        Vortex Secure System • v2.0.4 • 2026
      </div>
      
    </div>
  );
}
