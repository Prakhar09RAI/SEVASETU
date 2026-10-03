import React, { useState } from 'react';
import { Link, Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Briefcase,
  Layers,
  CalendarClock,
  CheckCircle,
  AlertTriangle,
  LifeBuoy,
  FileText,
  Sliders,
  Menu,
  X,
  LayoutDashboard,
  ArrowLeftRight,
  ShieldCheck,
  PanelLeft,
  LogOut,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/cn';
import type { NavItem } from '../components/navigation/types';

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: <LayoutDashboard size={16} /> },
  { label: 'Users', href: '/admin/users', icon: <Users size={16} /> },
  { label: 'Providers', href: '/admin/providers', icon: <Briefcase size={16} /> },
  { label: 'Services', href: '/admin/services', icon: <Layers size={16} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <CalendarClock size={16} /> },
  { label: 'Verification', href: '/admin/verification', icon: <CheckCircle size={16} /> },
  { label: 'Disputes', href: '/admin/reports', icon: <AlertTriangle size={16} /> },
  { label: 'Support', href: '/admin/support', icon: <LifeBuoy size={16} /> },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: <FileText size={16} /> },
  { label: 'Trust & Safety', href: '/admin/trust-safety', icon: <ShieldAlert size={16} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Sliders size={16} /> },
];

export interface AdminShellProps {
  children?: React.ReactNode;
}

export const AdminShell: React.FC<AdminShellProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Simple breadcrumb derived from path
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-primary-900 selection:text-white">
      {/* Skip to Main Content Link for Accessibility */}
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-xl focus:shadow-xl focus-ring font-medium"
      >
        Skip to administrative content
      </a>

      {/* Admin Top Header - Dark First */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Admin Brand Treatment */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSidebar((prev) => !prev)}
              aria-label="Toggle navigation sidebar"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-ring hidden lg:inline-flex"
            >
              <PanelLeft size={18} />
            </button>

            <Link
              to="/admin"
              className="flex items-center gap-3 shrink-0 focus-ring rounded-xl p-1"
              aria-label="SevaSetu Admin Operations Console"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-display font-extrabold text-base shadow-sm select-none">
                <ShieldCheck size={22} className="text-white" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-base tracking-tight text-white leading-tight">
                    SevaSetu
                  </span>
                  <Badge variant="warning" size="sm" className="bg-amber-950/80 text-amber-300 border-amber-800/80 text-[10px] py-0 px-2 font-bold uppercase tracking-wider">
                    Ops Console
                  </Badge>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  Trust, Safety &amp; Governance
                </span>
              </div>
            </Link>
          </div>

          {/* Center: System Health Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-emerald-400">System Operational</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-mono text-[11px]">API 99.98%</span>
          </div>

          {/* Quick Cross-Portal Switcher & Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeftRight size={13} />}
                className="text-xs h-9 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hidden sm:inline-flex"
              >
                Customer App
              </Button>
            </Link>

            <Link to="/provider">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Briefcase size={13} />}
                className="text-xs h-9 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hidden md:inline-flex"
              >
                Provider Portal
              </Button>
            </Link>

            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                leftIcon={<LogOut size={13} />}
                className="text-xs h-9 text-slate-400 hover:text-red-400 hover:bg-slate-800"
              >
                Sign Out
              </Button>
            )}

            {/* Mobile Navigation Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close admin navigation' : 'Open admin navigation'}
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus-ring"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-5 space-y-1 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-1">
              Admin Navigation
            </div>
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/admin'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  )
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Main Admin View Container */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <aside
          aria-label="Admin Operations Sidebar"
          className={cn(
            'hidden lg:flex flex-col shrink-0 border-r border-slate-800/80 bg-slate-950 py-5 px-3 transition-all duration-200 select-none sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto justify-between',
            showSidebar ? 'w-64' : 'w-18 items-center px-2'
          )}
        >
          <div>
            {showSidebar && (
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-3">
                Governance &amp; Ops
              </div>
            )}

            <nav className="space-y-1 w-full" aria-label="Admin Navigation Links">
              {ADMIN_NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/admin'}
                  title={!showSidebar ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'relative flex items-center rounded-xl text-xs font-semibold transition-all focus-ring group',
                      showSidebar ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3',
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs border border-slate-800'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-amber-500 rounded-r-full"
                          aria-hidden="true"
                        />
                      )}
                      <span className="shrink-0 text-current">{item.icon}</span>
                      {showSidebar && <span>{item.label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {showSidebar && (
            <div className="pt-4 border-t border-slate-900 text-[11px] text-slate-500 px-3">
              <div className="flex items-center gap-1.5 font-medium text-slate-400">
                <Activity size={13} className="text-emerald-400" />
                <span>Ops Engine v2.0</span>
              </div>
              <div className="text-[10px] text-slate-600 mt-0.5">High-Availability Telemetry</div>
            </div>
          )}
        </aside>

        {/* Content View Area */}
        <main
          id="admin-main-content"
          tabIndex={-1}
          className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 outline-none"
        >
          {/* Breadcrumb Hierarchy */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs text-slate-400">
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Admin
                </Link>
              </li>
              {pathSegments.slice(1).map((seg, idx) => {
                const url = `/${pathSegments.slice(0, idx + 2).join('/')}`;
                const isLast = idx === pathSegments.length - 2;
                return (
                  <React.Fragment key={url}>
                    <ChevronRight size={12} className="text-slate-600 shrink-0 select-none" aria-hidden="true" />
                    <li className={cn(isLast ? 'font-semibold text-white capitalize' : 'capitalize hover:text-white')}>
                      {isLast ? seg.replace('-', ' ') : <Link to={url}>{seg.replace('-', ' ')}</Link>}
                    </li>
                  </React.Fragment>
                );
              })}
            </ol>
          </nav>

          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
