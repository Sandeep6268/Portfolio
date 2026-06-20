"use client";
import CollectionEditor from "../CollectionEditor";
import { Field, Input, Textarea } from "../ui";
import IconField from "../IconField";
import Icon from "@/components/Icon";

export default function ServicesEditor() {
  return (
    <CollectionEditor
      resource="services"
      title="Services"
      description="The services you offer (icon + title + description)."
      blankItem={() => ({ title: "New Service", description: "", icon: "FiStar", enabled: true })}
      renderRow={(s) => ({
        title: s.title,
        subtitle: s.description?.slice(0, 60),
        icon: <Icon name={s.icon} />,
      })}
      renderForm={(s, patch) => (
        <>
          <Field label="Title">
            <Input value={s.title} onChange={(v) => patch({ title: v })} />
          </Field>
          <Field label="Description">
            <Textarea value={s.description} onChange={(v) => patch({ description: v })} />
          </Field>
          <IconField value={s.icon} onChange={(v) => patch({ icon: v })} />
        </>
      )}
    />
  );
}
