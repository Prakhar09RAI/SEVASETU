import React from 'react';

interface Props {
  heightClassName?: string;
  label?: string;
}

/**
 * Lightweight loading skeleton fallback while 3D canvas and shaders initialize.
 */
export const SceneLoadingFallback: React.FC<Props> = ({
  heightClassName = 'h-64 sm:h-80',
  label = 'Preparing 3D experience...',
}) => {
  return (
    <div
      className={`w-full ${heightClassName} rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/40 border border-neutral-200/60 flex flex-col items-center justify-center p-6 space-y-3 animate-pulse`}
      aria-busy="true"
      aria-label={label}
    >
      <div className="w-12 h-12 rounded-full border-2 border-primary-500/30 border-t-primary-600 animate-spin" />
      <span className="text-xs font-medium text-neutral-500 tracking-wide">{label}</span>
    </div>
  );
};
