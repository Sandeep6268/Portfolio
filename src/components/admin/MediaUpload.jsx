"use client";
import React, { useState } from "react";
import { api } from "./api";
import MediaPickerModal from "./MediaPickerModal";

/**
 * Single media field. Click "Upload / Replace" to open the media picker modal
 * (Upload file / Paste / Drag & drop / From URL). Optimized server-side.
 * value = { type, url, publicId, alt?, title? }. Pass seo={false} to hide alt/title.
 */
export default function MediaUpload({ label = "Media", value = {}, onChange, accept = "image/*,video/*", seo = true }) {
  const [open, setOpen] = useState(false);
  const v = value || {};

  const onPick = (items) => {
    const m = items?.[0];
    if (m) onChange?.({ type: m.type, url: m.url, publicId: m.publicId, alt: v.alt || "", title: v.title || "" });
  };

  const clear = async () => {
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
          <button type="button" className="a-btn small" onClick={() => setOpen(true)}>
            {v.url ? "Replace" : "Add image / video"}
          </button>
          {v.url && (
            <button type="button" className="a-btn small danger" onClick={clear}>
              Remove
            </button>
          )}
        </div>
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

      <div className="hint">Upload, paste, drag &amp; drop, or add by URL. Images → WebP; videos optimized.</div>

      <MediaPickerModal open={open} onClose={() => setOpen(false)} onPick={onPick} multiple={false} accept={accept} />
    </div>
  );
}
