"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import { getDataset } from "@/lib/api";
import { detectColumns } from "@/lib/detectColumns";
import { ColumnSummary, Row } from "@/types/dataset";
import ColumnSummaryTable from "@/components/ColumnSummaryTable";
import ChartControls from "@/components/ChartControls";
import ChartSection from "@/components/ChartSection";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import KpiCards from "@/components/KpiCards";
import DatasetTabs from "@/components/DatasetTabs";
import RawDataTable from "@/components/RawDataTable";
import { generateInsights } from "@/lib/generateInsights";
import InsightsPanel from "@/components/InsightsPanel";
import LoadingState from "@/components/LoadingState";
import NaturalLanguageChartBox from "@/components/NaturalLanguageChartBox";
import { parseChartCommand } from "@/lib/parseChartCommand";

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
  const [activeTab, setActiveTab] = useState("Analytics");

  const [commandMessage, setCommandMessage] = useState("");

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
      <AppShell>
        <LoadingState />
      </AppShell>
    );
  }

  const numericColumns = columns.filter(
  (col) => col.type === "number"
  ).length;

  const missingValues = columns.reduce(
    (sum, col) => sum + col.missing,
    0
  );

  const insights = generateInsights(rows, columns);

  function handleNaturalLanguageCommand(command: string) {
  const result = parseChartCommand(command, columns);

  if (result.chartType) setChartType(result.chartType);
  if (result.xAxis) setXAxis(result.xAxis);
  if (result.yAxis) setYAxis(result.yAxis);

  setCommandMessage(result.message);
}

  return (
    <AppShell>

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

        <KpiCards
          rows={rows.length}
          columns={columns.length}
          numericColumns={numericColumns}
          missingValues={missingValues}
        />

        <DatasetTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "Analytics" && (
          <>

            <ColumnSummaryTable columns={columns} />

            <NaturalLanguageChartBox
              onSubmitCommand={handleNaturalLanguageCommand}
              message={commandMessage}
            />

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

        {activeTab === "Raw Data" && <RawDataTable rows={rows} />}

        {activeTab === "AI Insights" && (
          <InsightsPanel insights={insights} />
        )}

      </AppShell>
  );
}