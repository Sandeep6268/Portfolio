"use client";
import CollectionEditor from "../CollectionEditor";
import { Field, Input, NumberInput } from "../ui";
import IconField from "../IconField";
import Icon from "@/components/Icon";

export default function SkillsEditor() {
  return (
    <CollectionEditor
      resource="skills"
      title="Skills"
      description="Each skill icon is customizable — paste a react-icons name (e.g. SiReact, FaGithub) or an SVG URL."
      blankItem={() => ({ name: "New Skill", icon: "FiCode", level: 80, category: "", enabled: true })}
      renderRow={(s) => ({
        title: s.name,
        subtitle: `${s.level}%`,
        icon: <Icon name={s.icon} />,
      })}
      renderForm={(s, patch) => (
        <>
          <div className="a-row">
            <Field label="Name">
              <Input value={s.name} onChange={(v) => patch({ name: v })} />
            </Field>
            <Field label="Level (%)">
              <NumberInput value={s.level} min={0} max={100} onChange={(v) => patch({ level: v })} />
            </Field>
          </div>
          <Field label="Category (optional)" hint="e.g. Frontend, Backend">
            <Input value={s.category} onChange={(v) => patch({ category: v })} />
          </Field>
          <IconField value={s.icon} onChange={(v) => patch({ icon: v })} />
        </>
      )}
    />
  );
}
