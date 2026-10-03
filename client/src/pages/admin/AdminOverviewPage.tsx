import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ShieldCheck,
  Users,
  Briefcase,
  CalendarClock,
  CheckCircle,
  AlertTriangle,
  LifeBuoy,
  Database,
  ArrowRight,
  Clock,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { PageHeader } from '../../layouts/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Alert } from '../../components/ui/Alert';
import { getBackendHealth } from '../../services/health.service';
import { AdminService } from '../../services/admin.service';
import { usePrefersReducedMotion } from '../../components/three';
import type { HealthStatus, AdminDashboardMetrics } from '@sevasetu/shared';

const AdminOperationsScene = React.lazy(() =>
  import('../../components/three').then((m) => ({ default: m.AdminOperationsScene }))
);

export const AdminOverviewPage: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);
  const [healthError, setHealthError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(true);

  const fetchHealthAndMetrics = async () => {
    setHealthLoading(true);
    setMetricsLoading(true);
    setHealthError(null);
    try {
      const [healthRes, metricsData] = await Promise.all([
        getBackendHealth().catch(() => null),
        AdminService.getDashboardMetrics().catch(() => null),
      ]);
      if (healthRes && healthRes.data) {
        setHealth(healthRes.data);
      }
      if (metricsData) {
        setMetrics(metricsData);
      }
    } catch (err: unknown) {
      setHealthError(err instanceof Error ? err.message : 'Unable to connect to platform API gateway');
    } finally {
      setHealthLoading(false);
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthAndMetrics();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <PageHeader
        title="Operations & Governance Overview"
        description="Unified platform operations dashboard for user management, verification pipelines, dispute handling, and system telemetry."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Overview' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw size={14} className={healthLoading || metricsLoading ? 'animate-spin' : ''} />}
              onClick={fetchHealthAndMetrics}
              disabled={healthLoading || metricsLoading}
            >
              Refresh Telemetry
            </Button>
            <Link to="/admin/trust-safety">
              <Button variant="primary" size="sm" leftIcon={<ShieldCheck size={14} />}>
                Trust & Safety Hub
              </Button>
            </Link>
          </div>
        }
      />

      {/* Telemetry Visualizer: 3D Scene or 2x2 Static Fallback when Reduced Motion is preferred */}
      {prefersReducedMotion ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Zap size={14} className="text-emerald-500" />
              <span>Real-Time Platform Operations (Accessible Mode)</span>
            </div>
            <span className="text-[11px] text-slate-400">Reduced Motion Active</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Bookings</span>
                <CalendarClock size={16} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-2">
                {metrics?.activeBookings ?? '—'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {metrics?.totalBookings ?? 0} total bookings dispatched
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Online Providers</span>
                <Briefcase size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-2">
                {metrics?.activeProviders ?? metrics?.totalProviders ?? '—'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {metrics?.pendingVerifications ?? 0} pending KYC verifications
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Dispute Rate</span>
                <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-2">
                {metrics && metrics.totalBookings > 0
                  ? `${((metrics.openDisputes / metrics.totalBookings) * 100).toFixed(1)}%`
                  : '0.0%'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {metrics?.openDisputes ?? 0} open case investigations
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">System Gateway</span>
                <Activity size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-2 capitalize">
                {health?.status || 'Online'}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PostgreSQL & API live
              </div>
            </div>
          </div>
        </div>
      ) : (
        <React.Suspense fallback={<div className="h-72 w-full rounded-2xl bg-slate-100/60 dark:bg-slate-800/60 animate-pulse border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-xs text-slate-400">Initializing 3D Telemetry Hub...</div>}>
          <AdminOperationsScene
            metrics={metrics}
            isHealthy={health?.status === 'healthy'}
          />
        </React.Suspense>
      )}

      {/* Platform Real-Time Health Card */}
      <Card variant="default" padding="md" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
              <Activity size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-slate-900 dark:text-slate-100">Platform Core Telemetry</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live backend service and database health validation</p>
            </div>
          </div>
          <div>
            {healthLoading ? (
              <Badge variant="neutral" size="sm">
                <Spinner size="sm" className="mr-1.5" /> Checking Gateway...
              </Badge>
            ) : healthError ? (
              <Badge variant="error" size="sm">Gateway Offline</Badge>
            ) : health?.status === 'healthy' ? (
              <Badge variant="success" size="sm">All Systems Operational</Badge>
            ) : (
              <Badge variant="warning" size="sm">Degraded Service</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Platform Status</span>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 capitalize">
              {health?.status || 'Unknown'}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/70 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Database Layer</span>
              <Database size={14} className="text-slate-400" />
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  health?.database?.status === 'connected' ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
              <span className="capitalize">{health?.database?.status || 'Unavailable'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/70 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Service Uptime</span>
              <Clock size={14} className="text-slate-400" />
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">
              {health?.uptimeSeconds ? `${Math.floor(health.uptimeSeconds)} seconds` : 'Unavailable'}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Environment Mode</span>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 uppercase text-xs font-mono">
              {health?.environment || 'Development'}
            </div>
          </div>
        </div>

        {healthError && (
          <div className="mt-4">
            <Alert variant="error" title="Backend Health Check Failed">
              {healthError}. Ensure the Express API daemon is running at http://localhost:5000.
            </Alert>
          </div>
        )}
      </Card>

      {/* Operational Queues & Review Pipeline Cards */}
      <div>
        <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
          Governance & Review Queues
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Verification Queue */}
          <Card variant="default" padding="md" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors lift">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400">
                <CheckCircle size={20} />
              </div>
              <Badge variant={metrics && metrics.pendingVerifications > 0 ? 'warning' : 'neutral'} size="sm">
                {metrics ? `${metrics.pendingVerifications} in queue` : '0 in queue'}
              </Badge>
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">Provider Verification</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Identity documents, trade certifications, and police clearances awaiting review.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {metrics && metrics.pendingVerifications > 0 ? `${metrics.pendingVerifications} awaiting action` : 'Queue clean'}
              </span>
              <Link
                to="/admin/verification"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center gap-1 min-h-[44px] sm:min-h-0 py-2 sm:py-0"
              >
                <span>Open Queue</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </Card>

          {/* Dispute & Reports Queue */}
          <Card variant="default" padding="md" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors lift">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400">
                <AlertTriangle size={20} />
              </div>
              <Badge variant={metrics && (metrics.openDisputes + metrics.openReports) > 0 ? 'error' : 'neutral'} size="sm">
                {metrics ? `${metrics.openDisputes + metrics.openReports} open cases` : '0 open cases'}
              </Badge>
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">Disputes & Reports</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Booking discrepancies, payment disputes, property claims, and safety incident flags.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {metrics && (metrics.openDisputes + metrics.openReports) > 0 ? `${metrics.openDisputes} disputes, ${metrics.openReports} reports` : 'No active escalations'}
              </span>
              <Link
                to="/admin/reports"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center gap-1 min-h-[44px] sm:min-h-0 py-2 sm:py-0"
              >
                <span>View Cases</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </Card>

          {/* Support Desk Queue */}
          <Card variant="default" padding="md" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors lift">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400">
                <LifeBuoy size={20} />
              </div>
              <Badge variant={metrics && metrics.openSupportTickets > 0 ? 'info' : 'neutral'} size="sm">
                {metrics ? `${metrics.openSupportTickets} pending` : '0 pending'}
              </Badge>
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">Support Operations</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Inquiries, platform feedback, and service assistance tickets from users and providers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {metrics && metrics.openSupportTickets > 0 ? `${metrics.openSupportTickets} tickets in queue` : 'All tickets cleared'}
              </span>
              <Link
                to="/admin/support"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center gap-1 min-h-[44px] sm:min-h-0 py-2 sm:py-0"
              >
                <span>Support Center</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Domain Operations Grid */}
      <div>
        <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
          Platform Directory & Dispatch
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/admin/users" className="block group">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-all shadow-xs lift">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <Users size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">User Management</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Customer and operator directory</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>

          <Link to="/admin/providers" className="block group">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-all shadow-xs lift">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">Provider Network</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Service partners & compliance</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>

          <Link to="/admin/bookings" className="block group">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-all shadow-xs lift">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <CalendarClock size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">Booking Dispatch</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Requests, appointments & state</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Honest Empty State for Recent Operational Activity */}
      <Card variant="default" padding="md" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">Recent Operational Activity</CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">Chronological activity events across verification, safety, and dispatch</p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="py-8 text-center">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              No recent administrative actions or system events recorded yet.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Events will automatically populate here as operations are performed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
