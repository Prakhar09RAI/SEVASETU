import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Briefcase,
  Wallet,
  Star,
  Clock,
} from 'lucide-react';
import { PageContainer } from '../../layouts/PageContainer';
import { PageHeader } from '../../layouts/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProviderProfileCompletion } from '../../components/provider/ProviderProfileCompletion';
import { providerService } from '../../services/provider.service';
import { cn } from '../../lib/cn';
import type { ProviderProfileData as UIProviderProfileData } from '../../types';
import type { ProviderOnboardingState } from '@sevasetu/shared';

const ProviderActivityScene = React.lazy(() =>
  import('../../components/three').then((m) => ({ default: m.ProviderActivityScene }))
);

export const ProviderOverviewPage: React.FC = () => {
  const [profile, setProfile] = useState<UIProviderProfileData | null>(null);
  const [hasSkills, setHasSkills] = useState(false);
  const [hasServices, setHasServices] = useState(false);
  const [skillsCount, setSkillsCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [onboarding, setOnboarding] = useState<ProviderOnboardingState | null>(null);
  const [isAcceptingJobs, setIsAcceptingJobs] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [profData, skillsData, servicesData, onboardingData] = await Promise.all([
          providerService.getProfile(),
          providerService.getSkills(),
          providerService.getServices(),
          providerService.getOnboardingState(),
        ]);
        if (isMounted) {
          const name = profData.displayName || profData.businessName || 'Service Provider';
          setProfile({
            fullName: name,
            bio: profData.bio || '',
            experienceYears: profData.experienceYears || 1,
            serviceArea: profData.serviceAreaSummary || '',
            languages: profData.languages,
            profileStatus: profData.onboardingStatus === 'COMPLETED' ? 'active' : 'incomplete',
            visibility: profData.isPubliclyListed ? 'public' : 'unlisted',
            verificationStatus: 'unverified',
          });
          setHasSkills(skillsData.length > 0);
          setHasServices(servicesData.length > 0);
          setSkillsCount(skillsData.length);
          setServicesCount(servicesData.length);
          setOnboarding(onboardingData);
        }
      } catch (_err) {
        // Handled silently for dashboard
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const isOnboardingComplete =
    onboarding?.status === 'COMPLETED' || onboarding?.onboardingStatus === 'COMPLETED';
  const currentStatus =
    onboarding?.status || onboarding?.onboardingStatus || 'IN_PROGRESS';

  return (
    <PageContainer maxWidth="xl" className="space-y-8 pb-16 text-left">
      {/* Provider Page Header */}
      <PageHeader
        title="Partner Console Overview"
        description="Monitor incoming client dispatch requests, job schedules, operational availability, and account earnings."
        breadcrumbs={[{ label: 'Provider Console' }]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {/* "Accepting Jobs" Toggle Control */}
            <button
              type="button"
              role="switch"
              aria-checked={isAcceptingJobs}
              aria-pressed={isAcceptingJobs}
              onClick={() => setIsAcceptingJobs((prev) => !prev)}
              className={cn(
                'inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all focus-ring cursor-pointer border select-none',
                isAcceptingJobs
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              )}
            >
              <span className="relative flex h-2.5 w-2.5">
                {isAcceptingJobs && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={cn(
                    'relative inline-flex rounded-full h-2.5 w-2.5',
                    isAcceptingJobs ? 'bg-emerald-500' : 'bg-slate-400'
                  )}
                />
              </span>
              <span>{isAcceptingJobs ? 'Accepting Jobs (Online)' : 'Paused (Offline)'}</span>
            </button>

            <Link to="/provider/availability">
              <Button variant="outline" size="sm" leftIcon={<Clock size={14} />}>
                Operating Hours
              </Button>
            </Link>
            <Link to="/provider/requests">
              <Button variant="primary" size="sm" leftIcon={<Inbox size={14} />}>
                View Requests
              </Button>
            </Link>
          </div>
        }
      />

      {/* 4 KPI Cards with font-display Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Active Requests */}
        <Card variant="default" className="p-5 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">New Requests</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              <Inbox size={18} aria-hidden="true" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              4
            </span>
            <Badge variant="warning" size="sm" className="font-mono text-[10px]">
              2 urgent (&lt; 5m)
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            Average response time: <strong>3.2 mins</strong>
          </p>
        </Card>

        {/* KPI 2: Confirmed Jobs */}
        <Card variant="default" className="p-5 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Jobs Today</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              <Briefcase size={18} aria-hidden="true" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              3
            </span>
            <span className="text-xs text-slate-400 font-medium">scheduled</span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1 flex items-center gap-1">
            <Clock size={12} />
            <span>Next arrival at 2:30 PM (Koramangala)</span>
          </p>
        </Card>

        {/* KPI 3: Weekly Earnings */}
        <Card variant="default" className="p-5 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">This Week</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <Wallet size={18} aria-hidden="true" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              ₹18,450
            </span>
            <Badge variant="success" size="sm" className="font-mono text-[10px]">
              +14%
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            Next direct payout on <strong>Friday</strong>
          </p>
        </Card>

        {/* KPI 4: Partner Rating */}
        <Card variant="default" className="p-5 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Service Rating</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <Star size={18} className="fill-amber-500" aria-hidden="true" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              4.92
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            Based on <strong>128 verified reviews</strong>
          </p>
        </Card>
      </div>

      {/* 3D Partner Operational Readiness Hub Visualizer */}
      <React.Suspense
        fallback={
          <div className="h-64 w-full rounded-3xl bg-slate-100/70 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs text-slate-400">
            Loading Partner Hub...
          </div>
        }
      >
        <div className="rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <ProviderActivityScene
            isVerified={profile?.verificationStatus === 'verified'}
            onboardingStatus={currentStatus}
            skillsCount={skillsCount}
            servicesCount={servicesCount}
            hasAvailability={hasSkills && hasServices}
          />
        </div>
      </React.Suspense>

      {/* Profile Readiness & Recent Action Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Onboarding &amp; Compliance Status
            </h2>
            <Badge variant={isOnboardingComplete ? 'success' : 'warning'} size="sm">
              {isOnboardingComplete ? 'Fully Verified' : 'In Progress'}
            </Badge>
          </div>
          <ProviderProfileCompletion
            profile={profile}
            hasSkills={hasSkills}
            hasServices={hasServices}
            hasAvailability={hasSkills && hasServices}
          />
        </div>

        <div className="lg:col-span-6 space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Quick Actions
          </h2>
          <Card variant="default" className="p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="font-display font-bold text-sm text-slate-900 dark:text-white block">
                  Weekly Operating Hours
                </span>
                <p className="text-xs text-slate-500">
                  Update your daily roving time slots, lunch breaks, and emergency leaves.
                </p>
              </div>
              <Link to="/provider/availability">
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </Link>
            </div>

            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="font-display font-bold text-sm text-slate-900 dark:text-white block">
                  Service Catalog &amp; Pricing
                </span>
                <p className="text-xs text-slate-500">
                  Manage fixed vs hourly rates, emergency surcharge, and add-on charges.
                </p>
              </div>
              <Link to="/provider/services">
                <Button variant="outline" size="sm">
                  Manage Services
                </Button>
              </Link>
            </div>

            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="font-display font-bold text-sm text-slate-900 dark:text-white block">
                  Customer Reviews &amp; Testimonials
                </span>
                <p className="text-xs text-slate-500">
                  Respond to customer ratings and improve your automated AI matching rank.
                </p>
              </div>
              <Link to="/provider/reviews">
                <Button variant="outline" size="sm">
                  View Feedback
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProviderOverviewPage;
