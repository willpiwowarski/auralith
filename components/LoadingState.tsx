"use client";

export default function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-72 rounded-xl bg-slate-800" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((card) => (
          <div
            key={card}
            className="h-36 rounded-2xl bg-slate-900 border border-cyan-500/10"
          />
        ))}
      </div>

      <div className="h-96 rounded-2xl bg-slate-900 border border-cyan-500/10" />
    </div>
  );
}