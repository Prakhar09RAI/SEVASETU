import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Layers, Activity } from 'lucide-react';
import { cn } from '../lib/cn';
import type { NavItem } from '../components/navigation/types';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  navItems?: NavItem[];
}

export const Footer: React.FC<FooterProps> = ({ navItems = [], className, ...props }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white font-display font-extrabold text-sm select-none shadow-xs">
                S
              </div>
              <span className="font-display font-bold text-base text-slate-900 dark:text-white tracking-tight">
                Seva<span className="text-primary-600 dark:text-primary-400">Setu</span>
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
              A robust, human-centered service marketplace connecting Indian communities to trusted, background-checked local professionals.
            </p>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
              <Shield size={14} className="text-primary-600 dark:text-primary-400" />
              <span>Verified &amp; Insured Services</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="hover:text-primary-700 dark:hover:text-primary-400 transition-colors focus-ring rounded-md p-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Architecture & Tech Stack */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
              Technology Stack
            </div>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>PostgreSQL 16 &amp; Prisma ORM</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Express &amp; TypeScript API</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>React 19 &amp; Tailwind CSS v4</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>WCAG AA Accessible Primitives</span>
              </li>
            </ul>
          </div>

          {/* System Guidelines */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
              Governance &amp; Trust
            </div>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Layers size={14} className="text-slate-400" />
                <span>Standardized Service Pricing</span>
              </li>
              <li className="flex items-center gap-2">
                <Activity size={14} className="text-slate-400" />
                <span>Live GPS &amp; Booking Tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield size={14} className="text-slate-400" />
                <span>Escrow Payment Protection</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
          <p>© {currentYear} SevaSetu Platform. All rights reserved.</p>
          <p className="font-mono text-slate-500">Design System: Emerald / Indigo / Amber</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
