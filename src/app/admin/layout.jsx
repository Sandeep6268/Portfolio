import "./admin.css";
import { ConfirmProvider } from "@/components/admin/ConfirmProvider";
import { getSettings } from "@/lib/getData";

export const metadata = {
  title: "Admin — Portfolio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  // Pull the selected theme so the admin accent + scrollbars follow it.
  let t = {};
  try {
    const settings = await getSettings();
    t = settings.theme || {};
  } catch {}

  const css = `.admin-root{
    ${t.primary ? `--a-primary:${t.primary};` : ""}
    ${t.secondary ? `--a-primary-2:${t.secondary};` : ""}
    ${t.primaryLight ? `--a-primary-light:${t.primaryLight};` : ""}
  }`.replace(/\s+/g, " ");

  return (
    <div className="admin-root">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <ConfirmProvider>{children}</ConfirmProvider>
    </div>
  );
}
