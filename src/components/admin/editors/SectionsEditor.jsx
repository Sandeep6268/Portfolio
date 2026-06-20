"use client";
import { useState } from "react";
import { useSettings } from "../useSettings";
import { Field, Input, Toggle } from "../ui";
import IconField from "../IconField";
import SaveBar from "../SaveBar";
import Loader from "../Loader";
import { FiArrowUp, FiArrowDown, FiMove } from "react-icons/fi";

const LABELS = {
  hero: "Hero",
  about: "About",
  projects: "Projects",
  skills: "Skills",
  experience: "Experience",
  services: "Services",
  testimonials: "Testimonials",
  contact: "Contact",
};

export default function SectionsEditor() {
  const { settings, set, loading, saving, saved, error, save } = useSettings();
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [navDrag, setNavDrag] = useState(null);
  const [navOver, setNavOver] = useState(null);
  if (loading || !settings) return <Loader />;

  const sections = [...(settings.sections || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const nav = settings.navItems || [];

  const commitSections = (next) => {
    // re-number order to match array index
    set({ sections: next.map((s, i) => ({ ...s, order: i })) });
  };
  const updateSection = (key, patch) =>
    commitSections(sections.map((s) => (s.key === key ? { ...s, ...patch } : s)));
  const move = (idx, dir) => {
    const next = [...sections];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    commitSections(next);
  };
  // drag & drop reorder (sections)
  const onDrop = (target) => {
    if (dragIdx === null || dragIdx === target) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    const next = [...sections];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(target, 0, moved);
    commitSections(next);
    setDragIdx(null);
    setOverIdx(null);
  };

  const setNav = (next) => set({ navItems: next });
  const updateNav = (i, patch) => setNav(nav.map((n, idx) => (idx === i ? { ...n, ...patch } : n)));
  const addNav = () => setNav([...nav, { icon: "FiCircle", label: "New", href: "#home", enabled: true }]);
  const removeNav = (i) => setNav(nav.filter((_, idx) => idx !== i));
  const moveNav = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= nav.length) return;
    const next = [...nav];
    [next[idx], next[j]] = [next[j], next[idx]];
    setNav(next);
  };
  const onNavDrop = (target) => {
    if (navDrag === null || navDrag === target) { setNavDrag(null); setNavOver(null); return; }
    const next = [...nav];
    const [moved] = next.splice(navDrag, 1);
    next.splice(target, 0, moved);
    setNav(next);
    setNavDrag(null);
    setNavOver(null);
  };

  return (
    <div>
      <div className="a-card">
        <h3>Sections — visibility, title & order</h3>
        <p className="section-desc">Drag the ⠿ handle (or use ↑ ↓) to reorder, toggle to show/hide, and rename headings.</p>
        {sections.map((s, idx) => (
          <div
            className={`a-item dnd ${dragIdx === idx ? "dragging" : ""} ${overIdx === idx && dragIdx !== idx ? "drag-over" : ""}`}
            key={s.key}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (overIdx !== idx) setOverIdx(idx); }}
            onDrop={(e) => { e.preventDefault(); onDrop(idx); }}
          >
            <div
              className="a-item-head"
              draggable
              onDragStart={(e) => { setDragIdx(idx); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", String(idx)); } catch {} }}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
            >
              <span className="drag-handle" title="Drag to reorder" aria-label="Drag to reorder">
                <FiMove />
              </span>
              <span className="title">{LABELS[s.key] || s.key}</span>
              <div className="actions">
                <button className="a-btn ghost small" onClick={() => move(idx, -1)} disabled={idx === 0} aria-label="Move up">
                  <FiArrowUp />
                </button>
                <button className="a-btn ghost small" onClick={() => move(idx, 1)} disabled={idx === sections.length - 1} aria-label="Move down">
                  <FiArrowDown />
                </button>
                <Toggle checked={s.enabled !== false} onChange={(v) => updateSection(s.key, { enabled: v })} />
              </div>
            </div>
            {s.key !== "hero" && (
              <div className="a-item-body">
                <Field label="Section heading">
                  <Input
                    value={s.title}
                    onChange={(v) => updateSection(s.key, { title: v })}
                    placeholder={LABELS[s.key]}
                  />
                </Field>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="a-card">
        <h3>Floating Navigation</h3>
        <p className="section-desc">The icon rail. Drag ⠿ (or ↑ ↓) to reorder. Each icon is customizable (react-icons name or SVG URL).</p>
        {nav.map((n, i) => (
          <div
            className={`a-item dnd ${navDrag === i ? "dragging" : ""} ${navOver === i && navDrag !== i ? "drag-over" : ""}`}
            key={n._id || i}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (navOver !== i) setNavOver(i); }}
            onDrop={(e) => { e.preventDefault(); onNavDrop(i); }}
          >
            <div
              className="a-item-head"
              draggable
              onDragStart={(e) => { setNavDrag(i); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", String(i)); } catch {} }}
              onDragEnd={() => { setNavDrag(null); setNavOver(null); }}
            >
              <span className="drag-handle" title="Drag to reorder" aria-label="Drag to reorder">
                <FiMove />
              </span>
              <span className="title">{n.label || "Nav item"}</span>
              <div className="actions">
                <button className="a-btn ghost small" onClick={() => moveNav(i, -1)} disabled={i === 0} aria-label="Move up"><FiArrowUp /></button>
                <button className="a-btn ghost small" onClick={() => moveNav(i, 1)} disabled={i === nav.length - 1} aria-label="Move down"><FiArrowDown /></button>
                <Toggle checked={n.enabled !== false} onChange={(v) => updateNav(i, { enabled: v })} />
                <button className="a-btn small danger" onClick={() => removeNav(i)}>Remove</button>
              </div>
            </div>
            <div className="a-item-body">
              <div className="a-row">
                <Field label="Label (tooltip)">
                  <Input value={n.label} onChange={(v) => updateNav(i, { label: v })} />
                </Field>
                <Field label="Link (anchor)" hint="e.g. #projects, #about">
                  <Input value={n.href} onChange={(v) => updateNav(i, { href: v })} />
                </Field>
              </div>
              <IconField value={n.icon} onChange={(v) => updateNav(i, { icon: v })} />
            </div>
          </div>
        ))}
        <button className="a-btn ghost small" onClick={addNav}>+ Add nav item</button>
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
