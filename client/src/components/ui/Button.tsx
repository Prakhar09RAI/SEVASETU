import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { Spinner } from './Spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-xl select-none transition-all duration-200 cursor-pointer focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900 shadow-sm shadow-primary-950/20',
        secondary:
          'bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 shadow-xs',
        outline:
          'border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs',
        ghost:
          'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80',
        danger:
          'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-950/20',
        destructive:
          'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-950/20',
        link:
          'text-primary-700 dark:text-primary-400 underline-offset-4 hover:underline p-0 h-auto font-medium focus-visible:ring-0',
      },
      size: {
        sm: 'h-9 px-3 text-sm gap-1.5',
        md: 'h-11 px-4 text-base min-h-[44px] gap-2',
        lg: 'h-14 px-6 text-lg min-h-[44px] gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'destructive'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      loading,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isBusy = Boolean(isLoading || loading);
    const isLink = variant === 'link';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isBusy}
        aria-busy={isBusy}
        className={cn(buttonVariants({ variant, size: isLink ? undefined : size }), className)}
        {...props}
      >
        {isBusy ? (
          <Spinner
            size={size === 'lg' ? 'md' : 'sm'}
            variant={variant === 'primary' || variant === 'danger' || variant === 'destructive' ? 'white' : 'current'}
            className="shrink-0"
          />
        ) : (
          leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isBusy && rightIcon && <span className="shrink-0" aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
