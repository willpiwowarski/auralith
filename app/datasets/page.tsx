"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { getDatasets } from "@/lib/api";

type Dataset = {
  datasetId: string;
  fileName: string;
  rowCount: number;
  columnCount: number;
  uploadedAt: string;
};

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDatasets() {
      try {
        const data = await getDatasets();
        setDatasets(data.datasets);
      } catch (error) {
        console.error("Failed to load datasets:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDatasets();
  }, []);

  return (
    <AppShell>
      <section>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-500 bg-clip-text text-transparent">
          Your Datasets
        </h1>

        <p className="text-cyan-300/70 mt-2">
          View, reopen, and analyze your uploaded datasets.
        </p>
      </section>

      {loading && <p className="text-cyan-300/70">Loading datasets...</p>}

      {!loading && datasets.length === 0 && (
        <section className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-cyan-50">No datasets yet</h2>
          <p className="text-cyan-300/70 mt-2">
            Upload a CSV from the dashboard to begin analyzing data.
          </p>

          <Link
            href="/"
            className="inline-block mt-5 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 font-semibold px-5 py-2 rounded-xl"
          >
            Go to Dashboard
          </Link>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {datasets.map((dataset) => (
          <Link
            key={dataset.datasetId}
            href={`/datasets/${dataset.datasetId}`}
            className="block bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)] hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(34,211,238,0.15)] transition"
          >
            <h2 className="text-2xl font-bold text-cyan-50">
              {dataset.fileName}
            </h2>

            <div className="text-cyan-300/70 mt-4 space-y-1 text-sm">
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
      </section>
    </AppShell>
  );
}