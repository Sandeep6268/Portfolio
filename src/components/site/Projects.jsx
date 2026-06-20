"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMaximize2, FiImage } from "react-icons/fi";
import Media from "@/components/Media";
import ProjectModal from "./ProjectModal";

export default function Projects({ title, projects = [] }) {
  const [active, setActive] = useState(null);
  if (!projects.length) return null;

  return (
    <section id="projects" className="projects-section">
      <h2 className="section-title">{title || "Featured Work"}</h2>
      <div className="projects-grid">
        {projects.map((project, index) => {
          const cover = project.media?.url ? project.media : project.gallery?.[0];
          const mediaCount =
            (project.media?.url ? 1 : 0) +
            (project.gallery?.filter((g) => g?.url && g.url !== project.media?.url).length || 0);

          return (
            <motion.button
              type="button"
              key={project._id || project.title}
              className="project-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 + 0.1 }}
              onClick={() => setActive(project)}
              aria-label={`Open ${project.title}`}
            >
              <div className="project-image">
                {cover?.url ? (
                  <Media media={cover} alt={project.title} />
                ) : null}
                {project.featured && <span className="project-badge">Featured</span>}
                {mediaCount > 1 && (
                  <span className="project-media-count">
                    <FiImage size={12} /> {mediaCount}
                  </span>
                )}
                <div className="project-overlay">
                  <span className="view-hint">
                    <FiMaximize2 size={14} /> View details
                  </span>
                </div>
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                {project.desc && <p className="project-desc">{project.desc}</p>}
                {Array.isArray(project.tech) && project.tech.length > 0 && (
                  <div className="tech-tags">
                    {project.tech.slice(0, 4).map((tech, i) => (
                      <span key={i}>{tech}</span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="more">+{project.tech.length - 4}</span>
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
