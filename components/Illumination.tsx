
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Html } from '@react-three/drei';
import * as THREE from 'three';

// Building dimensions from other components
const BUILDING_HEIGHT = 10.4; // From Setbacks
const CROWN_BASE_Y = BUILDING_HEIGHT + 0.5; // Start above Setbacks, BELOW Spire
const CROWN_HEIGHT = 4.0;     // Additional height from Crown structure
// Export for Spire to use
export const CROWN_TOTAL_HEIGHT = CROWN_BASE_Y + CROWN_HEIGHT; // 14.9

const Illumination: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const crownRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  // Single shared LED material - animate this one instead of 56 materials
  const ledMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00bfff'),
      emissive: new THREE.Color('#00bfff'),
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0.9,
    });
  }, []);

  // Single shared crown glow material
  const crownGlowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffd700'),
      emissive: new THREE.Color('#ffd700'),
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0.9,
    });
  }, []);

  // Crown structure material - glass
  const crownGlassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#b8d4e8'),
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7,
    });
  }, []);

  // Crown structural steel
  const crownSteelMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d8dce0'),
      metalness: 0.85,
      roughness: 0.25,
    });
  }, []);

  // Accent ring material
  const accentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffe4b5'),
      emissive: new THREE.Color('#ffe4b5'),
      emissiveIntensity: 1,
      transparent: true,
      opacity: 0.8,
    });
  }, []);

  // Shared geometries
  const ledBoxGeometry = useMemo(() => new THREE.BoxGeometry(0.04, CROWN_HEIGHT, 0.04), []);
  const smallLedGeometry = useMemo(() => new THREE.BoxGeometry(0.03, 0.5, 0.03), []);
  const glowSphereGeometry = useMemo(() => new THREE.SphereGeometry(0.05, 8, 8), []);

  // Crown observation deck levels
  const crownLevels = useMemo(() => [
    { y: 0, radius: 0.6, height: 0.8 },
    { y: 1.0, radius: 0.5, height: 0.7 },
    { y: 1.8, radius: 0.4, height: 0.6 },
    { y: 2.5, radius: 0.3, height: 0.5 },
    { y: 3.1, radius: 0.2, height: 0.4 },
  ], []);

  // Vertical LED channel positions (reduced from 8 to 4)
  const ledChannelAngles = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => (i / 4) * Math.PI * 2),
  []);

  // Crown light positions (reduced from 12 to 4)
  const crownLightPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const radius = 0.55;
      positions.push([
        Math.cos(angle) * radius,
        1.5,
        Math.sin(angle) * radius,
      ]);
    }
    return positions;
  }, []);

  // Ref for the single main light
  const mainLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const offset = scroll.offset;

    // Phase 5: 0.571 - 0.857
    const isVisible = offset > 0.54;

    if (groupRef.current) {
      groupRef.current.visible = isVisible;
    }

    // Skip all animations if not visible
    if (!isVisible) return;

    const time = state.clock.elapsedTime;
    const localProgress = Math.max(0, Math.min(1, (offset - 0.571) / 0.286));

    // Crown structure animation
    if (crownRef.current) {
      const targetY = THREE.MathUtils.lerp(CROWN_BASE_Y + 10, CROWN_BASE_Y, Math.min(localProgress * 1.8, 1));
      crownRef.current.position.y = targetY;
      crownRef.current.scale.setScalar(Math.min(localProgress * 2, 1));
    }

    // Animate shared materials (just 2 materials instead of 86!)
    const wave = Math.sin(time * 2) * 0.5 + 0.5;
    ledMaterial.emissiveIntensity = localProgress * (0.5 + wave);
    crownGlowMaterial.emissiveIntensity = localProgress * 2 * wave;

    // Single light animation
    if (mainLightRef.current) {
      mainLightRef.current.intensity = localProgress * 2;
    }

    // Label visibility
    if (labelRef.current) {
      labelRef.current.style.opacity = (offset > 0.60 && offset < 0.80) ? '1' : '0';
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* ===== CROWN STRUCTURE ===== */}
      <group ref={crownRef} position={[0, CROWN_BASE_Y + 10, 0]} scale={0}>

        {/* Main Crown Observation Deck Levels */}
        {crownLevels.map((level, i) => (
          <group key={`crown-level-${i}`} position={[0, level.y, 0]}>
            {/* Main deck ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[level.radius, 0.08, 8, 24]} />
              <primitive object={crownSteelMaterial} attach="material" />
            </mesh>

            {/* Glass panels - reduced from 6 to 3 */}
            {[0, 120, 240].map((angle, j) => (
              <mesh
                key={`glass-${i}-${j}`}
                position={[
                  Math.cos(THREE.MathUtils.degToRad(angle)) * level.radius,
                  0,
                  Math.sin(THREE.MathUtils.degToRad(angle)) * level.radius,
                ]}
                rotation={[0, THREE.MathUtils.degToRad(-angle), 0]}
              >
                <boxGeometry args={[0.15, level.height, 0.02]} />
                <primitive object={crownGlassMaterial} attach="material" />
              </mesh>
            ))}
          </group>
        ))}

        {/* Vertical LED Channels - using shared geometry and material */}
        {ledChannelAngles.map((angle, i) => (
          <mesh
            key={`led-channel-${i}`}
            geometry={ledBoxGeometry}
            material={ledMaterial}
            position={[
              Math.cos(angle) * 0.5,
              CROWN_HEIGHT / 2,
              Math.sin(angle) * 0.5,
            ]}
          />
        ))}

        {/* Crown Top Platform */}
        <mesh position={[0, CROWN_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
          <primitive object={crownSteelMaterial} attach="material" />
        </mesh>

        {/* Single main light instead of 12 */}
        <pointLight
          ref={mainLightRef}
          position={[0, 2, 0]}
          color="#ffd700"
          intensity={0}
          distance={6}
          decay={2}
        />

        {/* Crown glow meshes - reduced, using shared geometry/material */}
        {crownLightPositions.map((pos, i) => (
          <mesh
            key={`crown-glow-${i}`}
            position={pos}
            geometry={glowSphereGeometry}
            material={crownGlowMaterial}
          />
        ))}

        {/* Horizontal Accent Ring - just 1 instead of 3 */}
        <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.015, 8, 24]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>

        {/* Supporting Struts */}
        {[0, 120, 240].map((angle, i) => (
          <mesh
            key={`strut-${i}`}
            position={[
              Math.cos(THREE.MathUtils.degToRad(angle)) * 0.35,
              CROWN_HEIGHT / 2,
              Math.sin(THREE.MathUtils.degToRad(angle)) * 0.35,
            ]}
          >
            <boxGeometry args={[0.03, CROWN_HEIGHT, 0.03]} />
            <primitive object={crownSteelMaterial} attach="material" />
          </mesh>
        ))}
      </group>

      {/* ===== FACADE LED STRIPS - Simplified ===== */}
      {/* Reduced from 48 to 12 meshes, using shared geometry/material */}
      {[0, 120, 240].map((angle, stripIdx) => (
        <group key={`facade-strip-${stripIdx}`} rotation={[0, THREE.MathUtils.degToRad(angle), 0]}>
          {[3, 6, 9, 12].map((h, hIdx) => (
            <mesh
              key={`led-${stripIdx}-${hIdx}`}
              geometry={smallLedGeometry}
              material={ledMaterial}
              position={[0.7, h, 0]}
            />
          ))}
        </group>
      ))}

      {/* ===== PHASE LABEL ===== */}
      <Html position={[0, 18, 0]} center>
        <div
          ref={labelRef}
          className="pointer-events-none transition-opacity duration-500 bg-white/90 px-4 py-2 rounded-full shadow-lg border border-amber-100 flex items-center gap-3 whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Phase 05: Illumination
          </span>
        </div>
      </Html>
    </group>
  );
};

export default Illumination;
