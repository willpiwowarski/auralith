import MotionCard from "@/components/MotionCard";

type Props = {
  insights: string[];
};

export default function InsightsPanel({ insights }: Props) {
  return (
    <MotionCard
    delay={0.15}
    className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
        AI-Ready Insights
      </h2>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="border border-cyan-500/20 rounded-xl p-4 bg-slate-900/60"
          >
            <p className="text-cyan-50">{insight}</p>
          </div>
        ))}
      </div>
    </MotionCard>
  );
}