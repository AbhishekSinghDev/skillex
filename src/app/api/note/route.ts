import { db } from "@/server/db";
import { note } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    const noteData = await db.query.note.findFirst({
      where: eq(note.slug, slug),
      columns: {
        id: true,
        title: true,
        slug: true,
        content: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        attachments: {
          columns: {
            id: true,
            fileKey: true,
          },
        },
      },
    });

    if (!noteData?.isPublished) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ note: noteData }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/note:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
