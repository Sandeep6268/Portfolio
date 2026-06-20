"use client";
import { motion } from "framer-motion";

export default function Header({ siteName, subtitle }) {
  return (
    <motion.header
      className="site-header"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1>{siteName}</h1>
      <motion.p
        className="subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.5 }}
      >
        {subtitle}
      </motion.p>
    </motion.header>
  );
}
