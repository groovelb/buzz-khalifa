
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { BUILDING, WING_ANGLES, COLORS, PHASES, getTiersByPhase, getTierAnimationDelay } from './BurjKhalifaData';
import { getDayNightState } from '../hooks/useDayNight';

/**
 * Cladding Component - Phase 4: Mid Tower
 * Tier 8-14 (7개 Tier)
 *
 * 구조적 특징:
 * - 스캘럽 패턴: 각 Tier에서 3개 날개가 서로 다른 길이
 * - tierIndex % 3 번째 날개가 70% 길이로 후퇴 (하부보다 더 뚜렷)
 * - 회전 없음 - 길이 차이가 나선형 실루엣 생성
 *
 * 총 높이: ~12.5 units
 * 애니메이션: 중간 속도 (모멘텀 형성)
 */
const Cladding: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const tiersRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  // Phase 4 Tier 데이터
  const tiers = useMemo(() => getTiersByPhase(4), []);

  // Lower Tower 높이 계산 (baseY 오프셋용)
  const baseYPosition = useMemo(() => {
    const lowerTiers = getTiersByPhase(3);
    return BUILDING.CORE_HEIGHT + lowerTiers.reduce((sum, t) => sum + t.height, 0);
  }, []);

  // 디버그 모드: debugColor 사용하여 각 Tier 시각화
  const DEBUG_MODE = false;

  // 알루미늄 프레임 재질 (노즈) - 광택감 강화
  const aluminumMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.ALUMINUM),
      roughness: 0.22,
      metalness: 0.92,
    });
  }, []);

  // 수평 멀리언 재질 (밝은 알루미늄) - 미세한 광택
  const mullionMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.MULLION),
      roughness: 0.25,
      metalness: 0.88,
    });
  }, []);

  // 중앙 스파인 재질 (어두운) - 깊이감 있는 금속
  const spineMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.SPINE),
      roughness: 0.45,
      metalness: 0.55,
    });
  }, []);

  // 가장자리 핀 재질 - 섬세한 금속 질감
  const edgeFinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.EDGE_FIN),
      roughness: 0.38,
      metalness: 0.62,
    });
  }, []);

  // 유리 재질 - 세련된 반사/투과 (낮/밤 반응)
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(COLORS.GLASS),
      roughness: 0.05,
      metalness: 0.18,
      transparent: true,
      opacity: 0.88,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
      emissive: new THREE.Color('#000000'),
      emissiveIntensity: 0,
    });
  }, []);

  // 창문 내부 발광 재질 (밤에 켜짐)
  const windowGlowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFF8E8'),
      emissive: new THREE.Color('#FFECD0'),
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0,
    });
  }, []);

  // 멀리언 간격
  const MULLION_SPACING = 0.22;


  useFrame(() => {
    const offset = scroll.offset;
    const { start, end } = PHASES.MID_TOWER;

    const isVisible = offset > start - 0.02;
    const localProgress = Math.max(0, Math.min(1, (offset - start) / (end - start)));

    if (groupRef.current) {
      groupRef.current.visible = isVisible;
    }

    if (!isVisible) return;

    // 낮/밤 상태 계산
    const dayNight = getDayNightState(offset);

    // 단순한 따뜻한 백색 글로우
    const warmGlow = new THREE.Color('#FFE8D0');

    // 유리 재질 - 밤에 발광
    glassMaterial.emissive = warmGlow;
    glassMaterial.emissiveIntensity = dayNight.windowGlowIntensity * 1.6;
    glassMaterial.metalness = THREE.MathUtils.lerp(0.18, 0.08, dayNight.nightIntensity);
    glassMaterial.opacity = THREE.MathUtils.lerp(0.88, 0.72, dayNight.nightIntensity);

    // 창문 내부 발광 - 깔끔한 단일 색상
    windowGlowMaterial.emissive = warmGlow;
    windowGlowMaterial.emissiveIntensity = dayNight.windowGlowIntensity * 2.8;
    windowGlowMaterial.opacity = dayNight.windowGlowIntensity * 0.88;

    // Tier 순차 애니메이션 - 중간 속도
    if (tiersRef.current) {
      tiersRef.current.children.forEach((tierGroup, index) => {
        const tierDelay = getTierAnimationDelay(index, tiers.length);
        const adjustedProgress = Math.max(0, (localProgress - tierDelay * 0.45) / (1 - tierDelay * 0.45));
        const tierProgress = Math.max(0, Math.min(1, adjustedProgress * 1.6));

        const scale = THREE.MathUtils.smoothstep(tierProgress, 0, 0.5);
        tierGroup.scale.set(scale, scale, scale);
        tierGroup.visible = tierProgress > 0.01;
      });
    }

    if (labelRef.current) {
      labelRef.current.style.opacity = (offset > 0.45 && offset < 0.55) ? '1' : '0';
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <group ref={tiersRef} position={[0, baseYPosition, 0]}>
        {tiers.map((tier, tierIndex) => {
          // 누적 Y 위치
          const localTiers = tiers.slice(0, tierIndex);
          const baseY = localTiers.reduce((sum, t) => sum + t.height, 0);

          return (
            <group
              key={tier.id}
              position={[0, baseY, 0]}
              // 회전 제거 - 스캘럽 패턴이 나선 효과 생성
            >
              {/* Y자형 3개 날개 - 각각 다른 길이 */}
              {WING_ANGLES.map((angle, wingIndex) => {
                // 핵심: 각 날개별 개별 치수 사용
                const wingLength = tier.wingLengths[wingIndex];
                const wingWidth = tier.wingWidths[wingIndex];

                // 길이가 0이면 렌더링 안함
                if (wingLength <= 0) return null;

                // 멀리언 개수 계산
                const mullionCount = Math.floor(tier.height / MULLION_SPACING);

                return (
                  <group key={wingIndex} rotation={[0, THREE.MathUtils.degToRad(angle), 0]}>
                    {/* 유리 커튼월 (배경) */}
                    <mesh position={[0, tier.height / 2, wingLength / 2]}>
                      <boxGeometry args={[wingWidth * 0.85, tier.height - 0.03, wingLength * 0.92]} />
                      <primitive object={glassMaterial} attach="material" />
                    </mesh>

                    {/* 중앙 스파인 (어두운 수직선) */}
                    <mesh position={[0, tier.height / 2, wingLength / 2 + 0.01]}>
                      <boxGeometry args={[wingWidth * 0.08, tier.height - 0.02, wingLength * 0.95]} />
                      <primitive object={spineMaterial} attach="material" />
                    </mesh>

                    {/* 가장자리 핀 (양쪽) */}
                    {[-1, 1].map((side) => (
                      <mesh
                        key={`fin-${side}`}
                        position={[side * wingWidth * 0.42, tier.height / 2, wingLength / 2]}
                      >
                        <boxGeometry args={[0.015, tier.height - 0.02, wingLength * 0.9]} />
                        <primitive object={edgeFinMaterial} attach="material" />
                      </mesh>
                    ))}

                    {/* 수평 멀리언 (층간 라인) */}
                    {Array.from({ length: mullionCount }).map((_, i) => (
                      <mesh
                        key={`mullion-${i}`}
                        position={[0, (i + 0.5) * MULLION_SPACING, wingLength / 2 + 0.015]}
                      >
                        <boxGeometry args={[wingWidth * 0.9, 0.012, wingLength * 0.92]} />
                        <primitive object={mullionMaterial} attach="material" />
                      </mesh>
                    ))}

                    {/* 날개 끝 - Lobular (둥근) 형태 - 알루미늄 프레임 */}
                    <mesh position={[0, tier.height / 2, wingLength]} castShadow>
                      <cylinderGeometry args={[wingWidth / 2.8, wingWidth / 2.5, tier.height - 0.02, 10]} />
                      <primitive object={aluminumMaterial} attach="material" />
                    </mesh>

                    {/* 노즈 수직 패널 라인 */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <mesh
                        key={`nose-line-${deg}`}
                        position={[
                          Math.sin(THREE.MathUtils.degToRad(deg)) * wingWidth / 2.65,
                          tier.height / 2,
                          wingLength + Math.cos(THREE.MathUtils.degToRad(deg)) * wingWidth / 2.65
                        ]}
                      >
                        <boxGeometry args={[0.008, tier.height - 0.03, 0.008]} />
                        <primitive object={edgeFinMaterial} attach="material" />
                      </mesh>
                    ))}

                    {/* 창문 내부 발광 (밤에 보임) */}
                    <mesh position={[0, tier.height / 2, wingLength / 2 - 0.02]}>
                      <boxGeometry args={[wingWidth * 0.75, tier.height - 0.08, wingLength * 0.85]} />
                      <primitive object={windowGlowMaterial} attach="material" />
                    </mesh>
                  </group>
                );
              })}

              {/* 중앙 코어 - 테이퍼링 (비율 수정) */}
              <mesh position={[0, tier.height / 2, 0]} castShadow>
                <cylinderGeometry args={[BUILDING.CORE_RADIUS * 0.55, BUILDING.CORE_RADIUS * 0.65, tier.height - 0.02, 6]} />
                <meshStandardMaterial
                  color={DEBUG_MODE ? tier.debugColor : COLORS.CONCRETE}
                  roughness={0.85}
                  metalness={0.02}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Phase 라벨 */}
      <Html position={[0, 30, 0]} center>
        <div
          ref={labelRef}
          className="pointer-events-none transition-opacity duration-500 bg-white/90 px-4 py-2 rounded-full shadow-lg border border-sky-100 flex items-center gap-3 whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          <div className="w-3 h-3 bg-sky-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Phase 04: Mid Tower
          </span>
        </div>
      </Html>
    </group>
  );
};

export default Cladding;
