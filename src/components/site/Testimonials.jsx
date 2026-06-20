"use client";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

export default function Testimonials({ title, testimonials = [] }) {
  if (!testimonials.length) return null;
  return (
    <section id="testimonials" className="testimonials-section">
      <h2 className="section-title">{title || "Testimonials"}</h2>
      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <motion.div
            key={t._id || i}
            className="testimonial-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <div className="testimonial-stars">
              {Array.from({ length: Math.max(0, Math.min(5, t.rating || 5)) }).map((_, k) => (
                <FiStar key={k} fill="currentColor" />
              ))}
            </div>
            <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
            <div className="testimonial-author">
              {t.avatar?.url && <img src={t.avatar.url} alt={t.name} />}
              <div>
                <div className="name">{t.name}</div>
                {t.role && <div className="role">{t.role}</div>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
