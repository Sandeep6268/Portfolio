"use client";
import CollectionEditor from "../CollectionEditor";
import { Field, Input, Textarea, TagInput, Toggle } from "../ui";
import MediaUpload from "../MediaUpload";
import MultiMediaUpload from "../MultiMediaUpload";

export default function ProjectsEditor() {
  return (
    <CollectionEditor
      resource="projects"
      title="Projects"
      description="Add projects with an image or video. Media is auto-optimized (WebP / compressed video)."
      blankItem={() => ({
        title: "New Project",
        desc: "",
        tech: [],
        features: [],
        github: "",
        live: "",
        media: { type: "", url: "", publicId: "" },
        gallery: [],
        featured: false,
        enabled: true,
      })}
      renderRow={(p) => ({
        title: p.title,
        subtitle: [
          (p.tech || []).slice(0, 3).join(", "),
          (p.gallery?.length ? `${p.gallery.length} gallery item${p.gallery.length > 1 ? "s" : ""}` : ""),
        ].filter(Boolean).join(" · "),
        thumb: p.media?.url || p.gallery?.[0]?.url,
        thumbType: p.media?.type || p.gallery?.[0]?.type,
      })}
      renderForm={(p, patch) => (
        <>
          <Field label="Title">
            <Input value={p.title} onChange={(v) => patch({ title: v })} />
          </Field>
          <Field label="Description">
            <Textarea value={p.desc} onChange={(v) => patch({ desc: v })} />
          </Field>
          <MediaUpload
            label="Cover image or video (shown on the card)"
            value={p.media}
            onChange={(m) => patch({ media: m })}
          />
          <MultiMediaUpload
            label="Project gallery (multiple photos / videos shown in the popup)"
            value={p.gallery || []}
            onChange={(g) => patch({ gallery: g })}
          />
          <div className="a-row">
            <Field label="GitHub URL">
              <Input value={p.github} onChange={(v) => patch({ github: v })} placeholder="https://github.com/…" />
            </Field>
            <Field label="Live demo URL">
              <Input value={p.live} onChange={(v) => patch({ live: v })} placeholder="https://…" />
            </Field>
          </div>
          <TagInput label="Tech stack" value={p.tech || []} onChange={(v) => patch({ tech: v })} placeholder="React, Node…" />
          <TagInput label="Key features" value={p.features || []} onChange={(v) => patch({ features: v })} placeholder="Add a feature…" />
          <div className="a-field">
            <Toggle label="Featured project" checked={!!p.featured} onChange={(v) => patch({ featured: v })} />
          </div>
        </>
      )}
    />
  );
}
