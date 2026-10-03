import { useMemo } from 'react';
import { tokens } from '../../../lib/tokens';

export interface ThreeThemeColors {
  primary: string;
  primaryGlow: string;
  accent: string;
  accentGlow: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  gridLine: string;
  nodeBackground: string;
  text: string;
  isDark: boolean;
}

/**
 * Hook providing Three.js friendly hexadecimal color values aligned with the SevaSetu design system.
 */
export function useThemeColors(): ThreeThemeColors {
  return useMemo(() => {
    // Detect dark mode if html has class 'dark'
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

    if (isDark) {
      return {
        primary: '#3b82f6',
        primaryGlow: '#60a5fa',
        accent: '#f59e0b',
        accentGlow: '#fbbf24',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#38bdf8',
        background: '#090d16',
        gridLine: '#1e293b',
        nodeBackground: '#1e293b',
        text: '#f8fafc',
        isDark: true,
      };
    }

    return {
      primary: tokens.colors.primary[600],
      primaryGlow: tokens.colors.primary[400],
      accent: tokens.colors.accent[600],
      accentGlow: tokens.colors.accent[400],
      success: tokens.colors.feedback.success,
      warning: tokens.colors.feedback.warning,
      error: tokens.colors.feedback.error,
      info: tokens.colors.feedback.info,
      background: '#F8FAFC',
      gridLine: '#E2E8F0',
      nodeBackground: '#FFFFFF',
      text: tokens.colors.text.primary,
      isDark: false,
    };
  }, []);
}
