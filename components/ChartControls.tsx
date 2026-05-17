import { ColumnSummary } from "@/types/dataset";

type ChartControlsProps = {
  columns: ColumnSummary[];
  chartType: string;
  setChartType: (value: string) => void;
  xAxis: string;
  setXAxis: (value: string) => void;
  yAxis: string;
  setYAxis: (value: string) => void;
};

export default function ChartControls({
  columns,
  chartType,
  setChartType,
  xAxis,
  setXAxis,
  yAxis,
  setYAxis,
}: ChartControlsProps) {
  const textColumns = columns.filter((col) => col.type === "text");
  const numberColumns = columns.filter((col) => col.type === "number");

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-6">Chart Builder</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2 text-slate-400">Chart Type</label>

          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-slate-400">X Axis</label>

          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3"
          >
            {textColumns.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-slate-400">Y Axis</label>

          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3"
          >
            {numberColumns.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}