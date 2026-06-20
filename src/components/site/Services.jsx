"use client";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { FiStar } from "react-icons/fi";

export default function Services({ title, services = [] }) {
  if (!services.length) return null;
  return (
    <section id="services" className="services-section">
      <h2 className="section-title">{title || "What I Do"}</h2>
      <div className="services-grid">
        {services.map((s, i) => (
          <motion.div
            key={s._id || i}
            className="service-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <div className="service-icon">
              {s.icon ? <Icon name={s.icon} /> : <FiStar />}
            </div>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
