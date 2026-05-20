"use client";

import Papa from "papaparse";
import { useEffect, useState } from "react";
import ChartControls from "@/components/ChartControls";
import ChartSection from "@/components/ChartSection";
import ColumnSummaryTable from "@/components/ColumnSummaryTable";
import StatsCards from "@/components/StatsCards";
import { detectColumns } from "@/lib/detectColumns";
import { ColumnSummary, DatasetRecord, Row } from "@/types/dataset";
import { getDatasets, uploadDataset } from "@/lib/api";
import DatasetHistory from "@/components/DatasetHistory";
import AppShell from "@/components/AppShell";
import UploadDropzone from "@/components/UploadDropzone";

export default function Home() {
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<ColumnSummary[]>([]);
  const [fileName, setFileName] = useState("");

  const [chartType, setChartType] = useState("bar");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");

  const [datasetId, setDatasetId] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const [datasets, setDatasets] = useState<DatasetRecord[]>([]);

  useEffect(() => {
  async function loadDatasets() {
    try {
      const data = await getDatasets();
      setDatasets(data.datasets);
    } catch (error) {
      console.error("Failed to load datasets:", error);
    }
  }

  loadDatasets();
}, []);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const csvText = await file.text();

    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsedRows = results.data;
        const detectedColumns = detectColumns(parsedRows);

        setRows(parsedRows);
        setColumns(detectedColumns);

        const firstTextColumn = detectedColumns.find((col) => col.type === "text");
        const firstNumberColumn = detectedColumns.find((col) => col.type === "number");

        setXAxis(firstTextColumn?.name ?? "");
        setYAxis(firstNumberColumn?.name ?? "");

        const data = await uploadDataset({
          fileName: file.name,
          rowCount: parsedRows.length,
          columnCount: detectedColumns.length,
          csvText,
        });

        setDatasetId(data.datasetId);
        setUploadStatus(data.message);
        setDatasets((prev) => [
          {
            datasetId: data.datasetId,
            fileName: file.name,
            rowCount: parsedRows.length,
            columnCount: detectedColumns.length,
            uploadedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
    },
    });
  }

  return (
    <AppShell>
        
        <section>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-500 bg-clip-text text-transparent">Auralith</h1>
          <p className="text-cyan-300/70 mt-2">
             Upload datasets, generate analytics, and explore cloud-powered insights.
          </p>
        </section>

        <UploadDropzone onChange={handleFileUpload} />

        {datasetId && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400">Upload Status</p>
            <p className="text-lg font-semibold">{uploadStatus}</p>
            <p className="text-sm text-slate-400 mt-2">
              Dataset ID: <span className="text-white">{datasetId}</span>
            </p>
          </section>
        )}

        <DatasetHistory datasets={datasets} />

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
    </AppShell>
  );
}