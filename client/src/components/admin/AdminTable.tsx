import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { cn } from '../../lib/cn';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  render: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

export interface AdminTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  mobileCardRenderer?: (item: T, isSelected: boolean) => React.ReactNode;
}

export function AdminTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  error = null,
  emptyTitle = 'No records found',
  emptyDescription = 'There are currently no items matching the specified filters.',
  emptyAction,
  sortBy,
  sortDirection = 'asc',
  onSort,
  selectedIds,
  onSelectRow,
  onSelectAll,
  page = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  mobileCardRenderer,
}: AdminTableProps<T>): React.ReactElement {
  const isAllSelected =
    data.length > 0 && selectedIds && data.every((item) => selectedIds.includes(keyExtractor(item)));

  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 flex flex-col items-center justify-center min-h-[300px]">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4">
          Loading operational records...
        </p>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/60 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <AlertCircle className="text-red-500 mb-3" size={36} aria-hidden="true" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Unable to load data</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-1">{error}</p>
      </div>
    );
  }

  // 3. Empty State
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
      {/* Semantic Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 divide-y divide-slate-200 dark:divide-slate-800">
          <caption className="sr-only">{emptyTitle || 'Administrative operational records'}</caption>
          <thead className="bg-slate-50 dark:bg-slate-950/80 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            <tr>
              {onSelectAll && (
                <th scope="col" className="w-12 px-4 py-3.5">
                  <span className="sr-only">Select All Rows</span>
                  <Checkbox
                    checked={isAllSelected}
                    onChange={onSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isCurrentSort = sortBy === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn('px-4 py-3.5 select-none font-bold', col.headerClassName)}
                    aria-sort={
                      isCurrentSort
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : col.sortable
                        ? 'none'
                        : undefined
                    }
                  >
                    {col.sortable && onSort ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.key)}
                        className="inline-flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus-ring rounded-lg px-1.5 py-1 -mx-1.5 transition-colors cursor-pointer"
                      >
                        <span>{col.header}</span>
                        {isCurrentSort ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp size={14} className="text-primary-600 dark:text-primary-400" />
                          ) : (
                            <ArrowDown size={14} className="text-primary-600 dark:text-primary-400" />
                          )
                        ) : (
                          <ArrowUpDown size={13} className="text-slate-400" />
                        )}
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {data.map((item, index) => {
              const id = keyExtractor(item);
              const isSelected = selectedIds?.includes(id) ?? false;

              return (
                <tr
                  key={id}
                  className={cn(
                    'transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/60',
                    isSelected && 'bg-primary-50/40 dark:bg-primary-950/40'
                  )}
                >
                  {onSelectRow && (
                    <td className="w-12 px-4 py-3.5">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onSelectRow(id)}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-3.5 align-middle', col.className)}>
                      {col.render(item, index)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE: Responsive Card / Stacked View */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {data.map((item, index) => {
          const id = keyExtractor(item);
          const isSelected = selectedIds?.includes(id) ?? false;

          if (mobileCardRenderer) {
            return (
              <div key={id} className="p-4">
                {mobileCardRenderer(item, isSelected)}
              </div>
            );
          }

          return (
            <div
              key={id}
              className={cn(
                'p-4 space-y-2.5 transition-colors',
                isSelected && 'bg-primary-50/40 dark:bg-primary-950/40'
              )}
            >
              {onSelectRow && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500">Record #{index + 1}</span>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onSelectRow(id)}
                    aria-label={`Select record ${index + 1}`}
                  />
                </div>
              )}
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between items-baseline gap-2 text-xs">
                  <span className="font-semibold text-slate-400">{col.header}:</span>
                  <div className="text-right text-slate-900 dark:text-slate-100">{col.render(item, index)}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && onPageChange && (
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalItems} total records)
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
              className="h-9 px-2.5"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
              className="h-9 px-2.5"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTable;
