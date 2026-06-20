"use client";
import { Alert } from "./ui";

export default function SaveBar({ onSave, saving, saved, error }) {
  return (
    <>
      {error && <Alert type="error">{error}</Alert>}
      <div className="save-bar">
        <button className="a-btn" onClick={() => onSave()} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span style={{ color: "var(--a-success)" }}>✓ Saved</span>}
      </div>
    </>
  );
}
