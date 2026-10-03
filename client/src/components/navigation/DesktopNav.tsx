import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { Badge } from '../ui/Badge';
import type { NavItem } from './types';

export interface DesktopNavProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[];
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ items, className, ...props }) => {
  return (
    <nav
      aria-label="Main Navigation"
      className={cn('hidden md:flex items-center gap-1', className)}
      {...props}
    >
      {items.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              'relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all select-none whitespace-nowrap shrink-0',
              'focus-ring',
              isActive
                ? 'bg-primary-50 text-primary-800 font-semibold dark:bg-primary-950/70 dark:text-primary-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
            )
          }
        >
          {({ isActive }) => (
            <>
              {item.icon && (
                <span className="shrink-0 text-current" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
              {item.badge && (
                <Badge variant="info" size="sm" className="ml-1">
                  {item.badge}
                </Badge>
              )}
              {isActive && (
                <span
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600 rounded-full dark:bg-primary-400"
                  aria-hidden="true"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default DesktopNav;
