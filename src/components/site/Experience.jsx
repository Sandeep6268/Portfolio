"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Icon from "@/components/Icon";
import { FiBriefcase } from "react-icons/fi";

function TimelineCard({ exp, index }) {
  const ref = useRef(null);
  const side = index % 2 === 0 ? "left" : "right";

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 12).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 12).toFixed(2)}deg`);
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div className={`tl3d-item ${side}`}>
      <motion.div
        className="tl3d-node"
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
      >
        {exp.icon ? <Icon name={exp.icon} /> : <FiBriefcase />}
      </motion.div>

      <motion.div
        ref={ref}
        className="tl3d-card"
        onMouseMove={onMove}
        onMouseLeave={reset}
        initial={{ opacity: 0, x: side === "left" ? -90 : 90, rotateY: side === "left" ? 25 : -25 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="tl3d-card-inner">
          {exp.type && <span className="tl3d-type">{exp.type === "education" ? "Education" : "Work"}</span>}
          <h3>{exp.role}</h3>
          <div className="tl3d-meta">
            {[exp.company, exp.location].filter(Boolean).join(" • ")}
          </div>
          {(exp.startDate || exp.endDate) && (
            <div className="tl3d-date">
              {exp.startDate}
              {exp.endDate ? ` — ${exp.endDate}` : ""}
            </div>
          )}
          {exp.description && <p>{exp.description}</p>}
        </div>
      </motion.div>
    </div>
  );
}

export default function Experience({ title, experiences = [] }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const fillHeight = useTransform(fill, [0, 1], ["0%", "100%"]);

  if (!experiences.length) return null;

  return (
    <section id="experience" className="experience-section">
      <h2 className="section-title">{title || "Experience"}</h2>
      <div className="tl3d" ref={containerRef}>
        <div className="tl3d-line">
          <motion.div className="tl3d-line-fill" style={{ height: fillHeight }} />
        </div>
        {experiences.map((exp, i) => (
          <TimelineCard key={exp._id || i} exp={exp} index={i} />
        ))}
      </div>
    </section>
  );
}
