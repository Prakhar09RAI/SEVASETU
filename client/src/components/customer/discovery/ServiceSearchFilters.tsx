import React from 'react';
import { Search, MapPin, SlidersHorizontal, RotateCcw, Sparkles, Calendar, Clock } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Button } from '../../ui/Button';
import { cn } from '../../../lib/cn';
import type { ServiceCategory } from '../../../types';

export interface ServiceSearchFiltersProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  preferredDate?: string;
  onDateChange?: (value: string) => void;
  preferredTime?: string;
  onTimeChange?: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onReset?: () => void;
  categories: ServiceCategory[];
  className?: string;
}

export const ServiceSearchFilters: React.FC<ServiceSearchFiltersProps> = ({
  keyword,
  onKeywordChange,
  selectedCategory,
  onCategoryChange,
  location,
  onLocationChange,
  preferredDate,
  onDateChange,
  preferredTime,
  onTimeChange,
  sortBy,
  onSortChange,
  onReset,
  categories,
  className,
}) => {
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  const sortOptions = [
    { value: 'recommended', label: 'Best Match (AI Ranked)' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const quickFilterChips = [
    { id: 'available_today', label: '⚡ Available Today' },
    { id: 'top_rated', label: '⭐ Top Rated (4.8+)' },
    { id: 'instant_booking', label: '⚡ Instant Booking' },
    { id: 'fixed_price', label: '🏷️ Fixed Pricing' },
  ];

  const [activeChips, setActiveChips] = React.useState<Record<string, boolean>>({
    available_today: true,
  });

  const toggleChip = (chipId: string) => {
    setActiveChips((prev) => ({ ...prev, [chipId]: !prev[chipId] }));
  };

  return (
    <div className={cn('space-y-3 sticky top-16 z-30', className)}>
      {/* AI Smart Match Alert Banner */}
      <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-indigo-200/70 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
            <Sparkles size={14} aria-hidden="true" />
          </div>
          <span>
            <strong>AI Smart Match:</strong> Real-time distance, schedule availability, and customer satisfaction matching active.
          </span>
        </div>
        <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hidden sm:inline">
          ALGORITHM v2.4
        </span>
      </div>

      {/* Sticky Glass Filter Bar Container */}
      <div className="glass rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-3.5 text-left">
        {/* Row 1: Search, Category, Locality Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="Search service need (e.g. pipe leakage, wiring)..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            leftIcon={<Search size={16} />}
            aria-label="Search service need"
            className="h-11"
          />

          <Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={categoryOptions}
            aria-label="Filter by Category"
            className="h-11"
          />

          <Input
            placeholder="Area / Pincode / Landmark..."
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            leftIcon={<MapPin size={16} />}
            aria-label="Service Location"
            className="h-11"
          />
        </div>

        {/* Optional Scheduling Inputs */}
        {(onDateChange || onTimeChange) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {onDateChange && (
              <Input
                type="date"
                value={preferredDate || ''}
                onChange={(e) => onDateChange(e.target.value)}
                leftIcon={<Calendar size={16} />}
                aria-label="Preferred service date"
                className="h-10"
              />
            )}
            {onTimeChange && (
              <Input
                type="time"
                value={preferredTime || ''}
                onChange={(e) => onTimeChange(e.target.value)}
                leftIcon={<Clock size={16} />}
                aria-label="Preferred service time"
                className="h-10"
              />
            )}
          </div>
        )}

        {/* Row 2: Quick Filter Toggle Chips & Sort Control */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
          {/* Toggle Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Filters:</span>
            {quickFilterChips.map((chip) => {
              const isPressed = Boolean(activeChips[chip.id]);
              return (
                <button
                  key={chip.id}
                  type="button"
                  aria-pressed={isPressed}
                  onClick={() => toggleChip(chip.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer focus-ring',
                    isPressed
                      ? 'bg-primary-700 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  )}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Sort & Reset */}
          <div className="flex items-center gap-2 justify-end">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 shrink-0">
              <SlidersHorizontal size={14} aria-hidden="true" />
              <span className="font-semibold text-xs">Sort:</span>
            </div>
            <div className="w-44">
              <Select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                options={sortOptions}
                aria-label="Sort Results"
                className="h-9 py-1 text-xs"
              />
            </div>
            {onReset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                leftIcon={<RotateCcw size={13} />}
                className="text-xs h-9 px-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSearchFilters;
