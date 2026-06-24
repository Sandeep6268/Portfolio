"use client";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { api } from "./api";
import { FiArrowLeft, FiArrowRight, FiTrash2, FiUploadCloud } from "react-icons/fi";

/**
 * Upload & manage MULTIPLE media items (images and/or videos) for a gallery.
 * value = [{ type, url, publicId, caption }]; onChange returns the new array.
 */
export default function MultiMediaUpload({ label = "Gallery", value = [], onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const items = Array.isArray(value) ? value : [];

  const pick = () => inputRef.current?.click();

  // shared: upload a list of File objects and append them to the gallery
  const uploadFiles = async (files) => {
    const valid = files.filter((f) => {
      const m = f.type || "";
      return m.startsWith("image/") || m.startsWith("video/");
    });
    if (!valid.length) {
      if (files.length) toast.error("Only image or video files are allowed.");
      return;
    }
    setUploading(true);
    const uploaded = [];
    let failed = 0;
    for (const file of valid) {
      try {
        const res = await api.upload(file);
        uploaded.push({ type: res.type, url: res.url, publicId: res.publicId, caption: "", alt: "", title: "" });
      } catch (ex) {
        failed += 1;
      }
    }
    if (uploaded.length) {
      onChange?.([...items, ...uploaded]);
      toast.success(`${uploaded.length} item${uploaded.length > 1 ? "s" : ""} added to gallery`);
    }
    if (failed) toast.error(`${failed} upload${failed > 1 ? "s" : ""} failed`);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onFiles = (e) => uploadFiles(Array.from(e.target.files || []));

  // paste copied image(s) from the clipboard
  const onPaste = (e) => {
    const files = [];
    for (const it of e.clipboardData?.items || []) {
      if (it.kind === "file") {
        const f = it.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length) {
      e.preventDefault();
      uploadFiles(files);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(Array.from(e.dataTransfer?.files || []));
  };

  const update = (i, patch) =>
    onChange?.(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const remove = async (i) => {
    const it = items[i];
    if (it?.publicId) {
      try {
        await api.del(`/api/admin/upload?publicId=${encodeURIComponent(it.publicId)}&type=${it.type || "image"}`);
      } catch {}
    }
    onChange?.(items.filter((_, idx) => idx !== i));
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange?.(next);
  };

  return (
    <div className="a-field">
      {label && <label>{label}</label>}
      <div
        className={`gallery-uploader ${dragOver ? "dragover" : ""}`}
        tabIndex={0}
        onPaste={onPaste}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {items.map((it, i) => (
          <div className="gallery-tile" key={it.publicId || it.url || i}>
            {it.type === "video" ? (
              <video src={it.url} muted loop playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.url} alt="" />
            )}
            <div className="gallery-tile-actions">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="move left"><FiArrowLeft /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="move right"><FiArrowRight /></button>
              <button type="button" className="danger" onClick={() => remove(i)} aria-label="remove"><FiTrash2 /></button>
            </div>
            <input
              className="gallery-caption"
              value={it.caption || ""}
              placeholder="Caption (optional)"
              onChange={(e) => update(i, { caption: e.target.value })}
            />
            <input
              className="gallery-caption"
              value={it.alt || ""}
              placeholder="Alt text (SEO, optional)"
              onChange={(e) => update(i, { alt: e.target.value })}
            />
          </div>
        ))}
        <button type="button" className="gallery-add" onClick={pick} disabled={uploading}>
          <FiUploadCloud size={22} />
          <span>{uploading ? "Uploading…" : "Add media"}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={onFiles}
        style={{ display: "none" }}
      />
      <div className="hint">Add multiple images / videos — click, drag &amp; drop, or click here and paste (Ctrl/Cmd+V) a copied image. Reorder with the arrows. Images → WebP.</div>
    </div>
  );
}
