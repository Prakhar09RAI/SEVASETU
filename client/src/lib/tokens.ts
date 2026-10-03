/**
 * SevaSetu Design Tokens
 * Centralized design definitions for colors, typography, spacing, radius, shadows, and motion.
 * Primary: Emerald (Trust & Growth)
 * Accent: Indigo (Technical Precision & Modernity)
 * Warm: Amber (Local Indian Craft & Reliability)
 * Ink: Slate (Structured Neutral Foundation)
 */

export const tokens = {
  colors: {
    primary: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
    },
    accent: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
    },
    warm: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    ink: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
      950: '#020617',
    },
    feedback: {
      success: '#059669',
      successLight: '#ECFDF5',
      warning: '#B45309',
      warningLight: '#FFFBEB',
      error: '#DC2626',
      errorLight: '#FEF2F2',
      info: '#4F46E5',
      infoLight: '#EEF2FF',
    },
    // Backwards-compatible aliases
    brand: {
      primary: '#047857',
      primaryHover: '#065F46',
      primaryActive: '#064E3B',
      primaryLight: '#ECFDF5',
      secondary: '#0F172A',
      secondaryHover: '#1E293B',
      accent: '#4F46E5',
      accentLight: '#EEF2FF',
      warm: '#D97706',
    },
    neutral: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
      950: '#020617',
    },
    surface: {
      background: '#F8FAFC',
      card: '#FFFFFF',
      modal: '#FFFFFF',
      border: '#E2E8F0',
      divider: '#F1F5F9',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      muted: '#64748B',
      inverse: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: {
      display: ['Bricolage Grotesque', 'sans-serif'],
      sans: ['Plus Jakarta Sans', 'sans-serif'],
      mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
    scale: {
      hero: { size: '3.75rem', lineHeight: '1.1', weight: '700' }, // 60px
      display: { size: '2.25rem', lineHeight: '2.5rem', weight: '700' }, // 36px
      h1: { size: '1.875rem', lineHeight: '2.25rem', weight: '700' },      // 30px
      h2: { size: '1.5rem', lineHeight: '2rem', weight: '600' },           // 24px
      h3: { size: '1.25rem', lineHeight: '1.75rem', weight: '600' },       // 20px
      h4: { size: '1.125rem', lineHeight: '1.5rem', weight: '600' },        // 18px
      bodyLarge: { size: '1rem', lineHeight: '1.5rem', weight: '400' },     // 16px
      body: { size: '0.875rem', lineHeight: '1.25rem', weight: '400' },     // 14px
      bodySmall: { size: '0.75rem', lineHeight: '1rem', weight: '400' },    // 12px
      caption: { size: '0.6875rem', lineHeight: '0.875rem', weight: '500' }, // 11px
      label: { size: '0.875rem', lineHeight: '1.25rem', weight: '500' },    // 14px
    },
  },
  shadows: {
    subtle: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
    card: '0 1px 3px 0 rgb(15 23 42 / 0.08), 0 1px 2px -1px rgb(15 23 42 / 0.08)',
    lift: '0 12px 24px -6px rgb(15 23 42 / 0.12), 0 6px 12px -4px rgb(15 23 42 / 0.08)',
    glass: '0 20px 30px -10px rgb(15 23 42 / 0.15), 0 10px 15px -5px rgb(15 23 42 / 0.08)',
    elevated: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    modal: '0 25px 50px -12px rgb(15 23 42 / 0.25)',
  },
  radii: {
    sm: '0.375rem',   // 6px
    md: '0.625rem',   // 10px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    pill: '9999px',
  },
  radius: {
    sm: '0.375rem',   // 6px
    md: '0.625rem',   // 10px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    full: '9999px',
  },
  motion: {
    fast: '120ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '320ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  spacing: {
    pagePadding: 'px-4 sm:px-6 lg:px-8',
    sectionSpacing: 'py-8 sm:py-12 lg:py-16',
    cardPadding: 'p-5 sm:p-6',
    componentGap: 'gap-4 sm:gap-6',
  },
} as const;

export default tokens;
