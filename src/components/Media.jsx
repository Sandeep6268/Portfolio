"use client";
import React from "react";

/**
 * Renders an optimized image (WebP from Cloudinary) or a video.
 * `media` = { type: "image"|"video", url } OR a plain string url (image).
 */
export default function Media({ media, alt = "", className, style, videoProps = {} }) {
  const m = typeof media === "string" ? { type: "image", url: media } : media || {};
  if (!m.url) return null;

  // prefer the media's own SEO alt/title, fall back to the passed-in alt
  const altText = m.alt || alt;
  const titleText = m.title || undefined;

  if (m.type === "video") {
    return (
      <video
        className={className}
        style={style}
        src={m.url}
        title={titleText}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        {...videoProps}
      />
    );
  }

  // image — Cloudinary urls already deliver WebP + q_auto via buildOptimizedUrl
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      className={className}
      style={style}
      src={m.url}
      alt={altText}
      title={titleText}
      loading="lazy"
      decoding="async"
    />
  );
}
