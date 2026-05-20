import { ColumnSummary, Row } from "@/types/dataset";

export function generateInsights(rows: Row[], columns: ColumnSummary[]) {
  const insights: string[] = [];

  const missingValues = columns.reduce((sum, col) => sum + col.missing, 0);

  if (missingValues === 0) {
    insights.push("No missing values were detected across the dataset.");
  } else {
    insights.push(`${missingValues} missing values were detected.`);
  }

  const numericColumns = columns.filter((col) => col.type === "number");

  numericColumns.forEach((col) => {
    insights.push(
      `${col.name} ranges from ${col.min?.toFixed(2)} to ${col.max?.toFixed(
        2
      )}, with an average of ${col.average?.toFixed(2)}.`
    );
  });

  const textColumn = columns.find((col) => col.type === "text");
  const numberColumn = columns.find((col) => col.type === "number");

  if (textColumn && numberColumn) {
    const grouped = rows.reduce<Record<string, number>>((acc, row) => {
      const key = row[textColumn.name];
      const value = Number(row[numberColumn.name]);

      if (!key || Number.isNaN(value)) return acc;

      acc[key] = (acc[key] || 0) + value;
      return acc;
    }, {});

    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    if (highest) {
      insights.push(
        `${highest[0]} has the highest total ${numberColumn.name} at ${highest[1].toFixed(
          2
        )}.`
      );
    }

    if (lowest && lowest !== highest) {
      insights.push(
        `${lowest[0]} has the lowest total ${numberColumn.name} at ${lowest[1].toFixed(
          2
        )}.`
      );
    }
  }

  return insights;
}