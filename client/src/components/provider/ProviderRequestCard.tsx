import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  X,
  Eye,
  FileText,
  AlertCircle,
  Timer,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RequestStatusBadge } from './ProviderStatusBadge';
import type { ProviderRequestItem } from '../../types';
import { cn } from '../../lib/cn';

export interface ProviderRequestCardProps {
  request: ProviderRequestItem;
  onAccept?: (requestId: string) => void;
  onDecline?: (requestId: string) => void;
  className?: string;
}

export const ProviderRequestCard: React.FC<ProviderRequestCardProps> = ({
  request,
  onAccept,
  onDecline,
  className,
}) => {
  const isPending = request.status === 'new' || request.status === 'pending';
  const [secondsLeft, setSecondsLeft] = useState(285); // ~4m 45s countdown

  useEffect(() => {
    if (!isPending) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPending]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedCountdown = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <Card
      variant="default"
      padding="none"
      className={cn(
        'transition-all duration-200 bg-white dark:bg-slate-900 border text-left',
        isPending
          ? 'border-amber-300 dark:border-amber-700/80 shadow-md shadow-amber-500/5 ring-1 ring-amber-300/40'
          : 'border-slate-200 dark:border-slate-800',
        className
      )}
    >
      <CardHeader className="p-5 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm">{request.category}</Badge>
            <span className="text-xs text-slate-400 font-mono">Ref: {request.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {isPending && secondsLeft > 0 && (
              <div
                role="timer"
                aria-label={`Time remaining to respond: ${formattedCountdown}`}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-mono font-bold animate-pulse"
              >
                <Timer size={13} className="text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <span>{formattedCountdown} left</span>
              </div>
            )}
            <RequestStatusBadge status={request.status} />
          </div>
        </div>

        <CardTitle className="font-display font-bold text-lg pt-1 text-slate-900 dark:text-white">
          {request.serviceTitle}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 space-y-4 text-xs text-slate-700 dark:text-slate-300">
        {/* Customer Need Statement */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Customer Requirement
          </span>
          <p className="text-slate-900 dark:text-slate-100 font-medium leading-relaxed text-sm">
            "{request.customerSummary}"
          </p>
        </div>

        {/* Schedule & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Calendar size={15} className="text-primary-600 dark:text-primary-400 shrink-0" aria-hidden="true" />
            <span className="font-semibold">{request.requestedDate}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-mono">
            <Clock size={15} className="text-primary-600 dark:text-primary-400 shrink-0" aria-hidden="true" />
            <span>{request.requestedTime} ({request.duration})</span>
          </div>

          <div className="sm:col-span-2 flex items-start gap-2 text-slate-600 dark:text-slate-400">
            <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="truncate">{request.locationSummary}</span>
          </div>
        </div>

        {/* Customer Special Instructions */}
        {request.instructions && (
          <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300 bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/70 dark:border-amber-900/40">
            <FileText size={15} className="text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs leading-relaxed">
              <strong>Notes:</strong> {request.instructions}
            </p>
          </div>
        )}

        {/* Estimated Pricing */}
        {request.estimatedPrice && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400">Estimated Job Value:</span>
            <span className="font-display font-extrabold text-base text-slate-900 dark:text-white font-mono">
              ₹{request.estimatedPrice}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <Link to={`/provider/requests/${request.id}`}>
          <Button variant="ghost" size="sm" leftIcon={<Eye size={14} />} className="text-xs">
            View Details
          </Button>
        </Link>

        {isPending && (
          <div className="flex items-center gap-3">
            {onDecline && (
              <Button
                variant="outline"
                size="md"
                leftIcon={<X size={15} />}
                onClick={() => onDecline(request.id)}
                className="h-12 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900/60"
              >
                Decline
              </Button>
            )}

            {onAccept && (
              <Button
                variant="primary"
                size="md"
                leftIcon={<Check size={16} strokeWidth={2.5} />}
                onClick={() => onAccept(request.id)}
                className="min-h-[48px] px-6 text-sm font-semibold shadow-md shadow-primary-950/20"
              >
                Accept Task
              </Button>
            )}
          </div>
        )}

        {!isPending && (
          <span className="text-xs text-slate-400 italic flex items-center gap-1.5">
            <AlertCircle size={14} />
            <span>Action completed for this dispatch request</span>
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProviderRequestCard;
