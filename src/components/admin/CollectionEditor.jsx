"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useCollection } from "./useCollection";
import { useConfirm } from "./ConfirmProvider";
import { Toggle, Alert } from "./ui";
import Loader from "./Loader";
import { FiArrowUp, FiArrowDown, FiEdit2, FiTrash2, FiX, FiPlus, FiMove } from "react-icons/fi";

/**
 * Reusable list editor. Add / Edit happen in a centered popup form modal.
 *  blankItem() — factory for a new item
 *  renderRow(item) — { title, subtitle, thumb } summary for the list row
 *  renderForm(item, patch) — form fields; call patch({...}) to update the draft
 */
export default function CollectionEditor({ resource, title, description, blankItem, renderRow, renderForm }) {
  const { items, loading, error, busy, create, update, remove, reorder } = useCollection(resource);
  const confirm = useConfirm();

  // modal state: { mode: 'add'|'edit', draft, id? } | null
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  useEffect(() => setMounted(true), []);

  if (loading) return <Loader />;

  const openAdd = () => setModal({ mode: "add", draft: blankItem() });
  const openEdit = (item) => setModal({ mode: "edit", id: item._id, draft: { ...item } });
  const close = () => setModal(null);
  const patch = (p) => setModal((m) => (m ? { ...m, draft: { ...m.draft, ...p } } : m));

  const submit = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.mode === "add") {
        await create(modal.draft);
      } else {
        await update(modal.id, modal.draft);
        toast.success("Saved");
      }
      close();
    } catch {
      // error toast handled by the hook
    } finally {
      setSaving(false);
    }
  };

  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const ids = items.map((i) => i._id);
    [ids[idx], ids[j]] = [ids[j], ids[idx]];
    reorder(ids);
  };

  // drag & drop reorder
  const onDrop = (target) => {
    if (dragIdx === null || dragIdx === target) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    const ids = items.map((i) => i._id);
    const [moved] = ids.splice(dragIdx, 1);
    ids.splice(target, 0, moved);
    reorder(ids);
    setDragIdx(null);
    setOverIdx(null);
  };

  const quickToggle = (item, enabled) => update(item._id, { ...item, enabled });

  const deleteItem = async (item) => {
    const ok = await confirm({
      title: "Delete this item?",
      message: `"${renderRow(item).title || "This item"}" will be permanently removed.`,
      confirmText: "Delete",
    });
    if (ok) remove(item._id);
  };

  return (
    <div>
      <div className="a-toolbar">
        <div>
          <h3 style={{ fontSize: "1.1rem" }}>{title}</h3>
          {description && <div className="hint">{description}</div>}
        </div>
        <div className="a-spacer" />
        <button className="a-btn" onClick={openAdd} disabled={busy}><FiPlus /> Add new</button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {items.length === 0 && <div className="a-empty">No items yet. Click “Add new” to create one.</div>}

      {items.map((item, idx) => {
        const row = renderRow(item);
        return (
          <div
            className={`a-item dnd ${dragIdx === idx ? "dragging" : ""} ${overIdx === idx && dragIdx !== idx ? "drag-over" : ""}`}
            key={item._id}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (overIdx !== idx) setOverIdx(idx); }}
            onDrop={(e) => { e.preventDefault(); onDrop(idx); }}
          >
            <div
              className="a-item-head"
              draggable
              onDragStart={(e) => { setDragIdx(idx); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", String(idx)); } catch {} }}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
            >
              <span className="drag-handle" title="Drag to reorder" aria-label="Drag to reorder"><FiMove /></span>
              {row.thumb &&
                (row.thumbType === "video" ? (
                  <video className="a-thumb" src={row.thumb} muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="a-thumb" src={row.thumb} alt="" />
                ))}
              {row.icon && <div className="icon-preview">{row.icon}</div>}
              <div>
                <div className="title">{row.title || "Untitled"}</div>
                {row.subtitle && <div className="sub">{row.subtitle}</div>}
              </div>
              <div className="actions">
                <button className="a-btn ghost small" onClick={() => move(idx, -1)} disabled={idx === 0} aria-label="up"><FiArrowUp /></button>
                <button className="a-btn ghost small" onClick={() => move(idx, 1)} disabled={idx === items.length - 1} aria-label="down"><FiArrowDown /></button>
                <Toggle checked={item.enabled !== false} onChange={(v) => quickToggle(item, v)} />
                <button className="a-btn ghost small" onClick={() => openEdit(item)} aria-label="edit"><FiEdit2 /></button>
                <button className="a-btn small danger" onClick={() => deleteItem(item)} aria-label="delete"><FiTrash2 /></button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add / Edit form modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {modal && (
              <motion.div
                className="form-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={(e) => e.target === e.currentTarget && close()}
              >
                <motion.div
                  className="form-modal"
                  initial={{ scale: 0.94, opacity: 0, y: 18 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.94, opacity: 0, y: 18 }}
                  transition={{ type: "spring", damping: 24, stiffness: 280 }}
                  role="dialog"
                  aria-modal="true"
                >
                  <div className="form-modal-head">
                    <h3>{modal.mode === "add" ? `Add ${title.replace(/s$/, "")}` : `Edit ${title.replace(/s$/, "")}`}</h3>
                    <button className="form-modal-close" onClick={close} aria-label="Close"><FiX /></button>
                  </div>
                  <div className="form-modal-body">
                    {renderForm(modal.draft, patch)}
                  </div>
                  <div className="form-modal-foot">
                    <button className="a-btn ghost" onClick={close} disabled={saving}>Cancel</button>
                    <button className="a-btn" onClick={submit} disabled={saving}>
                      {saving ? "Saving…" : modal.mode === "add" ? "Create" : "Save changes"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
