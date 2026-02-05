"use client";
import { useState } from "react";
import { Plus, Trash2, Save, GripVertical, Type, CheckCircle, List, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FormBuilder() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    questions: []
  });

  const addQuestion = (type) => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          id: crypto.randomUUID(), // временный ID для UI
          text: "",
          type,
          options: type === "text" ? [] : ["Вариант 1"],
          required: false,
        },
      ],
    });
  };

  const updateQuestion = (idx, field, value) => {
    const newQuestions = [...form.questions];
    newQuestions[idx][field] = value;
    setForm({ ...form, questions: newQuestions });
  };

  const updateOption = (qIdx, optIdx, value) => {
    const newQuestions = [...form.questions];
    newQuestions[qIdx].options[optIdx] = value;
    setForm({ ...form, questions: newQuestions });
  };

  const addOption = (qIdx) => {
    const newQuestions = [...form.questions];
    newQuestions[qIdx].options.push(`Вариант ${newQuestions[qIdx].options.length + 1}`);
    setForm({ ...form, questions: newQuestions });
  };

  const removeQuestion = (idx) => {
    const newQuestions = form.questions.filter((_, i) => i !== idx);
    setForm({ ...form, questions: newQuestions });
  };

  const handleSave = async () => {
    if (!form.title) return alert("Введите название опроса");
    setLoading(true);

    try {
      const res = await fetch("/api/forms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        router.push("/"); // Возврат на главную
      } else {
        alert("Ошибка при сохранении");
      }
    } catch (e) {
      console.error(e);
      alert("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Хедер */}
      <div className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="font-bold text-sm">НАЗАД</span>
          </Link>
          <div className="flex items-center gap-4">
             <span className="text-slate-500 text-xs font-bold uppercase tracking-widest hidden sm:block">
               Конструктор Vortex
             </span>
             <button
              onClick={handleSave}
              disabled={loading}
              className="premium-button bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm shadow-lg shadow-blue-900/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              <span className="ml-2">ОПУБЛИКОВАТЬ</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-6 animate-fade-in">
        {/* Карточка заголовка */}
        <div className="glass-card p-8 rounded-[2rem] border-t-4 border-blue-500">
          <input
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="w-full bg-transparent text-4xl font-black text-white outline-none placeholder-slate-700 mb-4"
            placeholder="Название опроса"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            className="w-full bg-transparent text-lg text-slate-400 outline-none resize-none placeholder-slate-700"
            placeholder="Описание опроса (необязательно)"
            rows={2}
          />
        </div>

        {/* Список вопросов */}
        <div className="space-y-4">
          {form.questions.map((q, idx) => (
            <div key={q.id} className="glass-card p-6 rounded-3xl relative group transition-all hover:border-white/10">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-800 rounded-l-3xl group-hover:bg-blue-500/50 transition-colors" />
              
              <div className="flex gap-4">
                <div className="pt-4 text-slate-600 cursor-grab active:cursor-grabbing">
                  <GripVertical size={20} />
                </div>
                
                <div className="flex-grow space-y-4">
                  <div className="flex gap-4">
                    <input
                      value={q.text}
                      onChange={(e) => updateQuestion(idx, "text", e.target.value)}
                      className="flex-grow bg-slate-900/50 rounded-xl px-4 py-3 text-lg font-medium text-white outline-none focus:ring-1 ring-blue-500 transition-all placeholder-slate-600"
                      placeholder="Текст вопроса"
                      autoFocus
                    />
                     <button 
                      onClick={() => removeQuestion(idx)}
                      className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Опции для Radio/Checkbox */}
                  {(q.type === "radio" || q.type === "checkbox") && (
                    <div className="pl-1 space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-3 group/opt">
                          <div className={`w-4 h-4 border-2 border-slate-700 ${q.type === 'radio' ? 'rounded-full' : 'rounded-md'}`} />
                          <input
                            value={opt}
                            onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                            className="bg-transparent border-b border-transparent hover:border-white/10 focus:border-blue-500 text-slate-300 text-sm py-1 w-full outline-none transition-colors"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(idx)}
                        className="text-xs font-bold text-blue-500 hover:text-blue-400 mt-2 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-500/10 w-fit transition-colors"
                      >
                        <Plus size={14} /> ДОБАВИТЬ ВАРИАНТ
                      </button>
                    </div>
                  )}
                  
                  <div className="pt-2 flex items-center gap-2">
                     <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase cursor-pointer select-none">
                       <input 
                        type="checkbox" 
                        checked={q.required}
                        onChange={(e) => updateQuestion(idx, "required", e.target.checked)}
                        className="accent-blue-500 w-4 h-4" 
                       />
                       Обязательный вопрос
                     </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Плейсхолдер если пусто */}
        {form.questions.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-slate-600 font-medium">Добавьте первый вопрос, используя панель внизу</p>
          </div>
        )}
      </div>

      {/* Плавающая панель инструментов */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-card p-2 rounded-full flex gap-1 shadow-2xl border-white/10 z-50">
        <ToolButton icon={Type} label="Текст" onClick={() => addQuestion("text")} />
        <ToolButton icon={CheckCircle} label="Один" onClick={() => addQuestion("radio")} />
        <ToolButton icon={List} label="Множ." onClick={() => addQuestion("checkbox")} />
      </div>
    </div>
  );
}

function ToolButton({ icon: Icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center w-16 h-16 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-95 group"
    >
      <Icon size={24} className="mb-1 group-hover:-translate-y-0.5 transition-transform" />
      <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}
