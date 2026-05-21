"use client";

import MotionCard from "@/components/MotionCard";

type Props = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function UploadDropzone({ onChange }: Props) {
  return (
    <MotionCard
      delay={0.05}
      className="relative overflow-hidden bg-slate-950/80 border border-cyan-500/20 rounded-3xl p-10 shadow-[0_0_40px_rgba(34,211,238,0.08)] hover:border-cyan-400/40 transition"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(34,211,238,0.25)]">
          ↑
        </div>

        <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
          Upload Dataset
        </h2>

        <p className="mt-3 text-cyan-300/70 max-w-lg">
          Upload CSV datasets and generate cloud-powered analytics,
          visualizations, and AI-ready insights instantly.
        </p>

        <label className="mt-8">
          <input
            type="file"
            accept=".csv,.json"
            onChange={onChange}
            className="hidden"
          />

          <span className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 font-semibold px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-[0_0_30px_rgba(34,211,238,0.25)]">
            Select Dataset File
          </span>
        </label>
      </div>
    </MotionCard>
  );
}