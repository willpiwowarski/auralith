"use client";

import { useState } from "react";
import { ColumnSummary, Row } from "@/types/dataset";
import KpiCards from "@/components/KpiCards";
import DatasetTabs from "@/components/DatasetTabs";
import ColumnSummaryTable from "@/components/ColumnSummaryTable";
import ChartControls from "@/components/ChartControls";
import ChartSection from "@/components/ChartSection";
import RawDataTable from "@/components/RawDataTable";
import InsightsPanel from "@/components/InsightsPanel";
import NaturalLanguageChartBox from "@/components/NaturalLanguageChartBox";
import { generateInsights } from "@/lib/generateInsights";
import { parseChartCommand } from "@/lib/parseChartCommand";
import { generateChartWithAI } from "@/lib/api";
import AskAIPanel from "@/components/AskAIPanel";

type DatasetWorkspaceProps = {
  rows: Row[];
  columns: ColumnSummary[];
};

export default function DatasetWorkspace({
  rows,
  columns,
}: DatasetWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("Analytics");

  const firstTextColumn = columns.find((col) => col.type === "text");
  const firstNumberColumn = columns.find((col) => col.type === "number");

  const [chartType, setChartType] = useState("bar");
  const [xAxis, setXAxis] = useState(firstTextColumn?.name ?? "");
  const [yAxis, setYAxis] = useState(firstNumberColumn?.name ?? "");
  const [commandMessage, setCommandMessage] = useState("");

  const numericColumns = columns.filter((col) => col.type === "number").length;

  const missingValues = columns.reduce((sum, col) => sum + col.missing, 0);

  const insights = generateInsights(rows, columns);

  async function handleNaturalLanguageCommand(command: string) {
    try {
      setCommandMessage("Thinking with Gemini...");

      const aiResponse = await generateChartWithAI({
        command,
        columns,
      });

      if (!aiResponse.success) {
        throw new Error("Gemini unavailable");
      }

      const result = aiResponse.result;

      if (result.chartType) setChartType(result.chartType);
      if (result.xAxis) setXAxis(result.xAxis);
      if (result.yAxis) setYAxis(result.yAxis);

      setCommandMessage("Chart updated using Gemini AI.");
    } catch (error) {
      console.error("AI chart generation failed:", error);

      const fallback = parseChartCommand(command, columns);

      if (fallback.chartType) setChartType(fallback.chartType);
      if (fallback.xAxis) setXAxis(fallback.xAxis);
      if (fallback.yAxis) setYAxis(fallback.yAxis);

      setCommandMessage(
        "Gemini failed, so Auralith used the local rule parser instead."
      );
    }
  }

  if (rows.length === 0 || columns.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8">
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
        <div className="space-y-8">
          <AskAIPanel rows={rows} columns={columns} />
          <InsightsPanel insights={insights} />
        </div>
      )}
    </section>
  );
}