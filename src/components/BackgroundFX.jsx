"use client";
import dynamic from "next/dynamic";

// WebGL components must only render on the client.
const SmokeyCursor = dynamic(() => import("./SmokeyCursor"), { ssr: false });
const StarsBackground = dynamic(() => import("./StarsBackground"), { ssr: false });

/**
 * Renders the optional visual effects (smokey WebGL cursor + 3D star field)
 * based on theme toggles set in the admin panel.
 */
export default function BackgroundFX({ enableCursor = true, enableStars = true }) {
  return (
    <>
      {enableStars && <StarsBackground />}
      {enableCursor && <SmokeyCursor />}
    </>
  );
}
