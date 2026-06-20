"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import Icon from "@/components/Icon";

/**
 * Modern center-stage carousel for the "What I Do" services, shown in the hero.
 * The active card is large & centered; the prev/next peek in scaled-down and faded.
 * Auto-rotates, pausable on hover, with arrows + dots.
 */
export default function ServicesCarousel({ services = [] }) {
  const items = services.filter((s) => s && s.title);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;
  const timer = useRef(null);

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + count) % count),
    [count]
  );
  const goTo = (i) => setIndex(((i % count) + count) % count);

  // autoplay
  useEffect(() => {
    if (count <= 1 || paused) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), 3800);
    return () => clearInterval(timer.current);
  }, [count, paused]);

  if (!count) return null;

  const prev = (index - 1 + count) % count;
  const next = (index + 1) % count;

  // which relative position is each card in
  const posOf = (i) => {
    if (i === index) return "center";
    if (i === prev) return "left";
    if (i === next) return "right";
    return "hidden";
  };

  return (
    <div
      className="svc-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="svc-stage">
        {items.map((s, i) => {
          const pos = posOf(i);
          return (
            <motion.div
              key={s._id || i}
              className={`svc-card svc-${pos}`}
              animate={{
                x: pos === "left" ? "-58%" : pos === "right" ? "58%" : "0%",
                scale: pos === "center" ? 1 : 0.82,
                opacity: pos === "hidden" ? 0 : pos === "center" ? 1 : 0.45,
                rotateY: pos === "left" ? 18 : pos === "right" ? -18 : 0,
                zIndex: pos === "center" ? 3 : 1,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              style={{ pointerEvents: pos === "center" ? "auto" : "none" }}
              onClick={() => pos !== "center" && goTo(i)}
            >
              <div className="svc-card-inner">
                <div className="svc-icon">
                  {s.icon ? <Icon name={s.icon} /> : <FiStar />}
                </div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <button className="svc-nav prev" onClick={() => go(-1)} aria-label="Previous">
            <FiChevronLeft />
          </button>
          <button className="svc-nav next" onClick={() => go(1)} aria-label="Next">
            <FiChevronRight />
          </button>
          <div className="svc-dots">
            {items.map((_, i) => (
              <button
                key={i}
                className={`svc-dot ${i === index ? "active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
