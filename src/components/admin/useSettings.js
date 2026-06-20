"use client";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { api } from "./api";

/**
 * Loads the Settings singleton and provides a setter + save.
 * Each editor edits a slice of the same document; saving PUTs the whole thing.
 */
export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { settings } = await api.get("/api/admin/settings");
      setSettings(settings);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async (override) => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const payload = override || settings;
      const { settings: updated } = await api.put("/api/admin/settings", payload);
      setSettings(updated);
      setSaved(true);
      toast.success("Changes saved");
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message);
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }, [settings]);

  // helper to update a top-level field
  const set = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  // helper to update a nested object field e.g. setNested("hero", { heading })
  const setNested = useCallback((key, patch) => {
    setSettings((prev) => ({ ...prev, [key]: { ...(prev?.[key] || {}), ...patch } }));
  }, []);

  return { settings, setSettings, set, setNested, loading, saving, saved, error, save, reload: load };
}
