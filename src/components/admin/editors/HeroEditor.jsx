"use client";
import { useSettings } from "../useSettings";
import { Field, Input, Textarea, NumberInput } from "../ui";
import MediaUpload from "../MediaUpload";
import SaveBar from "../SaveBar";
import Loader from "../Loader";

export default function HeroEditor() {
  const { settings, setNested, loading, saving, saved, error, save } = useSettings();
  if (loading || !settings) return <Loader />;
  const hero = settings.hero || {};
  const stats = hero.stats || [];

  const setStats = (next) => setNested("hero", { stats: next });
  const updateStat = (i, patch) =>
    setStats(stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const addStat = () => setStats([...stats, { label: "New", value: 0, suffix: "" }]);
  const removeStat = (i) => setStats(stats.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="a-card">
        <h3>Hero Content</h3>
        <Field label="Heading">
          <Input value={hero.heading} onChange={(v) => setNested("hero", { heading: v })} />
        </Field>
        <Field label="Paragraph">
          <Textarea value={hero.paragraph} onChange={(v) => setNested("hero", { paragraph: v })} />
        </Field>
        <div className="a-row">
          <Field label="Primary button label">
            <Input value={hero.ctaLabel} onChange={(v) => setNested("hero", { ctaLabel: v })} />
          </Field>
          <Field label="Primary button link">
            <Input value={hero.ctaHref} onChange={(v) => setNested("hero", { ctaHref: v })} />
          </Field>
        </div>
        <div className="a-row">
          <Field label="Secondary button label">
            <Input value={hero.secondaryCtaLabel} onChange={(v) => setNested("hero", { secondaryCtaLabel: v })} />
          </Field>
          <Field label="Secondary button link">
            <Input value={hero.secondaryCtaHref} onChange={(v) => setNested("hero", { secondaryCtaHref: v })} />
          </Field>
        </div>
      </div>

      <div className="a-card">
        <h3>Hero Media (optional)</h3>
        <p className="section-desc">An image or video shown beside the hero text.</p>
        <MediaUpload value={hero.media} onChange={(m) => setNested("hero", { media: m })} />
      </div>

      <div className="a-card">
        <h3>Stats Counters</h3>
        <p className="section-desc">Animated numbers (e.g. Projects, Clients, Years).</p>
        {stats.map((s, i) => (
          <div className="a-row-3" key={i} style={{ alignItems: "end", marginBottom: "0.6rem" }}>
            <Field label="Label">
              <Input value={s.label} onChange={(v) => updateStat(i, { label: v })} />
            </Field>
            <Field label="Value">
              <NumberInput value={s.value} onChange={(v) => updateStat(i, { value: v })} />
            </Field>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "end" }}>
              <Field label="Suffix">
                <Input value={s.suffix} onChange={(v) => updateStat(i, { suffix: v })} placeholder="+" />
              </Field>
              <button className="a-btn small danger" onClick={() => removeStat(i)} style={{ marginBottom: "1rem" }}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <button className="a-btn ghost small" onClick={addStat}>+ Add stat</button>
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
