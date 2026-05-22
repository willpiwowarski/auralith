import { ColumnSummary } from "@/types/dataset";
import { ChartAggregation } from "@/lib/api";
import MotionCard from "@/components/MotionCard";

type ChartControlsProps = {
  columns: ColumnSummary[];
  chartType: string;
  setChartType: (value: string) => void;
  xAxis: string;
  setXAxis: (value: string) => void;
  yAxis: string;
  setYAxis: (value: string) => void;
  agg: ChartAggregation;
  setAgg: (value: ChartAggregation) => void;
};

export default function ChartControls({
  columns,
  chartType,
  setChartType,
  xAxis,
  setXAxis,
  yAxis,
  setYAxis,
  agg,
  setAgg,
}: ChartControlsProps) {
  const textColumns = columns.filter((col) => col.type === "text");
  const numberColumns = columns.filter((col) => col.type === "number");

  return (
    <MotionCard
      delay={0.15}
      className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">Chart Builder</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block mb-2 text-cyan-300/70">Chart Type</label>

          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl p-3 text-cyan-50 focus:outline-none focus:border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.06)]"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-cyan-300/70">X Axis</label>

          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl p-3 text-cyan-50 focus:outline-none focus:border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.06)]"
          >
            {textColumns.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-cyan-300/70">Y Axis</label>

          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl p-3 text-cyan-50 focus:outline-none focus:border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.06)]"
          >
            {numberColumns.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-cyan-300/70">Aggregation</label>

          <select
            value={agg}
            onChange={(e) => setAgg(e.target.value as ChartAggregation)}
            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl p-3 text-cyan-50 focus:outline-none focus:border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.06)]"
          >
            <option value="sum">Sum</option>
            <option value="avg">Average</option>
            <option value="count">Count</option>
            <option value="min">Min</option>
            <option value="max">Max</option>
          </select>
        </div>
      </div>
    </MotionCard>
  );
}
