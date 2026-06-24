"use client";

async function handle(res) {
  let json = {};
  try {
    json = await res.json();
  } catch {}
  if (!res.ok) {
    throw new Error(json.error || `Request failed (${res.status})`);
  }
  return json;
}

export const api = {
  get: (url) => fetch(url, { cache: "no-store" }).then(handle),
  post: (url, body) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handle),
  put: (url, body) =>
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handle),
  patch: (url, body) =>
    fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handle),
  del: (url) => fetch(url, { method: "DELETE" }).then(handle),

  /** Upload an image/video file -> { url, publicId, type } */
  upload: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch("/api/admin/upload", { method: "POST", body: fd }).then(handle);
  },

  /** Fetch a remote URL into Cloudinary -> { url, publicId, type } */
  uploadUrl: (url) =>
    fetch("/api/admin/upload/from-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }).then(handle),
};
