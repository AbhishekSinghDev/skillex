import { NoteCreationSchema } from "@/lib/zod-schema";
import { db } from "@/server/db";
import { note, noteAttachments } from "@/server/db/schema";
import { requireAdmin } from "@/server/helper";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const UpdateNoteSchema = NoteCreationSchema.extend({
  id: z.string().min(1, "Note ID is required"),
});

export async function PUT(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const validation = UpdateNoteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid note data", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check if note exists and user has permission
    const existingNote = await db.query.note.findFirst({
      where: eq(note.id, data.id),
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Update the note
    await db
      .update(note)
      .set({
        title: data.title,
        content: data.content,
        slug: data.slug,
        isPublished: data.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(note.id, data.id));

    // Delete existing attachments
    await db.delete(noteAttachments).where(eq(noteAttachments.noteId, data.id));

    // Insert new attachments if any
    if (data.attachments && data.attachments.length > 0) {
      await db.insert(noteAttachments).values(
        data.attachments.map((attachment) => ({
          noteId: data.id,
          fileName: attachment.fileName,
          fileKey: attachment.fileKey,
          fileSize: String(attachment.fileSize),
        }))
      );
    }

    return NextResponse.json(
      { message: "Note updated successfully", status: "success" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { message: "Failed to update note", status: "error" },
      { status: 500 }
    );
  }
}
