import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { uploadMedia, deleteMedia } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
// allow larger media uploads
export const maxDuration = 60;

export async function POST(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mime = file.type || "";
    const isVideo = mime.startsWith("video/");
    const isImage = mime.startsWith("image/");
    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: "Only image or video files are allowed." },
        { status: 400 }
      );
    }

    // 50MB cap
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 50MB)." },
        { status: 400 }
      );
    }

    const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;
    const result = await uploadMedia(dataUri, {
      resourceType: isVideo ? "video" : "image",
    });

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      type: result.type,
    });
  } catch (e) {
    console.error("[api/admin/upload]", e);
    return NextResponse.json(
      { error: "Upload failed: " + (e?.message || "unknown error") },
      { status: 500 }
    );
  }
}

// Optional: delete media by publicId
export async function DELETE(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const publicId = searchParams.get("publicId");
  const type = searchParams.get("type") || "image";
  if (publicId) await deleteMedia(publicId, type);
  return NextResponse.json({ ok: true });
}
