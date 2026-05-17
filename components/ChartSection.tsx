import { ColumnSummary, Row } from "@/types/dataset";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartSectionProps = {
  rows: Row[];
  columns: ColumnSummary[];
  chartType: string;
  xAxis: string;
  yAxis: string;
};

export default function ChartSection({
  rows,
  chartType,
  xAxis,
  yAxis,
}: ChartSectionProps) {
  const chartData = rows.slice(0, 20).map((row) => ({
    name: row[xAxis],
    value: Number(row[yAxis]),
  }));

  if (!xAxis || !yAxis || chartData.length === 0) return null;

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {chartType.toUpperCase()} Chart: {yAxis} by {xAxis}
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line dataKey="value" />
            </LineChart>
          ) : (
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name">
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}