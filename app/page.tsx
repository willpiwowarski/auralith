"use client";

import Papa from "papaparse";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Row = Record<string, string>;

type ColumnSummary = {
  name: string;
  type: "number" | "text";
  missing: number;
  unique: number;
  min?: number;
  max?: number;
  average?: number;
};

export default function Home() {
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<ColumnSummary[]>([]);
  const [fileName, setFileName] = useState("");

  function detectColumns(data: Row[]): ColumnSummary[] {
    if (data.length === 0) return [];

    const columnNames = Object.keys(data[0]);

    return columnNames.map((name) => {
      const values = data.map((row) => row[name]);
      const nonEmpty = values.filter((v) => v !== "" && v !== undefined && v !== null);
      const numericValues = nonEmpty
        .map((v) => Number(v))
        .filter((v) => !Number.isNaN(v));

      const isNumber = numericValues.length > 0 && numericValues.length === nonEmpty.length;

      if (isNumber) {
        const sum = numericValues.reduce((acc, val) => acc + val, 0);

        return {
          name,
          type: "number",
          missing: values.length - nonEmpty.length,
          unique: new Set(nonEmpty).size,
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          average: sum / numericValues.length,
        };
      }

      return {
        name,
        type: "text",
        missing: values.length - nonEmpty.length,
        unique: new Set(nonEmpty).size,
      };
    });
  }

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

  const firstTextColumn = columns.find((col) => col.type === "text");
  const firstNumberColumn = columns.find((col) => col.type === "number");

  const chartData =
    firstTextColumn && firstNumberColumn
      ? rows.slice(0, 20).map((row) => ({
          name: row[firstTextColumn.name],
          value: Number(row[firstNumberColumn.name]),
        }))
      : [];

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
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-slate-400">Rows</p>
                <p className="text-3xl font-bold">{rows.length}</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-slate-400">Columns</p>
                <p className="text-3xl font-bold">{columns.length}</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-slate-400">Numeric Columns</p>
                <p className="text-3xl font-bold">
                  {columns.filter((col) => col.type === "number").length}
                </p>
              </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Column Summary</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="text-left py-2">Column</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Missing</th>
                      <th className="text-left py-2">Unique</th>
                      <th className="text-left py-2">Min</th>
                      <th className="text-left py-2">Max</th>
                      <th className="text-left py-2">Average</th>
                    </tr>
                  </thead>

                  <tbody>
                    {columns.map((col) => (
                      <tr key={col.name} className="border-b border-slate-800">
                        <td className="py-2">{col.name}</td>
                        <td className="py-2">{col.type}</td>
                        <td className="py-2">{col.missing}</td>
                        <td className="py-2">{col.unique}</td>
                        <td className="py-2">{col.min?.toFixed(2) ?? "-"}</td>
                        <td className="py-2">{col.max?.toFixed(2) ?? "-"}</td>
                        <td className="py-2">
                          {col.average?.toFixed(2) ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {chartData.length > 0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Starter Chart: {firstNumberColumn?.name} by{" "}
                  {firstTextColumn?.name}
                </h2>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}