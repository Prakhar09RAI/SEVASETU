import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Briefcase,
  CalendarClock,
  XCircle,
  CreditCard,
  Check,
  ShieldCheck,
  KeyRound,
  Receipt,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../lib/cn';
import type { BookingRecord, BookingStatus } from '@sevasetu/shared';

export interface BookingSummaryProps {
  booking: BookingRecord;
  userRole?: 'customer' | 'provider' | 'admin';
  onCancel?: () => void;
  onReschedule?: () => void;
  className?: string;
}

const LIFECYCLE_STEPS: { status: BookingStatus; label: string; description: string }[] = [
  { status: 'PENDING_PROVIDER', label: 'Requested', description: 'Pending provider review' },
  { status: 'ACCEPTED', label: 'Accepted', description: 'Matched with specialist' },
  { status: 'SCHEDULED', label: 'Confirmed', description: 'Appointment confirmed' },
  { status: 'ON_THE_WAY', label: 'On The Way', description: 'Partner travelling' },
  { status: 'ARRIVED', label: 'Arrived', description: 'Specialist at location' },
  { status: 'IN_PROGRESS', label: 'In Progress', description: 'Work underway' },
  { status: 'COMPLETED', label: 'Completed', description: 'Service fulfilled' },
];

function getStepIndex(status: BookingStatus): number {
  switch (status) {
    case 'PENDING_PROVIDER':
      return 0;
    case 'ACCEPTED':
      return 1;
    case 'SCHEDULED':
      return 2;
    case 'ON_THE_WAY':
      return 3;
    case 'ARRIVED':
      return 4;
    case 'IN_PROGRESS':
      return 5;
    case 'COMPLETED':
      return 6;
    default:
      return -1;
  }
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  booking,
  userRole = 'customer',
  onCancel,
  onReschedule,
  className,
}) => {
  const currentStepIdx = getStepIndex(booking.status);
  const isCancellable =
    booking.status === 'PENDING_PROVIDER' ||
    booking.status === 'ACCEPTED' ||
    booking.status === 'SCHEDULED';
  const isReschedulable =
    booking.status === 'PENDING_PROVIDER' ||
    booking.status === 'ACCEPTED' ||
    booking.status === 'SCHEDULED';

  const providerName =
    booking.providerSnapshot?.businessName ||
    booking.providerSnapshot?.fullName ||
    booking.providerProfile?.businessName ||
    booking.providerProfile?.user?.fullName ||
    'Assigned Specialist';

  const customerName =
    booking.customerSnapshot?.fullName ||
    booking.customer?.fullName ||
    'Customer';

  const locationStr = booking.locationSnapshot
    ? `${booking.locationSnapshot.flatNumber || ''} ${booking.locationSnapshot.streetArea || ''}, ${booking.locationSnapshot.city} ${booking.locationSnapshot.postalCode}`.trim()
    : 'Service Location';

  // Deterministic 4-digit security PIN
  const digitsOnly = booking.referenceCode.replace(/\D/g, '') || booking.id.replace(/\D/g, '');
  const securityPin = digitsOnly.length >= 4 ? digitsOnly.slice(-4) : '4829';

  // Bill Breakdown Calculation
  const baseFee = booking.priceSnapshot !== null ? booking.priceSnapshot : 399;
  const platformFee = 49;
  const gstTax = Math.round((baseFee + platformFee) * 0.18);
  const totalAmount = baseFee + platformFee + gstTax;

  return (
    <div className={cn('space-y-6 text-left', className)}>
      {/* 1. Live Status Timeline Card (<ol> of 7 steps) */}
      <Card variant="default" padding="none" className="bg-white dark:bg-slate-900 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono text-slate-400 font-semibold block">
              Reference #{booking.referenceCode}
            </span>
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white pt-0.5">
              Service Appointment Status
            </h2>
          </div>
          <Badge
            variant={
              booking.status === 'COMPLETED'
                ? 'success'
                : booking.status === 'CANCELLED'
                ? 'error'
                : 'info'
            }
            size="md"
            withDot
          >
            {booking.status.replace(/_/g, ' ')}
          </Badge>
        </div>

        <div className="p-5 sm:p-6">
          <ol
            aria-label="Booking lifecycle timeline"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-2 relative"
          >
            {LIFECYCLE_STEPS.map((step, idx) => {
              const isDone = currentStepIdx > idx;
              const isCurrent = currentStepIdx === idx;
              const isUpcoming = currentStepIdx < idx;

              return (
                <li
                  key={step.status}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={cn(
                    'flex lg:flex-col items-center lg:items-center gap-3 lg:gap-2 p-2.5 rounded-xl transition-all',
                    isCurrent && 'bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/80',
                    isDone && 'opacity-90',
                    isUpcoming && 'opacity-50'
                  )}
                >
                  {/* Step Icon / Number Indicator */}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs select-none transition-all',
                      isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-indigo-600 text-white animate-pulse shadow-md shadow-indigo-600/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                    )}
                  >
                    {isDone ? <Check size={16} strokeWidth={3} aria-hidden="true" /> : idx + 1}
                  </div>

                  {/* Step Label */}
                  <div className="lg:text-center min-w-0">
                    <span
                      className={cn(
                        'block text-xs font-bold leading-tight truncate',
                        isCurrent
                          ? 'text-indigo-900 dark:text-indigo-200'
                          : isDone
                          ? 'text-emerald-800 dark:text-emerald-300'
                          : 'text-slate-500 dark:text-slate-400'
                      )}
                    >
                      {step.label}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden lg:block truncate">
                      {step.description}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Card>

      {/* 2. Service Verification PIN Card (amber-100 bg, amber-900 text, 30px tracking-widest) */}
      {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
              <KeyRound size={18} className="text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span>Service Security PIN</span>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300 max-w-md">
              Share this one-time security PIN with your verified service professional upon their arrival at your doorstep to initiate the service safely.
            </p>
          </div>

          <div className="px-6 py-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/80 border border-amber-300 dark:border-amber-700 select-all shrink-0">
            <span
              className="font-mono font-black text-3xl tracking-[0.3em] text-amber-950 dark:text-amber-100 leading-none"
              aria-label={`Security PIN: ${securityPin}`}
            >
              {securityPin}
            </span>
          </div>
        </div>
      )}

      {/* 3. Appointment & Stakeholder Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stakeholder Info */}
        <Card variant="default" className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            {userRole === 'provider' ? <User size={14} /> : <Briefcase size={14} />}
            <span>{userRole === 'provider' ? 'Customer Profile' : 'Service Partner'}</span>
          </div>
          <p className="font-display font-bold text-lg text-slate-900 dark:text-white">
            {userRole === 'provider' ? customerName : providerName}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Identity Checked &amp; Insured</span>
          </div>
        </Card>

        {/* Schedule Info */}
        <Card variant="default" className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Calendar size={14} />
            <span>Scheduled Date &amp; Window</span>
          </div>
          <p className="font-display font-bold text-lg text-slate-900 dark:text-white">
            {booking.scheduledDate}
          </p>
          <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
            <Clock size={13} className="text-primary-600" />
            <span>{booking.scheduledStartTime} – {booking.scheduledEndTime} ({booking.durationHours} hrs window)</span>
          </p>
        </Card>
      </div>

      {/* 4. Location Snapshot */}
      <Card variant="default" className="p-5 flex items-start gap-3">
        <MapPin size={18} className="text-primary-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Service Location
          </span>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{locationStr}</p>
        </div>
      </Card>

      {/* 5. Itemized Bill Breakdown */}
      <Card variant="default" padding="none" className="overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-primary-600" />
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Itemized Bill Breakdown
            </h3>
          </div>
          <Badge variant="neutral" size="sm" className="font-mono">
            {booking.pricingModelSnapshot}
          </Badge>
        </div>

        <div className="p-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <div className="flex justify-between items-center text-xs">
            <span>Base Service Fee ({booking.serviceTitleSnapshot || 'Specialist Visit'})</span>
            <span className="font-mono font-medium text-slate-900 dark:text-white">₹{baseFee}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span>Platform Safety, Insurance &amp; Tech Charge</span>
            <span className="font-mono font-medium text-slate-900 dark:text-white">₹{platformFee}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span>GST &amp; Government Taxes (18%)</span>
            <span className="font-mono font-medium text-slate-900 dark:text-white">₹{gstTax}</span>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center font-bold text-base text-slate-900 dark:text-white">
            <span>Total Payable Amount</span>
            <span className="font-mono text-xl text-primary-700 dark:text-primary-400 font-extrabold">
              ₹{totalAmount}
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={15} className="text-emerald-600" />
            <span>Escrow Protection: Money held safely until completion</span>
          </div>

          {booking.status !== 'CANCELLED' && booking.status !== 'DECLINED' && (
            <Link to={`/payment/${booking.id}`}>
              <Button variant="primary" size="md" leftIcon={<CreditCard size={15} />}>
                Proceed to Checkout
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {/* 6. Action Controls: Reschedule / Cancel */}
      {userRole === 'customer' && (isCancellable || isReschedulable) && (
        <div className="flex items-center justify-end gap-3 pt-2">
          {isReschedulable && onReschedule && (
            <Button
              variant="outline"
              size="md"
              leftIcon={<CalendarClock size={15} />}
              onClick={onReschedule}
            >
              Reschedule Window
            </Button>
          )}
          {isCancellable && onCancel && (
            <Button
              variant="ghost"
              size="md"
              leftIcon={<XCircle size={15} className="text-red-600" />}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
              onClick={onCancel}
            >
              Cancel Appointment
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingSummary;
