/**
 * Map admin SEO settings -> Next.js Metadata object.
 */
export function buildMetadata(settings) {
  const seo = settings?.seo || {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  const title = seo.metaTitle || settings?.metaTitle || settings?.siteName || "Portfolio";
  const description = seo.metaDescription || settings?.metaDescription || "";
  const canonical = seo.canonicalUrl || (siteUrl || undefined);

  const ogImage = seo.ogImage?.url || settings?.hero?.media?.url || undefined;
  const twImage = seo.twitterImage?.url || ogImage;

  const metadata = {
    title,
    description,
    keywords: (seo.keywords && seo.keywords.length) ? seo.keywords : undefined,
    icons: settings?.favicon?.url ? { icon: settings.favicon.url } : undefined,
    robots: {
      index: !seo.noindex,
      follow: !seo.nofollow,
    },
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      type: seo.ogType || "website",
      siteName: seo.ogSiteName || settings?.siteName || undefined,
      url: seo.ogUrl || canonical || undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: seo.twitterCard || "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || title,
      description: seo.twitterDescription || seo.ogDescription || description,
      site: seo.twitterSite || undefined,
      images: twImage ? [twImage] : undefined,
    },
  };

  if (siteUrl) {
    try {
      metadata.metadataBase = new URL(siteUrl);
    } catch {}
  }

  return metadata;
}

/** Collect JSON-LD scripts (custom + FAQ) as an array of objects. */
export function buildJsonLd(settings) {
  const seo = settings?.seo || {};
  const scripts = [];

  if (seo.jsonLd && seo.jsonLd.trim()) {
    try {
      scripts.push(JSON.parse(seo.jsonLd));
    } catch {
      // invalid JSON — skip silently so it never breaks the page
    }
  }

  const faqs = (seo.faqs || []).filter((f) => f.question && f.answer);
  if (faqs.length) {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return scripts;
}
