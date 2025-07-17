import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGithub,
  FiExternalLink,
  FiMail,
  FiLinkedin,
  FiInstagram,
  FiSun,
  FiMoon,
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
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const heroRef = useRef(null);
  const sphereRef = useRef();

  // Initialize theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
      document.body.className = savedTheme + "-mode";
    } else {
      setDarkMode(prefersDark);
      document.body.className = prefersDark ? "dark-mode" : "light-mode";
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.className = newMode ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // Skills data
  const skills = [
    { name: "JavaScript", icon: <FiCode />, level: 90 },
    { name: "React", icon: <FiCode />, level: 85 },
    { name: "Node.js", icon: <FiCode />, level: 80 },
    { name: "HTML/CSS", icon: <FiCode />, level: 95 },
    { name: "TypeScript", icon: <FiCode />, level: 75 },
    { name: "Git", icon: <FiCode />, level: 85 },
  ];

  // Animation effects
  useEffect(() => {
    if (!mounted) return;

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
  }, [mounted]);

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
      title: "E-commerce Platform",
      desc: "Full-featured online store with cart & payments",
      tech: ["React", "Node.js", "Stripe", "MongoDB"],
      github: "https://github.com/Sandeep6268/ecco-font",
      live: "https://ecco-font.vercel.app/",
      image:
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      features: [
        "Product catalog with filters",
        "Secure payment processing",
        "User authentication",
        "Order tracking",
      ],
    },
    {
      title: "Task Management App",
      desc: "Kanban-style productivity tool with drag-n-drop",
      tech: ["React", "Firebase", "Material UI", "Redux"],
      github: "#",
      live: "#",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "Drag and drop interface",
        "Real-time collaboration",
        "Task prioritization",
        "Progress tracking",
      ],
    },
    {
      title: "Portfolio Website",
      desc: "Interactive 3D portfolio website",
      tech: ["React", "Three.js", "Framer Motion", "CSS3"],
      github: "#",
      live: "#",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      features: [
        "3D interactive elements",
        "Dark/light mode",
        "Responsive design",
        "Micro-interactions",
      ],
    },
  ];

  // FloatingNav component
  const FloatingNav = () => {
    const navItems = [
      { icon: <FiUser />, label: "About", href: "#home" },
      { icon: <FiCode />, label: "Skills", href: "#skills" },
      { icon: <FiBriefcase />, label: "Work", href: "#projects" },
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
          color={darkMode ? "#8189ff" : "#646cff"}
          roughness={0.2}
          metalness={darkMode ? 0.7 : 0.3}
          emissive={darkMode ? "#3a3f8f" : "#a3a8ff"}
          emissiveIntensity={darkMode ? 0.5 : 0.2}
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
            {darkMode && (
              <Stars radius={100} depth={50} count={5000} factor={4} />
            )}
            <OrbitControls
              enableZoom={false}
              autoRotate
              autoRotateSpeed={darkMode ? 1 : 2}
              enablePan={false}
            />
            <AnimatedSphere />
          </Canvas>
          <div className="glow-effect"></div>
        </motion.div>
    <div className={`portfolio ${darkMode ? "dark" : "light"}`}>
      {/* Theme Toggle */}
      <motion.button
        className="theme-toggle"
        onClick={toggleTheme}
        whileHover={{ scale: 1.1, rotate: darkMode ? 0 : 180 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
      </motion.button>

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
              with modern technologies. With 4+ years of experience, I bring
              both technical expertise and creative problem-solving to every
              project.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number" data-target="50">
                  0
                </span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat">
                <span className="stat-number" data-target="20">
                  0
                </span>
                <span className="stat-label">Clients</span>
              </div>
              <div className="stat">
                <span className="stat-number" data-target="4">
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
              I'm currently available for freelance work or full-time positions.
              Feel free to reach out for project discussions or just to say
              hello!
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
          <ContactForm darkMode={darkMode} />
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

// ContactForm component
const ContactForm = ({ darkMode }) => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_bo02hid",
        "template_lh2le35",
        form.current,
        "8aGWUKjK04lqgNpwK"
      )
      .then(() => {
        alert("Message sent successfully!");
        form.current.reset();
      })
      .catch(() => {
        alert("Failed to send message. Please try again.");
      });
  };

  return (
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
        <textarea name="message" placeholder="Your Message" required></textarea>
      </div>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Send Message
      </motion.button>
    </motion.form>
  );
};

export default App;
