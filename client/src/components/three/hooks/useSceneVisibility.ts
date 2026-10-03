import { useState, useEffect, type RefObject } from 'react';

/**
 * Hook to pause Three.js animation / rendering when the canvas element is outside the viewport.
 * Uses an efficient IntersectionObserver with 10% threshold.
 */
export function useSceneVisibility(containerRef: RefObject<HTMLElement | null>): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  return isVisible;
}
