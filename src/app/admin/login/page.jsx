"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/components/admin/api";
import { Field, Input, Alert } from "@/components/admin/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/admin/login", { email, password });
      toast.success("Welcome back!");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <h1>
          Admin <span style={{ color: "var(--a-primary)" }}>Panel</span>
        </h1>
        <p className="muted">Sign in to manage your portfolio.</p>
        <Alert type="error">{error}</Alert>
        <Field label="Email">
          <Input
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            autoComplete="username"
            required
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </Field>
        <button className="a-btn" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
