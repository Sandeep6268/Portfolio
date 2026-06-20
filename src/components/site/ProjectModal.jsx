"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight, FiX, FiPlay } from "react-icons/fi";

/**
 * Project popup with a large media viewer + thumbnail strip and full details.
 * Builds its media list from project.gallery (falling back to the cover media).
 */
export default function ProjectModal({ project, onClose }) {
  const media = (() => {
    const list = [];
    if (project.media?.url) list.push(project.media);
    (project.gallery || []).forEach((g) => {
      if (g?.url && g.url !== project.media?.url) list.push(g);
    });
    return list;
  })();

  const [index, setIndex] = useState(0);
  const count = media.length;
  const active = media[index];

  const next = useCallback(() => count && setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => count && setIndex((i) => (i - 1 + count) % count), [count]);

  // keyboard: Esc closes, arrows navigate; lock body scroll while open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [next, prev, onClose]);

  return (
    <motion.div
      className="pm-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="pm-dialog"
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 24, stiffness: 280 }}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        <div className="pm-header">
          <h3>{project.title}</h3>
          <div className="pm-spacer" />
          <button className="pm-close" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className="pm-body">
          {count > 0 && (
            <>
              <div className="pm-viewer">
                {active.type === "video" ? (
                  <video src={active.url} controls autoPlay muted loop playsInline />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={active.url} alt={active.caption || project.title} />
                )}
                {count > 1 && (
                  <>
                    <button className="pm-nav prev" onClick={prev} aria-label="Previous"><FiChevronLeft /></button>
                    <button className="pm-nav next" onClick={next} aria-label="Next"><FiChevronRight /></button>
                    <span className="pm-counter">{index + 1} / {count}</span>
                  </>
                )}
                {active.caption && <div className="pm-caption">{active.caption}</div>}
              </div>

              {count > 1 && (
                <div className="pm-thumbs">
                  {media.map((m, i) => (
                    <button
                      key={m.publicId || m.url || i}
                      className={`pm-thumb ${i === index ? "active" : ""}`}
                      onClick={() => setIndex(i)}
                      aria-label={`Media ${i + 1}`}
                    >
                      {m.type === "video" ? (
                        <>
                          <video src={m.url} muted />
                          <span className="play-badge"><FiPlay /></span>
                        </>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.url} alt="" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="pm-details">
            {project.desc && <p className="lead">{project.desc}</p>}

            {(project.github || project.live) && (
              <div className="pm-links">
                {project.github && (
                  <a className="btn btn-outline" href={project.github} target="_blank" rel="noopener noreferrer">
                    <FiGithub /> View Code
                  </a>
                )}
                {project.live && (
                  <a className="btn btn-primary" href={project.live} target="_blank" rel="noopener noreferrer">
                    <FiExternalLink /> Live Demo
                  </a>
                )}
              </div>
            )}

            {Array.isArray(project.features) && project.features.length > 0 && (
              <>
                <h4 className="pm-section-title">Key Features</h4>
                <ul className="pm-features">
                  {project.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </>
            )}

            {Array.isArray(project.tech) && project.tech.length > 0 && (
              <>
                <h4 className="pm-section-title">Tech Stack</h4>
                <div className="pm-tech">
                  {project.tech.map((t, i) => (
                    <span key={i}>{t}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
