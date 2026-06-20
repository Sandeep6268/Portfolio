"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial } from "@react-three/drei";

/**
 * Subtle low-poly floating 3D shapes used as an accent behind the About text.
 * Light: a handful of distorting icosahedrons, no heavy postprocessing.
 */
function Blob({ position, color, scale, speed }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = t * 0.15 * speed;
      ref.current.rotation.y = t * 0.2 * speed;
    }
  });
  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1.5}>
      <Icosahedron ref={ref} args={[1, 4]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          roughness={0.25}
          metalness={0.4}
          distort={0.4}
          speed={2}
          transparent
          opacity={0.85}
        />
      </Icosahedron>
    </Float>
  );
}

export default function FloatingShapes() {
  const blobs = useMemo(
    () => [
      { position: [-3, 1.5, 0], color: "#8189ff", scale: 1.3, speed: 1.2 },
      { position: [3, -1, -1], color: "#ff8b8b", scale: 1.0, speed: 1.6 },
      { position: [1.5, 2, -2], color: "#6a73ff", scale: 0.7, speed: 2 },
      { position: [-2, -2, -1], color: "#9ca2ff", scale: 0.85, speed: 1.4 },
    ],
    []
  );

  return (
    <Canvas
      className="about-shapes-canvas"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, 2]} intensity={0.8} color="#8189ff" />
      {blobs.map((b, i) => (
        <Blob key={i} {...b} />
      ))}
    </Canvas>
  );
}
