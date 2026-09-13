"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface SceneProps {
  themePreset: string;
  colorPalette: string[];
  isExploding: boolean;
  onExplodeComplete: () => void;
}

// Particle System inside R3F
function ParticleField({ themePreset, colorPalette, isExploding, onExplodeComplete }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const [isMobile, setIsMobile] = useState(false);

  // Screen size detection for performance capping
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const particleCount = isMobile ? 1000 : 4500;

  // Track mouse coordinates for parallax
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Initialize particle positions, velocities, and color arrays
  const [positions, velocities, colors, originalPositions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const origPos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);

    const paletteColors = colorPalette.map((hex) => new THREE.Color(hex));

    for (let i = 0; i < particleCount; i++) {
      // Position
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 10;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;

      // Velocity (based on preset)
      if (themePreset === "cherry_blossoms") {
        // Slow falling down and swaying
        vel[i * 3] = (Math.random() - 0.5) * 0.02; // drift x
        vel[i * 3 + 1] = -(Math.random() * 0.02 + 0.005); // falling y
        vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02; // drift z
      } else if (themePreset === "cyber_glitch") {
        // Linear movement in grids
        vel[i * 3] = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.01 + 0.002);
        vel[i * 3 + 1] = 0;
        vel[i * 3 + 2] = 0;
      } else {
        // cosmic_hearts (ambient orbiting)
        vel[i * 3] = (Math.random() - 0.5) * 0.01;
        vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
        vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      }

      // Assign random color from palette
      const color = paletteColors[Math.floor(Math.random() * paletteColors.length)] || new THREE.Color("#8b5cf6");
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }

    return [pos, vel, cols, origPos];
  }, [particleCount, colorPalette, themePreset]);

  // Explosion state tracking
  const explosionProgress = useRef(0);
  const isExplodingActive = useRef(false);

  useEffect(() => {
    if (isExploding) {
      isExplodingActive.current = true;
      explosionProgress.current = 0.01; // start explosion
    }
  }, [isExploding]);

  // Frameloop animations
  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const posArray = posAttr.array as Float32Array;

    // Apply mouse parallax to particle points rotation
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, mouse.current.y * 0.015, 0.05);
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, mouse.current.x * 0.015, 0.05);

    // Update individual particle positions
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;

      if (isExplodingActive.current) {
        // Explode: push particles outwards violently
        const x = posArray[idx];
        const y = posArray[idx + 1];
        const z = posArray[idx + 2];

        const dist = Math.sqrt(x * x + y * y + z * z) || 1;
        // Direction vector from origin
        const dirX = x / dist;
        const dirY = y / dist;
        const dirZ = z / dist;

        const force = 10 / (dist * dist + 1) * (1 - explosionProgress.current);

        posArray[idx] += dirX * force * 0.5;
        posArray[idx + 1] += dirY * force * 0.5;
        posArray[idx + 2] += dirZ * force * 0.5;
      } else {
        // Standard motion based on themes
        if (themePreset === "cherry_blossoms") {
          // Falling & swaying
          posArray[idx + 1] += velocities[idx + 1]; // Fall
          posArray[idx] += Math.sin(time + idx) * 0.005; // Sway

          // Recycle particles that fall off bottom
          if (posArray[idx + 1] < -6) {
            posArray[idx + 1] = 6;
            posArray[idx] = (Math.random() - 0.5) * 15;
          }
        } else if (themePreset === "cyber_glitch") {
          // Grid-locked horizontal drift + random jitter
          posArray[idx] += velocities[idx];
          if (Math.abs(posArray[idx]) > 8) {
            posArray[idx] = -posArray[idx];
          }
          if (Math.random() > 0.995) {
            posArray[idx + 1] += (Math.random() - 0.5) * 0.6; // Glitch vertical step
          }
        } else {
          // cosmic_hearts (Orbiting orbital/wave drift)
          posArray[idx] = originalPositions[idx] + Math.sin(time * 0.5 + idx) * 0.4;
          posArray[idx + 1] = originalPositions[idx + 1] + Math.cos(time * 0.5 + idx) * 0.4;
          posArray[idx + 2] = originalPositions[idx + 2] + Math.sin(time * 0.2 + idx) * 0.3;
        }
      }
    }

    // Explosion progress increment
    if (isExplodingActive.current) {
      explosionProgress.current += 0.015;
      if (explosionProgress.current >= 1) {
        isExplodingActive.current = false;
        onExplodeComplete();
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={themePreset === "cyber_glitch" ? 0.04 : 0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Floating Glass Memory Cards (adds spatial parallax/depth)
function FloatingCards() {
  return (
    <group>
      {/* Glass Card 1 */}
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.4}>
        <mesh position={[-4, 2, -6]} rotation={[0.1, 0.2, 0.05]}>
          <boxGeometry args={[1.5, 2.2, 0.05]} />
          <meshPhysicalMaterial
            transmission={0.9}
            roughness={0.2}
            thickness={1}
            ior={1.5}
            color="#a855f7"
            transparent
            opacity={0.08}
          />
        </mesh>
      </Float>

      {/* Glass Card 2 */}
      <Float speed={1} rotationIntensity={0.15} floatIntensity={0.5}>
        <mesh position={[4.5, -2, -7]} rotation={[-0.05, -0.15, -0.1]}>
          <boxGeometry args={[2.2, 1.5, 0.05]} />
          <meshPhysicalMaterial
            transmission={0.85}
            roughness={0.2}
            thickness={0.8}
            ior={1.45}
            color="#ec4899"
            transparent
            opacity={0.06}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Main Canvas Scene exported to Client
export default function ApologyScene({ themePreset, colorPalette, isExploding, onExplodeComplete }: SceneProps) {
  // Select primary lighting colors based on palette
  const lightColor1 = colorPalette[0] || "#a855f7";
  const lightColor2 = colorPalette[1] || "#ec4899";

  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-[#09080f]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        <ambientLight intensity={0.4} />
        
        {/* Dynamic Colorful Lights matching generated palette */}
        <pointLight position={[10, 10, 10]} intensity={1.5} color={lightColor1} />
        <pointLight position={[-10, -10, -10]} intensity={1} color={lightColor2} />
        
        {/* Interactive Spot Light focusing on cursor/center */}
        <spotLight
          position={[0, 0, 8]}
          angle={0.6}
          penumbra={1}
          intensity={2}
          color={lightColor1}
          castShadow={false}
        />

        {/* 3D Content */}
        <ParticleField
          themePreset={themePreset}
          colorPalette={colorPalette}
          isExploding={isExploding}
          onExplodeComplete={onExplodeComplete}
        />
        
        <FloatingCards />
      </Canvas>
    </div>
  );
}
