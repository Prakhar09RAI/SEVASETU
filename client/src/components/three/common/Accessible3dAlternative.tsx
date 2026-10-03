import React from 'react';

export interface AccessibleActionItem {
  id: string;
  label: string;
  description?: string;
  badge?: string;
  onClick?: () => void;
  href?: string;
  isActive?: boolean;
}

interface Props {
  title: string;
  description: string;
  items: AccessibleActionItem[];
  srOnly?: boolean;
  className?: string;
}

/**
 * Screen-reader and keyboard accessible HTML companion for 3D interactive canvases.
 * Ensures keyboard navigation (Tab/Enter) and screen readers have 100% feature parity with 3D nodes.
 */
export const Accessible3dAlternative: React.FC<Props> = ({
  title,
  description,
  items,
  srOnly = false,
  className = '',
}) => {
  const containerClasses = srOnly
    ? 'sr-only focus-within:not-sr-only focus-within:absolute focus-within:z-50 focus-within:p-4 focus-within:bg-white focus-within:shadow-xl focus-within:rounded-xl focus-within:border focus-within:border-primary-200'
    : className;

  return (
    <nav
      aria-label={`${title} keyboard and screen-reader controls`}
      className={containerClasses}
    >
      <h2 className="text-sm font-bold text-neutral-900">{title}</h2>
      <p className="text-xs text-neutral-600 mb-3">{description}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const content = (
            <>
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-800 font-medium">
                  {item.badge}
                </span>
              )}
            </>
          );

          if (item.href) {
            return (
              <a
                key={item.id}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  item.isActive
                    ? 'bg-primary-600 text-white border-primary-700'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
                }`}
                aria-current={item.isActive ? 'true' : undefined}
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                item.isActive
                  ? 'bg-primary-600 text-white border-primary-700'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
              }`}
              aria-pressed={item.isActive}
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
