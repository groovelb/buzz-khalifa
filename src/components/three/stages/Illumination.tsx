
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useBuildingProgress } from '@/components/three/BuildingProgressContext';
import { BUILDING, WING_ANGLES, COLORS, getTiersByPhase, getTierAnimationDelay } from '@/data/burjKhalifaData';
import { PHASES } from '@/data/scrollConfig';
import { getDayNightState } from '@/hooks/useDayNight';

/**
 * Illumination Component - Phase 5: Upper Tower
 * Tier 15-22 (8개 Tier)
 *
 * 구조적 특징:
 * - 스캘럽 패턴: tierIndex % 3 번째 날개가 65% 길이로 후퇴 (가장 뚜렷)
 * - 날개 종료 패턴:
 *   - Tier 18: Wing C 종료
 *   - Tier 19: Wing B 종료
 *   - Tier 20+: 모든 날개 종료 (코어만)
 * - 회전 없음 - 길이 차이가 나선형 실루엣 생성
 *
 * 총 높이: ~7 units (가장 짧은 Tier들)
 * 애니메이션: 빠름 (드라마틱 상승)
 */

// Upper Tower 상단 Y좌표 (Spire 위치용)
const getUpperTowerBaseY = () => {
  const lowerTiers = getTiersByPhase(3);
  const midTiers = getTiersByPhase(4);
  return BUILDING.CORE_HEIGHT +
    lowerTiers.reduce((sum, t) => sum + t.height, 0) +
    midTiers.reduce((sum, t) => sum + t.height, 0);
};

export const UPPER_TOWER_TOP_Y = (() => {
  const upperTiers = getTiersByPhase(5);
  return getUpperTowerBaseY() + upperTiers.reduce((sum, t) => sum + t.height, 0);
})();

export const Illumination: React.FC = () => {
  const buildingProgress = useBuildingProgress();
  const groupRef = useRef<THREE.Group>(null);
  const tiersRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  // Phase 5 Tier 데이터
  const tiers = useMemo(() => getTiersByPhase(5), []);
  const baseYPosition = useMemo(() => getUpperTowerBaseY(), []);

  // 디버그 모드: debugColor 사용하여 각 Tier 시각화
  const DEBUG_MODE = false;

  // 알루미늄 프레임 재질 (노즈) - 상부 더 밝은 광택
  const aluminumMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.ALUMINUM_LIGHT),
      roughness: 0.18,
      metalness: 0.94,
    });
  }, []);

  // 수평 멀리언 재질 (밝은 알루미늄) - 미세한 광택
  const mullionMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.MULLION),
      roughness: 0.22,
      metalness: 0.90,
    });
  }, []);

  // 중앙 스파인 재질 (어두운) - 깊이감 있는 금속
  const spineMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.SPINE),
      roughness: 0.42,
      metalness: 0.58,
    });
  }, []);

  // 가장자리 핀 재질 - 섬세한 금속 질감
  const edgeFinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.EDGE_FIN),
      roughness: 0.35,
      metalness: 0.65,
    });
  }, []);

  // 유리 재질 - 상부는 약간 밝게 (대기 원근) + 세련된 효과
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(COLORS.GLASS_LIGHT),
      roughness: 0.04,
      metalness: 0.15,
      transparent: true,
      opacity: 0.85,
      clearcoat: 0.35,
      clearcoatRoughness: 0.08,
      emissive: new THREE.Color('#000000'),
      emissiveIntensity: 0,
    });
  }, []);

  // 창문 내부 발광 재질 (밤에 켜짐) - 상부는 더 밝게
  const windowGlowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFAF0'),
      emissive: new THREE.Color('#FFF0D0'),
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0,
    });
  }, []);

  // LED 악센트 재질 (야간 효과) - 더 세련된 색감
  const ledMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#5ec8ff'),
      emissive: new THREE.Color('#5ec8ff'),
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0.85,
    });
  }, []);

  // 멀리언 간격 (상부는 더 촘촘)
  const MULLION_SPACING = 0.18;


  useFrame(() => {
    const offset = buildingProgress.current;
    const { start, end } = PHASES.UPPER_TOWER;
    const duration = end - start;

    const isVisible = offset > start - 0.02;
    const localProgress = Math.max(0, Math.min(1, (offset - start) / duration));

    // 낮/밤 상태 계산
    const dayNight = getDayNightState(offset);

    if (groupRef.current) {
      groupRef.current.visible = isVisible;
    }

    if (!isVisible) return;

    // 단순한 따뜻한 백색 글로우 (상부는 약간 더 밝게)
    const warmGlow = new THREE.Color('#FFF0E0');

    // 유리 재질 - 상부 타워는 더 강한 발광
    glassMaterial.emissive = warmGlow;
    glassMaterial.emissiveIntensity = dayNight.windowGlowIntensity * 1.8;
    glassMaterial.metalness = THREE.MathUtils.lerp(0.15, 0.06, dayNight.nightIntensity);
    glassMaterial.opacity = THREE.MathUtils.lerp(0.85, 0.70, dayNight.nightIntensity);

    // 창문 내부 발광 - 상부는 가장 밝게 (스파이어 근처)
    windowGlowMaterial.emissive = warmGlow;
    windowGlowMaterial.emissiveIntensity = dayNight.windowGlowIntensity * 3.2;
    windowGlowMaterial.opacity = dayNight.windowGlowIntensity * 0.92;

    // Tier 순차 애니메이션 - 빠른 속도 (상부)
    if (tiersRef.current) {
      tiersRef.current.children.forEach((tierGroup, index) => {
        const tierDelay = getTierAnimationDelay(index, tiers.length);
        const adjustedProgress = Math.max(0, (localProgress - tierDelay * 0.2) / (1 - tierDelay * 0.2));
        const tierProgress = Math.max(0, Math.min(1, adjustedProgress * 2.8));

        const scale = THREE.MathUtils.smoothstep(tierProgress, 0, 0.35);
        tierGroup.scale.set(scale, scale, scale);
        tierGroup.visible = tierProgress > 0.01;
      });
    }

    // LED 야간 효과 - 깔끔한 단일 색상 (시안)
    const ledColor = new THREE.Color('#60D0FF');
    ledMaterial.color = ledColor;
    ledMaterial.emissive = ledColor;
    ledMaterial.emissiveIntensity = dayNight.nightIntensity * 2.5;

    if (labelRef.current) {
      labelRef.current.style.opacity = (offset > 0.60 && offset < 0.78) ? '1' : '0';
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <group ref={tiersRef} position={[0, baseYPosition, 0]}>
        {tiers.map((tier, tierIndex) => {
          const localTiers = tiers.slice(0, tierIndex);
          const baseY = localTiers.reduce((sum, t) => sum + t.height, 0);

          return (
            <group
              key={tier.id}
              position={[0, baseY, 0]}
              // 회전 제거 - 스캘럽 패턴이 나선 효과 생성
            >
              {/* Y자형 날개 - 각각 다른 길이 + 종료 패턴 */}
              {WING_ANGLES.map((angle, wingIndex) => {
                // 핵심: 각 날개별 개별 치수 사용
                const wingLength = tier.wingLengths[wingIndex];
                const wingWidth = tier.wingWidths[wingIndex];

                // 길이가 0이면 렌더링 안함 (날개 종료)
                if (wingLength <= 0) return null;

                // 멀리언 개수 계산
                const mullionCount = Math.floor(tier.height / MULLION_SPACING);

                return (
                  <group key={wingIndex} rotation={[0, THREE.MathUtils.degToRad(angle), 0]}>
                    {/* 유리 커튼월 (배경) */}
                    <mesh position={[0, tier.height / 2, wingLength / 2]}>
                      <boxGeometry args={[wingWidth * 0.85, tier.height - 0.02, wingLength * 0.92]} />
                      <primitive object={glassMaterial} attach="material" />
                    </mesh>

                    {/* 중앙 스파인 (어두운 수직선) */}
                    <mesh position={[0, tier.height / 2, wingLength / 2 + 0.008]}>
                      <boxGeometry args={[wingWidth * 0.1, tier.height - 0.015, wingLength * 0.95]} />
                      <primitive object={spineMaterial} attach="material" />
                    </mesh>

                    {/* 가장자리 핀 (양쪽) */}
                    {[-1, 1].map((side) => (
                      <mesh
                        key={`fin-${side}`}
                        position={[side * wingWidth * 0.42, tier.height / 2, wingLength / 2]}
                      >
                        <boxGeometry args={[0.012, tier.height - 0.015, wingLength * 0.9]} />
                        <primitive object={edgeFinMaterial} attach="material" />
                      </mesh>
                    ))}

                    {/* 수평 멀리언 (층간 라인) */}
                    {Array.from({ length: mullionCount }).map((_, i) => (
                      <mesh
                        key={`mullion-${i}`}
                        position={[0, (i + 0.5) * MULLION_SPACING, wingLength / 2 + 0.012]}
                      >
                        <boxGeometry args={[wingWidth * 0.9, 0.01, wingLength * 0.92]} />
                        <primitive object={mullionMaterial} attach="material" />
                      </mesh>
                    ))}

                    {/* 날개 끝 - 알루미늄 프레임 */}
                    <mesh position={[0, tier.height / 2, wingLength]} castShadow>
                      <cylinderGeometry args={[wingWidth / 3, wingWidth / 2.8, tier.height - 0.01, 8]} />
                      <primitive object={aluminumMaterial} attach="material" />
                    </mesh>

                    {/* 노즈 수직 패널 라인 */}
                    {[0, 60, 120, 180, 240, 300].map((deg) => (
                      <mesh
                        key={`nose-line-${deg}`}
                        position={[
                          Math.sin(THREE.MathUtils.degToRad(deg)) * wingWidth / 2.9,
                          tier.height / 2,
                          wingLength + Math.cos(THREE.MathUtils.degToRad(deg)) * wingWidth / 2.9
                        ]}
                      >
                        <boxGeometry args={[0.006, tier.height - 0.02, 0.006]} />
                        <primitive object={edgeFinMaterial} attach="material" />
                      </mesh>
                    ))}

                    {/* LED 악센트 스트립 (야간) */}
                    <mesh position={[0, tier.height - 0.015, wingLength / 2]}>
                      <boxGeometry args={[wingWidth * 0.25, 0.015, wingLength * 0.7]} />
                      <primitive object={ledMaterial} attach="material" />
                    </mesh>

                    {/* 창문 내부 발광 (밤에 보임) */}
                    <mesh position={[0, tier.height / 2, wingLength / 2 - 0.02]}>
                      <boxGeometry args={[wingWidth * 0.70, tier.height - 0.06, wingLength * 0.82]} />
                      <primitive object={windowGlowMaterial} attach="material" />
                    </mesh>
                  </group>
                );
              })}

              {/* 중앙 코어 - 스파이어 연결부로 좁아짐 (비율 수정) */}
              <mesh position={[0, tier.height / 2, 0]} castShadow>
                <cylinderGeometry args={[BUILDING.CORE_RADIUS * 0.35, BUILDING.CORE_RADIUS * 0.45, tier.height - 0.01, 6]} />
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
      <Html position={[0, 42, 0]} center>
        <div
          ref={labelRef}
          className="pointer-events-none transition-opacity duration-500 bg-white/90 px-4 py-2 rounded-full shadow-lg border border-amber-100 flex items-center gap-3 whitespace-nowrap"
          style={{ opacity: 0 }}
        >
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Phase 05: Upper Tower
          </span>
        </div>
      </Html>
    </group>
  );
};
