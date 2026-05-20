import MotionCard from "@/components/MotionCard";

type Props = {
  rows: number;
  columns: number;
  numericColumns: number;
  missingValues: number;
};

export default function KpiCards({
  rows,
  columns,
  numericColumns,
  missingValues,
}: Props) {
  const cards = [
    {
      label: "Rows",
      value: rows,
    },
    {
      label: "Columns",
      value: columns,
    },
    {
      label: "Numeric Columns",
      value: numericColumns,
    },
    {
      label: "Missing Values",
      value: missingValues,
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <MotionCard
          key={card.label}
          delay={cards.indexOf(card) * 0.08}
          className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)] hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.16)] transition"
        >
          <p className="text-sm text-cyan-300/70">{card.label}</p>

          <h2 className="text-4xl font-bold mt-3 bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">{card.value}</h2>
        </MotionCard>
      ))}
    </section>
  );
}