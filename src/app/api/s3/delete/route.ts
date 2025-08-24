import { env } from "@/env";
import { arc, detectBot, fixedWindow } from "@/server/arcjet";
import { requireAdmin } from "@/server/helper";
import { s3 } from "@/server/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const aj = arc
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 10,
    })
  );

export async function DELETE(req: Request) {
  const session = await requireAdmin();

  try {
    const ajDescision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (ajDescision.isDenied()) {
      return NextResponse.json(
        {
          error: "You are not allowed to delete files",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const key = body.key;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        {
          error: "Invalid Request Body",
        },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);

    return NextResponse.json(
      {
        message: "File deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete file",
      },
      {
        status: 500,
      }
    );
  }
}
