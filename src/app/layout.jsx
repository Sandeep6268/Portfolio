import "./globals.css";
import { getSettings } from "@/lib/getData";
import { buildMetadata, buildJsonLd } from "@/lib/seo";
import ThemeStyle from "@/components/ThemeStyle";
import ToasterProvider from "@/components/ToasterProvider";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    const settings = await getSettings();
    return buildMetadata(settings);
  } catch {
    return { title: "Portfolio", description: "Portfolio" };
  }
}

export default async function RootLayout({ children }) {
  let theme = {};
  let jsonLd = [];
  let fontFamily = "";
  try {
    const settings = await getSettings();
    theme = settings.theme || {};
    fontFamily = theme.fontFamily || "";
    jsonLd = buildJsonLd(settings);
  } catch {
    // DB unavailable at build/first-load — fall back to default CSS vars.
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <ThemeStyle theme={theme} />
        {jsonLd.map((obj, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
          />
        ))}
      </head>
      <body>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
