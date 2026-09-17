import { DAY_NIGHT_TIMING } from '@/data/scrollConfig';

/**
 * Day/Night Lighting Hook
 * 스크롤 진행도에 따른 낮/밤 조명 상태 관리
 *
 * 타이밍 (7 pages 기준):
 * - Phase 1-4 (0% - 57.1%): 낮 (dayProgress: 1 → 0.5)
 * - Phase 5 전반 (57.1% - 75%): 석양 (sunsetProgress: 0 → 1)
 * - Phase 5 후반 (75% - 85.7%): 황혼 (twilightProgress: 0 → 1)
 * - Phase 6 (85.7% - 100%): 밤 (nightProgress: 0 → 1)
 */

export interface DayNightState {
  // 0-1 범위의 진행도
  dayIntensity: number;      // 낮 조명 강도 (1 = 완전한 낮, 0 = 밤)
  nightIntensity: number;    // 밤 조명 강도 (0 = 낮, 1 = 완전한 밤)
  sunsetProgress: number;    // 석양 진행도 (0 = 아님, 1 = 최고점)

  // 조명 색상
  sunColor: string;          // 태양광 색상
  ambientColor: string;      // 환경광 색상

  // 건물 조명용
  windowGlowIntensity: number;   // 창문 발광 강도
  accentLightIntensity: number;  // 악센트 조명 강도

  // 유틸리티
  isDay: boolean;
  isNight: boolean;
  isSunset: boolean;
}

/**
 * 스크롤 진행도를 기반으로 낮/밤 상태 계산
 */
export const getDayNightState = (scrollProgress: number): DayNightState => {
  // 기본 타이밍 정의
  const SUNSET_START = DAY_NIGHT_TIMING.sunsetStart;
  const TWILIGHT_START = DAY_NIGHT_TIMING.twilightStart;
  const NIGHT_START = DAY_NIGHT_TIMING.nightStart;
  const FULL_NIGHT = DAY_NIGHT_TIMING.fullNight;

  // 낮 강도 계산 (1 → 0)
  let dayIntensity: number;
  if (scrollProgress < SUNSET_START) {
    dayIntensity = 1;
  } else if (scrollProgress < NIGHT_START) {
    dayIntensity = 1 - (scrollProgress - SUNSET_START) / (NIGHT_START - SUNSET_START);
  } else {
    dayIntensity = 0;
  }

  // 밤 강도 계산 (0 → 1)
  let nightIntensity: number;
  if (scrollProgress < TWILIGHT_START) {
    nightIntensity = 0;
  } else if (scrollProgress < FULL_NIGHT) {
    nightIntensity = (scrollProgress - TWILIGHT_START) / (FULL_NIGHT - TWILIGHT_START);
  } else {
    nightIntensity = 1;
  }

  // 석양 진행도 (bell curve - 0.57~0.80 사이에서 피크)
  let sunsetProgress: number;
  if (scrollProgress < SUNSET_START || scrollProgress > NIGHT_START) {
    sunsetProgress = 0;
  } else {
    const sunsetMid = (SUNSET_START + NIGHT_START) / 2;
    const distFromMid = Math.abs(scrollProgress - sunsetMid) / (NIGHT_START - SUNSET_START) * 2;
    sunsetProgress = 1 - distFromMid;
  }

  // 태양광 색상 (따뜻한 백색 → 주황 → 어두운 파랑)
  let sunColor: string;
  if (scrollProgress < SUNSET_START) {
    sunColor = '#FFFAF0';  // 따뜻한 백색
  } else if (scrollProgress < TWILIGHT_START) {
    sunColor = '#FF8C00';  // 주황
  } else if (scrollProgress < NIGHT_START) {
    sunColor = '#4A3060';  // 어두운 보라
  } else {
    sunColor = '#0A0A1A';  // 거의 검정
  }

  // 환경광 색상
  let ambientColor: string;
  if (scrollProgress < SUNSET_START) {
    ambientColor = '#FFF8DC';  // 따뜻한 크림색
  } else if (scrollProgress < TWILIGHT_START) {
    ambientColor = '#FFE4C4';  // 비스크
  } else if (scrollProgress < NIGHT_START) {
    ambientColor = '#1A1A2E';  // 어두운 남색
  } else {
    ambientColor = '#050510';  // 거의 검정
  }

  // 창문 발광 강도 (황혼부터 시작)
  let windowGlowIntensity: number;
  if (scrollProgress < TWILIGHT_START - 0.05) {
    windowGlowIntensity = 0;
  } else if (scrollProgress < FULL_NIGHT) {
    windowGlowIntensity = (scrollProgress - (TWILIGHT_START - 0.05)) / (FULL_NIGHT - (TWILIGHT_START - 0.05));
  } else {
    windowGlowIntensity = 1;
  }

  // 악센트 조명 강도 (밤에 더 강해짐)
  let accentLightIntensity: number;
  if (scrollProgress < NIGHT_START) {
    accentLightIntensity = Math.max(0, (scrollProgress - TWILIGHT_START) / (NIGHT_START - TWILIGHT_START)) * 0.5;
  } else {
    accentLightIntensity = 0.5 + (scrollProgress - NIGHT_START) / (1 - NIGHT_START) * 0.5;
  }

  return {
    dayIntensity,
    nightIntensity,
    sunsetProgress,
    sunColor,
    ambientColor,
    windowGlowIntensity,
    accentLightIntensity,
    isDay: scrollProgress < SUNSET_START,
    isNight: scrollProgress > NIGHT_START,
    isSunset: scrollProgress >= SUNSET_START && scrollProgress <= NIGHT_START,
  };
};

/**
 * 창문 발광 색상 (층별/시간별 변화)
 */
export const getWindowGlowColor = (floorIndex: number, time: number, nightIntensity: number): string => {
  if (nightIntensity < 0.1) return '#000000';

  // 다양한 따뜻한 색상들
  const warmColors = [
    '#FFF4E0',  // 따뜻한 백색
    '#FFE8CC',  // 크림색
    '#FFDAB9',  // 피치
    '#FFE4B5',  // 모카신
    '#FFF5EE',  // 시쉘
  ];

  // 층별로 다른 색상 + 시간에 따른 변화
  const colorIndex = (floorIndex + Math.floor(time * 0.5)) % warmColors.length;
  return warmColors[colorIndex];
};

/**
 * 랜덤 창문 켜짐/꺼짐 패턴 생성
 * @param floorCount 총 층수
 * @param windowsPerFloor 층당 창문 수
 * @param litRatio 켜진 창문 비율 (0-1)
 */
export const generateWindowPattern = (
  floorCount: number,
  windowsPerFloor: number,
  litRatio: number,
  seed: number = 42
): boolean[][] => {
  const pattern: boolean[][] = [];

  // 간단한 시드 기반 랜덤
  let random = seed;
  const nextRandom = () => {
    random = (random * 1103515245 + 12345) & 0x7fffffff;
    return random / 0x7fffffff;
  };

  for (let floor = 0; floor < floorCount; floor++) {
    const floorPattern: boolean[] = [];
    for (let window = 0; window < windowsPerFloor; window++) {
      floorPattern.push(nextRandom() < litRatio);
    }
    pattern.push(floorPattern);
  }

  return pattern;
};
