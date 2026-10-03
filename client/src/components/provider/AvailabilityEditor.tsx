import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Clock,
  Save,
  CalendarOff,
  Plus,
  Trash2,
  Coffee,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { Alert } from '../ui/Alert';
import { providerService } from '../../services/provider.service';
import { cn } from '../../lib/cn';
import type {
  DayOfWeek,
  SetDayScheduleInput,
  AvailabilityOverrideItem,
  ProviderAvailabilitySchedule,
  ProviderAvailabilityItem,
} from '@sevasetu/shared';

export interface AvailabilityEditorProps {
  className?: string;
  onSaved?: (data: ProviderAvailabilitySchedule) => void;
  initialLoading?: boolean;
}

interface LocalDaySchedule {
  dayOfWeek: DayOfWeek;
  dayLabel: string;
  shortLabel: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

const ORDERED_DAYS: {
  day: DayOfWeek;
  label: string;
  shortLabel: string;
  defaultStart: string;
  defaultEnd: string;
  defaultAvailable: boolean;
}[] = [
  { day: 'MONDAY', label: 'Monday', shortLabel: 'Mon', defaultStart: '09:00', defaultEnd: '18:00', defaultAvailable: true },
  { day: 'TUESDAY', label: 'Tuesday', shortLabel: 'Tue', defaultStart: '09:00', defaultEnd: '18:00', defaultAvailable: true },
  { day: 'WEDNESDAY', label: 'Wednesday', shortLabel: 'Wed', defaultStart: '09:00', defaultEnd: '18:00', defaultAvailable: true },
  { day: 'THURSDAY', label: 'Thursday', shortLabel: 'Thu', defaultStart: '09:00', defaultEnd: '18:00', defaultAvailable: true },
  { day: 'FRIDAY', label: 'Friday', shortLabel: 'Fri', defaultStart: '09:00', defaultEnd: '18:00', defaultAvailable: true },
  { day: 'SATURDAY', label: 'Saturday', shortLabel: 'Sat', defaultStart: '10:00', defaultEnd: '16:00', defaultAvailable: true },
  { day: 'SUNDAY', label: 'Sunday', shortLabel: 'Sun', defaultStart: '10:00', defaultEnd: '14:00', defaultAvailable: false },
];

export const AvailabilityEditor: React.FC<AvailabilityEditorProps> = ({
  className,
  onSaved,
  initialLoading = true,
}) => {
  const [schedule, setSchedule] = useState<LocalDaySchedule[]>(() =>
    ORDERED_DAYS.map((d) => ({
      dayOfWeek: d.day,
      dayLabel: d.label,
      shortLabel: d.shortLabel,
      isAvailable: d.defaultAvailable,
      startTime: d.defaultStart,
      endTime: d.defaultEnd,
      breakStart: '13:00',
      breakEnd: '14:00',
    }))
  );
  const [vacationMode, setVacationMode] = useState<boolean>(false);
  const [overrides, setOverrides] = useState<AvailabilityOverrideItem[]>([]);

  const [isLoading, setIsLoading] = useState(initialLoading);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Override State
  const [newOverrideDate, setNewOverrideDate] = useState('');
  const [newOverrideAvailable, setNewOverrideAvailable] = useState(false);
  const [newOverrideReason, setNewOverrideReason] = useState('');
  const [isAddingOverride, setIsAddingOverride] = useState(false);

  // Refs for arrow key roving focus
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Fetch Real Availability from PostgreSQL API
  useEffect(() => {
    let isMounted = true;
    async function loadAvailability() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await providerService.getAvailability();
        if (!isMounted) return;

        setVacationMode(data.vacationMode || false);
        setOverrides(data.overrides || []);

        if (data.weeklySchedule && data.weeklySchedule.length > 0) {
          const mapped = ORDERED_DAYS.map((def) => {
            const existing = data.weeklySchedule.find(
              (w: ProviderAvailabilityItem) => w.dayOfWeek === def.day
            );
            if (existing) {
              return {
                dayOfWeek: def.day,
                dayLabel: def.label,
                shortLabel: def.shortLabel,
                isAvailable: existing.isAvailable,
                startTime: existing.startTime || def.defaultStart,
                endTime: existing.endTime || def.defaultEnd,
                breakStart: existing.breakStart || undefined,
                breakEnd: existing.breakEnd || undefined,
              };
            }
            return {
              dayOfWeek: def.day,
              dayLabel: def.label,
              shortLabel: def.shortLabel,
              isAvailable: def.defaultAvailable,
              startTime: def.defaultStart,
              endTime: def.defaultEnd,
              breakStart: '13:00',
              breakEnd: '14:00',
            };
          });
          setSchedule(mapped);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Failed to load availability schedule';
        setErrorMessage(msg);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadAvailability();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleDay = (day: DayOfWeek) => {
    setSchedule((prev) =>
      prev.map((s) => (s.dayOfWeek === day ? { ...s, isAvailable: !s.isAvailable } : s))
    );
  };

  const handleKeyDownMatrix = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (index + 1) % 7;
      buttonRefs.current[nextIdx]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (index - 1 + 7) % 7;
      buttonRefs.current[prevIdx]?.focus();
    }
  };

  const handleTimeChange = (
    day: DayOfWeek,
    field: 'startTime' | 'endTime' | 'breakStart' | 'breakEnd',
    val: string
  ) => {
    setSchedule((prev) =>
      prev.map((s) => (s.dayOfWeek === day ? { ...s, [field]: val } : s))
    );
  };

  // Add Date-Specific Override
  const handleAddOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOverrideDate) return;

    setIsAddingOverride(true);
    setErrorMessage(null);
    try {
      const updated = await providerService.createOverride({
        date: newOverrideDate,
        isAvailable: newOverrideAvailable,
        reason: newOverrideReason.trim() || undefined,
      });

      setOverrides(updated.overrides || []);
      setNewOverrideDate('');
      setNewOverrideReason('');
      setNewOverrideAvailable(false);
      setSuccessMessage(`Date override for ${newOverrideDate} saved.`);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save date override';
      setErrorMessage(msg);
    } finally {
      setIsAddingOverride(false);
    }
  };

  // Remove Date Override
  const handleRemoveOverride = async (id: string, dateStr: string) => {
    setErrorMessage(null);
    try {
      await providerService.deleteOverride(id);
      setOverrides((prev) => prev.filter((o) => o.id !== id));
      setSuccessMessage(`Override for ${dateStr} removed.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete date override';
      setErrorMessage(msg);
    }
  };

  // Validate and Save Weekly Working Hours
  const handleSave = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    for (const item of schedule) {
      if (item.isAvailable) {
        if (!item.startTime || !item.endTime) {
          setErrorMessage(`Please provide valid start and end times for ${item.dayLabel}.`);
          return;
        }
        if (item.startTime >= item.endTime) {
          setErrorMessage(`${item.dayLabel} operating hours are invalid: Start time must precede end time.`);
          return;
        }
        if (item.breakStart && item.breakEnd) {
          if (item.breakStart >= item.breakEnd) {
            setErrorMessage(`${item.dayLabel} break times are invalid: Break start must precede break end.`);
            return;
          }
          if (item.breakStart < item.startTime || item.breakEnd > item.endTime) {
            setErrorMessage(`${item.dayLabel} break must fall within the working shift (${item.startTime} - ${item.endTime}).`);
            return;
          }
        }
      }
    }

    setIsSaving(true);
    try {
      const payloadSchedule: SetDayScheduleInput[] = schedule.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        isAvailable: s.isAvailable,
        breakStart: s.breakStart || null,
        breakEnd: s.breakEnd || null,
      }));

      const res = await providerService.setAvailability({
        vacationMode,
        weeklySchedule: payloadSchedule,
      });

      setSuccessMessage('Weekly operating schedule successfully saved.');
      if (onSaved) onSaved(res);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save weekly schedule';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const activeDaysCount = schedule.filter((s) => s.isAvailable).length;

  if (isLoading) {
    return (
      <Card variant="default" padding="lg" className="bg-white dark:bg-slate-900 text-center py-16">
        <Loader2 size={32} className="animate-spin text-primary-600 mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading your availability schedule...</p>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6 text-left', className)}>
      <Card variant="default" padding="md" className="bg-white dark:bg-slate-900 space-y-6">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-primary-700 dark:text-primary-400 font-semibold text-xs">
                <Calendar size={16} />
                <span>Operating Calendar &amp; Matrix</span>
              </div>
              <CardTitle className="font-display font-bold text-xl pt-1 text-slate-900 dark:text-white">
                Weekly Operating Matrix
              </CardTitle>
              <CardDescription>
                Click or use arrow keys across the 7-day matrix to toggle available shifts.
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-bold">
                {activeDaysCount} of 7 Days Active
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {errorMessage && (
            <Alert variant="error" title="Schedule Notice" onClose={() => setErrorMessage(null)}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert variant="success" title="Success" onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}

          {/* Vacation / Temporary Pause Mode */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                <CalendarOff size={16} className="text-amber-600 dark:text-amber-400" />
                <span>Vacation / Emergency Pause Mode</span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                When enabled, your profile is hidden from customer search results and direct booking dispatch.
              </p>
            </div>

            <Checkbox
              label="Pause All Incoming Dispatches"
              checked={vacationMode}
              onChange={(e) => setVacationMode(e.target.checked)}
            />
          </div>

          {/* 110px x 7 Column Matrix with 44px Buttons & Arrow Key Roving Focus */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              7-Day Weekly Matrix (Arrow keys navigation)
            </label>

            <div
              role="grid"
              aria-label="Weekly availability schedule matrix"
              className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5"
            >
              {schedule.map((item, idx) => (
                <div key={item.dayOfWeek} role="row" className="flex flex-col">
                  <div role="gridcell" className="h-full">
                    <button
                      ref={(el) => {
                        buttonRefs.current[idx] = el;
                      }}
                      type="button"
                      role="checkbox"
                      aria-checked={item.isAvailable}
                      aria-label={`${item.dayLabel}: ${item.isAvailable ? `Available ${item.startTime} to ${item.endTime}` : 'Unavailable'}`}
                      onClick={() => handleToggleDay(item.dayOfWeek)}
                      onKeyDown={(e) => handleKeyDownMatrix(e, idx)}
                      className={cn(
                        'w-full min-h-[110px] p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all cursor-pointer focus-ring select-none',
                        item.isAvailable
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 border-solid shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 border-dashed hover:border-slate-400'
                      )}
                    >
                      <div className="space-y-0.5">
                        <span className="font-display font-extrabold text-sm block">
                          {item.shortLabel}
                        </span>
                        <span className="text-[10px] font-medium opacity-75 uppercase">
                          {item.dayLabel}
                        </span>
                      </div>

                      <div className="my-1">
                        {item.isAvailable ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
                            <Check size={16} strokeWidth={3} aria-hidden="true" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                            <X size={15} aria-hidden="true" />
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] font-mono font-semibold">
                        {item.isAvailable ? `${item.startTime} - ${item.endTime}` : 'Day Off'}
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Hours & Break Fine-Tuning */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Shift Hours &amp; Lunch Break Configuration
            </label>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
              {schedule.map((item) => (
                <div
                  key={item.dayOfWeek}
                  className={cn(
                    'p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors',
                    item.isAvailable ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/60 dark:bg-slate-950/40 opacity-60'
                  )}
                >
                  <div className="flex items-center gap-3 sm:w-36">
                    <input
                      type="checkbox"
                      id={`day-config-${item.dayOfWeek}`}
                      checked={item.isAvailable}
                      onChange={() => handleToggleDay(item.dayOfWeek)}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`day-config-${item.dayOfWeek}`}
                      className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer select-none"
                    >
                      {item.dayLabel}
                    </label>
                  </div>

                  {item.isAvailable ? (
                    <div className="flex flex-wrap items-center gap-3 text-xs flex-1 justify-start sm:justify-end">
                      {/* Shift Window */}
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400" />
                        <span className="text-slate-400">Shift:</span>
                        <input
                          type="time"
                          value={item.startTime}
                          onChange={(e) => handleTimeChange(item.dayOfWeek, 'startTime', e.target.value)}
                          className="h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                          aria-label={`${item.dayLabel} shift start time`}
                        />
                        <span className="text-slate-400">–</span>
                        <input
                          type="time"
                          value={item.endTime}
                          onChange={(e) => handleTimeChange(item.dayOfWeek, 'endTime', e.target.value)}
                          className="h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                          aria-label={`${item.dayLabel} shift end time`}
                        />
                      </div>

                      {/* Lunch Break */}
                      <div className="flex items-center gap-1.5">
                        <Coffee size={13} className="text-slate-400" />
                        <span className="text-slate-400">Break:</span>
                        <input
                          type="time"
                          value={item.breakStart || '13:00'}
                          onChange={(e) => handleTimeChange(item.dayOfWeek, 'breakStart', e.target.value)}
                          className="h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                          aria-label={`${item.dayLabel} break start time`}
                        />
                        <span className="text-slate-400">–</span>
                        <input
                          type="time"
                          value={item.breakEnd || '14:00'}
                          onChange={(e) => handleTimeChange(item.dayOfWeek, 'breakEnd', e.target.value)}
                          className="h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                          aria-label={`${item.dayLabel} break end time`}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Marked Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Date-Specific Overrides Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Holiday &amp; Custom Date Overrides
              </label>
            </div>

            <form
              onSubmit={handleAddOverride}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
            >
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Specific Date
                </label>
                <input
                  type="date"
                  value={newOverrideDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewOverrideDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Status for Date
                </label>
                <select
                  value={newOverrideAvailable ? 'available' : 'unavailable'}
                  onChange={(e) => setNewOverrideAvailable(e.target.value === 'available')}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                >
                  <option value="unavailable">Unavailable (Off Duty)</option>
                  <option value="available">Special Availability (On Duty)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Reason / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Festival, Doctor Appointment"
                  value={newOverrideReason}
                  onChange={(e) => setNewOverrideReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  variant="outline"
                  size="md"
                  disabled={isAddingOverride || !newOverrideDate}
                  leftIcon={<Plus size={14} />}
                  className="w-full h-10 text-xs"
                >
                  Add Override
                </Button>
              </div>
            </form>

            {/* Overrides Table */}
            {overrides.length > 0 && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                {overrides.map((ov) => (
                  <div
                    key={ov.id}
                    className="p-3.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{ov.date}</span>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                          ov.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        )}
                      >
                        {ov.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      {ov.reason && <span className="text-slate-500 italic">— {ov.reason}</span>}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveOverride(ov.id, ov.date)}
                      className="p-1.5 text-slate-400 hover:text-red-600 focus-ring rounded-lg cursor-pointer"
                      aria-label={`Remove override for ${ov.date}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Changes will take effect immediately for customer booking searches.
          </span>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={isSaving}
            leftIcon={isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            className="min-h-[44px] px-6 text-sm font-semibold shadow-xs"
          >
            {isSaving ? 'Saving Schedule...' : 'Save Operating Schedule'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AvailabilityEditor;
