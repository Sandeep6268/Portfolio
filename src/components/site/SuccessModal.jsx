"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function SuccessModal({ onClose }) {
  const modalRef = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        ref={modalRef}
        className="success-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="modal-icon">
          <svg viewBox="0 0 24 24">
            <motion.path
              fill="none"
              strokeWidth="2"
              stroke="var(--primary)"
              strokeLinecap="round"
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </svg>
        </div>
        <h3>Message Sent Successfully!</h3>
        <p>Thank you for reaching out. I&apos;ll get back to you soon.</p>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="modal-close-btn"
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
