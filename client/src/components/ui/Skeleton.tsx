import React from 'react';
import { cn } from '../../lib/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

const variantStyles: Record<NonNullable<SkeletonProps['variant']>, string> = {
  text: 'h-4 w-full rounded-md',
  circular: 'rounded-full',
  rectangular: 'rounded-xl',
  card: 'h-32 w-full rounded-2xl',
};

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', width, height, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        style={{
          width,
          height,
          ...style,
        }}
        className={cn(
          'motion-safe:animate-pulse bg-slate-200 dark:bg-slate-800',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
export default Skeleton;
