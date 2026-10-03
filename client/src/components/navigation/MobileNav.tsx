import React, { useEffect, useRef } from 'react';
import { X, Sun, Moon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { Badge } from '../ui/Badge';
import type { NavItem } from './types';
import { useTheme } from '../../lib/useTheme';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, items }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { isDark, toggleTheme } = useTheme();

  // Close on Escape key, trap focus, manage body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (first && last) {
          if (e.shiftKey && document.activeElement === first) {
            last.focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 lg:hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800',
          'flex flex-col z-10 transform transition-transform duration-200 ease-in-out'
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white font-display font-extrabold text-sm shadow-xs">
              S
            </div>
            <span className="font-display font-bold text-base text-slate-900 dark:text-white tracking-tight">
              SevaSetu
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Drawer Nav Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5" aria-label="Mobile Menu Links">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
            Menu
          </div>
          {items.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  'focus-ring',
                  isActive
                    ? 'bg-primary-50 text-primary-800 font-semibold dark:bg-primary-950/70 dark:text-primary-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                )
              }
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <span className="shrink-0 text-current" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant="info" size="sm">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Drawer Footer Framework */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400">
          <p className="font-semibold text-slate-700 dark:text-slate-300">SevaSetu Platform</p>
          <p className="text-[11px] mt-0.5">Bridge to Local Services</p>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
