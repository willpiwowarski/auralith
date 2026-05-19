"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import { getDataset } from "@/lib/api";
import { detectColumns } from "@/lib/detectColumns";
import { ColumnSummary, Row } from "@/types/dataset";
import StatsCards from "@/components/StatsCards";
import ColumnSummaryTable from "@/components/ColumnSummaryTable";
import ChartControls from "@/components/ChartControls";
import ChartSection from "@/components/ChartSection";
import Link from "next/link";
import AuthHeader from "@/components/AuthHeader";

type DatasetDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function DatasetDetailPage({
  params,
}: DatasetDetailPageProps) {
  const [datasetId, setDatasetId] = useState("");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<ColumnSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [chartType, setChartType] = useState("bar");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");

  useEffect(() => {
    async function loadDataset() {
      try {
        const resolvedParams = await params;
        const response = await getDataset(resolvedParams.id);

        setDatasetId(response.dataset.datasetId);
        setFileName(response.dataset.fileName);

        const parsed = Papa.parse<Row>(response.dataset.csvText, {
          header: true,
          skipEmptyLines: true,
        });

        const parsedRows = parsed.data;
        const detectedColumns = detectColumns(parsedRows);

        setRows(parsedRows);
        setColumns(detectedColumns);

        const firstTextColumn = detectedColumns.find(
          (col) => col.type === "text"
        );
        const firstNumberColumn = detectedColumns.find(
          (col) => col.type === "number"
        );

        setXAxis(firstTextColumn?.name ?? "");
        setYAxis(firstNumberColumn?.name ?? "");
      } catch (error) {
        console.error("Failed to load dataset:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDataset();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <p>Loading dataset...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <AuthHeader />

        <section>
          <Link href="/" className="text-sm text-slate-400 hover:text-white">
            ← Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold">{fileName}</h1>

          <div className="text-slate-400 mt-2 space-y-1">
            <p>
              Dataset ID: <span className="text-white">{datasetId}</span>
            </p>
            <p>
              Rows Loaded: <span className="text-white">{rows.length}</span>
            </p>
          </div>
        </section>

        {rows.length > 0 && (
          <>
            <StatsCards rows={rows} columns={columns} />

            <ColumnSummaryTable columns={columns} />

            <ChartControls
              columns={columns}
              chartType={chartType}
              setChartType={setChartType}
              xAxis={xAxis}
              setXAxis={setXAxis}
              yAxis={yAxis}
              setYAxis={setYAxis}
            />

            <ChartSection
              rows={rows}
              columns={columns}
              chartType={chartType}
              xAxis={xAxis}
              yAxis={yAxis}
            />
          </>
        )}
      </div>
    </main>
  );
}