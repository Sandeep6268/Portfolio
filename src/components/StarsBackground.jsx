"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion } from "framer-motion";

/**
 * Fixed full-screen animated star field, ported from the original portfolio.
 * Lightweight: just a rotating Stars instancing mesh (one draw call) so it's
 * cheap on the GPU. Loaded with ssr:false from BackgroundFX.
 */
export default function StarsBackground() {
  return (
    <motion.div
      className="hero-image-fixed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ duration: 1 }}
      aria-hidden="true"
    >
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} enablePan={false} enableRotate={false} />
      </Canvas>
      <div className="glow-effect" />
    </motion.div>
  );
}
