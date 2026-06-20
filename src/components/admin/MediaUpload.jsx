"use client";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { api } from "./api";

/**
 * Upload an image OR video. Uploaded media is optimized server-side
 * (images delivered as WebP, videos with auto quality/codec).
 * value = { type, url, publicId, alt?, title? }; onChange receives the new media object.
 * Pass seo={false} to hide the optional alt/title inputs.
 */
export default function MediaUpload({ label = "Media", value = {}, onChange, accept = "image/*,video/*", seo = true }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const v = value || {};

  const pick = () => inputRef.current?.click();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    setUploading(true);
    try {
      const res = await api.upload(file);
      // keep any existing alt/title when replacing
      onChange?.({ type: res.type, url: res.url, publicId: res.publicId, alt: v.alt || "", title: v.title || "" });
      toast.success(`${res.type === "video" ? "Video" : "Image"} uploaded & optimized`);
    } catch (ex) {
      setErr(ex.message);
      toast.error(ex.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const clear = async () => {
    // best-effort remote delete
    if (v.publicId) {
      try {
        await api.del(`/api/admin/upload?publicId=${encodeURIComponent(v.publicId)}&type=${v.type || "image"}`);
      } catch {}
    }
    onChange?.({ type: "", url: "", publicId: "", alt: "", title: "" });
  };

  return (
    <div className="a-field">
      {label && <label>{label}</label>}
      <div className="media-upload">
        {v.url ? (
          v.type === "video" ? (
            <video className="preview" src={v.url} muted loop autoPlay playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="preview" src={v.url} alt="preview" />
          )
        ) : (
          <div className="preview-empty">No media</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button type="button" className="a-btn small" onClick={pick} disabled={uploading}>
            {uploading ? "Uploading…" : v.url ? "Replace" : "Upload image / video"}
          </button>
          {v.url && (
            <button type="button" className="a-btn small danger" onClick={clear} disabled={uploading}>
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onFile}
          style={{ display: "none" }}
        />
      </div>

      {seo && v.url && (
        <div className="media-seo-inline">
          <input
            className="a-input"
            value={v.alt || ""}
            placeholder="Alt text (SEO / accessibility — optional)"
            onChange={(e) => onChange?.({ ...v, alt: e.target.value })}
          />
          <input
            className="a-input"
            value={v.title || ""}
            placeholder="Title / tooltip (optional)"
            onChange={(e) => onChange?.({ ...v, title: e.target.value })}
          />
        </div>
      )}

      {err && <div className="hint" style={{ color: "var(--a-danger)" }}>{err}</div>}
      <div className="hint">Images auto-convert to WebP; videos optimized for fast load.</div>
    </div>
  );
}
