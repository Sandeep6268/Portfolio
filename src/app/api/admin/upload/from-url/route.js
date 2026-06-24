import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { uploadMedia } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Fetch a remote image/video URL into Cloudinary (optimized to WebP / auto).
 * Body: { url, type? }  ->  { url, publicId, type }
 * Cloudinary's uploader accepts a remote URL directly and stores an optimized copy.
 */
export async function POST(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url, type } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      return NextResponse.json({ error: "Enter a valid http(s) URL." }, { status: 400 });
    }

    // crude type hint from extension; default to auto so Cloudinary decides
    const looksVideo = /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(trimmed) || type === "video";
    const result = await uploadMedia(trimmed, {
      resourceType: looksVideo ? "video" : "auto",
    });

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      type: result.type,
    });
  } catch (e) {
    console.error("[api/admin/upload/from-url]", e);
    return NextResponse.json(
      { error: "Could not fetch that URL: " + (e?.message || "unknown error") },
      { status: 500 }
    );
  }
}
