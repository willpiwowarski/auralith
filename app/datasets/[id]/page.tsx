"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import LoadingState from "@/components/LoadingState";
import DatasetWorkspace from "@/components/DatasetWorkspace";
import { getDataset } from "@/lib/api";
import { detectColumns } from "@/lib/detectColumns";
import { Row, ColumnSummary } from "@/types/dataset";

type DatasetPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function DatasetDetailPage({ params }: DatasetPageProps) {
  const [datasetId, setDatasetId] = useState("");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<ColumnSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDataset() {
      try {
        const resolvedParams = await params;

        const response = await getDataset(resolvedParams.id);

        const csvText = response.dataset.csvText;

        const fileName = response.dataset.fileName;
        const extension = fileName.split(".").pop()?.toLowerCase();

        let parsedRows: Row[] = [];

        if (extension === "csv") {
          const parseResult = Papa.parse<Row>(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        parsedRows = parseResult.data;
      } else if (extension === "json" || extension === "xlsx") {
        const jsonData = JSON.parse(csvText);
        parsedRows = Array.isArray(jsonData) ? jsonData : [jsonData];
      } else {
        throw new Error("Unsupported file type");
      }

      const detectedColumns = detectColumns(parsedRows);

      setDatasetId(response.dataset.datasetId);
      setFileName(fileName);
      setRows(parsedRows);
      setColumns(detectedColumns);
      setLoading(false);
      } catch (error) {
        console.error("Failed to load dataset:", error);
        setError("Failed to load dataset");
        setLoading(false);
      }
    }

    loadDataset();
  }, [params]);

  if (loading) {
    return (
      <AppShell>
        <LoadingState />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <section className="bg-slate-950/80 border border-red-500/30 rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-red-300">{error}</h1>
          <Link href="/" className="text-cyan-300 inline-block mt-4">
            Back to Dashboard
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section>
        <Link href="/" className="text-sm text-cyan-300/70 hover:text-cyan-200">
          ← Back to Dashboard
        </Link>

        <h1 className="text-5xl font-bold mt-4 bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-500 bg-clip-text text-transparent">
          {fileName}
        </h1>

        <div className="text-cyan-300/70 mt-3 space-y-1">
          <p>
            Dataset ID: <span className="text-cyan-50">{datasetId}</span>
          </p>
          <p>
            Rows Loaded: <span className="text-cyan-50">{rows.length}</span>
          </p>
        </div>
      </section>

      <DatasetWorkspace rows={rows} columns={columns} />
    </AppShell>
  );
}