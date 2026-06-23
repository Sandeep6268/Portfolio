"use client";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

export default function FloatingNav({ items = [], activeSection }) {
  const visible = items.filter((i) => i.enabled !== false && i.href);
  if (!visible.length) return null;

  return (
    <motion.nav
      className="floating-nav"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      {visible.map((item, index) => {
        const target = item.href.startsWith("#") ? item.href.substring(1) : "";
        const active = activeSection === target;
        return (
          <motion.a
            key={item._id || index}
            href={item.href}
            className={`nav-item ${active ? "active" : ""}`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={item.label}
          >
            {/* sliding highlight pill (Telegram-style) — shared layout across items */}
            {active && (
              <motion.span
                className="nav-pill"
                layoutId="nav-pill"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="nav-icon"><Icon name={item.icon} /></span>
            <span className="nav-label">{item.label}</span>
            <span className="nav-tooltip">{item.label}</span>
          </motion.a>
        );
      })}
    </motion.nav>
  );
}
