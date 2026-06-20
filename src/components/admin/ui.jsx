"use client";
import React from "react";

export function Field({ label, hint, children }) {
  return (
    <div className="a-field">
      {label && <label>{label}</label>}
      {children}
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

export function Input({ value, onChange, ...props }) {
  return (
    <input
      className="a-input"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    />
  );
}

export function NumberInput({ value, onChange, ...props }) {
  return (
    <input
      type="number"
      className="a-input"
      value={value ?? 0}
      onChange={(e) => onChange?.(e.target.value === "" ? 0 : Number(e.target.value))}
      {...props}
    />
  );
}

export function Textarea({ value, onChange, ...props }) {
  return (
    <textarea
      className="a-textarea"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    />
  );
}

export function Select({ value, onChange, options = [], ...props }) {
  return (
    <select
      className="a-select"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="a-toggle">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange?.(e.target.checked)} />
      <span className="track" />
      {label && <span>{label}</span>}
    </label>
  );
}

export function ColorField({ label, value, onChange }) {
  return (
    <div className="a-field">
      {label && <label>{label}</label>}
      <div className="color-field">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <input
          className="a-input"
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="#8189ff"
        />
      </div>
    </div>
  );
}

/** Tag/list input — comma or Enter adds, returns string[] */
export function TagInput({ label, hint, value = [], onChange, placeholder }) {
  const [draft, setDraft] = React.useState("");
  const add = (raw) => {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) onChange?.([...(value || []), ...parts]);
    setDraft("");
  };
  return (
    <div className="a-field">
      {label && <label>{label}</label>}
      <input
        className="a-input"
        value={draft}
        placeholder={placeholder || "Type and press Enter"}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (draft.trim()) add(draft);
          }
        }}
        onBlur={() => draft.trim() && add(draft)}
      />
      {hint && <div className="hint">{hint}</div>}
      {value?.length > 0 && (
        <div className="chips">
          {value.map((t, i) => (
            <span className="chip" key={i}>
              {t}
              <button
                type="button"
                onClick={() => onChange?.(value.filter((_, idx) => idx !== i))}
                aria-label="remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Alert({ type = "error", children }) {
  if (!children) return null;
  return <div className={`a-alert ${type}`}>{children}</div>;
}
