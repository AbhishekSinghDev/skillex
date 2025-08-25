import { db } from "@/server/db";
import { course } from "@/server/db/schema";
import { requireAdmin } from "@/server/helper";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await requireAdmin();

    const courses = await db
      .select({
        id: course.id,
        title: course.title,
        smallDescription: course.smallDescription,
        duration: course.duration,
        level: course.level,
        status: course.status,
        price: course.price,
        fileKey: course.fileKey,
        slug: course.slug,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      })
      .from(course)
      .where(eq(course.userId, session.user.id))
      .orderBy(desc(course.createdAt));

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { message: "Failed to fetch courses", status: "error" },
      { status: 500 }
    );
  }
}
