import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const datasets = await prisma.dataset.findMany({
      orderBy: {
        uploadedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      datasets,
    });
  } catch (error) {
    console.error("Failed to fetch datasets:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch datasets",
      },
      {
        status: 500,
      }
    );
  }
}