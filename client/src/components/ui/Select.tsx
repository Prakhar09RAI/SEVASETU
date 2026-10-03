import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  srOnlyLabel?: boolean;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      srOnlyLabel = false,
      helperText,
      error,
      isRequired,
      options,
      id: customId,
      disabled,
      children,
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
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'w-full min-h-[44px] appearance-none rounded-xl border bg-white dark:bg-slate-900 px-3.5 py-2.5 pr-10 text-sm text-slate-900 dark:text-slate-100 transition-colors shadow-xs cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-primary-600 dark:focus:border-primary-500',
              'disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:text-slate-400 disabled:cursor-not-allowed',
              error
                ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled} className="dark:bg-slate-900">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-3.5 w-4 h-4 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
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

Select.displayName = 'Select';
export default Select;
