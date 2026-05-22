import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

type RouteContext = {
  params: Promise<{
    datasetId: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { datasetId } = await params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
      select: { id: true, userId: true },
    });

    if (!dataset) {
      return NextResponse.json(
        { success: false, message: "Dataset not found" },
        { status: 404 }
      );
    }

    if (dataset.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      where: { datasetId },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Failed to load conversation:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load conversation" },
      { status: 500 }
    );
  }
}
