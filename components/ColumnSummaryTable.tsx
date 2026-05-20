import { ColumnSummary } from "@/types/dataset";
import MotionCard from "@/components/MotionCard";

type ColumnSummaryTableProps = {
  columns: ColumnSummary[];
};

export default function ColumnSummaryTable({
  columns,
}: ColumnSummaryTableProps) {
  return (
    <MotionCard
    delay={0.1}
    className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">Column Summary</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-400 border-b border-slate-800">
            <tr>
              <th className="text-left py-2">Column</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Missing</th>
              <th className="text-left py-2">Unique</th>
              <th className="text-left py-2">Min</th>
              <th className="text-left py-2">Max</th>
              <th className="text-left py-2">Average</th>
            </tr>
          </thead>

          <tbody>
            {columns.map((col) => (
              <tr key={col.name} className="border-b border-slate-800">
                <td className="py-2">{col.name}</td>
                <td className="py-2">{col.type}</td>
                <td className="py-2">{col.missing}</td>
                <td className="py-2">{col.unique}</td>
                <td className="py-2">{col.min?.toFixed(2) ?? "-"}</td>
                <td className="py-2">{col.max?.toFixed(2) ?? "-"}</td>
                <td className="py-2">{col.average?.toFixed(2) ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MotionCard>
  );
}