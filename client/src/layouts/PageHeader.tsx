import React from 'react';
import { cn } from '../lib/cn';
import { Breadcrumbs, type BreadcrumbItem } from '../components/navigation/Breadcrumbs';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('space-y-3 pb-6 sm:pb-8 border-b border-slate-200/80 dark:border-slate-800 text-left', className)}
      {...props}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="mb-2" />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
