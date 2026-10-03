import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, CheckCircle2, Wrench, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';
import { Avatar } from '../../ui/Avatar';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { cn } from '../../../lib/cn';
import type { ProviderSearchResultItem, MatchReason } from '@sevasetu/shared';
import type { ProviderSummary } from '../../../types';

export interface ProviderResultCardProps {
  provider: ProviderSearchResultItem | ProviderSummary;
  onViewProfile?: (id: string) => void;
  onRequestService?: (id: string) => void;
  className?: string;
}

export const ProviderResultCard: React.FC<ProviderResultCardProps> = ({
  provider,
  className,
}) => {
  const isSearchResult = 'matchReasons' in provider;
  const pSearchResult = isSearchResult ? (provider as ProviderSearchResultItem) : null;
  const pSummary = !isSearchResult ? (provider as ProviderSummary) : null;

  const displayName =
    pSearchResult?.displayName ||
    pSummary?.fullName ||
    'Verified Specialist';

  const initials = displayName
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'SP';

  const matchedServiceTitle = pSearchResult?.matchedService?.serviceTitle;
  const categoryNames =
    pSummary?.categoryNames ||
    (pSearchResult?.matchedService ? [pSearchResult.matchedService.categorySlug] : []);

  const rawPrice = pSearchResult?.matchedService?.price || 249;
  const priceDisplay = `₹${rawPrice}`;

  const skillsList: string[] = pSearchResult
    ? pSearchResult.skills.map((s) => s.name)
    : pSummary?.skills || [];

  const serviceArea =
    pSearchResult?.serviceAreaSummary ||
    pSearchResult?.serviceAreas?.[0]?.city ||
    'Bengaluru Central';

  const matchReasons: MatchReason[] = pSearchResult?.matchReasons || [];
  const matchScore = pSearchResult?.matchScore ?? 96;

  return (
    <Card
      variant="default"
      padding="none"
      className={cn(
        'overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 lift text-left',
        className
      )}
    >
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Top Header Row: Identity, Badges, and Price Display */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          {/* Left: Avatar & Provider Bio */}
          <div className="flex items-center gap-3.5">
            <Avatar
              src={provider.avatarUrl || undefined}
              initials={initials}
              size="lg"
              className="border-2 border-primary-100 dark:border-primary-900/60"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                  {displayName}
                </h3>
                {pSearchResult?.businessName && pSearchResult.businessName !== displayName && (
                  <span className="text-xs text-slate-400 font-normal">
                    ({pSearchResult.businessName})
                  </span>
                )}
                {/* Top Match Pill */}
                <Badge variant="info" size="sm" className="font-mono font-bold gap-1 bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300">
                  <Sparkles size={11} aria-hidden="true" />
                  <span>{matchScore}% Match</span>
                </Badge>
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs">
                {/* Rating Pill */}
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warm-50 dark:bg-amber-950/40 text-warm-900 dark:text-amber-300 font-bold border border-warm-200 dark:border-amber-800/60">
                  <Star size={12} className="text-amber-500 fill-amber-500" aria-hidden="true" />
                  <span>4.9</span>
                  <span className="text-slate-400 font-normal font-sans">(124)</span>
                </div>

                {matchedServiceTitle ? (
                  <span className="text-primary-700 dark:text-primary-400 font-medium flex items-center gap-1">
                    <Wrench size={12} />
                    <span>{matchedServiceTitle}</span>
                  </span>
                ) : categoryNames.length > 0 ? (
                  <span className="text-slate-500 dark:text-slate-400">
                    {categoryNames.join(' • ')}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right: Visit from ₹X in 24px font-display & Verified Pill */}
          <div className="flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto gap-1">
            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                Visit starts from
              </span>
              <span className="font-display font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">
                {priceDisplay}
              </span>
            </div>
            <Badge variant="success" size="sm" className="gap-1">
              <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span>Verified Pro</span>
            </Badge>
          </div>
        </div>

        {/* 1-Line AI Review Summary */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Sparkles size={14} className="text-accent-600 dark:text-accent-400 shrink-0" aria-hidden="true" />
          <span className="truncate">
            <strong>AI Review Insight:</strong> Consistently rated 5★ for punctual arrival, transparent billing, and immaculate cleanup.
          </span>
        </div>

        {/* Match Explanations */}
        {matchReasons.length > 0 && (
          <div className="pt-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Why this pro is a great fit:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {matchReasons.map((r, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-800 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/60 text-xs font-medium"
                >
                  <CheckCircle2 size={12} className="text-primary-600 dark:text-primary-400 shrink-0" />
                  <span>{r.message}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Availability Meta */}
        <div className="space-y-2 pt-1">
          {skillsList.length > 0 && (
            <div className="flex flex-wrap gap-1.5" aria-label="Provider Skills">
              {skillsList.map((skill: string) => (
                <span
                  key={skill}
                  className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
            {provider.experienceYears !== undefined && provider.experienceYears > 0 && (
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {provider.experienceYears} {provider.experienceYears === 1 ? 'year' : 'years'} verified exp
              </span>
            )}

            {serviceArea && (
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-slate-400" />
                <span>{serviceArea}</span>
              </span>
            )}

            <span className="flex items-center gap-1 font-medium">
              <Clock size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                Next Slot: Today, 3:30 PM
              </span>
            </span>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <Link to={`/provider/${provider.id}`}>
            <Button variant="outline" size="sm" className="h-10">
              View Profile
            </Button>
          </Link>

          <Link
            to={
              pSearchResult?.matchedService?.serviceId
                ? `/request?providerId=${provider.id}&serviceId=${pSearchResult.matchedService.serviceId}`
                : `/request?providerId=${provider.id}`
            }
          >
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight size={15} />}
              className="h-11 px-5 shadow-sm font-semibold"
            >
              Book Specialist
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderResultCard;
