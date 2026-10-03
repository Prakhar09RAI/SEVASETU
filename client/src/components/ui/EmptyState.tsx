import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, compact = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40',
          compact ? 'p-6' : 'p-12',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 mb-4 ring-8 ring-primary-50/40 dark:ring-primary-950/30">
          {icon || <Inbox size={26} aria-hidden="true" />}
        </div>

        <h4 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5">
          {title}
        </h4>

        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
            {description}
          </p>
        )}

        {action && <div className="flex items-center gap-3">{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
export default EmptyState;
