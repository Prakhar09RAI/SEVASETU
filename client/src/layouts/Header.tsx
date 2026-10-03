import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Search,
  LogOut,
  Shield,
  ChevronDown,
  Briefcase,
  Activity,
  Layers,
  CalendarClock,
  User,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/cn';
import { DesktopNav } from '../components/navigation/DesktopNav';
import type { NavItem } from '../components/navigation/types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../lib/useTheme';
import { NotificationBadge } from '../components/notifications';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  navItems: NavItem[];
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  actionArea?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  navItems,
  isMobileMenuOpen,
  onToggleMobileMenu,
  actionArea,
  className,
  ...props
}) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close user dropdown on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigate('/services');
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return (
    <>
      {/* Top-level Keyboard Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-700 focus:text-white focus:rounded-xl focus:shadow-xl focus-ring font-medium"
      >
        Skip to main content
      </a>

      {/* Sticky Glass Navigation Bar */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full glass border-b border-slate-200/60 dark:border-slate-800/60 transition-colors',
          className
        )}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* ======================================================== */}
          {/* ZONE 1 (LEFT): Brand Logo & Primary Desktop Navigation   */}
          {/* ======================================================== */}
          <div className="flex items-center gap-3 lg:gap-5 min-w-0 shrink">
            {/* Brand Logo & Wordmark */}
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 shrink-0 focus-ring rounded-xl p-1 transition-transform hover:scale-[1.02]"
              aria-label="SevaSetu Home"
            >
              <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white font-display font-extrabold text-base sm:text-lg shadow-md shadow-primary-950/20 select-none">
                S
              </div>
              <div className="flex flex-col text-left">
                <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white leading-tight">
                  Seva<span className="text-primary-700 dark:text-primary-400">Setu</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase truncate">
                  Bridge to Services
                </span>
              </div>
            </Link>

            {/* Primary Desktop Navigation Links */}
            <div className="hidden lg:flex items-center min-w-0 shrink">
              <DesktopNav items={navItems} />
            </div>
          </div>

          {/* ======================================================== */}
          {/* ZONE 2 (CENTER): Flexible Search Pill (Cmd/Ctrl+K)       */}
          {/* ======================================================== */}
          <div className="hidden sm:flex flex-1 items-center justify-center min-w-0 px-2 lg:px-4 max-w-xs md:max-w-sm lg:max-w-md">
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="w-full max-w-[280px] lg:max-w-[320px] flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-all focus-ring truncate"
              aria-label="Search services (Cmd+K)"
            >
              <div className="flex items-center gap-2 min-w-0 truncate">
                <Search size={14} className="text-slate-400 shrink-0" aria-hidden="true" />
                <span className="truncate">Search services...</span>
              </div>
              <kbd className="hidden md:inline-flex text-[10px] font-mono py-0.5 px-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 shadow-2xs shrink-0">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* ======================================================== */}
          {/* ZONE 3 (RIGHT): Action Tools & Controls                  */}
          {/* ======================================================== */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
            {/* Dark / Light Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors cursor-pointer"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun size={18} className="text-amber-400 hover:rotate-45 transition-transform" aria-hidden="true" />
              ) : (
                <Moon size={18} className="text-slate-700 hover:-rotate-12 transition-transform" aria-hidden="true" />
              )}
            </button>

            {/* Notification Bell */}
            <Link
              to={user?.role === 'PROVIDER' ? '/provider/notifications' : '/notifications'}
              className="w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <NotificationBadge size={19} />
            </Link>

            {/* Custom Injected Action Area */}
            {actionArea && (
              <div className="hidden sm:flex items-center">
                {actionArea}
              </div>
            )}

            {/* User Profile Menu or Sign In */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors cursor-pointer"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="menu"
                  aria-label="User account menu"
                >
                  <Avatar
                    initials={user.fullName ? user.fullName.slice(0, 2) : 'US'}
                    size="sm"
                    className="border border-slate-200 dark:border-slate-700"
                  />
                  <span className="hidden xl:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                    {user.fullName || user.email}
                  </span>
                  <ChevronDown size={14} className="text-slate-400 dark:text-slate-500 hidden sm:inline" aria-hidden="true" />
                </button>

                {/* User Dropdown Panel */}
                {isUserMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 text-left">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {user.fullName || 'User Account'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-2">
                        <Badge variant="neutral" size="sm">
                          {user.role}
                        </Badge>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/activity"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        role="menuitem"
                      >
                        <CalendarClock size={15} className="text-primary-600 dark:text-primary-400" />
                        <span>My Activity</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        role="menuitem"
                      >
                        <User size={15} className="text-slate-500" />
                        <span>Profile & Addresses</span>
                      </Link>
                    </div>

                    <div className="py-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="block px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Portals & Tools
                      </span>
                      <Link
                        to="/provider"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        role="menuitem"
                      >
                        <Briefcase size={14} className="text-primary-600 dark:text-primary-400" />
                        <span>Partner Portal</span>
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        role="menuitem"
                      >
                        <Shield size={14} className="text-amber-500" />
                        <span>Operations Console</span>
                      </Link>
                      <Link
                        to="/health"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        role="menuitem"
                      >
                        <Activity size={14} className="text-emerald-500" />
                        <span>Health & DB Monitor</span>
                      </Link>
                      <Link
                        to="/design-system"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        role="menuitem"
                      >
                        <Layers size={14} className="text-indigo-500" />
                        <span>Design System</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer text-left"
                        role="menuitem"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs font-semibold bg-primary-700 text-white hover:bg-primary-800 focus-ring shadow-xs transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Hamburger Trigger */}
            <button
              type="button"
              onClick={onToggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors cursor-pointer"
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
