"use client";
import { useState } from "react";
import { useSettings } from "../useSettings";
import { Field, Input, Textarea, Select, Toggle, TagInput } from "../ui";
import MediaUpload from "../MediaUpload";
import SaveBar from "../SaveBar";
import Loader from "../Loader";
import { FiTrash2, FiPlus } from "react-icons/fi";

export default function SeoEditor() {
  const { settings, setNested, loading, saving, saved, error, save } = useSettings();
  const [tab, setTab] = useState("meta");
  if (loading || !settings) return <Loader />;

  const seo = settings.seo || {};
  const setSeo = (patch) => setNested("seo", patch);

  // content blocks
  const blocks = seo.contentBlocks || [];
  const setBlocks = (b) => setSeo({ contentBlocks: b });
  // faqs
  const faqs = seo.faqs || [];
  const setFaqs = (f) => setSeo({ faqs: f });
  // media seo
  const mediaSeo = seo.mediaSeo || [];
  const setMediaSeo = (m) => setSeo({ mediaSeo: m });

  const TABS = [
    ["meta", "Meta"],
    ["social", "Social (OG / Twitter)"],
    ["schema", "Structured data"],
    ["content", "Content blocks"],
    ["faq", "FAQ"],
    ["images", "Images"],
  ];

  return (
    <div>
      <div className="a-subtabs">
        {TABS.map(([k, label]) => (
          <button key={k} className={tab === k ? "active" : ""} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </div>

      {/* ---- META ---- */}
      {tab === "meta" && (
        <div className="a-card">
          <h3>Meta</h3>
          <Field label={`Meta title (${(seo.metaTitle || "").length}/60)`} hint="Page title shown in Google results">
            <Input value={seo.metaTitle} onChange={(v) => setSeo({ metaTitle: v })} placeholder="Page title shown in Google results" maxLength={70} />
          </Field>
          <Field label={`Meta description (${(seo.metaDescription || "").length}/160)`} hint="Short summary shown under the title in search results">
            <Textarea value={seo.metaDescription} onChange={(v) => setSeo({ metaDescription: v })} placeholder="Short summary shown under the title in search results" />
          </Field>
          <TagInput label="Keywords" hint="Type and press Enter / space" value={seo.keywords || []} onChange={(v) => setSeo({ keywords: v })} placeholder="e.g. full stack developer" />
          <div className="a-row">
            <Field label="Slug / URL (optional)">
              <Input value={seo.slug} onChange={(v) => setSeo({ slug: v })} placeholder="auto: /" />
            </Field>
            <Field label="Canonical URL (optional override)">
              <Input value={seo.canonicalUrl} onChange={(v) => setSeo({ canonicalUrl: v })} placeholder="auto: /" />
            </Field>
          </div>
          <div className="a-field"><Toggle label="Hide from search engines (noindex)" checked={!!seo.noindex} onChange={(v) => setSeo({ noindex: v })} /></div>
          <div className="a-field"><Toggle label="Don't follow links on this page (nofollow)" checked={!!seo.nofollow} onChange={(v) => setSeo({ nofollow: v })} /></div>
        </div>
      )}

      {/* ---- SOCIAL ---- */}
      {tab === "social" && (
        <>
          <div className="a-card">
            <h3>Open Graph <span className="hint" style={{ fontWeight: 400 }}>(Facebook / WhatsApp / LinkedIn share preview)</span></h3>
            <div className="a-row">
              <Field label="og:title (falls back to meta title)">
                <Input value={seo.ogTitle} onChange={(v) => setSeo({ ogTitle: v })} placeholder="Title shown when shared" />
              </Field>
              <Field label="og:type">
                <Select value={seo.ogType || "website"} onChange={(v) => setSeo({ ogType: v })} options={[
                  { value: "website", label: "website" },
                  { value: "profile", label: "profile" },
                  { value: "article", label: "article" },
                ]} />
              </Field>
            </div>
            <Field label="og:description (falls back to meta description)">
              <Textarea value={seo.ogDescription} onChange={(v) => setSeo({ ogDescription: v })} placeholder="Description shown when shared" />
            </Field>
            <div className="a-row">
              <Field label="og:site_name (falls back to site name)">
                <Input value={seo.ogSiteName} onChange={(v) => setSeo({ ogSiteName: v })} placeholder={settings.siteName} />
              </Field>
              <Field label="og:url (falls back to canonical)">
                <Input value={seo.ogUrl} onChange={(v) => setSeo({ ogUrl: v })} placeholder="https://…" />
              </Field>
            </div>
            <MediaUpload label="og:image (1200×630 recommended)" value={seo.ogImage} onChange={(m) => setSeo({ ogImage: m })} accept="image/*" />
          </div>

          <div className="a-card">
            <h3>Twitter / X card</h3>
            <div className="a-row">
              <Field label="twitter:card">
                <Select value={seo.twitterCard || "summary_large_image"} onChange={(v) => setSeo({ twitterCard: v })} options={[
                  { value: "summary_large_image", label: "summary_large_image" },
                  { value: "summary", label: "summary" },
                ]} />
              </Field>
              <Field label="twitter:title (falls back to og:title)">
                <Input value={seo.twitterTitle} onChange={(v) => setSeo({ twitterTitle: v })} placeholder="Title for Twitter/X" />
              </Field>
            </div>
            <Field label="twitter:description (falls back to og:description)">
              <Textarea value={seo.twitterDescription} onChange={(v) => setSeo({ twitterDescription: v })} placeholder="Description for Twitter/X" />
            </Field>
            <Field label="twitter:site (@handle, optional)">
              <Input value={seo.twitterSite} onChange={(v) => setSeo({ twitterSite: v })} placeholder="@username" />
            </Field>
            <MediaUpload label="twitter:image (falls back to og:image)" value={seo.twitterImage} onChange={(m) => setSeo({ twitterImage: m })} accept="image/*" />
          </div>
        </>
      )}

      {/* ---- STRUCTURED DATA ---- */}
      {tab === "schema" && (
        <div className="a-card">
          <h3>Custom JSON-LD structured data <span className="hint" style={{ fontWeight: 400 }}>(optional)</span></h3>
          <Field hint="Paste valid JSON-LD — it's injected into the page's <head> as a structured-data script. Leave blank if not needed.">
            <Textarea
              value={seo.jsonLd}
              onChange={(v) => setSeo({ jsonLd: v })}
              style={{ minHeight: 220, fontFamily: "monospace" }}
              placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Person",\n  ...\n}'}
            />
          </Field>
        </div>
      )}

      {/* ---- CONTENT BLOCKS ---- */}
      {tab === "content" && (
        <div className="a-card">
          <div className="a-toolbar" style={{ position: "static", border: "none", padding: 0, marginBottom: "0.8rem" }}>
            <div>
              <h3 style={{ margin: 0 }}>SEO content blocks</h3>
              <div className="hint">Optional — shows at the bottom of the page, above the footer. Great for keyword-rich copy.</div>
            </div>
            <div className="a-spacer" />
            <button className="a-btn small" onClick={() => setBlocks([...blocks, { title: "", html: "" }])}><FiPlus /> Add block</button>
          </div>
          {blocks.length === 0 && <div className="a-empty">No content blocks yet.</div>}
          {blocks.map((b, i) => (
            <div className="a-item" key={i}>
              <div className="a-item-head">
                <span className="title">Block {i + 1}</span>
                <div className="actions">
                  <button className="a-btn small danger" onClick={() => setBlocks(blocks.filter((_, idx) => idx !== i))}><FiTrash2 /></button>
                </div>
              </div>
              <div className="a-item-body">
                <Field label="Heading">
                  <Input value={b.title} onChange={(v) => setBlocks(blocks.map((x, idx) => idx === i ? { ...x, title: v } : x))} />
                </Field>
                <Field label="Body (HTML allowed)" hint="You can use <p>, <strong>, <a href>, <ul><li> etc.">
                  <Textarea value={b.html} onChange={(v) => setBlocks(blocks.map((x, idx) => idx === i ? { ...x, html: v } : x))} style={{ minHeight: 120 }} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- FAQ ---- */}
      {tab === "faq" && (
        <div className="a-card">
          <div className="a-toolbar" style={{ position: "static", border: "none", padding: 0, marginBottom: "0.8rem" }}>
            <div>
              <h3 style={{ margin: 0 }}>FAQ</h3>
              <div className="hint">Optional — also boosts SEO via FAQ rich results.</div>
            </div>
            <div className="a-spacer" />
            <button className="a-btn small" onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}><FiPlus /> Add FAQ</button>
          </div>
          {faqs.length === 0 && <div className="a-empty">No FAQs yet.</div>}
          {faqs.map((f, i) => (
            <div className="a-item" key={i}>
              <div className="a-item-head">
                <span className="title">{i + 1}.</span>
                <Input value={f.question} onChange={(v) => setFaqs(faqs.map((x, idx) => idx === i ? { ...x, question: v } : x))} placeholder="Question" />
                <div className="actions">
                  <button className="a-btn small danger" onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}><FiTrash2 /></button>
                </div>
              </div>
              <div className="a-item-body">
                <Textarea value={f.answer} onChange={(v) => setFaqs(faqs.map((x, idx) => idx === i ? { ...x, answer: v } : x))} placeholder="Answer" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- IMAGES ---- */}
      {tab === "images" && (
        <div className="a-card">
          <h3>Image SEO (alt / title)</h3>
          <p className="section-desc">Add alt text & title for images used across the site (also editable inline when you upload).</p>
          <div className="a-toolbar" style={{ position: "static", border: "none", padding: 0, marginBottom: "0.8rem" }}>
            <div className="a-spacer" />
            <button className="a-btn small" onClick={() => setMediaSeo([...mediaSeo, { url: "", alt: "", title: "" }])}><FiPlus /> Add image entry</button>
          </div>
          {mediaSeo.length === 0 && <div className="a-empty">No image entries. Upload media anywhere (with alt/title) or add one here.</div>}
          {mediaSeo.map((m, i) => (
            <div className="a-item" key={i}>
              <div className="a-item-head">
                {m.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="a-thumb" src={m.url} alt={m.alt || ""} />
                ) : (
                  <div className="a-thumb" />
                )}
                <div style={{ flex: 1 }}>
                  <Input value={m.url} onChange={(v) => setMediaSeo(mediaSeo.map((x, idx) => idx === i ? { ...x, url: v } : x))} placeholder="Image URL" />
                </div>
                <div className="actions">
                  <button className="a-btn small danger" onClick={() => setMediaSeo(mediaSeo.filter((_, idx) => idx !== i))}><FiTrash2 /></button>
                </div>
              </div>
              <div className="a-item-body">
                <Field label="Alt text (describes the image for SEO & screen readers)">
                  <Input value={m.alt} onChange={(v) => setMediaSeo(mediaSeo.map((x, idx) => idx === i ? { ...x, alt: v } : x))} placeholder="e.g. Project dashboard screenshot" />
                </Field>
                <Field label="Title (tooltip on hover)">
                  <Input value={m.title} onChange={(v) => setMediaSeo(mediaSeo.map((x, idx) => idx === i ? { ...x, title: v } : x))} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      )}

      <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
    </div>
  );
}
