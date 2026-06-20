"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSettings } from "../useSettings";
import { Field, Input, Toggle, ColorField } from "../ui";
import SaveBar from "../SaveBar";
import Loader from "../Loader";
import { THEME_PRESETS, THEME_COLOR_KEYS } from "@/lib/themePresets";
import { FiTrash2 } from "react-icons/fi";

function Swatches({ colors }) {
  const keys = ["bg", "primary", "secondary", "accent", "cardBg"];
  return (
    <div className="theme-swatches">
      {keys.map((k) => (
        <span key={k} style={{ background: colors[k] || "#000" }} />
      ))}
    </div>
  );
}

export default function ThemeEditor() {
  const { settings, setNested, loading, saving, saved, error, save } = useSettings();
  const [newName, setNewName] = useState("");
  if (loading || !settings) return <Loader />;
  const theme = settings.theme || {};
  const customPresets = theme.presets || [];

  const applyPreset = (colors) => {
    setNested("theme", { ...colors });
    toast.success("Theme applied — remember to Save");
  };

  const saveCurrentAsPreset = () => {
    const name = (newName || "").trim();
    if (!name) {
      toast.error("Give your theme a name first");
      return;
    }
    const colors = {};
    THEME_COLOR_KEYS.forEach(([k]) => (colors[k] = theme[k]));
    const presets = [...customPresets, { name, colors }];
    setNested("theme", { presets });
    setNewName("");
    toast.success(`Saved preset "${name}" — click Save changes to persist`);
  };

  const deletePreset = (idx) => {
    setNested("theme", { presets: customPresets.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <div className="a-card">
        <h3>Theme Presets</h3>
        <p className="section-desc">One-click apply a ready-made palette, then Save changes.</p>
        <div className="theme-preset-grid">
          {THEME_PRESETS.map((p) => (
            <button key={p.name} type="button" className="theme-preset" onClick={() => applyPreset(p.colors)}>
              <Swatches colors={p.colors} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {customPresets.length > 0 && (
          <>
            <h4 style={{ margin: "1.3rem 0 0.6rem", fontSize: "0.9rem", color: "var(--a-muted)" }}>Your saved themes</h4>
            <div className="theme-preset-grid">
              {customPresets.map((p, i) => (
                <div key={i} className="theme-preset custom">
                  <button type="button" className="theme-preset-apply" onClick={() => applyPreset(p.colors)}>
                    <Swatches colors={p.colors} />
                    <span>{p.name}</span>
                  </button>
                  <button type="button" className="theme-preset-del" onClick={() => deletePreset(i)} aria-label="Delete preset">
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="theme-save-preset">
          <Input value={newName} onChange={setNewName} placeholder="Name your current colors (e.g. My Brand)" />
          <button type="button" className="a-btn ghost" onClick={saveCurrentAsPreset}>
            Save current as preset
          </button>
        </div>
      </div>

      <div className="a-card">
        <h3>Theme Colors</h3>
        <p className="section-desc">Fine-tune any color. Changes recolor the whole site after saving.</p>
        <div className="a-row">
          {THEME_COLOR_KEYS.map(([key, label]) => (
            <ColorField key={key} label={label} value={theme[key]} onChange={(v) => setNested("theme", { [key]: v })} />
          ))}
        </div>
      </div>

      <div className="a-card">
        <h3>Typography</h3>
        <Field label="Font family (CSS)" hint="e.g. 'Poppins', sans-serif. Inter is loaded by default.">
          <Input value={theme.fontFamily} onChange={(v) => setNested("theme", { fontFamily: v })} />
        </Field>
      </div>

      <div className="a-card">
        <h3>Visual Effects</h3>
        <p className="section-desc">The smokey mouse trail and animated 3D star background.</p>
        <div className="a-field">
          <Toggle
            label="Smokey cursor (WebGL fluid trail)"
            checked={theme.enableSmokeyCursor !== false}
            onChange={(v) => setNested("theme", { enableSmokeyCursor: v })}
          />
        </div>
        <div className="a-field">
          <Toggle
            label="3D animated star background"
            checked={theme.enableStarsBackground !== false}
            onChange={(v) => setNested("theme", { enableStarsBackground: v })}
          />
        </div>
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
