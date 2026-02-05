"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Send, CheckCircle2 } from "lucide-react";

export default function PublicSurvey() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // В реальности здесь fetch к API
    // fetch(\`/api/dynamic/\${id}\`).then(...)
    // Для демо я сымитирую загрузку:
    setTimeout(() => {
      setForm({
        title: "Опрос о качестве городской среды",
        questions: [
          { id: 1, type: "text", text: "Ваше имя?" },
          { id: 2, type: "radio", text: "Как вам погода?", options: ["Супер", "Норм", "Плохо"] }
        ]
      });
    }, 1000);
  }, [id]);

  const handleSubmit = async () => {
    // POST /api/dynamic/submit
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-10 rounded-3xl text-center max-w-md">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
            <CheckCircle2 className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Спасибо!</h2>
          <p className="text-slate-400">Ваш голос учтен в системе Vortex.</p>
        </div>
      </div>
    );
  }

  if (!form) return <div className="text-center mt-20 text-slate-500">Загрузка формы...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="glass-card p-8 rounded-[2rem] mb-8 border-t-4 border-blue-600">
        <h1 className="text-3xl font-black text-white">{form.title}</h1>
        <p className="text-slate-400 mt-2">Пожалуйста, ответьте на все вопросы.</p>
      </div>

      <div className="space-y-6">
        {form.questions.map((q) => (
          <div key={q.id} className="glass-card p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-200 mb-4">{q.text}</h3>
            
            {q.type === "text" && (
              <input
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none"
                placeholder="Ваш ответ..."
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              />
            )}

            {q.type === "radio" && (
              <div className="space-y-3">
                {q.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      className="w-5 h-5 accent-blue-500"
                      onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                    />
                    <span className="text-slate-300">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="premium-button w-full mt-10 bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/30"
      >
        <Send size={20} /> ОТПРАВИТЬ ОТВЕТЫ
      </button>
    </div>
  );
}
