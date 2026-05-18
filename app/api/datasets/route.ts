import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
          datasets: [],
        },
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
        {
          success: false,
          message: "User not found",
          datasets: [],
        },
        { status: 404 }
      );
    }

    const datasets = await prisma.dataset.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      datasets: datasets.map((dataset) => ({
        datasetId: dataset.id,
        fileName: dataset.fileName,
        rowCount: dataset.rowCount,
        columnCount: dataset.columnCount,
        filePath: dataset.filePath,
        uploadedAt: dataset.uploadedAt,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch datasets:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch datasets",
        datasets: [],
      },
      { status: 500 }
    );
  }
}