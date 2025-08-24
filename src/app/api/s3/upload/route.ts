import { env } from "@/env";
import { FileUploadSchema } from "@/lib/zod-schema";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3 } from "@/server/s3";
import { v4 as v4uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = FileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid Request Body",
        },
        { status: 400 }
      );
    }

    const { fileName, contentType, fileSize, isImage } = validation.data;
    const uniqueKey = `${v4uuid()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      ContentType: contentType,
      Key: uniqueKey,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // url valid for 1 hour

    const response = {
      presignedUrl,
      key: uniqueKey,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Presigned URL generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate presigned URL",
      },
      { status: 500 }
    );
  }
}
