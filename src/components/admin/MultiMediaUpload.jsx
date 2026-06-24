"use client";
import React, { useState } from "react";
import { api } from "./api";
import MediaPickerModal from "./MediaPickerModal";
import { FiArrowLeft, FiArrowRight, FiTrash2, FiPlus, FiMove } from "react-icons/fi";

/**
 * Manage MULTIPLE media items (gallery). "Add media" opens the picker modal
 * (Upload / Paste / Drag & drop / From URL). value = [{ type, url, publicId, caption, alt }].
 * Tiles can be reordered by drag & drop (hold a tile and drop it anywhere) or arrows.
 */
export default function MultiMediaUpload({ label = "Gallery", value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const items = Array.isArray(value) ? value : [];

  // drag & drop reorder: move dragged tile to the drop position
  const onDropTile = (target) => {
    if (dragIdx === null || dragIdx === target) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(target, 0, moved);
    onChange?.(next);
    setDragIdx(null);
    setOverIdx(null);
  };

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
          <div
            className={`gallery-tile ${dragIdx === i ? "dragging" : ""} ${overIdx === i && dragIdx !== i ? "drag-over" : ""}`}
            key={it.publicId || it.url || i}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (overIdx !== i) setOverIdx(i); }}
            onDrop={(e) => { e.preventDefault(); onDropTile(i); }}
          >
            <div
              className="gallery-tile-media"
              draggable
              onDragStart={(e) => { setDragIdx(i); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", String(i)); } catch {} }}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
              title="Drag to reorder"
            >
              {it.type === "video" ? (
                <video src={it.url} muted loop playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.url} alt="" />
              )}
              <span className="gallery-pos">{i + 1}</span>
              <span className="gallery-drag-badge"><FiMove /></span>
            </div>
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
      <div className="hint">Add via upload, paste, drag &amp; drop, or URL. <strong>Reorder: hold an image and drag it</strong> to a new spot (or use the arrows). Images → WebP.</div>

      <MediaPickerModal open={open} onClose={() => setOpen(false)} onPick={onPick} multiple accept="image/*,video/*" />
    </div>
  );
}
