import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ShieldCheck,
  BadgePercent,
  Lock,
  MapPin,
  ArrowRight,
  Calendar,
  RotateCcw,
  Zap,
  Wrench,
  Sparkle,
  Fan,
} from 'lucide-react';
import { PageContainer } from '../../layouts/PageContainer';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ServiceCategoryGrid } from '../../components/customer/category/ServiceCategoryGrid';
import { CORE_SERVICE_CATEGORIES } from '../../constants/categories';
import { AiClientService } from '../../services/ai.service';
import { usePrefersReducedMotion } from '../../components/three';
import type { AiRepeatServiceRecommendation, AiPredictiveReminder } from '@sevasetu/shared';

const HeroServiceEcosystemScene = React.lazy(() =>
  import('../../components/three').then((m) => ({ default: m.HeroServiceEcosystemScene }))
);

export const CustomerHomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pincode, setPincode] = useState('');
  const [repeatRecommendations, setRepeatRecommendations] = useState<AiRepeatServiceRecommendation[]>([]);
  const [predictiveReminders, setPredictiveReminders] = useState<AiPredictiveReminder[]>([]);
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let isMounted = true;
    async function loadAiInsights() {
      try {
        const [recs, rems] = await Promise.all([
          AiClientService.getRepeatServices().catch(() => []),
          AiClientService.getPredictiveReminders().catch(() => []),
        ]);
        if (isMounted) {
          setRepeatRecommendations(recs);
          setPredictiveReminders(rems);
        }
      } catch {
        // AI insights optional; graceful silent fallback
      }
    }
    loadAiInsights();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (pincode.trim()) params.set('location', pincode.trim());
    navigate(`/services${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="space-y-16 pb-20 text-left">
      {/* 1. Hero & Service Discovery Section: Two-Column Layout (min-h-[560px]) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/70 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800 pt-10 sm:pt-14 pb-16 sm:pb-20">
        <PageContainer maxWidth="xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center min-h-[520px]">
            {/* Left Column: Trust Pill, 60px Headline, Glass Search, Trust Bullets */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
              {/* Trust Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-primary-200 dark:border-primary-800/60 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  ⚡ 10,000+ verified professionals across 28 cities
                </span>
              </div>

              {/* Display Headline */}
              <div className="space-y-3">
                <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.08] tracking-tight">
                  Home services, delivered with{' '}
                  <span className="bg-gradient-to-r from-primary-700 via-primary-600 to-accent-600 bg-clip-text text-transparent">
                    pride &amp; precision.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Connect directly with background-checked electricians, plumbers, cleaners, and carpenters in your local neighborhood.
                </p>
              </div>

              {/* Glass Search Bar Form */}
              <div className="max-w-2xl">
                <form
                  role="search"
                  onSubmit={handleSearchSubmit}
                  className="p-2 sm:p-2.5 glass rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xl shadow-slate-900/5 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2"
                >
                  {/* Primary Service Query */}
                  <div className="relative flex-1 flex items-center min-w-0">
                    <Search
                      size={20}
                      className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What needs fixing today? (e.g. AC servicing, leaking tap)..."
                      className="w-full h-12 pl-11 pr-3 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                      aria-label="Service keyword or natural language query"
                    />
                  </div>

                  {/* Locality / Pincode */}
                  <div className="relative w-full sm:w-36 flex items-center shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pl-0 sm:pl-2">
                    <MapPin
                      size={18}
                      className="absolute left-3.5 sm:left-4 text-slate-400 dark:text-slate-500 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="PIN: 560001"
                      className="w-full h-12 pl-10 sm:pl-10 pr-2 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                      aria-label="Postal code or locality"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto min-h-[48px] px-6 text-base font-semibold shadow-md shadow-primary-950/20 shrink-0"
                  >
                    Find Pros
                  </Button>
                </form>

                {/* Sub-bar tags & AI search hint */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-3 pt-3 gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Popular:</span>
                    <button
                      type="button"
                      onClick={() => navigate('/services?q=Deep+Cleaning')}
                      className="hover:text-primary-700 dark:hover:text-primary-400 underline-offset-2 hover:underline"
                    >
                      Deep Clean
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => navigate('/services?q=AC+Repair')}
                      className="hover:text-primary-700 dark:hover:text-primary-400 underline-offset-2 hover:underline"
                    >
                      AC Service
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => navigate('/services?q=Plumber')}
                      className="hover:text-primary-700 dark:hover:text-primary-400 underline-offset-2 hover:underline"
                    >
                      Plumber
                    </button>
                  </div>

                  <Badge variant="info" size="sm" className="font-semibold gap-1">
                    <Sparkles size={11} aria-hidden="true" />
                    <span>AI Natural Language Search</span>
                  </Badge>
                </div>
              </div>

              {/* 3 Trust Bullets */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200/80 dark:border-slate-800/80 max-w-2xl">
                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                  <span className="font-medium">Background-checked pros</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <BadgePercent size={18} className="text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
                  <span className="font-medium">Upfront fixed pricing</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <Lock size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
                  <span className="font-medium">Escrow payment safety</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Ecosystem Scene or Static Graceful Fallback */}
            <div className="lg:col-span-5 relative">
              {prefersReducedMotion ? (
                /* Static High-Impact Fallback Card Grid */
                <div className="grid grid-cols-2 gap-3.5 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5">
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                      <Zap size={20} />
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">Electrician</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Short-circuits, fans, meters</p>
                    <div className="flex items-center justify-between text-[11px] pt-1 font-semibold text-amber-700 dark:text-amber-400">
                      <span>4.9 ★ (3.2k)</span>
                      <span>25 min</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/40 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                      <Wrench size={20} />
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">Plumbing</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Pipe leaks, taps, geysers</p>
                    <div className="flex items-center justify-between text-[11px] pt-1 font-semibold text-indigo-700 dark:text-indigo-400">
                      <span>4.8 ★ (2.8k)</span>
                      <span>30 min</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <Sparkle size={20} />
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">Deep Cleaning</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Kitchen, bathrooms, sofa</p>
                    <div className="flex items-center justify-between text-[11px] pt-1 font-semibold text-emerald-700 dark:text-emerald-400">
                      <span>4.9 ★ (5.1k)</span>
                      <span>Scheduled</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/40 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                      <Fan size={20} />
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">AC &amp; Appliances</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Gas refill, motor repair</p>
                    <div className="flex items-center justify-between text-[11px] pt-1 font-semibold text-sky-700 dark:text-sky-400">
                      <span>4.8 ★ (4.4k)</span>
                      <span>Same Day</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Interactive 3D Canvas Container */
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-900/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs">
                  <React.Suspense
                    fallback={
                      <div className="h-[460px] w-full rounded-3xl bg-slate-100/70 dark:bg-slate-900 animate-pulse flex flex-col items-center justify-center gap-3 text-xs text-slate-400">
                        <Sparkles size={24} className="text-primary-600 animate-spin" />
                        <span>Rendering 3D Service City...</span>
                      </div>
                    }
                  >
                    <div className="h-[480px] w-full">
                      <HeroServiceEcosystemScene />
                    </div>
                  </React.Suspense>
                  <div className="absolute bottom-3 right-3 text-[11px] px-2.5 py-1 rounded-full bg-slate-900/70 text-slate-300 backdrop-blur-md border border-white/10 select-none">
                    Interactive 3D Ecosystem • Drag to rotate
                  </div>
                </div>
              )}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* AI Personalized Recommendations & Reminders */}
      {(repeatRecommendations.length > 0 || predictiveReminders.length > 0) && (
        <section>
          <PageContainer maxWidth="xl" className="space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent-600" />
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-slate-100 tracking-tight">
                Recommended For You
              </h2>
              <Badge variant="info" size="sm">Smart Suggestions</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictiveReminders.map((rem, i) => (
                <Card key={i} variant="default" className="p-5 border-accent-200 dark:border-accent-900/60 bg-accent-50/40 dark:bg-accent-950/20 flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-accent-100 text-accent-700 dark:bg-accent-900/60 dark:text-accent-300 shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">{rem.serviceTitle}</span>
                      <Badge variant="info" size="sm">{rem.patternType}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rem.explanation}</p>
                    <div className="pt-1">
                      <Link to={`/services?q=${encodeURIComponent(rem.serviceTitle)}`}>
                        <Button variant="ghost" size="sm" className="text-xs h-8 text-accent-700 dark:text-accent-400 pl-0">
                          Book for {rem.suggestedDay} &rarr;
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}

              {repeatRecommendations.map((rec, i) => (
                <Card key={i} variant="default" className="p-5 flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                    <RotateCcw size={20} />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">{rec.serviceTitle}</span>
                      <span className="text-[11px] text-slate-400">Last: {rec.lastBookedDate}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{rec.rationale}</p>
                    <div className="pt-1">
                      <Link to={`/services?q=${encodeURIComponent(rec.serviceTitle)}`}>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          Rebook Professional
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </PageContainer>
        </section>
      )}

      {/* 2. Popular Near You - Core Service Categories Grid */}
      <section>
        <PageContainer maxWidth="xl" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-primary-700 dark:text-primary-400 font-semibold text-xs mb-1">
                <Sparkles size={14} />
                <span>Verified Service Catalog</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Popular Services Near You
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Browse certified professionals by specialized service domain with upfront pricing.
              </p>
            </div>

            <Link to="/services">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                View All Categories
              </Button>
            </Link>
          </div>

          <ServiceCategoryGrid categories={CORE_SERVICE_CATEGORIES} />
        </PageContainer>
      </section>

      {/* 3. How It Works Framework */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-16">
        <PageContainer maxWidth="xl" className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              How SevaSetu Connects You
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              A transparent, safe, and dependable framework for local service procurement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" className="p-6 space-y-3.5 text-left">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300 font-display font-extrabold flex items-center justify-center text-lg shadow-xs">
                1
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
                Specify Your Need
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Describe your service in plain English or Hindi, or choose from our curated categories with your preferred date and time.
              </p>
            </Card>

            <Card variant="default" className="p-6 space-y-3.5 text-left">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300 font-display font-extrabold flex items-center justify-center text-lg shadow-xs">
                2
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
                Match With Verified Pros
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Review verified professional profiles, skills, service areas, and transparent pricing before instant confirmation.
              </p>
            </Card>

            <Card variant="default" className="p-6 space-y-3.5 text-left">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300 font-display font-extrabold flex items-center justify-center text-lg shadow-xs">
                3
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
                Escrow &amp; Guaranteed Service
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Track pro arrival with OTP verification. Payment is held in secure escrow and released only upon your satisfaction.
              </p>
            </Card>
          </div>
        </PageContainer>
      </section>

      {/* 4. Trust & Security Banner */}
      <section>
        <PageContainer maxWidth="xl">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-primary-800 via-primary-900 to-slate-950 text-white relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl space-y-4 relative z-10">
              <Badge variant="success" size="sm" className="bg-emerald-400/20 text-emerald-300 border-emerald-400/30">
                Safety Guarantee
              </Badge>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Every service professional is thoroughly vetted.
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                Aadhaar identity checks, police background verification, and verified customer reviews keep your home safe and secure.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link to="/services">
                  <Button variant="secondary" size="md" className="font-semibold">
                    Explore Services Now
                  </Button>
                </Link>
                <Link to="/provider">
                  <Button variant="outline" size="md" className="border-white/30 text-white hover:bg-white/10">
                    Join as a Partner
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
};

export default CustomerHomePage;
