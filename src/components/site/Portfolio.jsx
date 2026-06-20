"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Header from "./Header";
import FloatingNav from "./FloatingNav";
import Hero from "./Hero";
import About from "./About";
import Projects from "./Projects";
import Skills from "./Skills";
import Experience from "./Experience";
import Services from "./Services";
import Testimonials from "./Testimonials";
import Contact from "./Contact";
import SeoContent from "./SeoContent";

/**
 * Client orchestrator for the public portfolio. Receives all data as props
 * (fetched on the server). Renders sections in the admin-configured order,
 * skipping any section that is disabled.
 */
export default function Portfolio({ data }) {
  const { settings, projects, skills, experiences, services, testimonials } = data;
  const [activeSection, setActiveSection] = useState("home");

  // scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const scrollPosition = window.scrollY + 200;
      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveSection(section.id);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // section visibility + order, keyed by section config
  const sectionConfig = {};
  (settings.sections || []).forEach((s) => {
    sectionConfig[s.key] = s;
  });
  const isEnabled = (key) => sectionConfig[key]?.enabled !== false;
  const titleFor = (key, fallback) => sectionConfig[key]?.title || fallback;

  // build ordered list of section keys
  const ordered = [...(settings.sections || [])]
    .filter((s) => s.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((s) => s.key);

  const renderSection = (key) => {
    switch (key) {
      case "hero":
        return <Hero key="hero" hero={settings.hero} services={services} />;
      case "about":
        return <About key="about" title={titleFor("about")} about={settings.about} name={settings.siteName} />;
      case "projects":
        return <Projects key="projects" title={titleFor("projects")} projects={projects} />;
      case "skills":
        return <Skills key="skills" title={titleFor("skills")} skills={skills} />;
      case "experience":
        return <Experience key="experience" title={titleFor("experience")} experiences={experiences} />;
      case "services":
        return <Services key="services" title={titleFor("services")} services={services} />;
      case "testimonials":
        return <Testimonials key="testimonials" title={titleFor("testimonials")} testimonials={testimonials} />;
      case "contact":
        return (
          <Contact
            key="contact"
            title={titleFor("contact")}
            contact={settings.contact}
            socialLinks={settings.socialLinks}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="portfolio">
      <Header siteName={settings.siteName} subtitle={settings.subtitle} />
      <FloatingNav items={settings.navItems} activeSection={activeSection} />

      {ordered.map((key) => renderSection(key))}

      <SeoContent seo={settings.seo} />

      {settings.footerText && (
        <footer className="site-footer">{settings.footerText}</footer>
      )}

      <motion.button
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        aria-label="Back to top"
      >
        ↑
      </motion.button>
    </div>
  );
}
