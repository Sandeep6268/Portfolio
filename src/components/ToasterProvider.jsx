"use client";
import { Toaster } from "react-hot-toast";

/**
 * App-wide toast container, themed to match the dark UI.
 * Mounted once in the root layout (covers public site + admin).
 */
export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: "#1e1e1e",
          color: "#f0f0f0",
          border: "1px solid #333333",
          borderRadius: "12px",
          fontSize: "0.92rem",
          boxShadow: "0 10px 30px rgba(0,0,0,.4)",
        },
        success: { iconTheme: { primary: "#8189ff", secondary: "#fff" } },
        error: { iconTheme: { primary: "#ff6b6b", secondary: "#fff" } },
      }}
    />
  );
}
