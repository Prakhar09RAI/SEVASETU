import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  srOnlyLabel?: boolean;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      srOnlyLabel = false,
      helperText,
      error,
      isRequired,
      leftIcon,
      rightIcon,
      id: customId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'block text-xs font-semibold text-slate-700 dark:text-slate-300',
              srOnlyLabel && 'sr-only'
            )}
          >
            {label}
            {isRequired && (
              <span className="text-red-500 dark:text-red-400 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center shrink-0"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'w-full min-h-[44px] rounded-xl border bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 transition-colors shadow-xs',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-primary-600 dark:focus:border-primary-500',
              'disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:text-slate-400 disabled:cursor-not-allowed',
              error
                ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3.5 text-slate-400 dark:text-slate-500 flex items-center shrink-0">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} className="text-xs text-red-600 dark:text-red-400 font-medium" role="alert">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
