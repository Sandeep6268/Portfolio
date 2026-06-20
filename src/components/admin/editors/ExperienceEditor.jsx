"use client";
import CollectionEditor from "../CollectionEditor";
import { Field, Input, Textarea, Select } from "../ui";
import IconField from "../IconField";
import Icon from "@/components/Icon";

export default function ExperienceEditor() {
  return (
    <CollectionEditor
      resource="experiences"
      title="Experience & Education"
      description="Timeline entries for your work history or education."
      blankItem={() => ({
        role: "New Role",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        type: "work",
        icon: "FiBriefcase",
        enabled: true,
      })}
      renderRow={(e) => ({
        title: e.role,
        subtitle: [e.company, `${e.startDate}${e.endDate ? " – " + e.endDate : ""}`].filter(Boolean).join(" • "),
        icon: <Icon name={e.icon} />,
      })}
      renderForm={(e, patch) => (
        <>
          <div className="a-row">
            <Field label="Role / Title">
              <Input value={e.role} onChange={(v) => patch({ role: v })} />
            </Field>
            <Field label="Company / School">
              <Input value={e.company} onChange={(v) => patch({ company: v })} />
            </Field>
          </div>
          <div className="a-row-3">
            <Field label="Location">
              <Input value={e.location} onChange={(v) => patch({ location: v })} />
            </Field>
            <Field label="Start">
              <Input value={e.startDate} onChange={(v) => patch({ startDate: v })} placeholder="Jan 2024" />
            </Field>
            <Field label="End">
              <Input value={e.endDate} onChange={(v) => patch({ endDate: v })} placeholder="Present" />
            </Field>
          </div>
          <Field label="Type">
            <Select
              value={e.type}
              onChange={(v) => patch({ type: v })}
              options={[
                { value: "work", label: "Work" },
                { value: "education", label: "Education" },
              ]}
            />
          </Field>
          <Field label="Description">
            <Textarea value={e.description} onChange={(v) => patch({ description: v })} />
          </Field>
          <IconField value={e.icon} onChange={(v) => patch({ icon: v })} />
        </>
      )}
    />
  );
}
