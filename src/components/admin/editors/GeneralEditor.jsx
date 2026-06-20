"use client";
import { useSettings } from "../useSettings";
import { Field, Input, Textarea } from "../ui";
import MediaUpload from "../MediaUpload";
import SaveBar from "../SaveBar";

export default function GeneralEditor() {
  const { settings, set, setNested, loading, saving, saved, error, save } = useSettings();
  if (loading || !settings) return <div className="a-loading">Loading…</div>;

  return (
    <div>
      <div className="a-card">
        <h3>Site Identity</h3>
        <p className="section-desc">Shown in the header at the top of your portfolio.</p>
        <Field label="Name / Title">
          <Input value={settings.siteName} onChange={(v) => set({ siteName: v })} />
        </Field>
        <Field label="Subtitle / Tagline">
          <Input value={settings.subtitle} onChange={(v) => set({ subtitle: v })} />
        </Field>
        <Field label="Footer text">
          <Input value={settings.footerText} onChange={(v) => set({ footerText: v })} />
        </Field>
      </div>

      <div className="a-card">
        <h3>SEO</h3>
        <p className="section-desc">Title & description shown in browser tabs and search results.</p>
        <Field label="Meta title">
          <Input value={settings.metaTitle} onChange={(v) => set({ metaTitle: v })} />
        </Field>
        <Field label="Meta description">
          <Textarea value={settings.metaDescription} onChange={(v) => set({ metaDescription: v })} />
        </Field>
      </div>

      <div className="a-card">
        <h3>Favicon</h3>
        <MediaUpload
          label="Favicon (image)"
          value={settings.favicon}
          onChange={(m) => set({ favicon: m })}
          accept="image/*"
        />
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
