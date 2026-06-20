"use client";

/**
 * Custom themed admin loader — an orbiting dual-ring spinner with the
 * Portfolio mark, used wherever an editor is fetching data.
 * Color follows the selected theme via --a-primary.
 */
export default function Loader({ label = "Loading", full = false }) {
  return (
    <div className={`a-loader ${full ? "full" : ""}`} role="status" aria-live="polite">
      <div className="a-loader-spinner">
        <span className="ring ring-1" />
        <span className="ring ring-2" />
        <span className="ring ring-3" />
        <span className="a-loader-dot" />
      </div>
      <span className="a-loader-label">
        {label}
        <span className="a-loader-dots"><i>.</i><i>.</i><i>.</i></span>
      </span>
    </div>
  );
}
