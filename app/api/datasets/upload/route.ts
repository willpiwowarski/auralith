import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const dataset = await prisma.dataset.create({
      data: {
        fileName: body.fileName,
        rowCount: body.rowCount,
        columnCount: body.columnCount,
      },
    });

    return NextResponse.json({
      success: true,
      datasetId: dataset.id,
      message: "Dataset uploaded successfully",
    });
  } catch (error) {
    console.error("Upload failed:", error);

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