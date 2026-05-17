import { ColumnSummary, Row } from "@/types/dataset";

type StatsCardsProps = {
  rows: Row[];
  columns: ColumnSummary[];
};

export default function StatsCards({ rows, columns }: StatsCardsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p className="text-slate-400">Rows</p>
        <p className="text-3xl font-bold">{rows.length}</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p className="text-slate-400">Columns</p>
        <p className="text-3xl font-bold">{columns.length}</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p className="text-slate-400">Numeric Columns</p>
        <p className="text-3xl font-bold">
          {columns.filter((col) => col.type === "number").length}
        </p>
      </div>
    </section>
  );
}