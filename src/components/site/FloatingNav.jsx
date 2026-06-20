"use client";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

export default function FloatingNav({ items = [], activeSection }) {
  const visible = items.filter((i) => i.enabled !== false && i.href);
  if (!visible.length) return null;

  return (
    <motion.nav
      className="floating-nav"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      {visible.map((item, index) => {
        const target = item.href.startsWith("#") ? item.href.substring(1) : "";
        return (
          <motion.a
            key={item._id || index}
            href={item.href}
            className={`nav-item ${activeSection === target ? "active" : ""}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={item.label}
          >
            <Icon name={item.icon} />
            <span className="nav-tooltip">{item.label}</span>
          </motion.a>
        );
      })}
    </motion.nav>
  );
}
