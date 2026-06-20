/**
 * Seed script — run with: npm run seed
 *
 * - Creates the admin account from ADMIN_EMAIL / ADMIN_PASSWORD (if none exists)
 * - Creates the Settings singleton with sensible defaults
 * - Seeds the original projects, skills, services and experience
 *
 * Safe to re-run: it won't duplicate content that already exists.
 *
 * This file is self-contained (defines its own loose schemas) so it can run as
 * a plain Node ESM script without depending on the app's module resolution.
 */
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Loose schemas (strict:false) so they accept whatever fields the app uses.
const loose = () => new mongoose.Schema({}, { strict: false, timestamps: true });
const Admin = mongoose.model("Admin", new mongoose.Schema({}, { strict: false, timestamps: true }));
const Settings = mongoose.model("Settings", loose());
const Project = mongoose.model("Project", loose());
const Skill = mongoose.model("Skill", loose());
const Service = mongoose.model("Service", loose());
const Experience = mongoose.model("Experience", loose());

const DEFAULT_SETTINGS = {
  singleton: "main",
  siteName: "Sandeep Singh Khicchi",
  subtitle: "Full Stack Developer | Problem Solver",
  metaTitle: "Sandeep Singh Khicchi — Full Stack Developer",
  metaDescription:
    "Portfolio of Sandeep Singh Khicchi, a Full Stack Developer building responsive, performant web applications.",
  hero: {
    heading: "Building Digital Experiences That Matter",
    paragraph:
      "I specialize in creating responsive, performant web applications with modern technologies. With 1+ years of experience, I bring both technical expertise and creative problem-solving to every project.",
    ctaLabel: "View My Work",
    ctaHref: "#projects",
    secondaryCtaLabel: "Get In Touch",
    secondaryCtaHref: "#contact",
    stats: [
      { label: "Projects", value: 20, suffix: "+" },
      { label: "Clients", value: 8, suffix: "" },
      { label: "Years Exp", value: 1, suffix: "+" },
    ],
  },
  about: {
    heading: "About Me",
    body:
      "I'm a passionate Full Stack Developer who loves turning ideas into clean, fast, and accessible web experiences. I work across the stack — from pixel-perfect React frontends to robust Node and Python backends.",
    highlights: [
      "1+ years of hands-on development experience",
      "Comfortable across frontend, backend & databases",
      "Focused on performance and great UX",
    ],
  },
  contact: {
    heading: "Let's work together",
    body:
      "I'm currently available for freelance work or full-time positions. Feel free to reach out for project discussions or just to say hello!",
    email: "sandeepsinghkhicchi@gmail.com",
  },
  socialLinks: [
    { label: "LinkedIn", icon: "FiLinkedin", url: "http://linkedin.com/in/sandeep-singh-khicchi-70440b2a5", enabled: true },
    { label: "Instagram", icon: "FiInstagram", url: "https://www.instagram.com/sandybannarajput/", enabled: true },
    { label: "GitHub", icon: "FiGithub", url: "https://github.com/Sandeep6268", enabled: true },
  ],
  navItems: [
    { icon: "FiUser", label: "About", href: "#about", enabled: true },
    { icon: "FiBriefcase", label: "Work", href: "#projects", enabled: true },
    { icon: "FiCode", label: "Skills", href: "#skills", enabled: true },
    { icon: "FiMessageSquare", label: "Contact", href: "#contact", enabled: true },
  ],
  sections: [
    { key: "hero", title: "", enabled: true, order: 0 },
    { key: "about", title: "About Me", enabled: true, order: 1 },
    { key: "projects", title: "Featured Work", enabled: true, order: 2 },
    { key: "skills", title: "Tech Stack", enabled: true, order: 3 },
    { key: "experience", title: "Experience", enabled: true, order: 4 },
    { key: "services", title: "What I Do", enabled: true, order: 5 },
    { key: "testimonials", title: "Testimonials", enabled: true, order: 6 },
    { key: "contact", title: "Get In Touch", enabled: true, order: 7 },
  ],
  theme: {
    primary: "#8189ff", primaryLight: "#9ca2ff", secondary: "#6a73ff", accent: "#ff8b8b",
    text: "#f0f0f0", textLight: "#d0d0d0", bg: "#121212", cardBg: "#1e1e1e", border: "#333333",
    enableSmokeyCursor: true, enableStarsBackground: true,
  },
  footerText: "© Sandeep Singh Khicchi. Built with Next.js.",
  smtp: {},
};

const DEFAULT_SKILLS = [
  ["HTML5", "SiHtml5", 95], ["CSS3", "SiCss3", 90], ["JavaScript", "SiJavascript", 90],
  ["React js", "SiReact", 85], ["Node.js", "SiNodedotjs", 75], ["MongoDB", "SiMongodb", 75],
  ["Tailwind CSS", "SiTailwindcss", 85], ["Bootstrap", "SiBootstrap", 80], ["Python", "SiPython", 80],
  ["Django", "SiDjango", 75], ["SQL", "SiMysql", 80], ["Next.js", "SiNextdotjs", 70],
  ["Firebase", "SiFirebase", 75], ["Cloudinary", "SiCloudinary", 70], ["Razorpay", "SiRazorpay", 70],
  ["Git", "SiGit", 85],
].map(([name, icon, level], i) => ({ name, icon, level, order: i, enabled: true }));

const DEFAULT_PROJECTS = [
  {
    title: "SHOPEASY - Next JS E-Commerce",
    desc: "Modern clothing e-commerce platform with complete shopping cart and user authentication",
    tech: ["Next.js", "React", "MongoDB", "Firebase Auth", "Tailwind CSS", "Context API"],
    github: "https://github.com/Sandeep6268/shopeasy-nextjs",
    live: "https://shopeasy-nextjs.vercel.app/",
    media: { type: "image", url: "/shopeasy.png", publicId: "" },
    features: ["Next.js 14 with App Router", "MongoDB database integration", "Firebase authentication (Email/Google)", "Responsive design with Tailwind CSS", "Shopping cart functionality", "Product catalog with categories", "User profile management", "Search and filter products", "State management with Context API"],
    featured: true,
  },
  {
    title: "YouTube Clone",
    desc: "A full-featured YouTube clone with video streaming, search, and channel functionality",
    tech: ["React", "Material UI", "Google Cloud Console"],
    github: "https://github.com/Sandeep6268/youtubeclone",
    live: "https://sandeep6268.github.io/youtubeclone/",
    media: { type: "image", url: "/yt.png", publicId: "" },
    features: ["Video streaming and playback functionality", "Advanced search", "Subscriber counts", "Responsive design for all devices", "Comment section with replies", "Expand and Collapse toggle"],
  },
  {
    title: "CHATAPP - Real-time Messenger",
    desc: "Modern real-time chat application with live messaging, push notifications, and user discovery",
    tech: ["Next.js", "TypeScript", "React", "Firebase", "Firebase Auth", "Tailwind CSS", "Service Workers"],
    github: "https://github.com/Sandeep6268/chat-app-nextjs",
    live: "https://chat-app-nextjs-gray-eta.vercel.app/chat",
    media: { type: "image", url: "/chat-app.png", publicId: "" },
    features: ["Real-time messaging with Firebase", "Full TypeScript implementation", "Browser push notifications", "User authentication (Login/Logout)", "Discover and add new users via + icon", "Type-safe Firebase operations", "Responsive design with Tailwind CSS", "Online/offline status tracking", "Message history persistence", "Modern UI with smooth animations"],
  },
  {
    title: "WEAS E-Commerce By (JS)",
    desc: "Pure JavaScript e-commerce platform with PhonePe payment integration",
    tech: ["JavaScript", "PHP", "PhonePe API", "HTML5", "CSS3", "Bootstrap"],
    github: "", live: "https://weas.in/",
    media: { type: "image", url: "/weas.png", publicId: "" },
    features: ["Vanilla JavaScript frontend", "PhonePe payment gateway integration via PHP backend", "Product catalog with categories", "Shopping cart system", "Order tracking", "Admin dashboard", "Responsive mobile design"],
  },
  {
    title: "DIGIMEDIA - Marketing Agency",
    desc: "Fully responsive marketing agency website built with pure HTML and CSS",
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    github: "https://github.com/Sandeep6268/Digimedia-Website",
    live: "https://sandeep6268.github.io/Digimedia-Website/",
    media: { type: "image", url: "/digimedia.png", publicId: "" },
    features: ["Pure HTML5 and CSS3 implementation", "Fully responsive design (Mobile-first)", "Modern and clean UI/UX design", "Cross-browser compatibility", "Optimized for performance", "Semantic HTML structure", "CSS Flexbox and Grid layouts", "Smooth animations and transitions", "Contact forms and interactive elements"],
  },
  {
    title: "UTILITYHUB - Tools & Utilities",
    desc: "Fully responsive utility website with interactive features built with pure HTML, CSS and JavaScript",
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    github: "https://github.com/Sandeep6268/utilityhub",
    live: "https://sandeep6268.github.io/utilityhub/",
    media: { type: "image", url: "/utilityhub.png", publicId: "" },
    features: ["Pure HTML5, CSS3 and Vanilla JavaScript", "Fully responsive across all devices", "Interactive UI components", "Modern glassmorphism design", "Cross-browser compatible", "Lightweight and fast loading", "Custom CSS animations", "Form validation and user interactions", "Clean and organized code structure"],
  },
].map((p, i) => ({ ...p, order: i, enabled: true }));

const DEFAULT_SERVICES = [
  { title: "Web Development", description: "Responsive, fast websites & web apps built with modern frameworks.", icon: "FiCode" },
  { title: "Full Stack Apps", description: "End-to-end products with robust backends, auth and databases.", icon: "FiLayers" },
  { title: "UI / UX Implementation", description: "Pixel-perfect, accessible interfaces with smooth animations.", icon: "FiFeather" },
  { title: "API & Integrations", description: "REST APIs, payment gateways, and third-party service integrations.", icon: "FiServer" },
].map((s, i) => ({ ...s, order: i, enabled: true }));

const DEFAULT_EXPERIENCE = [
  { role: "Full Stack Developer", company: "Freelance", location: "Remote", startDate: "2024", endDate: "Present", description: "Building full stack web applications for clients using React, Next.js, Node and Python.", type: "work", icon: "FiBriefcase" },
].map((e, i) => ({ ...e, order: i, enabled: true }));

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set (check .env.local)");

  console.log("Connecting to MongoDB…");
  await mongoose.connect(uri);
  console.log("Connected.");

  if ((await Admin.countDocuments()) === 0) {
    const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ email, passwordHash, name: "Admin" });
    console.log(`✓ Admin created: ${email}`);
  } else console.log("• Admin already exists, skipping.");

  if (!(await Settings.findOne({ singleton: "main" }))) {
    await Settings.create(DEFAULT_SETTINGS);
    console.log("✓ Settings singleton created.");
  } else console.log("• Settings already exist, skipping.");

  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany(DEFAULT_PROJECTS);
    console.log(`✓ ${DEFAULT_PROJECTS.length} projects seeded.`);
  } else console.log("• Projects already exist, skipping.");

  if ((await Skill.countDocuments()) === 0) {
    await Skill.insertMany(DEFAULT_SKILLS);
    console.log(`✓ ${DEFAULT_SKILLS.length} skills seeded.`);
  } else console.log("• Skills already exist, skipping.");

  if ((await Service.countDocuments()) === 0) {
    await Service.insertMany(DEFAULT_SERVICES);
    console.log(`✓ ${DEFAULT_SERVICES.length} services seeded.`);
  } else console.log("• Services already exist, skipping.");

  if ((await Experience.countDocuments()) === 0) {
    await Experience.insertMany(DEFAULT_EXPERIENCE);
    console.log(`✓ ${DEFAULT_EXPERIENCE.length} experience entries seeded.`);
  } else console.log("• Experience already exists, skipping.");

  await mongoose.disconnect();
  console.log("\nDone! Start with `npm run dev` then log in at /admin/login");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
