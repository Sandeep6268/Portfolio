"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

// WebGL sphere — client only
const TechSphere = dynamic(() => import("./TechSphere"), {
  ssr: false,
  loading: () => <div className="tech-sphere-wrap loading">Loading 3D…</div>,
});

/** A single tilt-on-mouse skill card for the grid below the sphere. */
function TiltSkill({ skill, index }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 16).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 16).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(px * 100 + 50).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100 + 50).toFixed(1)}%`);
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <motion.div
      ref={ref}
      className="skill-card-3d"
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 30, rotateX: -20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.05 }}
    >
      <div className="skill-card-3d-inner">
        <div className="skill-glow" />
        <div className="skill-ring" style={{ "--lvl": `${(skill.level || 0) * 3.6}deg` }}>
          <div className="skill-ring-icon">
            <Icon name={skill.icon} />
          </div>
        </div>
        <h4>{skill.name}</h4>
        <span className="skill-pct">{skill.level}%</span>
      </div>
    </motion.div>
  );
}

export default function Skills({ title, skills = [] }) {
  if (!skills.length) return null;

  return (
    <section id="skills" className="skills-section">
      <h2 className="section-title">{title || "Tech Stack"}</h2>

      <TechSphere skills={skills} />

      <div className="skills-grid-3d">
        {skills.map((skill, i) => (
          <TiltSkill key={skill._id || skill.name} skill={skill} index={i} />
        ))}
      </div>
    </section>
  );
}
