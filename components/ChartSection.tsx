import { ColumnSummary, Row } from "@/types/dataset";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartSectionProps = {
  rows: Row[];
  columns: ColumnSummary[];
};

export default function ChartSection({ rows, columns }: ChartSectionProps) {
  const firstTextColumn = columns.find((col) => col.type === "text");
  const firstNumberColumn = columns.find((col) => col.type === "number");

  const chartData =
    firstTextColumn && firstNumberColumn
      ? rows.slice(0, 20).map((row) => ({
          name: row[firstTextColumn.name],
          value: Number(row[firstNumberColumn.name]),
        }))
      : [];

  if (chartData.length === 0) return null;

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Starter Chart: {firstNumberColumn?.name} by {firstTextColumn?.name}
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}