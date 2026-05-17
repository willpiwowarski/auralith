import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Dataset upload request:", body);

    return NextResponse.json({
      success: true,
      datasetId: crypto.randomUUID(),
      message: "Dataset uploaded successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}