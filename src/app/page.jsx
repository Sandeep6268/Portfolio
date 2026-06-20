import { getPortfolioData } from "@/lib/getData";
import { defaultSettings, DEFAULT_PROJECTS, DEFAULT_SKILLS, DEFAULT_SERVICES, DEFAULT_EXPERIENCE } from "@/lib/defaults";
import Portfolio from "@/components/site/Portfolio";
import BackgroundFX from "@/components/BackgroundFX";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let data;
  try {
    data = await getPortfolioData();
  } catch (e) {
    // DB unreachable — render with defaults so the site still works.
    console.error("[page] falling back to defaults:", e?.message);
    data = {
      settings: defaultSettings(),
      projects: DEFAULT_PROJECTS,
      skills: DEFAULT_SKILLS,
      experiences: DEFAULT_EXPERIENCE,
      services: DEFAULT_SERVICES,
      testimonials: [],
    };
  }

  const theme = data.settings.theme || {};

  return (
    <>
      <BackgroundFX
        enableCursor={theme.enableSmokeyCursor !== false}
        enableStars={theme.enableStarsBackground !== false}
      />
      <Portfolio data={data} />
    </>
  );
}
