import { ColumnSummary, Row } from "@/types/dataset";
import { ChartAggregation, ChartFilter } from "@/lib/api";
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
import MotionCard from "@/components/MotionCard";

type ChartSectionProps = {
  rows: Row[];
  columns: ColumnSummary[];
  chartType: string;
  xAxis: string;
  yAxis: string;
  agg?: ChartAggregation;
  filter?: ChartFilter;
};

function aggregateValues(values: number[], agg: ChartAggregation): number {
  if (agg === "count") return values.length;

  if (values.length === 0) return 0;

  if (agg === "sum") return values.reduce((a, b) => a + b, 0);
  if (agg === "avg")
    return values.reduce((a, b) => a + b, 0) / values.length;
  if (agg === "min") return Math.min(...values);
  if (agg === "max") return Math.max(...values);

  return 0;
}

export default function ChartSection({
  rows,
  chartType,
  xAxis,
  yAxis,
  agg,
  filter,
}: ChartSectionProps) {
  const effectiveAgg: ChartAggregation = agg ?? "sum";

  const filteredRows = filter
    ? rows.filter((row) => row[filter.column] === filter.value)
    : rows;

  const grouped = filteredRows.reduce<Record<string, number[]>>((acc, row) => {
    const key = row[xAxis];
    if (!key) return acc;

    if (effectiveAgg === "count") {
      acc[key] = acc[key] || [];
      acc[key].push(1);
      return acc;
    }

    const value = Number(row[yAxis]);
    if (Number.isNaN(value)) return acc;

    acc[key] = acc[key] || [];
    acc[key].push(value);
    return acc;
  }, {});

  const chartData = Object.entries(grouped).map(([name, values]) => ({
    name,
    value: aggregateValues(values, effectiveAgg),
  }));

  if (!xAxis || !yAxis || chartData.length === 0) return null;

  const titleAgg = effectiveAgg.toUpperCase();
  const titleFilter = filter
    ? ` where ${filter.column} = ${filter.value}`
    : "";

  return (
    <MotionCard
    delay={0.15}
    className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
        {chartType.toUpperCase()} Chart: {titleAgg}({yAxis}) by {xAxis}{titleFilter}
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
    </MotionCard>
  );
}
