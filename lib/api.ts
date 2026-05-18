export type UploadDatasetRequest = {
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
  payload: UploadDatasetRequest
): Promise<UploadDatasetResponse> {
  const response = await fetch("/api/datasets/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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