/**
 * Burj Khalifa Building Data - 모듈 기반 나선형 세트백 v6
 *
 * 핵심 원칙:
 * 1. 면적은 "모듈 단위"로만 변함 (점진적 X, 계단식 O)
 * 2. 모듈 내에서 면적은 완전히 일정
 * 3. 각 날개가 서로 다른 높이에서 세트백 → "걸쳐짐" → 나선형
 * 4. 세트백 전까지는 이전 크기 완전히 유지
 *
 * 구조:
 * - 7개 면적 레벨 (100%, 85%, 70%, 55%, 40%, 25%, 0%)
 * - 각 날개별 세트백 높이가 다름 (C가 먼저, A가 마지막)
 */

// ============================================
// 건물 기본 치수
// ============================================
export const BUILDING = {
  TOTAL_HEIGHT: 55,
  TOWER_HEIGHT: 47,
  SPIRE_HEIGHT: 8,
  BASE_WING_LENGTH: 2.0,
  BASE_WING_WIDTH: 0.6,
  CORE_HEIGHT: 7,
  CORE_RADIUS: 0.5,
} as const;

export const WING_ANGLES = [0, 120, 240] as const;

// ============================================
// 면적 레벨 (7단계)
// ============================================
const AREA_LEVELS = [1.0, 0.85, 0.70, 0.55, 0.40, 0.25, 0] as const;

// ============================================
// 각 날개의 세트백 높이 스케줄
// ============================================
/**
 * 각 날개가 다음 레벨로 세트백되는 높이
 * - C: 가장 빨리, 가장 자주 세트백
 * - B: 중간
 * - A: 가장 늦게, 가장 오래 유지 (걸쳐짐)
 *
 * 배열 길이 = 세트백 횟수
 * 값 = 세트백이 발생하는 높이
 */

// Wing A: 가장 늦게 세트백 (오래 "걸쳐짐")
const WING_A_SETBACK_HEIGHTS = [18, 28, 35, 40, 44];
// Wing B: 중간 타이밍
const WING_B_SETBACK_HEIGHTS = [14, 23, 30, 36, 41];
// Wing C: 가장 빨리 세트백
const WING_C_SETBACK_HEIGHTS = [10, 18, 25, 32, 38];

// ============================================
// 높이에서 날개의 현재 레벨 계산
// ============================================
const getWingLevelAtHeight = (setbackHeights: readonly number[], y: number): number => {
  let level = 0;
  for (const height of setbackHeights) {
    if (y >= height) {
      level++;
    } else {
      break;
    }
  }
  return level;
};

const getWingScaleAtHeight = (setbackHeights: readonly number[], y: number): number => {
  const level = getWingLevelAtHeight(setbackHeights, y);
  return AREA_LEVELS[Math.min(level, AREA_LEVELS.length - 1)];
};

// ============================================
// Tier 데이터 인터페이스
// ============================================
export interface TierData {
  id: number;
  height: number;
  baseY: number;
  wingLengths: [number, number, number];
  wingWidths: [number, number, number];
  wingLevels: [number, number, number];  // 디버깅용: 각 날개의 현재 레벨
  phase: 3 | 4 | 5;
  debugColor: string;
}

// ============================================
// 디버그 색상 (레벨 기반)
// ============================================
const LEVEL_COLORS = [
  '#1e40af',  // Level 0 (100%) - 파랑
  '#059669',  // Level 1 (85%) - 초록
  '#ca8a04',  // Level 2 (70%) - 노랑
  '#ea580c',  // Level 3 (55%) - 주황
  '#dc2626',  // Level 4 (40%) - 빨강
  '#db2777',  // Level 5 (25%) - 분홍
  '#7c3aed',  // Level 6 (0%) - 보라
];

// 가장 진행된 날개의 레벨로 색상 결정
const getDebugColor = (wingLevels: [number, number, number]): string => {
  const maxLevel = Math.max(...wingLevels);
  return LEVEL_COLORS[Math.min(maxLevel, LEVEL_COLORS.length - 1)];
};

// ============================================
// Tier 데이터 생성
// ============================================
const generateModuleBasedTiers = (): TierData[] => {
  const tiers: TierData[] = [];

  // Tier 높이 배열 (아래가 높고 위로 갈수록 낮아짐)
  const tierHeights = [
    2.8, 2.6, 2.4, 2.2,  // 하부 (4개)
    2.0, 1.9, 1.8, 1.7,  // 중하부 (4개)
    1.6, 1.5, 1.4, 1.3,  // 중부 (4개)
    1.2, 1.1, 1.0, 0.9,  // 중상부 (4개)
    0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5  // 상부 (8개)
  ];

  let currentY = 0;

  tierHeights.forEach((tierHeight, index) => {
    const midY = currentY + tierHeight / 2;

    // 각 날개의 현재 레벨과 스케일 계산
    const levelA = getWingLevelAtHeight(WING_A_SETBACK_HEIGHTS, midY);
    const levelB = getWingLevelAtHeight(WING_B_SETBACK_HEIGHTS, midY);
    const levelC = getWingLevelAtHeight(WING_C_SETBACK_HEIGHTS, midY);

    const scaleA = AREA_LEVELS[Math.min(levelA, AREA_LEVELS.length - 1)];
    const scaleB = AREA_LEVELS[Math.min(levelB, AREA_LEVELS.length - 1)];
    const scaleC = AREA_LEVELS[Math.min(levelC, AREA_LEVELS.length - 1)];

    const wingLengths: [number, number, number] = [
      scaleA * BUILDING.BASE_WING_LENGTH,
      scaleB * BUILDING.BASE_WING_LENGTH,
      scaleC * BUILDING.BASE_WING_LENGTH,
    ];

    const wingWidths: [number, number, number] = [
      scaleA * BUILDING.BASE_WING_WIDTH,
      scaleB * BUILDING.BASE_WING_WIDTH,
      scaleC * BUILDING.BASE_WING_WIDTH,
    ];

    // Phase 결정
    let phase: 3 | 4 | 5;
    if (currentY < 15) phase = 3;
    else if (currentY < 30) phase = 4;
    else phase = 5;

    const wingLevels: [number, number, number] = [levelA, levelB, levelC];

    tiers.push({
      id: index,
      height: tierHeight,
      baseY: currentY,
      wingLengths,
      wingWidths,
      wingLevels,
      phase,
      debugColor: getDebugColor(wingLevels),
    });

    currentY += tierHeight;
  });

  return tiers;
};

// TIER_DATA 생성
export const TIER_DATA: TierData[] = generateModuleBasedTiers();

// ============================================
// 검증: 나선형 패턴 확인
// ============================================
export const validateSpiralPattern = (): void => {
  console.log('\n=== MODULE-BASED SPIRAL PATTERN ===');
  console.log('Height | A Lv | B Lv | C Lv | A Scale | B Scale | C Scale | Spiral?');
  console.log('-------|------|------|------|---------|---------|---------|--------');

  [0, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44].forEach(y => {
    const lvA = getWingLevelAtHeight(WING_A_SETBACK_HEIGHTS, y);
    const lvB = getWingLevelAtHeight(WING_B_SETBACK_HEIGHTS, y);
    const lvC = getWingLevelAtHeight(WING_C_SETBACK_HEIGHTS, y);

    const scA = AREA_LEVELS[Math.min(lvA, AREA_LEVELS.length - 1)];
    const scB = AREA_LEVELS[Math.min(lvB, AREA_LEVELS.length - 1)];
    const scC = AREA_LEVELS[Math.min(lvC, AREA_LEVELS.length - 1)];

    // 나선형 확인: A >= B >= C (레벨이 낮을수록 크기가 큼)
    const isSpiral = lvA <= lvB && lvB <= lvC;

    const scAStr = scA > 0 ? `${(scA * 100).toFixed(0)}%` : 'END';
    const scBStr = scB > 0 ? `${(scB * 100).toFixed(0)}%` : 'END';
    const scCStr = scC > 0 ? `${(scC * 100).toFixed(0)}%` : 'END';

    console.log(`  ${y.toString().padStart(3)}  |  ${lvA}   |  ${lvB}   |  ${lvC}   | ${scAStr.padStart(7)} | ${scBStr.padStart(7)} | ${scCStr.padStart(7)} |   ${isSpiral ? '✓' : '✗'}`);
  });

  console.log('\n걸쳐짐 예시:');
  console.log('높이 12: A=Lv0(100%), B=Lv0(100%), C=Lv1(85%) → C만 세트백, A·B는 걸쳐짐');
  console.log('높이 16: A=Lv0(100%), B=Lv1(85%), C=Lv1(85%) → B도 세트백, A는 여전히 걸쳐짐');
  console.log('높이 20: A=Lv1(85%), B=Lv1(85%), C=Lv2(70%) → 모두 한 단계씩 진행');
};

// 검증 실행
validateSpiralPattern();

// ============================================
// 유틸리티 함수
// ============================================
export const getTierPositions = () => {
  return TIER_DATA.map((tier) => ({
    ...tier,
    baseY: tier.baseY + BUILDING.CORE_HEIGHT,
  }));
};

export const getTiersByPhase = (phase: number) => {
  return getTierPositions().filter(t => t.phase === phase);
};

export const getTowerTopY = () => {
  const lastTier = TIER_DATA[TIER_DATA.length - 1];
  return BUILDING.CORE_HEIGHT + lastTier.baseY + lastTier.height;
};

export const getWingVisibility = (tierId: number): [boolean, boolean, boolean] => {
  const tier = TIER_DATA.find(t => t.id === tierId);
  if (!tier) return [true, true, true];
  return [
    tier.wingLengths[0] > 0,
    tier.wingLengths[1] > 0,
    tier.wingLengths[2] > 0,
  ];
};

export const getWingDimensions = (
  tierId: number,
  wingIndex: number
): { length: number; width: number } => {
  const tier = TIER_DATA.find(t => t.id === tierId);
  if (!tier) return { length: 0, width: 0 };
  return {
    length: tier.wingLengths[wingIndex],
    width: tier.wingWidths[wingIndex],
  };
};

// ============================================
// Phase 스크롤 경계
// ============================================
export const PHASES = {
  FOUNDATION: { start: 0, end: 0.143 },
  CORE: { start: 0.143, end: 0.286 },
  LOWER_TOWER: { start: 0.286, end: 0.429 },
  MID_TOWER: { start: 0.429, end: 0.571 },
  UPPER_TOWER: { start: 0.571, end: 0.857 },
  SPIRE: { start: 0.857, end: 1.0 },
} as const;

// ============================================
// 색상 팔레트 (세련된 부르즈 할리파 - 통일된 블루그레이)
// ============================================
export const COLORS = {
  // 구조물 - 따뜻한 실버 그레이
  CONCRETE: '#c8cdd2',
  CONCRETE_DARK: '#a8b0b8',
  CONCRETE_LIGHT: '#dce0e4',

  // 유리 - 깊은 청회색 (하늘 반사)
  GLASS: '#506872',
  GLASS_LIGHT: '#607880',
  GLASS_DARK: '#405860',

  // 알루미늄 프레임/멀리언 - 밝은 실버
  ALUMINUM: '#d0d5da',
  ALUMINUM_LIGHT: '#e4e8ec',
  MULLION: '#c4ccd4',

  // 구조 디테일 - 미묘한 대비
  SPINE: '#3a4850',        // 중앙 스파인 (어두운 청회색)
  EDGE_FIN: '#5a6870',     // 가장자리 핀 (중간 톤)
  FRAME_DARK: '#485058',   // 어두운 프레임

  // 스틸 (스파이어) - 밝은 실버
  STEEL: '#d4d8dc',
  STEEL_POLISHED: '#e8ecf0',
  STEEL_BRUSHED: '#c0c8d0',

  // 기초 - 따뜻한 그레이
  FOUNDATION: '#b0b8c0',
  FOUNDATION_DARK: '#98a0a8',
} as const;

// ============================================
// 애니메이션 헬퍼
// ============================================
export const getTierAnimationDelay = (
  tierIndex: number,
  totalTiers: number
): number => {
  const normalized = tierIndex / totalTiers;
  return normalized * normalized * normalized;
};

// ============================================
// 세트백 스케줄 노출 (디버깅용)
// ============================================
export const getSetbackSchedules = () => ({
  wingA: WING_A_SETBACK_HEIGHTS,
  wingB: WING_B_SETBACK_HEIGHTS,
  wingC: WING_C_SETBACK_HEIGHTS,
  areaLevels: AREA_LEVELS,
});

// ============================================
// 디버그 출력
// ============================================
export const printTierData = () => {
  console.log('\n=== TIER DATA (Module-Based) ===');
  TIER_DATA.forEach(t => {
    const wings = t.wingLengths.map((l, i) =>
      l > 0 ? `${['A','B','C'][i]}[${t.wingLevels[i]}]:${l.toFixed(2)}` : `${['A','B','C'][i]}:END`
    ).join(' ');
    console.log(`Tier ${t.id.toString().padStart(2)} (Y:${t.baseY.toFixed(1).padStart(5)}): ${wings}`);
  });
};
