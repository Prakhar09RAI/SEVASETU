import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface Props {
  enableZoom?: boolean;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enablePan?: boolean;
}

/**
 * Constrained camera controller preventing disorienting user motion.
 * Automatically halts auto-rotation when user requests reduced motion.
 */
export const ControlledCamera: React.FC<Props> = ({
  enableZoom = false,
  minDistance = 5,
  maxDistance = 14,
  minPolarAngle = Math.PI / 4, // 45 deg
  maxPolarAngle = Math.PI / 2 + 0.1, // slightly past horizontal
  autoRotate = true,
  autoRotateSpeed = 0.8,
  enablePan = false,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <OrbitControls
      makeDefault
      enablePan={enablePan}
      enableZoom={enableZoom}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={minPolarAngle}
      maxPolarAngle={maxPolarAngle}
      autoRotate={autoRotate && !prefersReducedMotion}
      autoRotateSpeed={autoRotateSpeed}
      dampingFactor={0.05}
      enableDamping
    />
  );
};
