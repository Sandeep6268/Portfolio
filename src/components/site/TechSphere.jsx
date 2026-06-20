"use client";
import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { FiPlus, FiMinus, FiMaximize } from "react-icons/fi";
import * as THREE from "three";
import Icon from "@/components/Icon";

/**
 * Crazy 3D rotating tech sphere: every skill icon is placed on a sphere using
 * a Fibonacci distribution and rendered as an HTML billboard so we can reuse the
 * react-icons / SVG <Icon>. The whole group auto-rotates and is drag-rotatable.
 */

function Word({ position, skill, onHover }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  // billboard: always face the camera
  useFrame(({ camera }) => {
    if (ref.current) ref.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={ref} position={position}>
      <Html center transform sprite distanceFactor={9} zIndexRange={[10, 0]}>
        <div
          className={`sphere-chip ${hovered ? "hovered" : ""}`}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            onHover?.(skill);
          }}
          onPointerOut={() => {
            setHovered(false);
            onHover?.(null);
          }}
        >
          <span className="sphere-chip-icon">
            <Icon name={skill.icon} />
          </span>
          <span className="sphere-chip-name">{skill.name}</span>
        </div>
      </Html>
    </group>
  );
}

function Cloud({ skills, radius = 6, onHover }) {
  const group = useRef();

  // Fibonacci sphere point distribution
  const positions = useMemo(() => {
    const n = skills.length;
    const pts = [];
    const offset = 2 / n;
    const increment = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;
      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;
      pts.push(new THREE.Vector3(x * radius, y * radius, z * radius));
    }
    return pts;
  }, [skills.length, radius]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={group}>
      {skills.map((skill, i) => (
        <Word key={skill._id || skill.name || i} position={positions[i]} skill={skill} onHover={onHover} />
      ))}
    </group>
  );
}

export default function TechSphere({ skills = [] }) {
  const [active, setActive] = useState(null);
  const controlsRef = useRef(null);

  // step-zoom for the +/- buttons: move the camera toward/away from the target,
  // clamped to the same min/max distance as scroll zoom (works across three versions).
  const zoom = (dir) => {
    const c = controlsRef.current;
    if (!c) return;
    const cam = c.object;
    const target = c.target;
    const dirVec = new THREE.Vector3().subVectors(cam.position, target);
    let dist = dirVec.length();
    dist = Math.min(26, Math.max(9, dist * (dir > 0 ? 0.8 : 1.25)));
    dirVec.setLength(dist);
    cam.position.copy(target).add(dirVec);
    c.update();
  };
  const resetView = () => {
    const c = controlsRef.current;
    if (!c) return;
    c.object.position.set(0, 0, 16);
    c.target.set(0, 0, 0);
    c.update();
  };

  if (!skills.length) return null;

  return (
    <div className="tech-sphere-wrap">
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 16], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#121212", 18, 45]} />
        <Cloud skills={skills} radius={6} onHover={setActive} />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom
          zoomSpeed={0.9}
          minDistance={9}
          maxDistance={26}
          rotateSpeed={0.9}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      {/* zoom controls */}
      <div className="tech-sphere-zoom">
        <button onClick={() => zoom(1)} aria-label="Zoom in"><FiPlus /></button>
        <button onClick={() => zoom(-1)} aria-label="Zoom out"><FiMinus /></button>
        <button onClick={resetView} aria-label="Reset view"><FiMaximize /></button>
      </div>

      {/* live readout of the hovered skill */}
      <div className={`tech-sphere-readout ${active ? "show" : ""}`}>
        {active && (
          <>
            <span className="rd-icon"><Icon name={active.icon} /></span>
            <div>
              <div className="rd-name">{active.name}</div>
              <div className="rd-bar"><span style={{ width: `${active.level || 0}%` }} /></div>
            </div>
            <span className="rd-level">{active.level}%</span>
          </>
        )}
      </div>
      <div className="tech-sphere-hint">Drag to rotate ↺ · Scroll / +− to zoom</div>
    </div>
  );
}
