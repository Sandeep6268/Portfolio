import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const FOLDER = "portfolio";

/**
 * Upload a file (Buffer/base64 data URI) to Cloudinary.
 * resourceType: "image" | "video" | "auto"
 * Returns { url, publicId, type } where url is an OPTIMIZED delivery url:
 *   - images delivered as WebP (f_webp) with automatic quality (q_auto)
 *   - videos delivered with q_auto and automatic format/codec
 */
export async function uploadMedia(fileDataUri, { resourceType = "auto", folder = FOLDER } = {}) {
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileDataUri,
      {
        folder,
        resource_type: resourceType,
        // For videos, generate an eager optimized version
        ...(resourceType === "video"
          ? {
              eager: [{ quality: "auto", format: "mp4" }],
              eager_async: false,
            }
          : {}),
      },
      (error, res) => {
        if (error) return reject(error);
        resolve(res);
      }
    );
  });

  const type = result.resource_type === "video" ? "video" : "image";
  const url = buildOptimizedUrl(result.public_id, type);

  return { url, publicId: result.public_id, type, raw: result };
}

/**
 * Build an optimized delivery URL from a public_id.
 * Images -> WebP + q_auto. Videos -> q_auto + f_auto (auto codec).
 */
export function buildOptimizedUrl(publicId, type = "image") {
  if (type === "video") {
    return cloudinary.url(publicId, {
      resource_type: "video",
      quality: "auto",
      fetch_format: "auto",
      secure: true,
    });
  }
  return cloudinary.url(publicId, {
    resource_type: "image",
    fetch_format: "webp", // force WebP for speed/size
    quality: "auto",
    secure: true,
  });
}

export async function deleteMedia(publicId, type = "image") {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: type === "video" ? "video" : "image",
    });
  } catch (e) {
    console.warn("[cloudinary] delete failed", publicId, e?.message);
  }
}

export default cloudinary;
