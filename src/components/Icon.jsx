"use client";
import React, { useEffect, useState } from "react";

/**
 * Universal icon renderer used everywhere in the portfolio.
 *
 * The `name` prop can be:
 *   1. A URL (http..., /path, or a data: URI ending in an image/svg) -> rendered as <img>
 *   2. A react-icons component name e.g. "FaGithub", "SiReact", "FiCode", "MdEmail"
 *      The 2-letter (sometimes 3) lowercase prefix maps to the react-icons subpackage:
 *        Fa->fa, Fa6->fa6, Fi->fi, Si->si, Md->md, Ai->ai, Bi->bi, Bs->bs,
 *        Di->di, Gi->gi, Go->go, Hi->hi, Hi2->hi2, Im->im, Io->io, Io5->io5,
 *        Ri->ri, Tb->tb, Ti->ti, Vsc->vsc, Cg->cg, Gr->gr, Lia->lia, Lu->lu, Pi->pi,
 *        Sl->sl, Tfi->tfi, Wi->wi, Fc->fc
 *
 * Falls back to a small monogram when the icon can't be resolved.
 */

// prefixes ordered longest-first so e.g. "Hi2" beats "Hi"
const PREFIXES = [
  ["Fa6", "fa6"], ["Hi2", "hi2"], ["Io5", "io5"], ["Lia", "lia"], ["Tfi", "tfi"],
  ["Vsc", "vsc"],
  ["Ai", "ai"], ["Bi", "bi"], ["Bs", "bs"], ["Cg", "cg"], ["Ci", "ci"], ["Di", "di"],
  ["Fa", "fa"], ["Fc", "fc"], ["Fi", "fi"], ["Gi", "gi"], ["Go", "go"],
  ["Gr", "gr"], ["Hi", "hi"], ["Im", "im"], ["Io", "io"], ["Lu", "lu"],
  ["Md", "md"], ["Pi", "pi"], ["Ri", "ri"], ["Rx", "rx"], ["Si", "si"], ["Sl", "sl"],
  ["Tb", "tb"], ["Ti", "ti"], ["Wi", "wi"],
];

const loaders = {
  fa: () => import("react-icons/fa"),
  fa6: () => import("react-icons/fa6"),
  fi: () => import("react-icons/fi"),
  si: () => import("react-icons/si"),
  md: () => import("react-icons/md"),
  ai: () => import("react-icons/ai"),
  bi: () => import("react-icons/bi"),
  bs: () => import("react-icons/bs"),
  cg: () => import("react-icons/cg"),
  ci: () => import("react-icons/ci"),
  di: () => import("react-icons/di"),
  fc: () => import("react-icons/fc"),
  gi: () => import("react-icons/gi"),
  go: () => import("react-icons/go"),
  gr: () => import("react-icons/gr"),
  hi: () => import("react-icons/hi"),
  hi2: () => import("react-icons/hi2"),
  im: () => import("react-icons/im"),
  io: () => import("react-icons/io"),
  io5: () => import("react-icons/io5"),
  lia: () => import("react-icons/lia"),
  lu: () => import("react-icons/lu"),
  pi: () => import("react-icons/pi"),
  ri: () => import("react-icons/ri"),
  rx: () => import("react-icons/rx"),
  sl: () => import("react-icons/sl"),
  tb: () => import("react-icons/tb"),
  tfi: () => import("react-icons/tfi"),
  ti: () => import("react-icons/ti"),
  vsc: () => import("react-icons/vsc"),
  wi: () => import("react-icons/wi"),
};

const cache = new Map();

export function isUrlIcon(name) {
  if (!name) return false;
  const v = String(name).trim();
  return (
    v.startsWith("http://") ||
    v.startsWith("https://") ||
    v.startsWith("/") ||
    v.startsWith("data:")
  );
}

function packKeyFor(name) {
  for (const [prefix, key] of PREFIXES) {
    if (name.startsWith(prefix)) return key;
  }
  return null;
}

export default function Icon({ name, className, style, size }) {
  const [Comp, setComp] = useState(null);
  const url = isUrlIcon(name);

  useEffect(() => {
    let active = true;
    if (!name || url) {
      setComp(null);
      return;
    }
    const key = packKeyFor(name);
    if (!key || !loaders[key]) {
      setComp(null);
      return;
    }

    const cacheKey = `${key}:${name}`;
    if (cache.has(cacheKey)) {
      setComp(() => cache.get(cacheKey));
      return;
    }

    loaders[key]()
      .then((mod) => {
        if (!active) return;
        const C = mod[name];
        if (C) {
          cache.set(cacheKey, C);
          setComp(() => C);
        } else {
          setComp(null);
        }
      })
      .catch(() => active && setComp(null));

    return () => {
      active = false;
    };
  }, [name, url]);

  if (url) {
    return (
      <img
        src={name}
        alt=""
        className={className}
        style={{ width: size || "1em", height: size || "1em", objectFit: "contain", ...style }}
      />
    );
  }

  if (Comp) {
    return <Comp className={className} style={style} size={size} />;
  }

  // fallback monogram
  const letter = (name || "?").replace(/^[A-Z][a-z0-9]*/, "").charAt(0) || (name || "?").charAt(2) || "•";
  return (
    <span className={className} style={{ fontWeight: 700, ...style }}>
      {letter.toUpperCase()}
    </span>
  );
}
