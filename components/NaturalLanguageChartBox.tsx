"use client";

import { useState } from "react";

type Props = {
  onSubmitCommand: (command: string) => void;
  message: string;
};

export default function NaturalLanguageChartBox({
  onSubmitCommand,
  message,
}: Props) {
  const [command, setCommand] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!command.trim()) return;

    onSubmitCommand(command);
    setCommand("");
  }

  return (
    <section className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
      <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
        Natural Language Analytics
      </h2>

      <p className="text-cyan-300/70 mb-5">
        Ask Auralith to update your chart.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Example: show profit by month as a line chart"
          className="flex-1 bg-slate-950 border border-cyan-500/20 rounded-xl p-3 text-cyan-50 focus:outline-none focus:border-cyan-400"
        />

        <button className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition shadow-[0_0_25px_rgba(34,211,238,0.2)]">
          Apply
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-cyan-300/80">{message}</p>}
    </section>
  );
}