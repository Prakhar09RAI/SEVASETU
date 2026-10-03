import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Wrench,
  Hammer,
  Home,
  Car,
  Layers,
} from 'lucide-react';
import { cn } from '../../../lib/cn';
import type { ServiceCategory } from '../../../types';

export interface ServiceCategoryCardProps {
  category: ServiceCategory;
  isSelected?: boolean;
  onSelect?: (category: ServiceCategory) => void;
  className?: string;
  asLink?: boolean;
}

type CategoryIconComponent = React.ComponentType<{
  size?: number;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;

const iconMap: Record<string, CategoryIconComponent> = {
  Sparkles,
  Zap,
  Wrench,
  Hammer,
  Home,
  Car,
};

export const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({
  category,
  isSelected = false,
  onSelect,
  className,
  asLink = true,
}) => {
  const IconComponent: CategoryIconComponent = (category.iconName && iconMap[category.iconName]) || Layers;

  const content = (
    <div
      className={cn(
        'group flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none lift focus-ring',
        isSelected
          ? 'bg-primary-50/90 border-primary-500 shadow-sm text-primary-950 dark:bg-primary-950/60 dark:border-primary-400 dark:text-primary-100 ring-2 ring-primary-500'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-500 text-slate-900 dark:text-slate-100',
        className
      )}
    >
      <div
        className={cn(
          'w-13 h-13 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-200',
          isSelected
            ? 'bg-primary-600 text-white shadow-xs'
            : 'bg-primary-50 dark:bg-primary-950/80 text-primary-700 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white dark:group-hover:bg-primary-600 dark:group-hover:text-white'
        )}
      >
        <IconComponent size={24} aria-hidden="true" />
      </div>

      <h3 className="font-display font-bold text-sm leading-tight text-slate-900 dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
        {category.name}
      </h3>

      {category.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      )}

      <div className="mt-3 pt-2 w-full border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
        <span className="text-[11px] font-semibold text-primary-700 dark:text-primary-400 group-hover:underline">
          From ₹199 • Book Now
        </span>
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link
        to={`/services/${category.slug}`}
        aria-label={`Browse ${category.name} services`}
        className="focus-ring rounded-2xl block"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(category)}
      aria-pressed={isSelected}
      className="w-full text-left focus-ring rounded-2xl"
    >
      {content}
    </button>
  );
};

export default ServiceCategoryCard;
