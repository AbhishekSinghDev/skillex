import { env } from "@/env";
import { db } from "@/server/db";
import { noteAttachments } from "@/server/db/schema";
import { requireAdmin } from "@/server/helper";
import { s3 } from "@/server/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const DeleteAttachmentSchema = z.object({
  attachmentId: z.string().min(1, "Attachment ID is required"),
});

export async function DELETE(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const validation = DeleteAttachmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid attachment ID", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const { attachmentId } = validation.data;

    // Get the attachment details first
    const attachment = await db.query.noteAttachments.findFirst({
      where: eq(noteAttachments.id, attachmentId),
    });

    if (!attachment) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 }
      );
    }

    // Delete from S3 bucket
    try {
      const command = new DeleteObjectCommand({
        Bucket: env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: attachment.fileKey,
      });

      const res = await s3.send(command);

      if (res.$metadata.httpStatusCode !== 204) {
        console.warn("Failed to delete file from S3");
        return NextResponse.json(
          { error: "Failed to delete attachment from S3" },
          { status: 500 }
        );
      }
    } catch (s3Error) {
      console.warn("S3 deletion failed:", s3Error);
      return NextResponse.json(
        { error: "Failed to delete attachment from S3" },
        { status: 500 }
      );
    }

    // Delete from database
    await db
      .delete(noteAttachments)
      .where(eq(noteAttachments.id, attachmentId));

    return NextResponse.json(
      { message: "Attachment deleted successfully", status: "success" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return NextResponse.json(
      { message: "Failed to delete attachment", status: "error" },
      { status: 500 }
    );
  }
}
