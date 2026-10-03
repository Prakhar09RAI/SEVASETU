import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../lib/cn';
import { Badge } from '../components/ui/Badge';
import type { NavItem } from '../components/navigation/types';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  title?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  title = 'Platform Menu',
  className,
  ...props
}) => {
  // Close on Escape on mobile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    };

    if (isMobileOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen, onCloseMobile]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
        {!isCollapsed ? (
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
            {title}
          </span>
        ) : (
          <span className="mx-auto w-2.5 h-2.5 rounded-full bg-primary-600" aria-hidden="true" />
        )}

        {/* Mobile close button */}
        {isMobileOpen && onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar menu"
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}

        {/* Desktop collapse toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
          className="hidden md:inline-flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors ml-auto"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Sidebar Navigation">
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={() => isMobileOpen && onCloseMobile && onCloseMobile()}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                'relative flex items-center rounded-xl text-sm font-medium transition-all group focus-ring',
                isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5',
                isActive
                  ? 'bg-primary-50 text-primary-800 font-semibold dark:bg-primary-950/70 dark:text-primary-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Left Active Pill Indicator */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary-600 dark:bg-primary-400 rounded-r-full"
                    aria-hidden="true"
                  />
                )}
                <div className="flex items-center gap-3">
                  {item.icon && (
                    <span className="shrink-0 text-current" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <Badge variant="info" size="sm">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-600 dark:text-slate-400">Platform</span>
            <span className="text-[11px] font-mono">v1.0</span>
          </div>
        ) : (
          <div className="text-center text-[10px] font-mono">v1</div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:block shrink-0 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ease-in-out',
          isCollapsed ? 'w-18' : 'w-64',
          className
        )}
        aria-label="Sidebar"
        {...props}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Sidebar"
          className="fixed inset-0 z-50 md:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[80vw] shadow-2xl z-10 border-r border-slate-200 dark:border-slate-800">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
