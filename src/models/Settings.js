import mongoose from "mongoose";

/**
 * A single Settings document (singleton) holds all global, admin-editable
 * content & configuration for the portfolio. Arrays of repeated items
 * (projects, skills, experiences, services, testimonials) live in their own
 * collections so they can be added/removed independently.
 */

const MediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "video", ""], default: "" },
    url: { type: String, default: "" }, // optimized/delivery url (webp for images)
    publicId: { type: String, default: "" }, // cloudinary public id (for deletion)
    alt: { type: String, default: "" }, // SEO alt text
    title: { type: String, default: "" }, // SEO/title tooltip
  },
  { _id: false }
);

const SocialLinkSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" }, // e.g. "GitHub"
    icon: { type: String, default: "" }, // react-icons name OR svg url
    url: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
  },
  { _id: true }
);

const NavItemSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "" }, // react-icons name or svg url
    label: { type: String, default: "" },
    href: { type: String, default: "" }, // e.g. "#home"
    enabled: { type: Boolean, default: true },
  },
  { _id: true }
);

const StatSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    value: { type: Number, default: 0 },
    suffix: { type: String, default: "" }, // e.g. "+"
  },
  { _id: true }
);

/**
 * Controls whether a section renders and in which order, plus its title.
 * key matches a fixed set of section identifiers the front-end knows about.
 */
const SectionConfigSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // hero | about | projects | skills | experience | services | testimonials | contact
    title: { type: String, default: "" }, // displayed section heading
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const ThemeSchema = new mongoose.Schema(
  {
    primary: { type: String, default: "#8189ff" },
    primaryLight: { type: String, default: "#9ca2ff" },
    secondary: { type: String, default: "#6a73ff" },
    accent: { type: String, default: "#ff8b8b" },
    text: { type: String, default: "#f0f0f0" },
    textLight: { type: String, default: "#d0d0d0" },
    bg: { type: String, default: "#121212" },
    cardBg: { type: String, default: "#1e1e1e" },
    border: { type: String, default: "#333333" },
    fontFamily: {
      type: String,
      default:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    // toggles for the visual effects
    enableSmokeyCursor: { type: Boolean, default: true },
    enableStarsBackground: { type: Boolean, default: true },
    // user-saved custom theme presets
    presets: {
      type: [
        {
          name: { type: String, default: "Custom" },
          colors: { type: mongoose.Schema.Types.Mixed, default: {} },
        },
      ],
      default: [],
    },
  },
  { _id: false }
);

/** Full SEO config — site-wide. */
const SeoBlockSchema = new mongoose.Schema(
  { title: { type: String, default: "" }, html: { type: String, default: "" } },
  { _id: true }
);
const FaqSchema = new mongoose.Schema(
  { question: { type: String, default: "" }, answer: { type: String, default: "" } },
  { _id: true }
);
const MediaSeoSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    type: { type: String, default: "image" },
    alt: { type: String, default: "" },
    title: { type: String, default: "" },
  },
  { _id: true }
);
const SeoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    keywords: { type: [String], default: [] },
    canonicalUrl: { type: String, default: "" },
    noindex: { type: Boolean, default: false },
    nofollow: { type: Boolean, default: false },
    // Open Graph
    ogTitle: { type: String, default: "" },
    ogType: { type: String, default: "website" },
    ogDescription: { type: String, default: "" },
    ogSiteName: { type: String, default: "" },
    ogUrl: { type: String, default: "" },
    ogImage: { type: MediaSchema, default: () => ({}) },
    // Twitter / X
    twitterCard: { type: String, default: "summary_large_image" },
    twitterTitle: { type: String, default: "" },
    twitterDescription: { type: String, default: "" },
    twitterImage: { type: MediaSchema, default: () => ({}) },
    twitterSite: { type: String, default: "" },
    // structured data
    jsonLd: { type: String, default: "" },
    // SEO content blocks (rendered above the footer)
    contentBlocks: { type: [SeoBlockSchema], default: [] },
    // FAQ (renders + FAQ rich-result JSON-LD)
    faqs: { type: [FaqSchema], default: [] },
    // central media alt/title registry
    mediaSeo: { type: [MediaSeoSchema], default: [] },
  },
  { _id: false }
);

const SettingsSchema = new mongoose.Schema(
  {
    singleton: { type: String, default: "main", unique: true },

    // Header
    siteName: { type: String, default: "Sandeep Singh Khicchi" },
    subtitle: { type: String, default: "Full Stack Developer | Problem Solver" },
    favicon: { type: MediaSchema, default: () => ({}) },
    logo: { type: MediaSchema, default: () => ({}) },

    // SEO
    metaTitle: { type: String, default: "Sandeep Singh Khicchi — Portfolio" },
    metaDescription: {
      type: String,
      default: "Full Stack Developer portfolio.",
    },

    // Hero
    hero: {
      heading: {
        type: String,
        default: "Building Digital Experiences That Matter",
      },
      paragraph: {
        type: String,
        default:
          "I specialize in creating responsive, performant web applications with modern technologies.",
      },
      ctaLabel: { type: String, default: "View My Work" },
      ctaHref: { type: String, default: "#projects" },
      secondaryCtaLabel: { type: String, default: "Get In Touch" },
      secondaryCtaHref: { type: String, default: "#contact" },
      media: { type: MediaSchema, default: () => ({}) }, // optional hero image/video
      stats: { type: [StatSchema], default: [] },
    },

    // About section
    about: {
      heading: { type: String, default: "About Me" },
      body: {
        type: String,
        default:
          "I'm a passionate full stack developer focused on crafting clean, performant, user-friendly web experiences.",
      },
      media: { type: MediaSchema, default: () => ({}) },
      resumeUrl: { type: String, default: "" },
      highlights: { type: [String], default: [] },
    },

    // Contact
    contact: {
      heading: { type: String, default: "Let's work together" },
      body: {
        type: String,
        default:
          "I'm currently available for freelance work or full-time positions. Feel free to reach out!",
      },
      email: { type: String, default: "sandeepsinghkhicchi@gmail.com" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
    },

    socialLinks: { type: [SocialLinkSchema], default: [] },
    navItems: { type: [NavItemSchema], default: [] },
    sections: { type: [SectionConfigSchema], default: [] },
    theme: { type: ThemeSchema, default: () => ({}) },
    seo: { type: SeoSchema, default: () => ({}) },

    footerText: {
      type: String,
      default: "© Sandeep Singh Khicchi. All rights reserved.",
    },

    // Optional SMTP override (falls back to env if blank)
    smtp: {
      host: { type: String, default: "" },
      port: { type: Number, default: 0 },
      secure: { type: Boolean, default: false },
      user: { type: String, default: "" },
      pass: { type: String, default: "" },
      fromEmail: { type: String, default: "" },
      notifyEmail: { type: String, default: "" }, // where contact messages are sent
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
