"use client";
import { useState } from "react";
import { Plus, Trash2, Save, GripVertical, Type, CheckCircle, List } from "lucide-react";

export default function FormBuilder() {
  const [title, setTitle] = useState("Новый опрос");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const addQuestion = (type) => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        text: "",
        type,
        options: type === "radio" || type === "checkbox" ? ["Вариант 1"] : [],
        required: false,
      },
    ]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const addOption = (qId) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, options: [...q.options, `Вариант ${q.options.length + 1}`] } : q
      )
    );
  };

  const saveForm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dynamic/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, questions }),
      });
      if (res.ok) alert("Форма успешно создана!");
    } catch (e) {
      alert("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <header className="flex justify-between items-end">
        <div className="w-full mr-10">
          <label className="text-slate-500 text-xs font-bold uppercase tracking-widest">Название опроса</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-4xl font-black text-white border-b border-white/10 focus:border-blue-500 outline-none py-2 placeholder-slate-700"
            placeholder="Введите название..."
          />
        </div>
        <button
          onClick={saveForm}
          disabled={loading}
          className="premium-button bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
        >
          <Save size={20} /> {loading ? "Сохраняем..." : "Опубликовать"}
        </button>
      </header>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="glass-card p-6 rounded-3xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-start gap-4">
              <div className="mt-4 text-slate-600 cursor-move">
                <GripVertical size={20} />
              </div>
              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <input
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                    className="w-full bg-white/5 rounded-xl px-4 py-3 text-lg font-medium outline-none focus:ring-2 ring-blue-500/50 transition-all"
                    placeholder={`Вопрос #${idx + 1}`}
                  />
                  <button
                    onClick={() => setQuestions(questions.filter((item) => item.id !== q.id))}
                    className="p-3 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors text-slate-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Рендеринг опций для списков */}
                {(q.type === "radio" || q.type === "checkbox") && (
                  <div className="space-y-2 pl-2">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-3">
                        <div className={`w-4 h-4 border-2 border-slate-600 ${q.type === 'radio' ? 'rounded-full' : 'rounded-md'}`} />
                        <input
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...q.options];
                            newOpts[optIdx] = e.target.value;
                            updateQuestion(q.id, "options", newOpts);
                          }}
                          className="bg-transparent border-b border-white/5 text-sm py-1 focus:border-blue-500 outline-none w-full"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => addOption(q.id)}
                      className="text-xs text-blue-400 font-bold hover:text-blue-300 mt-2 flex items-center gap-1"
                    >
                      <Plus size={14} /> ДОБАВИТЬ ВАРИАНТ
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Панель инструментов */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-card p-2 rounded-full flex gap-2 shadow-2xl border-white/10">
        <button onClick={() => addQuestion("text")} className="p-4 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all tooltip" title="Текст">
          <Type size={24} />
        </button>
        <button onClick={() => addQuestion("radio")} className="p-4 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all" title="Один выбор">
          <CheckCircle size={24} />
        </button>
        <button onClick={() => addQuestion("checkbox")} className="p-4 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all" title="Множественный выбор">
          <List size={24} />
        </button>
      </div>
    </div>
  );
}
