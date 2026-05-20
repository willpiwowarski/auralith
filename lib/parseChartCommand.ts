import { ColumnSummary } from "@/types/dataset";

type ParsedCommand = {
  chartType?: string;
  xAxis?: string;
  yAxis?: string;
  message: string;
};

export function parseChartCommand(
  command: string,
  columns: ColumnSummary[]
): ParsedCommand {
  const lower = command.toLowerCase();

  const chartType = lower.includes("pie")
    ? "pie"
    : lower.includes("line")
    ? "line"
    : lower.includes("bar")
    ? "bar"
    : undefined;

  const matchedColumns = columns.filter((col) =>
    lower.includes(col.name.toLowerCase())
  );

  const textColumns = matchedColumns.filter((col) => col.type === "text");
  const numberColumns = matchedColumns.filter((col) => col.type === "number");

  const xAxis = textColumns[0]?.name;
  const yAxis = numberColumns[0]?.name;

  if (!chartType && !xAxis && !yAxis) {
    return {
      message:
        "I could not detect a chart type or matching columns. Try something like: show sales by region as a bar chart.",
    };
  }

  return {
    chartType,
    xAxis,
    yAxis,
    message: "Chart updated from your command.",
  };
}