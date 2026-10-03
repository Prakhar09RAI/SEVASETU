import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
  children: React.ReactNode;
  className?: string;
}

const sizeStyles: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  closeOnBackdrop = true,
  children,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus restoration & Escape key & Focus trapping
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previousActiveElement.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    // Focus first focusable element inside modal
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusable[0];
        if (firstEl) {
          firstEl.focus();
        }
      }
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (first && last) {
          if (event.shiftKey && document.activeElement === first) {
            last.focus();
            event.preventDefault();
          } else if (!event.shiftKey && document.activeElement === last) {
            first.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full max-h-[calc(100vh-2rem)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden transform transition-all',
          sizeStyles[size],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="space-y-1 pr-6 text-left">
              {title && (
                <h3 id="modal-title" className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p id="modal-description" className="text-sm text-slate-600 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors cursor-pointer shrink-0"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-left text-slate-800 dark:text-slate-200">{children}</div>
      </div>
    </div>
  );
};

export const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 mt-6 border-t border-slate-100 dark:border-slate-800',
      className
    )}
    {...props}
  />
);

export default Modal;
