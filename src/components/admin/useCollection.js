"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "./api";

/**
 * Generic CRUD state for an admin collection resource
 * (projects | skills | experiences | services | testimonials).
 */
export function useCollection(resource) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await api.get(`/api/admin/${resource}`);
      setItems(items);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(async (data) => {
    setBusy(true);
    try {
      const { item } = await api.post(`/api/admin/${resource}`, data);
      setItems((prev) => [...prev, item]);
      setError("");
      toast.success("Item added");
      return item;
    } catch (e) {
      setError(e.message);
      toast.error(e.message || "Failed to add item");
      throw e;
    } finally {
      setBusy(false);
    }
  }, [resource]);

  const update = useCallback(async (id, data) => {
    setBusy(true);
    try {
      const { item } = await api.put(`/api/admin/${resource}/${id}`, data);
      setItems((prev) => prev.map((it) => (it._id === id ? item : it)));
      setError("");
      return item;
    } catch (e) {
      setError(e.message);
      toast.error(e.message || "Failed to save");
      throw e;
    } finally {
      setBusy(false);
    }
  }, [resource]);

  const remove = useCallback(async (id) => {
    setBusy(true);
    try {
      await api.del(`/api/admin/${resource}/${id}`);
      setItems((prev) => prev.filter((it) => it._id !== id));
      setError("");
      toast.success("Item deleted");
    } catch (e) {
      setError(e.message);
      toast.error(e.message || "Failed to delete");
    } finally {
      setBusy(false);
    }
  }, [resource]);

  const reorder = useCallback(async (ids) => {
    setItems((prev) => {
      const map = Object.fromEntries(prev.map((p) => [p._id, p]));
      return ids.map((id) => map[id]).filter(Boolean);
    });
    try {
      await api.post(`/api/admin/reorder/${resource}`, { ids });
    } catch (e) {
      setError(e.message);
    }
  }, [resource]);

  return { items, setItems, loading, error, busy, create, update, remove, reorder, reload: load };
}
