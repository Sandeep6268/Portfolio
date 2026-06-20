"use client";
import CollectionEditor from "../CollectionEditor";
import { Field, Input, Textarea, NumberInput } from "../ui";
import MediaUpload from "../MediaUpload";

export default function TestimonialsEditor() {
  return (
    <CollectionEditor
      resource="testimonials"
      title="Testimonials"
      description="Client/colleague reviews with avatar, name, role and rating."
      blankItem={() => ({
        name: "New Person",
        role: "",
        quote: "",
        rating: 5,
        avatar: { type: "", url: "", publicId: "" },
        enabled: true,
      })}
      renderRow={(t) => ({
        title: t.name,
        subtitle: t.role,
        thumb: t.avatar?.url,
      })}
      renderForm={(t, patch) => (
        <>
          <div className="a-row">
            <Field label="Name">
              <Input value={t.name} onChange={(v) => patch({ name: v })} />
            </Field>
            <Field label="Role / Company">
              <Input value={t.role} onChange={(v) => patch({ role: v })} />
            </Field>
          </div>
          <Field label="Quote">
            <Textarea value={t.quote} onChange={(v) => patch({ quote: v })} />
          </Field>
          <Field label="Rating (0–5)">
            <NumberInput value={t.rating} min={0} max={5} onChange={(v) => patch({ rating: v })} />
          </Field>
          <MediaUpload label="Avatar" value={t.avatar} onChange={(m) => patch({ avatar: m })} accept="image/*" />
        </>
      )}
    />
  );
}
