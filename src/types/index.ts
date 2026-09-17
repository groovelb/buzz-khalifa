export interface ConstructionStage {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  technicalNote: string;
  measurement?: string;
  image?: string;
}

export interface StageRange {
  start: number;
  end: number;
}

export interface TierData {
  id: number;
  height: number;
  baseY: number;
  wingLengths: [number, number, number];
  wingWidths: [number, number, number];
  wingLevels: [number, number, number];
  phase: 3 | 4 | 5;
  debugColor: string;
}
