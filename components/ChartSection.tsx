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
  const groupedData = rows.reduce<Record<string, number>>((acc, row) => {
    const key = row[xAxis];
    const value = Number(row[yAxis]);

    if (!key || Number.isNaN(value)) return acc;

    acc[key] = (acc[key] || 0) + value;
    return acc;
  }, {});

  const chartData = Object.entries(groupedData).map(([name, value]) => ({
    name,
    value,
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
              <Bar dataKey="value" fill="#60a5fa" />
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line dataKey="value" stroke="#60a5fa" />
            </LineChart>
          ) : (
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" fill="#60a5fa">
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