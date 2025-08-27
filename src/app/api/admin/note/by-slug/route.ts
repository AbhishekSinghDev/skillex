import { db } from "@/server/db";
import { note } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return new Response("Slug is required", { status: 400 });
  }

  const noteData = await db.query.note.findFirst({
    where: eq(note.slug, slug),
    with: {
      attachments: {
        columns: {
          id: true,
          fileName: true,
          fileSize: true,
          fileKey: true,
        },
      },
    },
  });

  if (!noteData) {
    return NextResponse.json({ message: "Note not found" }, { status: 404 });
  }

  return NextResponse.json({ note: noteData }, { status: 200 });
}
