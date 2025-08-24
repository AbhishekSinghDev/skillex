import { CourseCreationSchema } from "@/lib/zod-schema";
import { db } from "@/server/db";
import { course } from "@/server/db/schema";
import { requireAdmin } from "@/server/helper";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();

    const body = await req.json();
    const validation = CourseCreationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid course data", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    await db.insert(course).values({
      title: data.title,
      slug: data.slug,
      description: data.description,
      smallDescription: data.smallDescription,
      category: data.category,
      fileKey: data.fileKey,
      price: String(data.price),
      duration: String(data.duration),
      level: data.level,
      userId: session?.user.id as string,
    });

    return NextResponse.json(
      { message: "Course created successfully", status: "success" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { message: "Failed to create course", status: "error" },
      { status: 500 }
    );
  }
}
