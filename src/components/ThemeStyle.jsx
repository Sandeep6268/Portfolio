/**
 * Server component that emits a <style> tag overriding the CSS theme
 * variables with the admin-configured theme. Rendered in <head> via layout
 * so colors apply before paint (no flash).
 */
export default function ThemeStyle({ theme = {} }) {
  const t = theme || {};
  const css = `:root{
    ${t.primary ? `--primary:${t.primary};` : ""}
    ${t.primaryLight ? `--primary-light:${t.primaryLight};` : ""}
    ${t.secondary ? `--secondary:${t.secondary};` : ""}
    ${t.accent ? `--accent:${t.accent};` : ""}
    ${t.text ? `--text:${t.text};` : ""}
    ${t.textLight ? `--text-light:${t.textLight};` : ""}
    ${t.bg ? `--bg:${t.bg};` : ""}
    ${t.cardBg ? `--card-bg:${t.cardBg};` : ""}
    ${t.border ? `--border:${t.border};` : ""}
    ${t.fontFamily ? `--font-family:${t.fontFamily};` : ""}
  }`.replace(/\s+/g, " ");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
