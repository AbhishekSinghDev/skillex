import { NoteCreationSchema } from "@/lib/zod-schema";
import { db } from "@/server/db";
import { note, noteAttachments } from "@/server/db/schema";
import { requireAdmin } from "@/server/helper";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();

    const body = await req.json();
    const validation = NoteCreationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid note data", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Insert the note
    const [createdNote] = await db
      .insert(note)
      .values({
        title: data.title,
        content: data.content,
        slug: data.slug,
        isPublished: data.isPublished,
        createdBy: session.user.id,
      })
      .returning();

    // Insert attachments if any
    if (data.attachments && data.attachments.length > 0) {
      await db.insert(noteAttachments).values(
        data.attachments.map((attachment) => ({
          noteId: createdNote.id,
          fileName: attachment.fileName,
          fileKey: attachment.fileKey,
          fileSize: String(attachment.fileSize),
        }))
      );
    }

    return NextResponse.json(
      { message: "Note created successfully", status: "success" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { message: "Failed to create note", status: "error" },
      { status: 500 }
    );
  }
}
