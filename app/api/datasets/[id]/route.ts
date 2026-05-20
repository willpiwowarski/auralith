import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

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

    if (!dataset || !dataset.s3Key) {
      return NextResponse.json(
        { success: false, message: "Dataset not found" },
        { status: 404 }
      );
    }

    console.log("Reading dataset from S3:", dataset.s3Key);
    
    const s3Response = await s3.send(
        new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: dataset.s3Key,
        })
    );

    const csvText = await s3Response.Body?.transformToString();

    if (!csvText) {
        return NextResponse.json(
            { success: false, message: "Dataset file is empty" },
            { status: 500 }
        );
    }

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