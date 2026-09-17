import type { StageRange } from '@/types';

export const SCROLL_CONFIG = {
  pages: 7,
  damping: 0.25,
} as const;

// Rounded values are intentionally preserved from the original experience.
export const PHASES = {
  FOUNDATION: { start: 0, end: 0.143 },
  CORE: { start: 0.143, end: 0.286 },
  LOWER_TOWER: { start: 0.286, end: 0.429 },
  MID_TOWER: { start: 0.429, end: 0.571 },
  UPPER_TOWER: { start: 0.571, end: 0.857 },
  SPIRE: { start: 0.857, end: 1 },
} as const satisfies Record<string, StageRange>;

export const SECTION_HEIGHTS = [1, 1, 1, 1, 2, 1] as const;

export const SCENE_TIMING = {
  constructionEnd: PHASES.UPPER_TOWER.end,
  finaleLength: 0.143,
  buildingTravel: 55,
  constructionZoom: { from: 95, to: 52 },
  finaleZoom: { from: 52, to: 15 },
  zoomDamping: 0.08,
} as const;

export const DAY_NIGHT_TIMING = {
  sunsetStart: 0.57,
  twilightStart: 0.7,
  nightStart: 0.8,
  fullNight: 0.9,
} as const;

export const THEME_TIMING = {
  dawnEnd: 0.35,
  dayEnd: 0.55,
  sunsetEnd: 0.7,
  duskEnd: 0.85,
} as const;

export const ATMOSPHERE_TIMING = {
  morningStart: 0.14,
  morningLength: 0.14,
  middayStart: 0.35,
  middayLength: 0.21,
  afternoonStart: 0.57,
  afternoonLength: 0.22,
  sunsetStart: 0.7,
  sunsetLength: 0.13,
  duskStart: PHASES.SPIRE.start,
  duskLength: 0.157,
  finaleLength: 0.143,
  sunEnd: 0.75,
  sunSetLength: 0.18,
  sunNightLength: 0.25,
  sunFadeStart: 0.7,
  sunFadeLength: 0.12,
  moonStart: 0.65,
  moonLength: 0.35,
  ambientTwilightLength: 0.107,
  sunColorStart: 0.55,
  sunColorLength: 0.2,
  sunWarmLength: 0.25,
} as const;
