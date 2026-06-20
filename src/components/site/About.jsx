"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { FiCheckCircle, FiDownload } from "react-icons/fi";
import Media from "@/components/Media";

const FloatingShapes = dynamic(() => import("./FloatingShapes"), { ssr: false });

function initialsOf(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "ME";
}

export default function About({ title, about = {}, name = "" }) {
  const frameRef = useRef(null);

  const onMove = (e) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 18).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 18).toFixed(2)}deg`);
  };
  const reset = () => {
    const el = frameRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const hasMedia = !!about.media?.url;

  return (
    <section id="about" className="about-section about-3d">
      <div className="about-shapes" aria-hidden="true">
        <FloatingShapes />
      </div>

      <h2 className="section-title">{title || about.heading || "About Me"}</h2>

      <div className="about-grid-3d">
        {/* LEFT visual — uploaded media OR an animated monogram orb */}
        <div className="about-visual" onMouseMove={onMove} onMouseLeave={reset}>
          <motion.div
            ref={frameRef}
            className={`about-media-frame ${hasMedia ? "" : "orb"}`}
            initial={{ opacity: 0, scale: 0.85, rotateY: -25 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="about-media-glow" />
            {hasMedia ? (
              <>
                <Media media={about.media} alt="About" />
                <div className="about-media-shine" />
              </>
            ) : (
              <div className="about-monogram">
                <span className="ring ring-1" />
                <span className="ring ring-2" />
                <span className="ring ring-3" />
                <span className="mono-text">{initialsOf(name)}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT — glass card with bio + highlights */}
        <motion.div
          className="about-card-3d"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="about-body">{about.body}</p>

          {Array.isArray(about.highlights) && about.highlights.length > 0 && (
            <ul className="about-highlights-3d">
              {about.highlights.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.12 }}
                >
                  <span className="hl-check"><FiCheckCircle /></span>
                  <span>{h}</span>
                </motion.li>
              ))}
            </ul>
          )}

          {about.resumeUrl && (
            <motion.a
              className="btn btn-primary resume-btn"
              href={about.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <FiDownload /> Download Resume
            </motion.a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
