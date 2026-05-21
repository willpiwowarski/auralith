"use client";

import { useState } from "react";

type Props = {
  rows: any[];
  columns: any[];
};

export default function AskAIPanel({ rows, columns }: Props) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAskAI(event: React.FormEvent) {
    event.preventDefault();

    if (!question.trim()) return;

    try {
      setLoading(true);
      setResponse("");

      const result = await fetch("/api/ai/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          rows: rows.slice(0, 50),
          columns,
        }),
      });

      const data = await result.json();

      setResponse(data.answer);
    } catch (error) {
      console.error(error);
      setResponse("AI request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
        Ask Auralith AI
      </h2>

      <p className="text-cyan-300/70 mt-2">
        Ask questions about your dataset using Gemini AI.
      </p>

      <form onSubmit={handleAskAI} className="mt-6 flex gap-3">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What trends do you notice?"
          className="flex-1 bg-slate-950 border border-cyan-500/20 rounded-xl p-3 text-cyan-50 focus:outline-none focus:border-cyan-400"
        />

        <button
          className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 px-6 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Ask AI
        </button>
      </form>

      {loading && (
        <p className="mt-5 text-cyan-300/70">
          Auralith is analyzing your dataset...
        </p>
      )}

      {response && (
        <div className="mt-6 bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
          <p className="text-cyan-50/95 whitespace-pre-wrap leading-8 tracking-wide text-[15px]">
            {response}
          </p>
        </div>
      )}
    </section>
  );
}