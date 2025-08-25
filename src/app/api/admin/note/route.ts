import { db } from "@/server/db";
import { note } from "@/server/db/schema";
import { requireAdmin } from "@/server/helper";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await requireAdmin();

    const notes = await db.query.note.findMany({
      where: eq(note.createdBy, session.user.id),
      with: {
        attachments: {
          columns: {
            id: true,
            fileKey: true,
          },
        },
      },
      orderBy: desc(note.createdAt),
    });

    return NextResponse.json({ notes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { message: "Failed to fetch notes", status: "error" },
      { status: 500 }
    );
  }
}
