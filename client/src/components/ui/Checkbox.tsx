import React, { forwardRef, useEffect, useId, useRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      indeterminate = false,
      id: customId,
      disabled,
      checked,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const generatedId = useId();
    const id = customId || generatedId;
    const errorId = `${id}-error`;

    useEffect(() => {
      const el = (forwardedRef as React.RefObject<HTMLInputElement>)?.current || internalRef.current;
      if (el) {
        el.indeterminate = indeterminate;
      }
    }, [indeterminate, forwardedRef]);

    const setRef = (element: HTMLInputElement | null) => {
      internalRef.current = element;
      if (typeof forwardedRef === 'function') {
        forwardedRef(element);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = element;
      }
    };

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
              ref={setRef}
              type="checkbox"
              id={id}
              disabled={disabled}
              checked={checked}
              aria-invalid={Boolean(error)}
              className={cn(
                'peer h-5 w-5 shrink-0 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors cursor-pointer appearance-none',
                'checked:bg-primary-700 checked:border-primary-700 dark:checked:bg-primary-600 dark:checked:border-primary-600',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
                'disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:border-slate-300 disabled:cursor-not-allowed',
                error && 'border-red-500 dark:border-red-500',
                className
              )}
              {...props}
            />
            {indeterminate ? (
              <Minus
                className="pointer-events-none absolute w-3.5 h-3.5 text-white stroke-[3]"
                aria-hidden="true"
              />
            ) : (
              <Check
                className="pointer-events-none absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 stroke-[3] transition-opacity"
                aria-hidden="true"
              />
            )}
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

        {error && (
          <p id={errorId} className="text-xs text-red-600 dark:text-red-400 font-medium pl-8" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
