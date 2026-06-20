"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

/**
 * Renders the admin-defined SEO content blocks (keyword-rich copy) and an
 * accordion FAQ. Shown above the footer. Both are optional.
 */
export default function SeoContent({ seo = {} }) {
  const blocks = (seo.contentBlocks || []).filter((b) => b.title || b.html);
  const faqs = (seo.faqs || []).filter((f) => f.question && f.answer);
  const [open, setOpen] = useState(0);

  if (!blocks.length && !faqs.length) return null;

  return (
    <section className="seo-content-section">
      {blocks.map((b, i) => (
        <motion.div
          key={i}
          className="seo-block"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {b.title && <h3>{b.title}</h3>}
          {b.html && <div className="seo-block-body" dangerouslySetInnerHTML={{ __html: b.html }} />}
        </motion.div>
      ))}

      {faqs.length > 0 && (
        <div className="seo-faq">
          <h2 className="section-title">FAQ</h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className={`faq-item ${open === i ? "open" : ""}`} key={i}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{f.question}</span>
                  <FiChevronDown className="faq-chevron" />
                </button>
                <div className="faq-a" style={{ maxHeight: open === i ? "500px" : "0" }}>
                  <p>{f.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
