export const clampProgress = (value: number): number => Math.max(0, Math.min(1, value));

export const getRangeProgress = (
  value: number,
  start: number,
  end: number,
): number => clampProgress((value - start) / (end - start));
