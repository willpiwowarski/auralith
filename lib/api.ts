export type UploadDatasetMetadata = {
  fileName: string;
  rowCount: number;
  columnCount: number;
};

export type UploadDatasetResponse = {
  success: boolean;
  datasetId: string;
  message: string;
};

export async function uploadDataset(
  file: File,
  projection: string,
  metadata: UploadDatasetMetadata
): Promise<UploadDatasetResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("projection", projection);
  formData.append("fileName", metadata.fileName);
  formData.append("rowCount", String(metadata.rowCount));
  formData.append("columnCount", String(metadata.columnCount));

  const response = await fetch("/api/datasets/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload dataset");
  }

  return response.json();
}

import { DatasetRecord } from "@/types/dataset";

export type GetDatasetsResponse = {
  success: boolean;
  datasets: DatasetRecord[];
};

export async function getDatasets(): Promise<GetDatasetsResponse> {
  const response = await fetch("/api/datasets");

  if (!response.ok) {
    throw new Error("Failed to fetch datasets");
  }

  return response.json();
}

export type GetDatasetResponse = {
  success: boolean;
  dataset: {
    datasetId: string;
    fileName: string;
    rowCount: number;
    columnCount: number;
    uploadedAt: string;
    csvText: string;
  };
};

export async function getDataset(
  datasetId: string
): Promise<GetDatasetResponse> {
  const response = await fetch(`/api/datasets/${datasetId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch dataset");
  }

  return response.json();
}

import { ColumnSummary } from "@/types/dataset";

export type GenerateChartRequest = {
  command: string;
  columns: ColumnSummary[];
};

export type ChartAggregation = "sum" | "avg" | "count" | "min" | "max";

export type ChartFilter = {
  column: string;
  op: "equals";
  value: string;
};

export type GenerateChartResponse = {
  success: boolean;
  message?: string;
  result: {
    chartType?: "bar" | "line" | "pie";
    xAxis?: string;
    yAxis?: string;
    agg?: ChartAggregation;
    filter?: ChartFilter;
  };
};

export async function generateChartWithAI(
  payload: GenerateChartRequest
): Promise<GenerateChartResponse> {
  const response = await fetch("/api/ai/chart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: typeof data?.message === "string" ? data.message : undefined,
      result: {},
    };
  }

  return data;
}