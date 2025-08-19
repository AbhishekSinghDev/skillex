import { FileUploadSchema } from "@/lib/zod-schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
}
