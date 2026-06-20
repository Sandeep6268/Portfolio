"use client";
import { useSettings } from "../useSettings";
import { Field, Input, Textarea, TagInput } from "../ui";
import MediaUpload from "../MediaUpload";
import SaveBar from "../SaveBar";
import Loader from "../Loader";

export default function AboutEditor() {
  const { settings, setNested, loading, saving, saved, error, save } = useSettings();
  if (loading || !settings) return <Loader />;
  const about = settings.about || {};

  return (
    <div>
      <div className="a-card">
        <h3>About Section</h3>
        <Field label="Section heading">
          <Input value={about.heading} onChange={(v) => setNested("about", { heading: v })} />
        </Field>
        <Field label="Body text">
          <Textarea
            value={about.body}
            onChange={(v) => setNested("about", { body: v })}
            style={{ minHeight: 140 }}
          />
        </Field>
        <TagInput
          label="Highlights"
          hint="Short bullet points (press Enter to add)."
          value={about.highlights || []}
          onChange={(v) => setNested("about", { highlights: v })}
        />
        <Field label="Resume / CV URL (optional)">
          <Input
            value={about.resumeUrl}
            onChange={(v) => setNested("about", { resumeUrl: v })}
            placeholder="https://…/resume.pdf"
          />
        </Field>
      </div>

      <div className="a-card">
        <h3>About Media (optional)</h3>
        <p className="section-desc">A photo or video of you / your work.</p>
        <MediaUpload value={about.media} onChange={(m) => setNested("about", { media: m })} />
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
