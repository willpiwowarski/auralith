import Link from "next/link";
import { DatasetRecord } from "@/types/dataset";

type DatasetHistoryProps = {
  datasets: DatasetRecord[];
};

export default function DatasetHistory({
  datasets,
}: DatasetHistoryProps) {
  if (datasets.length === 0) return null;

  return (
    <section className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">Recent Datasets</h2>

      <div className="space-y-4">
        {datasets.map((dataset) => (
          <Link
            key={`${dataset.datasetId}-${dataset.uploadedAt}`}
            href={`/datasets/${dataset.datasetId}`}
            className="block border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)] transition"
          >
            <p className="text-lg font-semibold">{dataset.fileName}</p>

            <div className="text-sm text-slate-400 mt-2 space-y-1">
              <p>Dataset ID: {dataset.datasetId}</p>
              <p>Rows: {dataset.rowCount}</p>
              <p>Columns: {dataset.columnCount}</p>
              <p>
                Uploaded:{" "}
                {new Date(dataset.uploadedAt).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
