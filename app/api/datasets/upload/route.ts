import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const uploadsDir = path.join(process.cwd(), "uploads");

    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(
      uploadsDir,
      `${Date.now()}-${body.fileName}`
    );

    await fs.writeFile(filePath, body.csvText);

    const dataset = await prisma.dataset.create({
      data: {
        fileName: body.fileName,
        rowCount: body.rowCount,
        columnCount: body.columnCount,
        filePath,
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