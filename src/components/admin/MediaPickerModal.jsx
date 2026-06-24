"use client";
import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "./api";
import { FiUploadCloud, FiClipboard, FiLink, FiX } from "react-icons/fi";

/**
 * One modal to add media every way: Upload file, Paste (clipboard), Drag & drop, From URL.
 * Calls onPick(mediaArray) where each item is { type, url, publicId }.
 *  - multiple=false -> onPick is called with a single-item array
 *  - multiple=true  -> may return several (file picker / paste / drop multi)
 * URL option fetches the link into Cloudinary (optimized to WebP).
 */
export default function MediaPickerModal({ open, onClose, onPick, multiple = false, accept = "image/*,video/*" }) {
  const inputRef = useRef(null);
  const dropRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [url, setUrl] = useState("");

  // focus the drop zone so Ctrl/Cmd+V paste lands here
  useEffect(() => {
    if (open) {
      setUrl("");
      const t = setTimeout(() => dropRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !busy && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  const finish = (items) => {
    if (items?.length) {
      onPick?.(items);
      onClose?.();
    }
  };

  const validFiles = (files) =>
    files.filter((f) => {
      const m = f.type || "";
      return m.startsWith("image/") || m.startsWith("video/");
    });

  const uploadFiles = async (rawFiles) => {
    const files = validFiles(Array.from(rawFiles || []));
    if (!files.length) {
      toast.error("Only image or video files are allowed.");
      return;
    }
    const list = multiple ? files : files.slice(0, 1);
    setBusy(true);
    const out = [];
    let failed = 0;
    for (const file of list) {
      try {
        const res = await api.upload(file);
        out.push({ type: res.type, url: res.url, publicId: res.publicId });
      } catch {
        failed += 1;
      }
    }
    setBusy(false);
    if (failed) toast.error(`${failed} upload${failed > 1 ? "s" : ""} failed`);
    if (out.length) {
      toast.success(`${out.length} item${out.length > 1 ? "s" : ""} added`);
      finish(out);
    }
  };

  const onFileInput = (e) => uploadFiles(e.target.files);

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

  const pasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard?.read) {
        toast.error("Use Ctrl/Cmd+V inside the box, or Upload / URL.");
        return;
      }
      const clip = await navigator.clipboard.read();
      const files = [];
      for (const item of clip) {
        const imgType = item.types.find((t) => t.startsWith("image/"));
        if (imgType) {
          const blob = await item.getType(imgType);
          const ext = imgType.split("/")[1] || "png";
          files.push(new File([blob], `pasted-${Date.now()}.${ext}`, { type: imgType }));
        }
      }
      if (files.length) uploadFiles(files);
      else toast.error("No image in clipboard. Copy an image first.");
    } catch {
      toast.error("Clipboard blocked — press Ctrl/Cmd+V inside the box instead.");
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer?.files);
  };

  const useUrl = async () => {
    const u = url.trim();
    if (!u) return;
    setBusy(true);
    try {
      const res = await api.uploadUrl(u);
      toast.success("Fetched & optimized");
      finish([{ type: res.type, url: res.url, publicId: res.publicId }]);
    } catch (ex) {
      toast.error(ex.message || "Could not fetch that URL");
    } finally {
      setBusy(false);
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="mp-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
        >
          <motion.div
            className="mp-modal"
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="mp-head">
              <h3>Add {multiple ? "media" : "image / video"}</h3>
              <button className="mp-close" onClick={onClose} disabled={busy} aria-label="Close"><FiX /></button>
            </div>

            <div className="mp-body">
              {/* Drop / paste zone (also click to pick) */}
              <div
                ref={dropRef}
                className={`mp-dropzone ${dragOver ? "dragover" : ""} ${busy ? "busy" : ""}`}
                tabIndex={0}
                onPaste={onPaste}
                onClick={() => !busy && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
              >
                <FiUploadCloud size={30} />
                {busy ? (
                  <span>Uploading…</span>
                ) : (
                  <>
                    <strong>Click to upload</strong>
                    <span>or drag &amp; drop{multiple ? " (multiple)" : ""}, or press Ctrl/Cmd+V to paste</span>
                  </>
                )}
              </div>

              <div className="mp-actions">
                <button type="button" className="a-btn small ghost" onClick={() => inputRef.current?.click()} disabled={busy}>
                  <FiUploadCloud /> Upload file
                </button>
                <button type="button" className="a-btn small ghost" onClick={pasteFromClipboard} disabled={busy}>
                  <FiClipboard /> Paste image
                </button>
              </div>

              <div className="mp-divider"><span>or from URL</span></div>

              <div className="mp-url">
                <FiLink className="mp-url-icon" />
                <input
                  className="a-input"
                  value={url}
                  placeholder="https://…/image.jpg or video URL"
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && useUrl()}
                  disabled={busy}
                />
                <button type="button" className="a-btn small" onClick={useUrl} disabled={busy || !url.trim()}>
                  Use
                </button>
              </div>
              <div className="hint">URL media is fetched into Cloudinary &amp; optimized (WebP). Images → WebP; videos compressed.</div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={onFileInput}
              style={{ display: "none" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
