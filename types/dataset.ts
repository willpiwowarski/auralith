export type Row = Record<string, string>;

export type ColumnSummary = {
  name: string;
  type: "number" | "text";
  missing: number;
  unique: number;
  min?: number;
  max?: number;
  average?: number;
};