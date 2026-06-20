import { connectDB } from "./db";
import Settings from "@/models/Settings";
import Project from "@/models/Project";
import Skill from "@/models/Skill";
import Experience from "@/models/Experience";
import Service from "@/models/Service";
import Testimonial from "@/models/Testimonial";
import { defaultSettings, DEFAULT_SECTIONS } from "./defaults";

/** Convert a mongoose doc / object to a plain JSON-safe object. */
export function serialize(doc) {
  return JSON.parse(JSON.stringify(doc));
}

/** Ensure a Settings singleton exists, returns the (lean) doc. */
export async function getSettings() {
  await connectDB();
  let settings = await Settings.findOne({ singleton: "main" }).lean();
  if (!settings) {
    const created = await Settings.create(defaultSettings());
    settings = created.toObject();
  }
  // make sure every known section key exists in the config
  const have = new Set((settings.sections || []).map((s) => s.key));
  const missing = DEFAULT_SECTIONS.filter((s) => !have.has(s.key));
  if (missing.length) {
    settings.sections = [...(settings.sections || []), ...missing];
  }
  return serialize(settings);
}

/**
 * Fetch everything the public site needs in one call.
 * Only enabled items are returned, sorted by order.
 */
export async function getPortfolioData() {
  await connectDB();

  const [settings, projects, skills, experiences, services, testimonials] =
    await Promise.all([
      getSettings(),
      Project.find({ enabled: true }).sort({ order: 1, createdAt: 1 }).lean(),
      Skill.find({ enabled: true }).sort({ order: 1, createdAt: 1 }).lean(),
      Experience.find({ enabled: true }).sort({ order: 1, createdAt: 1 }).lean(),
      Service.find({ enabled: true }).sort({ order: 1, createdAt: 1 }).lean(),
      Testimonial.find({ enabled: true }).sort({ order: 1, createdAt: 1 }).lean(),
    ]);

  return serialize({
    settings,
    projects,
    skills,
    experiences,
    services,
    testimonials,
  });
}
