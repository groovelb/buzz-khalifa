
import { useEffect, useState, useCallback } from 'react';

// Theme phases based on scroll progress
export type ThemePhase = 'dawn' | 'day' | 'sunset' | 'dusk' | 'night';

interface ThemeState {
  phase: ThemePhase;
  progress: number;
  isDark: boolean;
}

// Global state for theme (simple pub/sub pattern)
let globalThemeState: ThemeState = {
  phase: 'dawn',
  progress: 0,
  isDark: false,
};

const listeners = new Set<(state: ThemeState) => void>();

export const setThemeProgress = (progress: number) => {
  let phase: ThemePhase;
  let isDark: boolean;

  if (progress < 0.35) {
    phase = 'dawn';
    isDark = false;
  } else if (progress < 0.55) {
    phase = 'day';
    isDark = false;
  } else if (progress < 0.70) {
    phase = 'sunset';
    isDark = false;
  } else if (progress < 0.85) {
    phase = 'dusk';
    isDark = true;
  } else {
    phase = 'night';
    isDark = true;
  }

  globalThemeState = { phase, progress, isDark };

  // Notify all listeners
  listeners.forEach(listener => listener(globalThemeState));

  // Update CSS custom properties on document
  updateCSSVariables(progress, isDark);
};

const updateCSSVariables = (progress: number, isDark: boolean) => {
  const root = document.documentElement;

  if (isDark) {
    // Night theme - no background, light text, gold accents
    root.style.setProperty('--ui-text-primary', '#f5f3f0');
    root.style.setProperty('--ui-text-secondary', '#b0b0b0');
    root.style.setProperty('--ui-text-muted', '#808080');
    root.style.setProperty('--ui-text-body', '#d0d0d0');
    root.style.setProperty('--ui-bg-card', 'transparent');
    root.style.setProperty('--ui-border', 'rgba(255, 255, 255, 0.15)');
    root.style.setProperty('--ui-border-accent', '#d4b878');
    root.style.setProperty('--ui-gold', '#d4b878');
    root.style.setProperty('--ui-gold-muted', 'rgba(212, 184, 120, 0.8)');
  } else {
    // Day theme - no background, black border, dark text
    root.style.setProperty('--ui-text-primary', '#1a1a1a');
    root.style.setProperty('--ui-text-secondary', '#3a3a3a');
    root.style.setProperty('--ui-text-muted', '#5a5a5a');
    root.style.setProperty('--ui-text-body', '#2a2a2a');
    root.style.setProperty('--ui-bg-card', 'transparent');
    root.style.setProperty('--ui-border', '#1a1a1a');
    root.style.setProperty('--ui-border-accent', '#1a1a1a');
    root.style.setProperty('--ui-gold', '#1a1a1a');
    root.style.setProperty('--ui-gold-muted', 'rgba(26, 26, 26, 0.6)');
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeState>(globalThemeState);

  useEffect(() => {
    const listener = (state: ThemeState) => setTheme(state);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return theme;
};

export const getThemeClasses = (isDark: boolean) => ({
  textPrimary: isDark ? 'text-[#f5f3f0]' : 'text-ink',
  textSecondary: isDark ? 'text-[#a0a0a0]' : 'text-slate',
  textMuted: isDark ? 'text-[#707070]' : 'text-stone',
  bgCard: isDark ? 'bg-[#14141e]/90' : 'bg-cream/90',
  border: isDark ? 'border-white/10' : 'border-stone/10',
  borderGold: isDark ? 'border-[#d4b878]' : 'border-gold',
  gold: isDark ? 'text-[#d4b878]' : 'text-gold',
  bgGold: isDark ? 'bg-[#d4b878]' : 'bg-gold',
});
