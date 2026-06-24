"use client";
import React, { useState } from "react";
import { api } from "./api";
import MediaPickerModal from "./MediaPickerModal";
import { FiArrowLeft, FiArrowRight, FiTrash2, FiPlus } from "react-icons/fi";

/**
 * Manage MULTIPLE media items (gallery). "Add media" opens the picker modal
 * (Upload / Paste / Drag & drop / From URL). value = [{ type, url, publicId, caption, alt }].
 */
export default function MultiMediaUpload({ label = "Gallery", value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const items = Array.isArray(value) ? value : [];

  const onPick = (picked) => {
    const added = picked.map((m) => ({
      type: m.type, url: m.url, publicId: m.publicId, caption: "", alt: "", title: "",
    }));
    if (added.length) onChange?.([...items, ...added]);
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
      <div className="gallery-uploader">
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
        <button type="button" className="gallery-add" onClick={() => setOpen(true)}>
          <FiPlus size={22} />
          <span>Add media</span>
        </button>
      </div>
      <div className="hint">Add multiple images / videos — upload, paste, drag &amp; drop, or by URL. Reorder with the arrows. Images → WebP.</div>

      <MediaPickerModal open={open} onClose={() => setOpen(false)} onPick={onPick} multiple accept="image/*,video/*" />
    </div>
  );
}
