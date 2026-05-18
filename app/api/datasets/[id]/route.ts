import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import fs from "fs/promises";

type DatasetRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: DatasetRouteProps) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const dataset = await prisma.dataset.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!dataset || !dataset.filePath) {
      return NextResponse.json(
        { success: false, message: "Dataset not found" },
        { status: 404 }
      );
    }

    const csvText = await fs.readFile(dataset.filePath, "utf-8");

    return NextResponse.json({
      success: true,
      dataset: {
        datasetId: dataset.id,
        fileName: dataset.fileName,
        rowCount: dataset.rowCount,
        columnCount: dataset.columnCount,
        uploadedAt: dataset.uploadedAt,
        csvText,
      },
    });
  } catch (error) {
    console.error("Failed to fetch dataset:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch dataset" },
      { status: 500 }
    );
  }
}