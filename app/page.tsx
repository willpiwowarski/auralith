"use client";

import Papa from "papaparse";
import { useState } from "react";
import ChartSection from "@/components/ChartSection";
import ColumnSummaryTable from "@/components/ColumnSummaryTable";
import StatsCards from "@/components/StatsCards";
import { detectColumns } from "@/lib/detectColumns";
import { ColumnSummary, Row } from "@/types/dataset";

export default function Home() {
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<ColumnSummary[]>([]);
  const [fileName, setFileName] = useState("");

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedRows = results.data;
        setRows(parsedRows);
        setColumns(detectColumns(parsedRows));
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
            <ChartSection rows={rows} columns={columns} />
          </>
        )}
      </div>
    </main>
  );
}