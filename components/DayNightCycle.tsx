
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

// Sky color progression through the day
const SKY_COLORS = {
  dawn: '#87CEEB',      // 0% - Morning blue
  morning: '#7EC8E3',   // 15% - Light blue
  midday: '#4A90C2',    // 30% - Clear blue
  afternoon: '#F4A460', // 50% - Sandy orange
  sunset: '#FF6B35',    // 65% - Deep orange
  dusk: '#1a0a30',      // 80% - Dark purple
  night: '#010108',     // 100% - Near black
};

// 태양 그라데이션 쉐이더
const sunVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFragmentShader = `
  varying vec2 vUv;
  uniform vec3 colorCenter;
  uniform vec3 colorEdge;
  uniform float time;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center) * 2.0;

    // 부드러운 원형 그라데이션
    float alpha = 1.0 - smoothstep(0.0, 1.0, dist);

    // 중심에서 가장자리로 색상 변화
    vec3 color = mix(colorCenter, colorEdge, pow(dist, 0.5));

    // 가장자리 부드럽게 페이드
    alpha *= smoothstep(1.0, 0.3, dist);

    gl_FragColor = vec4(color, alpha);
  }
`;

// 달 그라데이션 쉐이더
const moonFragmentShader = `
  varying vec2 vUv;
  uniform vec3 colorCenter;
  uniform vec3 colorEdge;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center) * 2.0;

    // 달은 더 선명한 가장자리
    float alpha = 1.0 - smoothstep(0.6, 1.0, dist);

    // 부드러운 색상 전환
    vec3 color = mix(colorCenter, colorEdge, pow(dist, 0.8));

    // 은은한 글로우
    float glow = 1.0 - smoothstep(0.0, 1.0, dist);
    alpha = max(alpha, glow * 0.3);

    gl_FragColor = vec4(color, alpha);
  }
`;

const DayNightCycle: React.FC = () => {
  const { scene, camera } = useThree();
  const scroll = useScroll();

  // Refs
  const sunGroupRef = useRef<THREE.Group>(null);
  const moonGroupRef = useRef<THREE.Group>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const moonLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  const tempColor = useMemo(() => new THREE.Color(), []);
  const tempColor2 = useMemo(() => new THREE.Color(), []);

  // 태양 쉐이더 머티리얼
  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: sunVertexShader,
      fragmentShader: sunFragmentShader,
      uniforms: {
        colorCenter: { value: new THREE.Color('#FFFFFF') },
        colorEdge: { value: new THREE.Color('#FF8C00') },
        time: { value: 0 },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, []);

  // 달 쉐이더 머티리얼 - 노란색 달
  const moonMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: sunVertexShader,
      fragmentShader: moonFragmentShader,
      uniforms: {
        colorCenter: { value: new THREE.Color('#FFE566') },  // 밝은 노란색
        colorEdge: { value: new THREE.Color('#FFD700') },    // 골드
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, []);

  useFrame(() => {
    const progress = scroll.offset;

    // ============================================
    // SKY BACKGROUND COLOR - 새 타이밍 (7 pages)
    // Phase 1-4 (0-0.571): 낮
    // Phase 5 (0.571-0.857): 석양→밤 전환
    // Phase 6 (0.857-1.0): 밤
    // ============================================
    let skyColor: THREE.Color;

    if (progress < 0.14) {
      // 새벽 → 아침
      const t = progress / 0.14;
      skyColor = tempColor.set(SKY_COLORS.dawn).lerp(tempColor2.set(SKY_COLORS.morning), t);
    } else if (progress < 0.35) {
      // 아침 → 정오
      const t = (progress - 0.14) / 0.21;
      skyColor = tempColor.set(SKY_COLORS.morning).lerp(tempColor2.set(SKY_COLORS.midday), t);
    } else if (progress < 0.57) {
      // 정오 → 오후 (Phase 4까지)
      const t = (progress - 0.35) / 0.22;
      skyColor = tempColor.set(SKY_COLORS.midday).lerp(tempColor2.set(SKY_COLORS.afternoon), t);
    } else if (progress < 0.70) {
      // 오후 → 석양 (Phase 5 전반)
      const t = (progress - 0.57) / 0.13;
      skyColor = tempColor.set(SKY_COLORS.afternoon).lerp(tempColor2.set(SKY_COLORS.sunset), t);
    } else if (progress < 0.857) {
      // 석양 → 황혼 (Phase 5 후반)
      const t = (progress - 0.70) / 0.157;
      skyColor = tempColor.set(SKY_COLORS.sunset).lerp(tempColor2.set(SKY_COLORS.dusk), t);
    } else {
      // 황혼 → 밤 (Phase 6)
      const t = (progress - 0.857) / 0.143;
      skyColor = tempColor.set(SKY_COLORS.dusk).lerp(tempColor2.set(SKY_COLORS.night), t);
    }

    scene.background = skyColor;

    // ============================================
    // SUN - 새 타이밍에 맞춰 이동
    // ============================================
    if (sunGroupRef.current) {
      // 해는 0.75에서 사라짐 (Phase 5 중반)
      const sunProgress = Math.min(progress / 0.75, 1);
      const sunX = -8 + sunProgress * 5;     // -8 → -3
      const sunY = 12 - sunProgress * 18;    // 12 → -6 (내려감)
      const sunZ = -8;

      sunGroupRef.current.position.set(sunX, sunY, sunZ);
      sunGroupRef.current.lookAt(camera.position);

      // 70% 이후 페이드아웃
      const sunOpacity = progress < 0.70 ? 1 : Math.max(0, 1 - (progress - 0.70) / 0.12);
      sunGroupRef.current.visible = sunOpacity > 0.01;
      sunGroupRef.current.scale.setScalar(2.5 + sunOpacity * 0.5);

      // 태양 색상 변화
      if (progress < 0.35) {
        // 아침 - 밝은 노란색
        sunMaterial.uniforms.colorCenter.value.set('#FFFEF5');
        sunMaterial.uniforms.colorEdge.value.set('#FFD700');
      } else if (progress < 0.55) {
        // 정오 - 순백색
        sunMaterial.uniforms.colorCenter.value.set('#FFFFFF');
        sunMaterial.uniforms.colorEdge.value.set('#FFF8DC');
      } else {
        // 석양 - 주황색/빨간색
        const t = (progress - 0.55) / 0.25;
        sunMaterial.uniforms.colorCenter.value.set('#FFFFFF').lerp(tempColor2.set('#FFAA00'), t);
        sunMaterial.uniforms.colorEdge.value.set('#FF8C00').lerp(tempColor2.set('#FF4500'), t);
      }
    }

    // ============================================
    // MOON - Phase 5 중반(65%)부터 나타남
    // ============================================
    if (moonGroupRef.current) {
      const moonStart = 0.65;
      const moonProgress = Math.max(0, (progress - moonStart) / (1 - moonStart));

      const moonX = -4 + moonProgress * 3;   // -4 → -1
      const moonY = 4 + moonProgress * 10;   // 4 → 14 (올라감)
      const moonZ = -8;

      moonGroupRef.current.position.set(moonX, moonY, moonZ);
      moonGroupRef.current.lookAt(camera.position);

      moonGroupRef.current.visible = progress > moonStart;

      // 페이드인 & 크기
      const moonOpacity = Math.min(1, moonProgress * 2.5);
      moonGroupRef.current.scale.setScalar(1.5 + moonOpacity * 0.5);
    }

    // ============================================
    // SUN LIGHT - 새 타이밍
    // ============================================
    if (sunLightRef.current) {
      let intensity: number;
      if (progress < 0.57) {
        // 낮 (Phase 1-4)
        intensity = 1.5;
      } else if (progress < 0.75) {
        // 석양 (Phase 5 전반)
        intensity = THREE.MathUtils.lerp(1.5, 0.4, (progress - 0.57) / 0.18);
      } else {
        // 밤 (Phase 5 후반 ~ Phase 6)
        intensity = THREE.MathUtils.lerp(0.4, 0, (progress - 0.75) / 0.25);
      }
      sunLightRef.current.intensity = intensity;

      // Color warms during sunset
      if (progress < 0.55) {
        sunLightRef.current.color.setHex(0xFFFAF0);
      } else if (progress < 0.75) {
        const t = (progress - 0.55) / 0.2;
        sunLightRef.current.color.set('#FFFAF0').lerp(tempColor2.set('#FF8C00'), t);
      } else {
        sunLightRef.current.color.setHex(0x2F2F4F);
      }
    }

    // ============================================
    // MOON LIGHT - 65%부터 서서히
    // ============================================
    if (moonLightRef.current) {
      const moonProgress = Math.max(0, (progress - 0.65) / 0.35);
      moonLightRef.current.intensity = moonProgress * 0.2;
    }

    // ============================================
    // AMBIENT LIGHT - 새 타이밍 적용
    // ============================================
    if (ambientRef.current) {
      let ambientIntensity: number;
      if (progress < 0.57) {
        // 낮 (Phase 1-4) - 밝음
        ambientIntensity = 0.6;
      } else if (progress < 0.75) {
        // 석양 (Phase 5 전반) - 점점 어두워짐
        ambientIntensity = THREE.MathUtils.lerp(0.6, 0.12, (progress - 0.57) / 0.18);
      } else if (progress < 0.857) {
        // 황혼 (Phase 5 후반) - 많이 어두움
        ambientIntensity = THREE.MathUtils.lerp(0.12, 0.02, (progress - 0.75) / 0.107);
      } else {
        // 밤 (Phase 6) - 거의 암흑
        ambientIntensity = THREE.MathUtils.lerp(0.02, 0.008, (progress - 0.857) / 0.143);
      }
      ambientRef.current.intensity = ambientIntensity;

      // Color shifts to deep blue at night
      if (progress < 0.65) {
        ambientRef.current.color.setHex(0xFFF8DC);
      } else {
        const t = (progress - 0.65) / 0.35;
        ambientRef.current.color.set('#FFF8DC').lerp(tempColor2.set('#050510'), t);
      }
    }
  });

  return (
    <>
      {/* ===== LIGHTS ===== */}
      <ambientLight ref={ambientRef} intensity={0.5} color="#FFF8DC" />

      <directionalLight
        ref={sunLightRef}
        position={[10, 15, 10]}
        intensity={1.5}
        color="#FFFAF0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <directionalLight
        ref={moonLightRef}
        position={[-10, 12, -5]}
        intensity={0}
        color="#B0C4DE"
      />

      {/* ===== SUN ===== 그라데이션 쉐이더 적용 */}
      <group ref={sunGroupRef} position={[-8, 12, -8]}>
        <mesh material={sunMaterial}>
          <planeGeometry args={[4, 4]} />
        </mesh>
      </group>

      {/* ===== MOON ===== 그라데이션 쉐이더 적용 */}
      <group ref={moonGroupRef} position={[-4, 5, -8]} visible={false}>
        <mesh material={moonMaterial}>
          <planeGeometry args={[3, 3]} />
        </mesh>
      </group>
    </>
  );
};

export default DayNightCycle;
