
import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

import { ATMOSPHERE_TIMING } from '@/data/scrollConfig';

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

// 달 텍스처 생성 함수 (Canvas 기반)
const createMoonTexture = (): THREE.CanvasTexture => {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 10;

  // 배경 투명
  ctx.clearRect(0, 0, size, size);

  // 달 기본 - 노란색 그라데이션
  const gradient = ctx.createRadialGradient(cx * 0.85, cy * 0.85, 0, cx, cy, radius);
  gradient.addColorStop(0, '#FFFDE7');    // 밝은 중심
  gradient.addColorStop(0.5, '#FFE082');  // 중간 노란색
  gradient.addColorStop(0.85, '#FFD54F'); // 진한 노란색
  gradient.addColorStop(1, '#FFC107');    // 가장자리

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // 크레이터 (어두운 반점들)
  const craters = [
    { x: 0.3, y: 0.35, r: 0.12, opacity: 0.15 },
    { x: 0.55, y: 0.25, r: 0.08, opacity: 0.12 },
    { x: 0.7, y: 0.45, r: 0.15, opacity: 0.18 },
    { x: 0.4, y: 0.6, r: 0.1, opacity: 0.14 },
    { x: 0.25, y: 0.7, r: 0.07, opacity: 0.1 },
    { x: 0.6, y: 0.7, r: 0.13, opacity: 0.16 },
    { x: 0.75, y: 0.65, r: 0.06, opacity: 0.08 },
    { x: 0.5, y: 0.45, r: 0.18, opacity: 0.12 },
  ];

  craters.forEach(crater => {
    const craterX = cx + (crater.x - 0.5) * radius * 1.6;
    const craterY = cy + (crater.y - 0.5) * radius * 1.6;
    const craterR = crater.r * radius;

    const craterGrad = ctx.createRadialGradient(
      craterX, craterY, 0,
      craterX, craterY, craterR
    );
    craterGrad.addColorStop(0, `rgba(139, 119, 42, ${crater.opacity})`);
    craterGrad.addColorStop(0.7, `rgba(139, 119, 42, ${crater.opacity * 0.5})`);
    craterGrad.addColorStop(1, 'rgba(139, 119, 42, 0)');

    ctx.beginPath();
    ctx.arc(craterX, craterY, craterR, 0, Math.PI * 2);
    ctx.fillStyle = craterGrad;
    ctx.fill();
  });

  // 미세한 표면 질감
  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius * 0.9;
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist;
    const pr = 1 + Math.random() * 3;

    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 160, 80, ${0.05 + Math.random() * 0.08})`;
    ctx.fill();
  }

  // 가장자리 글로우 효과
  const glowGradient = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius + 8);
  glowGradient.addColorStop(0, 'rgba(255, 248, 200, 0)');
  glowGradient.addColorStop(0.5, 'rgba(255, 245, 180, 0.3)');
  glowGradient.addColorStop(1, 'rgba(255, 240, 150, 0)');

  ctx.beginPath();
  ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
  ctx.fillStyle = glowGradient;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

export const DayNightCycle: React.FC = () => {
  const { scene, camera } = useThree();
  const scroll = useScroll();

  // Refs
  const sunGroupRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Sprite>(null);
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

  // 달 Sprite 머티리얼 - Canvas 텍스처 사용 (완벽한 원형)
  const moonMaterial = useMemo(() => {
    const texture = createMoonTexture();
    return new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: false,  // 거리에 따른 크기 변화 없음 (항상 일정 크기)
    });
  }, []);

  useEffect(() => () => {
    sunMaterial.dispose();
    moonMaterial.map?.dispose();
    moonMaterial.dispose();
  }, [moonMaterial, sunMaterial]);

  useFrame(() => {
    const progress = scroll.offset;

    // ============================================
    // SKY BACKGROUND COLOR - 새 타이밍 (7 pages)
    // Phase 1-4 (0-0.571): 낮
    // Phase 5 (0.571-0.857): 석양→밤 전환
    // Phase 6 (0.857-1.0): 밤
    // ============================================
    let skyColor: THREE.Color;

    if (progress < ATMOSPHERE_TIMING.morningStart) {
      // 새벽 → 아침
      const t = progress / ATMOSPHERE_TIMING.morningLength;
      skyColor = tempColor.set(SKY_COLORS.dawn).lerp(tempColor2.set(SKY_COLORS.morning), t);
    } else if (progress < ATMOSPHERE_TIMING.middayStart) {
      // 아침 → 정오
      const t = (progress - ATMOSPHERE_TIMING.morningStart) / ATMOSPHERE_TIMING.middayLength;
      skyColor = tempColor.set(SKY_COLORS.morning).lerp(tempColor2.set(SKY_COLORS.midday), t);
    } else if (progress < ATMOSPHERE_TIMING.afternoonStart) {
      // 정오 → 오후 (Phase 4까지)
      const t = (progress - ATMOSPHERE_TIMING.middayStart) / ATMOSPHERE_TIMING.afternoonLength;
      skyColor = tempColor.set(SKY_COLORS.midday).lerp(tempColor2.set(SKY_COLORS.afternoon), t);
    } else if (progress < ATMOSPHERE_TIMING.sunsetStart) {
      // 오후 → 석양 (Phase 5 전반)
      const t = (progress - ATMOSPHERE_TIMING.afternoonStart) / ATMOSPHERE_TIMING.sunsetLength;
      skyColor = tempColor.set(SKY_COLORS.afternoon).lerp(tempColor2.set(SKY_COLORS.sunset), t);
    } else if (progress < ATMOSPHERE_TIMING.duskStart) {
      // 석양 → 황혼 (Phase 5 후반)
      const t = (progress - ATMOSPHERE_TIMING.sunsetStart) / ATMOSPHERE_TIMING.duskLength;
      skyColor = tempColor.set(SKY_COLORS.sunset).lerp(tempColor2.set(SKY_COLORS.dusk), t);
    } else {
      // 황혼 → 밤 (Phase 6)
      const t = (progress - ATMOSPHERE_TIMING.duskStart) / ATMOSPHERE_TIMING.finaleLength;
      skyColor = tempColor.set(SKY_COLORS.dusk).lerp(tempColor2.set(SKY_COLORS.night), t);
    }

    scene.background = skyColor;

    // Fog 비활성화 (경계선 이질감 제거)
    scene.fog = null;

    // ============================================
    // SUN - 새 타이밍에 맞춰 이동
    // ============================================
    if (sunGroupRef.current) {
      // 해는 0.75에서 사라짐 (Phase 5 중반)
      const sunProgress = Math.min(progress / ATMOSPHERE_TIMING.sunEnd, 1);
      const sunX = -8 + sunProgress * 5;     // -8 → -3
      const sunY = 12 - sunProgress * 18;    // 12 → -6 (내려감)
      const sunZ = -8;

      sunGroupRef.current.position.set(sunX, sunY, sunZ);
      sunGroupRef.current.lookAt(camera.position);

      // 70% 이후 페이드아웃
      const sunOpacity = progress < ATMOSPHERE_TIMING.sunFadeStart ? 1 : Math.max(0, 1 - (progress - ATMOSPHERE_TIMING.sunFadeStart) / ATMOSPHERE_TIMING.sunFadeLength);
      sunGroupRef.current.visible = sunOpacity > 0.01;
      sunGroupRef.current.scale.setScalar(2.5 + sunOpacity * 0.5);

      // 태양 색상 변화
      if (progress < ATMOSPHERE_TIMING.middayStart) {
        // 아침 - 밝은 노란색
        sunMaterial.uniforms.colorCenter.value.set('#FFFEF5');
        sunMaterial.uniforms.colorEdge.value.set('#FFD700');
      } else if (progress < ATMOSPHERE_TIMING.sunColorStart) {
        // 정오 - 순백색
        sunMaterial.uniforms.colorCenter.value.set('#FFFFFF');
        sunMaterial.uniforms.colorEdge.value.set('#FFF8DC');
      } else {
        // 석양 - 주황색/빨간색
        const t = (progress - ATMOSPHERE_TIMING.sunColorStart) / ATMOSPHERE_TIMING.sunWarmLength;
        sunMaterial.uniforms.colorCenter.value.set('#FFFFFF').lerp(tempColor2.set('#FFAA00'), t);
        sunMaterial.uniforms.colorEdge.value.set('#FF8C00').lerp(tempColor2.set('#FF4500'), t);
      }
    }

    // ============================================
    // MOON - Phase 5 중반(65%)부터 화면 우측 상단에 나타남
    // Sprite는 자동으로 카메라를 바라보므로 lookAt 불필요
    // ============================================
    if (moonRef.current) {
      const moonStart = ATMOSPHERE_TIMING.moonStart;
      const moonProgress = Math.max(0, (progress - moonStart) / (1 - moonStart));

      // 우측 상단 위치 (X 양수, Y 높음)
      const moonX = 8 + moonProgress * 2;    // 8 → 10 (우측)
      const moonY = 12 + moonProgress * 8;   // 12 → 20 (상단으로 올라감)
      const moonZ = -15;                      // 뒤쪽 배경

      moonRef.current.position.set(moonX, moonY, moonZ);
      moonRef.current.visible = progress > moonStart;

      // 페이드인 & 크기 (Sprite scale은 화면 비율)
      const moonOpacity = Math.min(1, moonProgress * 2.0);
      const moonSize = 0.08 + moonOpacity * 0.02;  // 화면 대비 크기
      moonRef.current.scale.set(moonSize, moonSize, 1);

      // 투명도 조절
      (moonRef.current.material as THREE.SpriteMaterial).opacity = moonOpacity;
    }

    // ============================================
    // SUN LIGHT - 새 타이밍
    // ============================================
    if (sunLightRef.current) {
      let intensity: number;
      if (progress < ATMOSPHERE_TIMING.afternoonStart) {
        // 낮 (Phase 1-4)
        intensity = 1.5;
      } else if (progress < ATMOSPHERE_TIMING.sunEnd) {
        // 석양 (Phase 5 전반)
        intensity = THREE.MathUtils.lerp(1.5, 0.4, (progress - ATMOSPHERE_TIMING.afternoonStart) / ATMOSPHERE_TIMING.sunSetLength);
      } else {
        // 밤 (Phase 5 후반 ~ Phase 6)
        intensity = THREE.MathUtils.lerp(0.4, 0, (progress - ATMOSPHERE_TIMING.sunEnd) / ATMOSPHERE_TIMING.sunNightLength);
      }
      sunLightRef.current.intensity = intensity;

      // Color warms during sunset
      if (progress < ATMOSPHERE_TIMING.sunColorStart) {
        sunLightRef.current.color.setHex(0xFFFAF0);
      } else if (progress < ATMOSPHERE_TIMING.sunEnd) {
        const t = (progress - ATMOSPHERE_TIMING.sunColorStart) / ATMOSPHERE_TIMING.sunColorLength;
        sunLightRef.current.color.set('#FFFAF0').lerp(tempColor2.set('#FF8C00'), t);
      } else {
        sunLightRef.current.color.setHex(0x2F2F4F);
      }
    }

    // ============================================
    // MOON LIGHT - 65%부터 서서히
    // ============================================
    if (moonLightRef.current) {
      const moonProgress = Math.max(0, (progress - ATMOSPHERE_TIMING.moonStart) / ATMOSPHERE_TIMING.moonLength);
      moonLightRef.current.intensity = moonProgress * 0.2;
    }

    // ============================================
    // AMBIENT LIGHT - 새 타이밍 적용
    // ============================================
    if (ambientRef.current) {
      let ambientIntensity: number;
      if (progress < ATMOSPHERE_TIMING.afternoonStart) {
        // 낮 (Phase 1-4) - 밝음
        ambientIntensity = 0.6;
      } else if (progress < ATMOSPHERE_TIMING.sunEnd) {
        // 석양 (Phase 5 전반) - 점점 어두워짐
        ambientIntensity = THREE.MathUtils.lerp(0.6, 0.12, (progress - ATMOSPHERE_TIMING.afternoonStart) / ATMOSPHERE_TIMING.sunSetLength);
      } else if (progress < ATMOSPHERE_TIMING.duskStart) {
        // 황혼 (Phase 5 후반) - 많이 어두움
        ambientIntensity = THREE.MathUtils.lerp(0.12, 0.02, (progress - ATMOSPHERE_TIMING.sunEnd) / ATMOSPHERE_TIMING.ambientTwilightLength);
      } else {
        // 밤 (Phase 6) - 거의 암흑
        ambientIntensity = THREE.MathUtils.lerp(0.02, 0.008, (progress - ATMOSPHERE_TIMING.duskStart) / ATMOSPHERE_TIMING.finaleLength);
      }
      ambientRef.current.intensity = ambientIntensity;

      // Color shifts to deep blue at night
      if (progress < ATMOSPHERE_TIMING.moonStart) {
        ambientRef.current.color.setHex(0xFFF8DC);
      } else {
        const t = (progress - ATMOSPHERE_TIMING.moonStart) / ATMOSPHERE_TIMING.moonLength;
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
        position={[8, 15, -8]}
        intensity={0}
        color="#E8E8F0"
      />

      {/* ===== SUN ===== 그라데이션 쉐이더 적용 */}
      <group ref={sunGroupRef} position={[-8, 12, -8]}>
        <mesh material={sunMaterial}>
          <planeGeometry args={[4, 4]} />
        </mesh>
      </group>

      {/* ===== MOON ===== 노란색 보름달 Sprite (우측 상단, 완벽한 원형) */}
      <sprite
        ref={moonRef}
        position={[8, 12, -15]}
        material={moonMaterial}
        visible={false}
      />
    </>
  );
};
