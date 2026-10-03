import React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center font-medium rounded-full border transition-colors select-none',
  {
    variants: {
      variant: {
        success:
          'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
        warning:
          'bg-warm-50 text-warm-900 border-warm-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60',
        error:
          'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/60',
        info:
          'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60',
        neutral:
          'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      },
      size: {
        sm: 'text-[11px] px-2 py-0.5 gap-1',
        md: 'text-xs px-2.5 py-1 gap-1.5',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  }
);

const dotVariants: Record<string, string> = {
  success: 'bg-emerald-500 dark:bg-emerald-400',
  warning: 'bg-warm-500 dark:bg-amber-400',
  error: 'bg-red-500 dark:bg-red-400',
  info: 'bg-indigo-500 dark:bg-indigo-400',
  neutral: 'bg-slate-400 dark:bg-slate-500',
};

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  showDot?: boolean;
  withDot?: boolean;
  icon?: ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  showDot = false,
  withDot = false,
  icon,
  children,
  ...props
}) => {
  const hasDot = Boolean(dot || showDot || withDot);

  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {hasDot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotVariants[variant || 'neutral'])}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0 flex items-center" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
