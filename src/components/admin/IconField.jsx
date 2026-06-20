"use client";
import React from "react";
import Icon from "@/components/Icon";

/**
 * Lets the admin set an icon by EITHER:
 *  - a react-icons component name (e.g. "FaGithub", "SiReact", "FiCode"), or
 *  - an SVG / image URL.
 * Shows a live preview rendered by the same <Icon> used on the site.
 */
export default function IconField({ label = "Icon", value, onChange, hint }) {
  return (
    <div className="a-field">
      {label && <label>{label}</label>}
      <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
        <div className="icon-preview">
          <Icon name={value} />
        </div>
        <input
          className="a-input"
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder='e.g. "FaGithub" or https://.../icon.svg'
        />
      </div>
      <div className="hint">
        {hint ||
          'Paste a react-icons name (e.g. SiReact, FaGithub, FiCode) or an SVG/image URL. Browse names at react-icons.github.io/react-icons'}
      </div>
    </div>
  );
}
