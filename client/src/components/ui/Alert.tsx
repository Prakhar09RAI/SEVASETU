import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onClose?: () => void;
  icon?: boolean;
}

const variantStyles: Record<
  NonNullable<AlertProps['variant']>,
  { container: string; iconColor: string; defaultIcon: React.ElementType }
> = {
  info: {
    container:
      'bg-indigo-50/80 border-indigo-200 text-indigo-950 dark:bg-indigo-950/40 dark:border-indigo-800/60 dark:text-indigo-200',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    defaultIcon: Info,
  },
  success: {
    container:
      'bg-emerald-50/80 border-emerald-200 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-200',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    defaultIcon: CheckCircle2,
  },
  warning: {
    container:
      'bg-warm-50/90 border-warm-200 text-warm-950 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-200',
    iconColor: 'text-warm-600 dark:text-amber-400',
    defaultIcon: AlertTriangle,
  },
  error: {
    container:
      'bg-red-50/90 border-red-200 text-red-950 dark:bg-red-950/40 dark:border-red-800/60 dark:text-red-200',
    iconColor: 'text-red-600 dark:text-red-400',
    defaultIcon: AlertCircle,
  },
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, children, onClose, icon = true, ...props }, ref) => {
    const config = variantStyles[variant];
    const IconComponent = config.defaultIcon as React.ComponentType<{
      size?: number;
      className?: string;
      'aria-hidden'?: boolean | 'true' | 'false';
    }>;
    const computedRole = variant === 'error' ? 'alert' : 'status';

    return (
      <div
        ref={ref}
        role={computedRole}
        className={cn(
          'relative w-full rounded-xl border p-4 text-sm flex gap-3.5 transition-colors',
          config.container,
          className
        )}
        {...props}
      >
        {icon && (
          <div className="shrink-0 mt-0.5">
            <IconComponent size={20} className={config.iconColor} aria-hidden="true" />
          </div>
        )}

        <div className="flex-1 space-y-1 text-left">
          {title && <h5 className="font-semibold leading-tight">{title}</h5>}
          {children && (
            <div className="opacity-90 leading-relaxed text-xs sm:text-sm">
              {children}
            </div>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss alert"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 focus-ring transition-colors cursor-pointer"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('font-semibold leading-tight text-slate-900 dark:text-slate-100', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-slate-700 dark:text-slate-300 leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export default Alert;
