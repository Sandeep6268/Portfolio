import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
window.THREE = THREE;

import {
  FiGithub,
  FiExternalLink,
  FiMail,
  FiLinkedin,
  FiInstagram,
  FiUser,
  FiCode,
  FiBriefcase,
  FiMessageSquare,
} from "react-icons/fi";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars } from "@react-three/drei";
import gsap from "gsap";
import emailjs from "emailjs-com";
import "./App.css";

const App = () => {
  const [activeSection, setActiveSection] = useState("home");
  const heroRef = useRef(null);
  const sphereRef = useRef();

  // Skills data
  // Updated skills data in the App component
  const skills = [
    { name: "HTML5", icon: <FiCode />, level: 95 },
    { name: "CSS3", icon: <FiCode />, level: 90 },
    { name: "JavaScript", icon: <FiCode />, level: 90 },
    { name: "React js", icon: <FiCode />, level: 85 },
    { name: "Bootstrap", icon: <FiCode />, level: 80 },
    { name: "Python", icon: <FiCode />, level: 80 },
    { name: "Django", icon: <FiCode />, level: 75 },
    { name: "SQL", icon: <FiCode />, level: 80 },
    { name: "Next.js", icon: <FiCode />, level: 70 },
    { name: "Firebase", icon: <FiCode />, level: 75 },
    { name: "Razorpay", icon: <FiCode />, level: 70 },
    { name: "Git", icon: <FiCode />, level: 85 },
  ];

  // Animation effects
  useEffect(() => {
    // if (!mounted) return;

    // Hero text animation
    gsap.from(".hero-text h2", {
      duration: 1.5,
      y: 50,
      opacity: 0,
      ease: "power3.out",
      delay: 0.3,
    });

    gsap.from(".hero-text p", {
      duration: 1.5,
      y: 50,
      opacity: 0,
      ease: "power3.out",
      delay: 0.5,
    });

    // Stats counter animation
    const statNumbers = document.querySelectorAll(".stat-number");
    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute("data-target"));
      let count = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const updateCount = () => {
        count += increment;
        if (count < target) {
          el.textContent = Math.floor(count);
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = target;
        }
      };

      updateCount();
    });

    // Scroll animations
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        duration: 1,
      });
    });
  }, []);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Projects data
  const projects = [
    {
  title: "RS Clothing - Full Stack ",
  desc: "Advanced clothing e-commerce platform with complete shopping experience",
  tech: ["React", "Django", "PostgreSQL", "Cloudinary", "Firebase", "Razorpay"],
  github: "https://github.com/Sandeep6268/ecco-font",
  live: "https://ecco-font.vercel.app/",
  image: "/clothing.png", // Make sure this image exists in your public folder
  features: [
    "React frontend with responsive design",
    "Django REST framework backend",
    "Neon PostgreSQL database integration",
    "Cloudinary CDN for product images",
    "Firebase authentication (Email/Google)",
    "Razorpay payment gateway integration",
    "Advanced product filtering system",
    "Admin dashboard for inventory",
    "Contact form with email support",
  ]
},
    {
      title: "YouTube Clone",
      desc: "A full-featured YouTube clone with video streaming, search, and channel functionality",
      tech: ["React", "Material UI", "Google Cloud Console"],
      github: "https://github.com/Sandeep6268/youtubeclone",
      live: "https://sandeep6268.github.io/youtubeclone/", // Add your live URL here if deployed
      image: "/yt.png",
      features: [
        "Video streaming and playback functionality",
        "Advanced search",
        "Subscriber counts",
        "Responsive design for all devices",
        "Comment section with replies",
        "Expand and Collapse toggle",
      ],
    },
    {
      title: "WEAS E-Commerce By (JS)",
      desc: "Pure JavaScript e-commerce platform with PhonePe payment integration",
      tech: ["JavaScript", "PHP", "PhonePe API", "HTML5", "CSS3", "Bootstrap"],
      github: "#", // Add GitHub link if available
      live: "https://weas.in/", // Add live URL if available
      image: "/weas.png", // Add your screenshot path
      features: [
        "Vanilla JavaScript frontend",
        "PhonePe payment gateway integration via PHP backend",
        "Product catalog with categories",
        "Shopping cart system",
        "Order tracking",
        "Admin dashboard",
        "Responsive mobile design",
      ],
    },
  ];

  // FloatingNav component
  const FloatingNav = () => {
    const navItems = [
      { icon: <FiUser />, label: "About", href: "#home" },
      { icon: <FiBriefcase />, label: "Work", href: "#projects" },
      { icon: <FiCode />, label: "Skills", href: "#skills" },
      { icon: <FiMessageSquare />, label: "Contact", href: "#contact" },
    ];

    return (
      <motion.nav
        className="floating-nav"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        {navItems.map((item, index) => (
          <motion.a
            key={index}
            href={item.href}
            className={`nav-item ${
              activeSection === item.href.substring(1) ? "active" : ""
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={item.label}
          >
            {item.icon}
            <span className="nav-tooltip">{item.label}</span>
          </motion.a>
        ))}
      </motion.nav>
    );
  };

  // AnimatedSphere component
  const AnimatedSphere = () => {
    useFrame(({ clock }) => {
      if (sphereRef.current) {
        sphereRef.current.rotation.x = clock.getElapsedTime() * 0.1;
        sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      }
    });

    return (
      <Sphere args={[1, 32, 32]} ref={sphereRef}>
        <meshStandardMaterial
          color={`#8189ff" : "#646cff`}
          roughness={0.2}
          metalness={` 0.7 : 0.3`}
          emissive={`#3a3f8f" `}
          emissiveIntensity={` 0.5 `}
        />
      </Sphere>
    );
  };

  return (
    <>
      {/* 3D Model Background - Now fixed */}
      <motion.div
        className="hero-image-fixed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1 }}
      >
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <Stars radius={100} depth={50} count={5000} factor={4} />

          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={`1 `}
            enablePan={false}
          />
          {/* <AnimatedSphere /> */}
        </Canvas>
        <div className="glow-effect"></div>
      </motion.div>
      <div className={`portfolio dark`}>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Sandeep Singh Khicchi</h1>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.5 }}
          >
            Full Stack Developer | Problem Solver
          </motion.p>
        </motion.header>

        {/* Floating Navigation */}
        <FloatingNav />

        {/* Hero Section */}
        <section id="home" className="hero" ref={heroRef}>
          <div className="hero-content">
            <div className="hero-text">
              <h2>Building Digital Experiences That Matter</h2>
              <p>
                I specialize in creating responsive, performant web applications
                with modern technologies. With 1+ years of experience, I bring
                both technical expertise and creative problem-solving to every
                project.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number" data-target="20">
                    0
                  </span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat">
                  <span className="stat-number" data-target="8">
                    0
                  </span>
                  <span className="stat-label">Clients</span>
                </div>
                <div className="stat">
                  <span className="stat-number" data-target="1">
                    0
                  </span>
                  <span className="stat-label">Years Exp</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects-section">
          <h2 className="section-title">Featured Work</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                className="project-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -10 }}
              >
                <div
                  className="project-image"
                  style={{ backgroundImage: `url(${project.image})` }}
                >
                  <div className="project-links">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiGithub />
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiExternalLink />
                      </a>
                    )}
                  </div>
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>
                  <div className="project-features">
                    <h4>Key Features:</h4>
                    <ul>
                      {project.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="tech-tags">
                    {project.tech.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="skills-section">
          <h2 className="section-title">Tech Stack</h2>
          <div className="skills-grid">
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                className="skill-item"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="skill-icon">{skill.icon}</div>
                <div className="skill-info">
                  <h4>{skill.name}</h4>
                  <div className="skill-bar">
                    <motion.div
                      className="skill-progress"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                  <span className="skill-level">{skill.level}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-container">
            <div className="contact-info">
              <h3>Let's work together</h3>
              <p>
                I'm currently available for freelance work or full-time
                positions. Feel free to reach out for project discussions or
                just to say hello!
              </p>
              <div className="contact-details">
                <a href="mailto:sandeepsinghkhicchi@gmail.com">
                  <FiMail /> sandeepsinghkhicchi@gmail.com
                </a>
                <div className="social-links">
                  <a
                    href="http://linkedin.com/in/sandeep-singh-khicchi-70440b2a5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiLinkedin />
                  </a>
                  <a
                    href="https://www.instagram.com/sandybannarajput/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiInstagram />
                  </a>
                  <a
                    href="https://github.com/Sandeep6268"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiGithub />
                  </a>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>

        {/* Back to Top Button */}
        <motion.button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ↑
        </motion.button>
      </div>
    </>
  );
};

const SuccessModal = ({ onClose }) => {
  const modalRef = useRef();

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
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
        className={`success-modal dark`}
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
              stroke={`#8189ff `}
              strokeLinecap="round"
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </svg>
        </div>
        <h3>Message Sent Successfully!</h3>
        <p>Thank you for reaching out. I'll get back to you soon.</p>
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
};

// ContactForm component
const ContactForm = () => {
  const form = useRef();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    emailjs
      .sendForm(
        "service_bo02hid",
        "template_lh2le35",
        form.current,
        "8aGWUKjK04lqgNpwK"
      )
      .then(() => {
        setShowSuccessModal(true);
        form.current.reset();
      })
      .catch(() => {
        alert("Failed to send message. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <motion.form
        ref={form}
        onSubmit={sendEmail}
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
          <input type="text" name="subject" placeholder="Subject" required />
        </div>
        <div className="form-group">
          <textarea
            name="message"
            placeholder="Your Message"
            required
          ></textarea>
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting}
          className={isSubmitting ? "submitting" : ""}
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
        {showSuccessModal && (
          <SuccessModal onClose={() => setShowSuccessModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
