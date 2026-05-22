import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
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
        },
        {
          status: 404,
        }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const projection = formData.get("projection");
    const fileName = formData.get("fileName");
    const rowCountRaw = formData.get("rowCount");
    const columnCountRaw = formData.get("columnCount");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid 'file' field (expected File)",
        },
        { status: 400 }
      );
    }

    if (typeof projection !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid 'projection' field (expected string)",
        },
        { status: 400 }
      );
    }

    if (typeof fileName !== "string" || fileName.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid 'fileName' field (expected string)",
        },
        { status: 400 }
      );
    }

    const rowCount =
      typeof rowCountRaw === "string" ? Number.parseInt(rowCountRaw, 10) : NaN;
    const columnCount =
      typeof columnCountRaw === "string"
        ? Number.parseInt(columnCountRaw, 10)
        : NaN;

    if (Number.isNaN(rowCount)) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid 'rowCount' field (expected integer)",
        },
        { status: 400 }
      );
    }

    if (Number.isNaN(columnCount)) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid 'columnCount' field (expected integer)",
        },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const originalS3Key = `datasets/${user.id}/${timestamp}-original-${fileName}`;
    const s3Key = `datasets/${user.id}/${timestamp}-${fileName}`;
    const originalContentType = file.type || "application/octet-stream";

    const extension = fileName.split(".").pop()?.toLowerCase();
    const projectionContentType =
      extension === "json" ? "application/json" : "text/csv";

    try {
      const originalBytes = Buffer.from(await file.arrayBuffer());

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: originalS3Key,
          Body: originalBytes,
          ContentType: originalContentType,
        })
      );
    } catch (error) {
      console.error("Original S3 upload failed:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to persist original file",
        },
        { status: 500 }
      );
    }

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: s3Key,
          Body: projection,
          ContentType: projectionContentType,
        })
      );
    } catch (error) {
      console.error(
        `Projection S3 upload failed after original was persisted. ` +
          `Orphaned original key: ${originalS3Key} (userId: ${user.id}).`,
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: "Failed to persist projection",
        },
        { status: 500 }
      );
    }

    const dataset = await prisma.dataset.create({
      data: {
        fileName,
        rowCount,
        columnCount,
        s3Key,
        originalS3Key,
        originalContentType,
        userId: user.id,
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
