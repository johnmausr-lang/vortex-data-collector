"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Send, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";

export default function PublicSurvey() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/forms/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Опрос не найден");
        return res.json();
      })
      .then(data => {
        setForm(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleInput = (qId, val, type) => {
    if (type === 'checkbox') {
      const current = answers[qId] ? JSON.parse(answers[qId]) : [];
      const updated = current.includes(val) 
        ? current.filter(item => item !== val)
        : [...current, val];
      setAnswers({ ...answers, [qId]: JSON.stringify(updated) });
    } else {
      setAnswers({ ...answers, [qId]: val });
    }
  };

  const handleSubmit = async () => {
    // Простая валидация
    const missing = form.questions.filter(q => q.required && !answers[q.id]);
    if (missing.length > 0) return alert("Пожалуйста, ответьте на обязательные вопросы (*)");

    setSubmitting(true);
    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: id, answers }),
      });
      if (res.ok) setSubmitted(true);
      else alert("Ошибка отправки");
    } catch (e) {
      alert("Ошибка сети");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">
      {error}
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div className="glass-card p-12 rounded-[3rem] text-center max-w-lg w-full border border-green-500/20 shadow-[0_0_100px_rgba(16,185,129,0.1)]">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/30">
            <CheckCircle2 className="text-white" size={48} strokeWidth={3} />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Спасибо!</h2>
          <p className="text-slate-400 text-lg">Ваши ответы успешно сохранены в защищенной базе данных Vortex.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-500/20">
          <ShieldCheck size={14} /> Vortex Secure Form
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">{form.title}</h1>
        {form.description && <p className="text-slate-400 text-lg max-w-xl mx-auto">{form.description}</p>}
      </div>

      <div className="space-y-8">
        {form.questions.map((q) => (
          <div key={q.id} className="glass-card p-8 rounded-[2rem] border-white/5">
            <h3 className="text-xl font-bold text-slate-100 mb-6 flex gap-2">
              {q.text}
              {q.required && <span className="text-red-500">*</span>}
            </h3>
            
            {q.type === "text" && (
              <input
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-700"
                placeholder="Введите ваш ответ..."
                onChange={(e) => handleInput(q.id, e.target.value, 'text')}
              />
            )}

            {(q.type === "radio" || q.type === "checkbox") && (
              <div className="space-y-3">
                {q.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/10 cursor-pointer transition-all group">
                    <div className={`w-6 h-6 flex items-center justify-center border-2 border-slate-600 group-hover:border-blue-500 ${q.type === 'radio' ? 'rounded-full' : 'rounded-lg'} transition-colors`}>
                       {q.type === 'radio' && answers[q.id] === opt && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                       {q.type === 'checkbox' && answers[q.id]?.includes(opt) && <div className="w-3 h-3 bg-blue-500 rounded-sm" />}
                    </div>
                    <input
                      type={q.type}
                      name={`q-${q.id}`}
                      className="hidden"
                      onChange={() => handleInput(q.id, opt, q.type)}
                    />
                    <span className="text-slate-300 font-medium group-hover:text-white">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="premium-button w-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20 py-6 text-xl"
        >
          {submitting ? <Loader2 className="animate-spin" /> : <Send size={24} />}
          <span className="ml-3">ОТПРАВИТЬ ОТВЕТЫ</span>
        </button>
      </div>
    </div>
  );
}
