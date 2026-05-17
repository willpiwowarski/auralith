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