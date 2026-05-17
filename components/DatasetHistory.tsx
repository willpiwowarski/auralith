import { DatasetRecord } from "@/types/dataset";

type DatasetHistoryProps = {
  datasets: DatasetRecord[];
};

export default function DatasetHistory({
  datasets,
}: DatasetHistoryProps) {
  if (datasets.length === 0) return null;

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4">Recent Datasets</h2>

      <div className="space-y-4">
        {datasets.map((dataset) => (
          <div
            key={dataset.datasetId}
            className="border border-slate-800 rounded-lg p-4"
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
          </div>
        ))}
      </div>
    </section>
  );
}