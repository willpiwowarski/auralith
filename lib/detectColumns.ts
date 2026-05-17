import { ColumnSummary, Row } from "@/types/dataset";

export function detectColumns(data: Row[]): ColumnSummary[] {
  if (data.length === 0) return [];

  const columnNames = Object.keys(data[0]);

  return columnNames.map((name) => {
    const values = data.map((row) => row[name]);
    const nonEmpty = values.filter(
      (v) => v !== "" && v !== undefined && v !== null
    );

    const numericValues = nonEmpty
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v));

    const isNumber =
      numericValues.length > 0 && numericValues.length === nonEmpty.length;

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