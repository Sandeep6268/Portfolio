"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiHome, FiUser, FiBriefcase, FiCode, FiClock, FiGrid,
  FiStar, FiMail, FiSettings, FiLogOut, FiMenu, FiExternalLink, FiSearch,
} from "react-icons/fi";
import { api } from "@/components/admin/api";

import GeneralEditor from "@/components/admin/editors/GeneralEditor";
import HeroEditor from "@/components/admin/editors/HeroEditor";
import AboutEditor from "@/components/admin/editors/AboutEditor";
import ProjectsEditor from "@/components/admin/editors/ProjectsEditor";
import SkillsEditor from "@/components/admin/editors/SkillsEditor";
import ExperienceEditor from "@/components/admin/editors/ExperienceEditor";
import ServicesEditor from "@/components/admin/editors/ServicesEditor";
import TestimonialsEditor from "@/components/admin/editors/TestimonialsEditor";
import ContactEditor from "@/components/admin/editors/ContactEditor";
import ThemeEditor from "@/components/admin/editors/ThemeEditor";
import SectionsEditor from "@/components/admin/editors/SectionsEditor";
import SeoEditor from "@/components/admin/editors/SeoEditor";
import MessagesEditor from "@/components/admin/editors/MessagesEditor";
import SettingsEditor from "@/components/admin/editors/SettingsEditor";

const TABS = [
  { key: "general", label: "General", icon: <FiHome />, group: "Content" },
  { key: "hero", label: "Hero", icon: <FiGrid />, group: "Content" },
  { key: "about", label: "About", icon: <FiUser />, group: "Content" },
  { key: "projects", label: "Projects", icon: <FiBriefcase />, group: "Content" },
  { key: "skills", label: "Skills", icon: <FiCode />, group: "Content" },
  { key: "experience", label: "Experience", icon: <FiClock />, group: "Content" },
  { key: "services", label: "Services", icon: <FiStar />, group: "Content" },
  { key: "testimonials", label: "Testimonials", icon: <FiStar />, group: "Content" },
  { key: "contact", label: "Contact", icon: <FiMail />, group: "Content" },
  { key: "sections", label: "Sections & Order", icon: <FiGrid />, group: "Layout" },
  { key: "theme", label: "Theme & Effects", icon: <FiSettings />, group: "Layout" },
  { key: "seo", label: "SEO", icon: <FiSearch />, group: "Layout" },
  { key: "messages", label: "Messages", icon: <FiMail />, group: "Admin" },
  { key: "settings", label: "Settings", icon: <FiSettings />, group: "Admin" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("general");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [me, setMe] = useState(null);

  useEffect(() => {
    api.get("/api/admin/me").then(setMe).catch(() => router.replace("/admin/login"));
    refreshUnread();
  }, []);

  const refreshUnread = () => {
    api.get("/api/admin/messages").then((r) => setUnread(r.unread || 0)).catch(() => {});
  };

  const logout = async () => {
    await api.post("/api/admin/logout", {});
    router.replace("/admin/login");
    router.refresh();
  };

  const groups = ["Content", "Layout", "Admin"];
  const current = TABS.find((t) => t.key === tab);

  const renderEditor = () => {
    switch (tab) {
      case "general": return <GeneralEditor />;
      case "hero": return <HeroEditor />;
      case "about": return <AboutEditor />;
      case "projects": return <ProjectsEditor />;
      case "skills": return <SkillsEditor />;
      case "experience": return <ExperienceEditor />;
      case "services": return <ServicesEditor />;
      case "testimonials": return <TestimonialsEditor />;
      case "contact": return <ContactEditor />;
      case "sections": return <SectionsEditor />;
      case "theme": return <ThemeEditor />;
      case "seo": return <SeoEditor />;
      case "messages": return <MessagesEditor onChange={refreshUnread} />;
      case "settings": return <SettingsEditor />;
      default: return null;
    }
  };

  return (
    <div className="admin-shell">
      <div
        className={`sidebar-backdrop ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-brand">
          Portfolio<span>Admin</span>
        </div>
        <nav className="admin-nav">
          {groups.map((g) => (
            <div key={g}>
              <div style={{ color: "var(--a-muted)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 1, padding: "0.9rem 0.8rem 0.3rem" }}>
                {g}
              </div>
              {TABS.filter((t) => t.group === g).map((t) => (
                <button
                  key={t.key}
                  className={tab === t.key ? "active" : ""}
                  onClick={() => { setTab(t.key); setSidebarOpen(false); }}
                >
                  {t.icon}
                  <span>{t.label}</span>
                  {t.key === "messages" && unread > 0 && <span className="badge">{unread}</span>}
                </button>
              ))}
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--a-border)", margin: "0.8rem 0", paddingTop: "0.5rem" }}>
            <button onClick={logout}>
              <FiLogOut /> <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen((s) => !s)}>
              <FiMenu />
            </button>
            <h2>{current?.label}</h2>
          </div>
          <a className="a-btn ghost small" href="/" target="_blank" rel="noopener noreferrer">
            <FiExternalLink /> View site
          </a>
        </div>
        <div className="admin-content">{renderEditor()}</div>
      </main>
    </div>
  );
}
