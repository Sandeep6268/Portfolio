"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Media from "@/components/Media";
import ServicesCarousel from "./ServicesCarousel";

function StatCounter({ value, label, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const target = Number(value) || 0;
    let raf;
    const duration = 2000;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setCount(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="stat" ref={ref}>
      <span className="stat-number">
        {count}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function Hero({ hero = {}, services = [] }) {
  const stats = hero.stats || [];
  const hasServices = Array.isArray(services) && services.length > 0;
  return (
    <section id="home" className="hero">
      <div className={`hero-content ${!hero.media?.url && !hasServices ? "hero-solo" : ""}`}>
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>{hero.heading}</h2>
          <p>{hero.paragraph}</p>

          {(hero.ctaLabel || hero.secondaryCtaLabel) && (
            <div className="hero-cta">
              {hero.ctaLabel && (
                <a className="btn btn-primary" href={hero.ctaHref || "#projects"}>
                  {hero.ctaLabel}
                </a>
              )}
              {hero.secondaryCtaLabel && (
                <a className="btn btn-outline" href={hero.secondaryCtaHref || "#contact"}>
                  {hero.secondaryCtaLabel}
                </a>
              )}
            </div>
          )}

          {stats.length > 0 && (
            <div className="hero-stats">
              {stats.map((s, i) => (
                <StatCounter key={s._id || i} value={s.value} label={s.label} suffix={s.suffix} />
              ))}
            </div>
          )}
        </motion.div>

        {hero.media?.url ? (
          <motion.div
            className="hero-media"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Media media={hero.media} alt="Hero" />
          </motion.div>
        ) : hasServices ? (
          <motion.div
            className="hero-carousel-wrap"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ServicesCarousel services={services} />
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
