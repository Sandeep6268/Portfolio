"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import Icon from "@/components/Icon";
import SuccessModal from "./SuccessModal";

function ContactForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send message.");
      toast.success("Message sent! I'll get back to you soon.");
      setShowSuccess(true);
      form.reset();
    } catch (err) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        className="contact-form"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="form-group">
          <input type="text" name="name" placeholder="Your Name" required />
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder="Your Email" required />
        </div>
        <div className="form-group">
          <input type="text" name="subject" placeholder="Subject" />
        </div>
        <div className="form-group">
          <textarea name="message" placeholder="Your Message" required></textarea>
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="spinner-container">
              <div className="spinner"></div>
              <span>Sending...</span>
            </div>
          ) : (
            "Send Message"
          )}
        </motion.button>
      </motion.form>
      <AnimatePresence>
        {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      </AnimatePresence>
    </>
  );
}

export default function Contact({ title, contact = {}, socialLinks = [] }) {
  const socials = socialLinks.filter((s) => s.enabled !== false && s.url);
  return (
    <section id="contact" className="contact-section">
      <h2 className="section-title">{title || "Get In Touch"}</h2>
      <div className="contact-container">
        <div className="contact-info">
          <h3>{contact.heading || "Let's work together"}</h3>
          <p>{contact.body}</p>
          <div className="contact-details">
            {contact.email && (
              <a href={`mailto:${contact.email}`}>
                <FiMail /> {contact.email}
              </a>
            )}
            {contact.phone && (
              <a href={`tel:${contact.phone}`}>
                <FiPhone /> {contact.phone}
              </a>
            )}
            {contact.location && (
              <span className="contact-line">
                <FiMapPin /> {contact.location}
              </span>
            )}
            {socials.length > 0 && (
              <div className="social-links">
                {socials.map((s, i) => (
                  <a key={s._id || i} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <Icon name={s.icon} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
