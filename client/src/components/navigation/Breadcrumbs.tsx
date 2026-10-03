import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHomeIcon = true,
  className,
  ...props
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-xs text-slate-500 dark:text-slate-400', className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {showHomeIcon && (
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors focus-ring rounded-md p-1"
              aria-label="Home"
            >
              <Home size={14} aria-hidden="true" />
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5 sm:gap-2">
              {(showHomeIcon || index > 0) && (
                <ChevronRight
                  size={12}
                  className="text-slate-400 dark:text-slate-600 shrink-0 select-none"
                  aria-hidden="true"
                />
              )}

              {isLast || !item.href ? (
                <span
                  className={cn(
                    'font-medium truncate max-w-[200px] sm:max-w-none',
                    isLast
                      ? 'text-slate-900 dark:text-slate-100 font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && <span className="mr-1.5 inline-flex">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors truncate max-w-[160px] sm:max-w-none focus-ring rounded-md p-0.5"
                >
                  {item.icon && <span className="mr-1.5 inline-flex">{item.icon}</span>}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
