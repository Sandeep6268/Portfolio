"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSettings } from "../useSettings";
import { api } from "../api";
import { Field, Input, NumberInput, Toggle } from "../ui";
import SaveBar from "../SaveBar";
import Loader from "../Loader";

function PasswordCard() {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await api.post("/api/admin/password", { currentPassword: cur, newPassword: next });
      toast.success("Password updated");
      setCur("");
      setNext("");
    } catch (e) {
      toast.error(e.message || "Failed to update password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="a-card">
      <h3>Change Password</h3>
      <div className="a-row">
        <Field label="Current password">
          <Input type="password" value={cur} onChange={setCur} />
        </Field>
        <Field label="New password">
          <Input type="password" value={next} onChange={setNext} />
        </Field>
      </div>
      <button className="a-btn" onClick={submit} disabled={busy || !next}>
        {busy ? "Updating…" : "Update password"}
      </button>
    </div>
  );
}

export default function SettingsEditor() {
  const { settings, setNested, loading, saving, saved, error, save } = useSettings();
  if (loading || !settings) return <Loader />;
  const smtp = settings.smtp || {};

  return (
    <div>
      <PasswordCard />

      <div className="a-card">
        <h3>Email (SMTP) Settings</h3>
        <p className="section-desc">
          Contact form notifications are sent via these settings. Leave blank to use the server defaults from your environment.
        </p>
        <div className="a-row">
          <Field label="SMTP host">
            <Input value={smtp.host} onChange={(v) => setNested("smtp", { host: v })} placeholder="smtp.gmail.com" />
          </Field>
          <Field label="SMTP port">
            <NumberInput value={smtp.port} onChange={(v) => setNested("smtp", { port: v })} placeholder="587" />
          </Field>
        </div>
        <div className="a-field">
          <Toggle label="Use SSL/TLS (secure)" checked={!!smtp.secure} onChange={(v) => setNested("smtp", { secure: v })} />
        </div>
        <div className="a-row">
          <Field label="SMTP user">
            <Input value={smtp.user} onChange={(v) => setNested("smtp", { user: v })} />
          </Field>
          <Field label="SMTP password / app password">
            <Input type="password" value={smtp.pass} onChange={(v) => setNested("smtp", { pass: v })} />
          </Field>
        </div>
        <div className="a-row">
          <Field label="From email">
            <Input value={smtp.fromEmail} onChange={(v) => setNested("smtp", { fromEmail: v })} />
          </Field>
          <Field label="Notify (receive messages at)" hint="Defaults to your contact email.">
            <Input value={smtp.notifyEmail} onChange={(v) => setNested("smtp", { notifyEmail: v })} />
          </Field>
        </div>
      </div>

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
