import React, { useState, useEffect, useRef } from 'react';
import { Menu, Sun, Moon, Search, LogOut, Shield, ChevronDown } from 'lucide-react';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand Logo & Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 focus-ring rounded-xl p-1 transition-transform hover:scale-[1.02]"
            aria-label="SevaSetu Home"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white font-display font-extrabold text-lg shadow-md shadow-primary-950/20 select-none">
              S
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-tight">
                Seva<span className="text-primary-700 dark:text-primary-400">Setu</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase truncate">
                Bridge to Services
              </span>
            </div>
          </Link>

          {/* Primary Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center min-w-0">
            <DesktopNav items={navItems} />
          </div>

          {/* Right Action Tools: Search, Theme Toggle, Notifications, User Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Global Search Pill (Cmd/Ctrl+K) */}
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors focus-ring"
              aria-label="Search services (Cmd+K)"
            >
              <Search size={14} className="text-slate-400" aria-hidden="true" />
              <span>Search services...</span>
              <kbd className="hidden md:inline-flex text-[10px] font-mono py-0.5 px-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 inline-flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors cursor-pointer"
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
              className="w-10 h-10 inline-flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <NotificationBadge size={19} />
            </Link>

            {/* Custom injected action area (e.g. role switcher buttons) */}
            {actionArea && (
              <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
                {actionArea}
              </div>
            )}

            {/* User Profile Menu or Sign In */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors cursor-pointer"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="menu"
                  aria-label="User account menu"
                >
                  <Avatar
                    initials={user.fullName ? user.fullName.slice(0, 2) : 'US'}
                    size="sm"
                    className="border border-slate-200 dark:border-slate-700"
                  />
                  <span className="hidden md:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {user.fullName || user.email}
                  </span>
                  <ChevronDown size={14} className="text-slate-400 dark:text-slate-500" aria-hidden="true" />
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
                      {user.role === 'PROVIDER' ? (
                        <Link
                          to="/provider"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          role="menuitem"
                        >
                          <Shield size={15} className="text-primary-600 dark:text-primary-400" />
                          <span>Provider Console</span>
                        </Link>
                      ) : user.role === 'ADMIN' ? (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          role="menuitem"
                        >
                          <Shield size={15} className="text-amber-500" />
                          <span>Admin Console</span>
                        </Link>
                      ) : (
                        <Link
                          to="/customer/bookings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          role="menuitem"
                        >
                          <span>My Bookings</span>
                        </Link>
                      )}
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
