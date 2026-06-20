"use client";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";

const ConfirmContext = createContext(null);

/**
 * Promise-based confirmation dialog provider.
 * Usage: const confirm = useConfirm();
 *        if (await confirm({ title, message, confirmText, danger })) { ... }
 */
export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null); // { options } | null
  const resolver = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolver.current = resolve;
      setState({
        title: options.title || "Are you sure?",
        message: options.message || "This action cannot be undone.",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        danger: options.danger !== false, // default destructive style
      });
    });
  }, []);

  const close = useCallback((result) => {
    resolver.current?.(result);
    resolver.current = null;
    setState(null);
  }, []);

  // Esc cancels, Enter confirms while open
  useEffect(() => {
    if (!state) return;
    const onKey = (e) => {
      if (e.key === "Escape") close(false);
      else if (e.key === "Enter") close(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [state, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {state && (
              <motion.div
                className="confirm-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={(e) => e.target === e.currentTarget && close(false)}
              >
                <motion.div
                  className="confirm-dialog"
                  initial={{ scale: 0.92, opacity: 0, y: 16 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.92, opacity: 0, y: 16 }}
                  transition={{ type: "spring", damping: 24, stiffness: 300 }}
                  role="alertdialog"
                  aria-modal="true"
                >
                  <div className={`confirm-icon ${state.danger ? "danger" : ""}`}>
                    <FiAlertTriangle />
                  </div>
                  <h3>{state.title}</h3>
                  <p>{state.message}</p>
                  <div className="confirm-actions">
                    <button className="a-btn ghost" onClick={() => close(false)} autoFocus>
                      {state.cancelText}
                    </button>
                    <button
                      className={`a-btn ${state.danger ? "danger-solid" : ""}`}
                      onClick={() => close(true)}
                    >
                      {state.confirmText}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    // Fallback to native confirm if provider isn't mounted (shouldn't happen in admin)
    return async (opts = {}) =>
      window.confirm(opts.message || opts.title || "Are you sure?");
  }
  return ctx;
}
