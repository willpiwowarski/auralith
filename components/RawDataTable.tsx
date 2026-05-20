import MotionCard from "@/components/MotionCard";

type Props = {
  rows: any[];
};

export default function RawDataTable({ rows }: Props) {
  if (rows.length === 0) {
    return null;
  }

  const columns = Object.keys(rows[0]);

  return (
    <MotionCard
    delay={0.15}
    className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
      <h2 className="text-2xl font-bold mb-6">Raw Dataset</h2>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            {columns.map((column) => (
              <th
                key={column}
                className="text-left py-3 px-4 text-slate-300"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-b border-slate-800 hover:bg-slate-800/40"
            >
              {columns.map((column) => (
                <td key={column} className="py-3 px-4 text-slate-400">
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </MotionCard>
  );
}