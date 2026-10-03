import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Ignore localStorage failure in restricted sandbox
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return { theme, toggleTheme, setTheme, isDark: theme === 'dark' };
}

export default useTheme;
