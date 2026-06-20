"use client";
import { useSettings } from "../useSettings";
import { Field, Input, Textarea, Toggle } from "../ui";
import IconField from "../IconField";
import SaveBar from "../SaveBar";

export default function ContactEditor() {
  const { settings, setNested, set, loading, saving, saved, error, save } = useSettings();
  if (loading || !settings) return <div className="a-loading">Loading…</div>;
  const contact = settings.contact || {};
  const socials = settings.socialLinks || [];

  const setSocials = (next) => set({ socialLinks: next });
  const updateSocial = (i, patch) =>
    setSocials(socials.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const addSocial = () =>
    setSocials([...socials, { label: "New", icon: "FiLink", url: "", enabled: true }]);
  const removeSocial = (i) => setSocials(socials.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="a-card">
        <h3>Contact Section</h3>
        <Field label="Heading">
          <Input value={contact.heading} onChange={(v) => setNested("contact", { heading: v })} />
        </Field>
        <Field label="Body text">
          <Textarea value={contact.body} onChange={(v) => setNested("contact", { body: v })} />
        </Field>
        <div className="a-row">
          <Field label="Email">
            <Input value={contact.email} onChange={(v) => setNested("contact", { email: v })} />
          </Field>
          <Field label="Phone (optional)">
            <Input value={contact.phone} onChange={(v) => setNested("contact", { phone: v })} />
          </Field>
        </div>
        <Field label="Location (optional)">
          <Input value={contact.location} onChange={(v) => setNested("contact", { location: v })} />
        </Field>
      </div>

      <div className="a-card">
        <h3>Social Links</h3>
        <p className="section-desc">Each icon is fully customizable — use a react-icons name or an SVG URL.</p>
        {socials.map((s, i) => (
          <div className="a-item" key={s._id || i}>
            <div className="a-item-head">
              <span className="title">{s.label || "Social"}</span>
              <div className="actions">
                <Toggle checked={s.enabled !== false} onChange={(v) => updateSocial(i, { enabled: v })} />
                <button className="a-btn small danger" onClick={() => removeSocial(i)}>Remove</button>
              </div>
            </div>
            <div className="a-item-body">
              <div className="a-row">
                <Field label="Label">
                  <Input value={s.label} onChange={(v) => updateSocial(i, { label: v })} />
                </Field>
                <Field label="URL">
                  <Input value={s.url} onChange={(v) => updateSocial(i, { url: v })} placeholder="https://…" />
                </Field>
              </div>
              <IconField value={s.icon} onChange={(v) => updateSocial(i, { icon: v })} />
            </div>
          </div>
        ))}
        <button className="a-btn ghost small" onClick={addSocial}>+ Add social link</button>
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
