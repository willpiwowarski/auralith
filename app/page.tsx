"use client";

import Papa from "papaparse";
import { useEffect, useState } from "react";
import { detectColumns } from "@/lib/detectColumns";
import { ColumnSummary, DatasetRecord, Row } from "@/types/dataset";
import { getDatasets, uploadDataset } from "@/lib/api";
import DatasetHistory from "@/components/DatasetHistory";
import AppShell from "@/components/AppShell";
import UploadDropzone from "@/components/UploadDropzone";
import DatasetWorkspace from "@/components/DatasetWorkspace";

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

  try {
    setFileName(file.name);

    const fileText = await file.text();
    const extension = file.name.split(".").pop()?.toLowerCase();

    let parsedRows: Row[] = [];

    if (extension === "csv") {
      const parseResult = Papa.parse<Row>(fileText, {
        header: true,
        skipEmptyLines: true,
      });

      parsedRows = parseResult.data;
    } else if (extension === "json") {
      const jsonData = JSON.parse(fileText);

      parsedRows = Array.isArray(jsonData) ? jsonData : [jsonData];
    } else {
      throw new Error("Unsupported file type");
    }

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
      csvText: fileText,
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
  } catch (error) {
    console.error("Upload failed:", error);
    setUploadStatus("Upload failed");
  }
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
          <section className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
            <p className="text-cyan-300/70">Upload Status</p>

            <p className="text-lg font-semibold text-cyan-50">
              {uploadStatus}
            </p>

            <p className="text-sm text-cyan-300/70 mt-2">
              Dataset ID: <span className="text-cyan-50">{datasetId}</span>
            </p>

            <a
              href={`/datasets/${datasetId}`}
              className="inline-block mt-4 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 font-semibold px-5 py-2 rounded-xl hover:opacity-90 transition shadow-[0_0_25px_rgba(34,211,238,0.2)]"
            >
              Open Dataset
            </a>
          </section>
        )}

        <DatasetHistory datasets={datasets} />

       {rows.length > 0 && (
          <DatasetWorkspace rows={rows} columns={columns} />
        )}
    </AppShell>
  );
}