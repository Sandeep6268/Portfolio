"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api";
import { useConfirm } from "../ConfirmProvider";
import { Alert } from "../ui";
import { FiTrash2, FiMail, FiCheck } from "react-icons/fi";

export default function MessagesEditor({ onChange }) {
  const confirm = useConfirm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { items } = await api.get("/api/admin/messages");
      setItems(items);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (m) => {
    if (m.read) return;
    await api.patch(`/api/admin/messages/${m._id}`, { read: true });
    setItems((prev) => prev.map((x) => (x._id === m._id ? { ...x, read: true } : x)));
    onChange?.();
  };

  const del = async (id) => {
    const ok = await confirm({
      title: "Delete this message?",
      message: "This message will be permanently removed from your inbox.",
      confirmText: "Delete",
    });
    if (!ok) return;
    try {
      await api.del(`/api/admin/messages/${id}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
      toast.success("Message deleted");
      onChange?.();
    } catch (e) {
      toast.error(e.message || "Failed to delete");
    }
  };

  if (loading) return <div className="a-loading">Loading…</div>;

  return (
    <div>
      {error && <Alert type="error">{error}</Alert>}
      {items.length === 0 && <div className="a-empty">No messages yet.</div>}
      {items.map((m) => {
        const open = openId === m._id;
        return (
          <div className="a-item" key={m._id}>
            <div className="a-item-head">
              <div className="icon-preview"><FiMail /></div>
              <div>
                <div className="title">
                  {m.name} {!m.read && <span className="badge" style={{ background: "var(--a-primary)" }}>new</span>}
                </div>
                <div className="sub">{m.email} • {m.subject || "(no subject)"}</div>
              </div>
              <div className="actions">
                {!m.read && (
                  <button className="a-btn ghost small" onClick={() => markRead(m)} aria-label="mark read"><FiCheck /></button>
                )}
                <button className="a-btn ghost small" onClick={() => { setOpenId(open ? null : m._id); markRead(m); }}>
                  {open ? "Hide" : "Read"}
                </button>
                <button className="a-btn small danger" onClick={() => del(m._id)} aria-label="delete"><FiTrash2 /></button>
              </div>
            </div>
            {open && (
              <div className="a-item-body">
                <p style={{ whiteSpace: "pre-wrap", color: "var(--a-text)" }}>{m.message}</p>
                <div className="hint" style={{ marginTop: "0.8rem" }}>
                  Received {new Date(m.createdAt).toLocaleString()}
                </div>
                <a className="a-btn ghost small" href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "")}`} style={{ marginTop: "0.6rem" }}>
                  Reply via email
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
