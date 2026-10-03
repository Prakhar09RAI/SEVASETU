import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      id: customId,
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;

    return (
      <div className="flex flex-col space-y-1 text-left">
        <label
          htmlFor={id}
          className={cn(
            'flex items-start gap-3 py-1 cursor-pointer select-none group min-h-[44px]',
            disabled && 'cursor-not-allowed opacity-60'
          )}
        >
          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
            <input
              ref={ref}
              type="radio"
              id={id}
              disabled={disabled}
              checked={checked}
              aria-invalid={Boolean(error)}
              className={cn(
                'peer h-5 w-5 shrink-0 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors cursor-pointer appearance-none',
                'checked:border-primary-700 dark:checked:border-primary-500',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
                'disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:border-slate-300 disabled:cursor-not-allowed',
                error && 'border-red-500 dark:border-red-500',
                className
              )}
              {...props}
            />
            <span
              className="pointer-events-none absolute w-2.5 h-2.5 rounded-full bg-primary-700 dark:bg-primary-500 opacity-0 peer-checked:opacity-100 transition-opacity"
              aria-hidden="true"
            />
          </div>

          {(label || helperText) && (
            <div className="text-left leading-snug">
              {label && (
                <span
                  className={cn(
                    'text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white',
                    disabled && 'text-slate-400 dark:text-slate-600'
                  )}
                >
                  {label}
                </span>
              )}
              {helperText && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{helperText}</p>
              )}
            </div>
          )}
        </label>
      </div>
    );
  }
);

Radio.displayName = 'Radio';
export default Radio;
