"use client";

import Papa from "papaparse";
import { useState } from "react";
import ChartControls from "@/components/ChartControls";
import ChartSection from "@/components/ChartSection";
import ColumnSummaryTable from "@/components/ColumnSummaryTable";
import StatsCards from "@/components/StatsCards";
import { detectColumns } from "@/lib/detectColumns";
import { ColumnSummary, Row } from "@/types/dataset";

export default function Home() {
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<ColumnSummary[]>([]);
  const [fileName, setFileName] = useState("");

  const [chartType, setChartType] = useState("bar");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

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

        const response = await fetch("/api/datasets/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          rowCount: parsedRows.length,
          columnCount: detectedColumns.length,
        }),
      });

      const data = await response.json();
      console.log("Backend response:", data);
    },
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <section>
          <h1 className="text-4xl font-bold">InsightForge</h1>
          <p className="text-slate-400 mt-2">
            Upload a CSV and generate instant analytics.
          </p>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-slate-300"
          />

          {fileName && (
            <p className="mt-4 text-slate-400">
              Uploaded: <span className="text-white">{fileName}</span>
            </p>
          )}
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