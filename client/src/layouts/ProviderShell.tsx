import React, { useState } from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  CalendarClock,
  Wrench,
  User,
  Wallet,
  Star,
  Menu,
  X,
  ArrowLeftRight,
  Shield,
  PanelLeft,
  Bell,
  LogOut,
  MessageSquare,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { NotificationBadge } from '../components/notifications';
import { cn } from '../lib/cn';
import { useTheme } from '../lib/useTheme';
import type { NavItem } from '../components/navigation/types';

export const PROVIDER_NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/provider', icon: <LayoutDashboard size={16} /> },
  { label: 'Requests', href: '/provider/requests', icon: <Inbox size={16} /> },
  { label: 'Jobs', href: '/provider/jobs', icon: <Briefcase size={16} /> },
  { label: 'Messages', href: '/provider/messages', icon: <MessageSquare size={16} /> },
  { label: 'Availability', href: '/provider/availability', icon: <CalendarClock size={16} /> },
  { label: 'Services', href: '/provider/services', icon: <Wrench size={16} /> },
  { label: 'Profile', href: '/provider/profile', icon: <User size={16} /> },
  { label: 'Earnings', href: '/provider/earnings', icon: <Wallet size={16} /> },
  { label: 'Reviews', href: '/provider/reviews', icon: <Star size={16} /> },
  { label: 'Alerts', href: '/provider/notifications', icon: <Bell size={16} /> },
];

export interface ProviderShellProps {
  children?: React.ReactNode;
}

export const ProviderShell: React.FC<ProviderShellProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col antialiased selection:bg-primary-100 selection:text-primary-900">
      {/* Skip to Main Content Link for Accessibility */}
      <a
        href="#provider-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-700 focus:text-white focus:rounded-xl focus:shadow-xl focus-ring font-medium"
      >
        Skip to provider content
      </a>

      {/* Provider Header */}
      <header className="sticky top-0 z-40 w-full glass border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Provider Brand Treatment */}
          <div className="flex items-center gap-3">
            <Link
              to="/provider"
              className="flex items-center gap-3 shrink-0 focus-ring rounded-xl p-1"
              aria-label="SevaSetu Provider Portal Home"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-700 to-slate-900 text-white font-display font-extrabold text-base shadow-sm select-none">
                S
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                    SevaSetu
                  </span>
                  <Badge variant="success" size="sm" className="text-[10px] py-0 px-2 font-bold uppercase tracking-wider">
                    Partner
                  </Badge>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
                  Service Provider Console
                </span>
              </div>
            </Link>
          </div>

          {/* Provider Desktop Navigation Links */}
          <nav
            aria-label="Provider Portal Navigation"
            className="hidden xl:flex items-center gap-1"
          >
            {PROVIDER_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/provider'}
                className={({ isActive }) =>
                  cn(
                    'relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all select-none focus-ring',
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  )
                }
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Action Area & Mode Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 inline-flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors cursor-pointer"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {/* Quick Messages Link */}
            <Link
              to="/provider/messages"
              title="Provider Messages"
              aria-label="Provider Messages"
              className="w-10 h-10 inline-flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors"
            >
              <MessageSquare size={18} />
            </Link>

            {/* Quick Notifications Link */}
            <Link
              to="/provider/notifications"
              title="Notifications & Alerts"
              aria-label="Provider Notifications"
              className="w-10 h-10 inline-flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors"
            >
              <NotificationBadge size={18} />
            </Link>

            {/* Switch to Customer Portal Mode */}
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeftRight size={13} />}
                className="text-xs h-9"
              >
                <span className="hidden sm:inline">Customer</span> App
              </Button>
            </Link>

            {/* Switch to Operations Console */}
            <Link to="/admin">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Shield size={13} />}
                className="text-xs h-9 hidden md:inline-flex"
              >
                Admin
              </Button>
            </Link>

            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                leftIcon={<LogOut size={13} />}
                className="text-xs h-9 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
              >
                Sign Out
              </Button>
            )}

            {/* Desktop Sidebar Toggle */}
            <Button
              variant={showSidebar ? 'secondary' : 'ghost'}
              size="sm"
              leftIcon={<PanelLeft size={14} />}
              onClick={() => setShowSidebar((prev) => !prev)}
              aria-label="Toggle provider sidebar"
              className="hidden lg:inline-flex xl:hidden"
            >
              Menu
            </Button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close provider menu' : 'Open provider menu'}
              aria-expanded={isMobileMenuOpen}
              className="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
            <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Partner Menu</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <Shield size={12} />
                Verified Partner
              </span>
            </div>
            {PROVIDER_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/provider'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
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

      {/* Main Content Area */}
      <div className="flex-1 flex w-full">
        {/* Provider Sidebar on medium screens / or expandable */}
        <aside
          className={cn(
            'border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-col justify-between shrink-0 transition-all',
            showSidebar ? 'flex w-64' : 'hidden xl:flex xl:w-64'
          )}
        >
          <div className="p-4 space-y-1">
            <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Partner Workspace
            </div>
            {PROVIDER_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/provider'}
                className={({ isActive }) =>
                  cn(
                    'relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group focus-ring',
                    isActive
                      ? 'bg-primary-50 text-primary-800 font-semibold dark:bg-primary-950/70 dark:text-primary-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary-600 dark:bg-primary-400 rounded-r-full"
                        aria-hidden="true"
                      />
                    )}
                    <span className="shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Profile-Readiness Widget at bottom of Sidebar */}
          <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-warm-50 to-warm-100 dark:from-warm-950/40 dark:to-warm-900/40 border border-warm-200 dark:border-warm-800/60 text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={14} className="text-warm-600 dark:text-warm-400 shrink-0" aria-hidden="true" />
              <span className="text-xs font-bold text-warm-900 dark:text-warm-100">Profile Readiness</span>
            </div>
            <p className="text-[11px] text-warm-800 dark:text-warm-300 mb-2 leading-relaxed">
              Profile 85% complete — add bank details to enable automatic payouts.
            </p>
            {/* 6px Progress Bar */}
            <div
              role="progressbar"
              aria-label="Profile readiness progress"
              aria-valuenow={85}
              aria-valuemin={0}
              aria-valuemax={100}
              className="w-full h-1.5 bg-warm-200/80 dark:bg-warm-950 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: '85%' }}
              />
            </div>
            <div className="mt-2 text-right">
              <Link
                to="/provider/profile"
                className="text-[11px] font-semibold text-primary-700 dark:text-primary-400 hover:underline"
              >
                Complete Now →
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main
          id="provider-main-content"
          tabIndex={-1}
          className="flex-1 flex flex-col min-w-0 outline-none"
        >
          {children || <Outlet />}
        </main>
      </div>

      {/* Provider Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">SevaSetu Partner Portal</span>
            <span>•</span>
            <span>Local Services Marketplace</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/provider/profile" className="hover:text-slate-800 dark:hover:text-white transition-colors">
              Profile
            </Link>
            <Link to="/provider/availability" className="hover:text-slate-800 dark:hover:text-white transition-colors">
              Operating Hours
            </Link>
            <Link to="/" className="hover:text-slate-800 dark:hover:text-white transition-colors">
              Customer Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProviderShell;
