import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import {
  Home,
  Search,
  Sparkles,
  CalendarClock,
  Activity,
  Layers,
  Layout,
  ArrowLeft,
  PanelLeft,
  Briefcase,
  MessageSquare,
  Bell,
  ShieldCheck,
  User,
} from 'lucide-react';
import { ApplicationShell } from './layouts/ApplicationShell';
import { ProviderShell } from './layouts/ProviderShell';
import { AdminShell } from './layouts/AdminShell';
import { Button } from './components/ui/Button';
import { EmptyState } from './components/ui/EmptyState';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage, RegisterPage, UnauthorizedPage } from './pages/auth';
import {
  CustomerHomePage,
  ServiceDiscoveryPage,
  ServiceDetailPage,
  ProviderProfilePage as CustomerProviderProfilePage,
  RequestServicePage,
  CustomerActivityPage,
  CustomerProfilePage,
  CustomerBookingDetailPage,
} from './pages/customer';
import {
  ProviderOverviewPage,
  ProviderRequestsPage,
  ProviderRequestDetailPage,
  ProviderJobsPage,
  ProviderJobDetailPage,
  ProviderAvailabilityPage,
  ProviderServicesPage,
  ProviderProfilePage,
  ProviderEarningsPage,
  ProviderReviewsPage,
} from './pages/provider';
import {
  PaymentPage,
  InvoicePage,
  CustomerReviewPage,
} from './pages/transaction';
import {
  MessagesPage,
  NotificationsPage,
} from './pages/communication';
import {
  AdminOverviewPage,
  AdminUsersPage,
  AdminUserDetailPage,
  AdminProvidersPage,
  AdminProviderDetailPage,
  AdminServicesPage,
  AdminBookingsPage,
  AdminBookingDetailPage,
  AdminVerificationPage,
  AdminVerificationDetailPage,
  AdminDisputesPage,
  AdminDisputeDetailPage,
  AdminSupportPage,
  AdminAuditLogsPage,
  AdminTrustSafetyPage,
  AdminSettingsPage,
} from './pages/admin';
import { ShellPreview } from './pages/ShellPreview';
import { DesignSystemPreview } from './pages/DesignSystemPreview';
import { HealthMonitor } from './pages/HealthMonitor';
import type { NavItem } from './components/navigation/types';

// ==========================================
// Customer Portal Layout Wrapper
// ==========================================
const CustomerLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { isAuthenticated } = useAuth();

  const navItems: NavItem[] = [
    { label: 'Find Services', href: '/services', icon: <Search size={15} /> },
    { label: 'Request Service', href: '/request', icon: <Sparkles size={15} /> },
    { label: 'Activity', href: '/activity', icon: <CalendarClock size={15} /> },
    { label: 'Messages', href: '/messages', icon: <MessageSquare size={15} /> },
  ];

  const sidebarItems: NavItem[] = [
    { label: 'Customer Home', href: '/', icon: <Home size={15} /> },
    { label: 'Browse Services', href: '/services', icon: <Search size={15} /> },
    { label: 'Request Service', href: '/request', icon: <Sparkles size={15} /> },
    { label: 'My Activity', href: '/activity', icon: <CalendarClock size={15} /> },
    ...(isAuthenticated ? [{ label: 'My Profile & Addresses', href: '/profile', icon: <User size={15} /> }] : []),
    { label: 'Messages', href: '/messages', icon: <MessageSquare size={15} /> },
    { label: 'Notifications', href: '/notifications', icon: <Bell size={15} /> },
    { label: 'Partner Portal', href: '/provider', icon: <Briefcase size={15} /> },
    { label: 'Operations Console', href: '/admin', icon: <ShieldCheck size={15} /> },
    { label: 'System Health', href: '/health', icon: <Activity size={15} /> },
    { label: 'Design System', href: '/design-system', icon: <Layers size={15} /> },
    { label: 'Shell Layout', href: '/shell-preview', icon: <Layout size={15} /> },
  ];

  return (
    <ApplicationShell
      navItems={navItems}
      sidebarItems={sidebarItems}
      showSidebar={showSidebar}
      sidebarTitle="Customer Navigation"
      headerActionArea={
        <Button
          variant={showSidebar ? 'secondary' : 'ghost'}
          size="sm"
          leftIcon={<PanelLeft size={14} />}
          onClick={() => setShowSidebar((prev) => !prev)}
          aria-label="Toggle sidebar navigation"
          className="hidden xl:inline-flex text-xs h-9"
        >
          {showSidebar ? 'Hide Menu' : 'Menu'}
        </Button>
      }
    >
      <Outlet />
    </ApplicationShell>
  );
};

// ==========================================
// Root App with Customer, Provider & Admin Shells
// ==========================================
export const App: React.FC = () => {
  const [previewSidebar, setPreviewSidebar] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* ========================================== */}
          {/* 1. Admin & Operations Experience Routes    */}
          {/* ========================================== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="users/:id" element={<AdminUserDetailPage />} />
            <Route path="providers" element={<AdminProvidersPage />} />
            <Route path="providers/:id" element={<AdminProviderDetailPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="bookings/:id" element={<AdminBookingDetailPage />} />
            <Route path="verification" element={<AdminVerificationPage />} />
            <Route path="verification/:id" element={<AdminVerificationDetailPage />} />
            <Route path="reports" element={<AdminDisputesPage />} />
            <Route path="reports/:id" element={<AdminDisputeDetailPage />} />
            <Route path="support" element={<AdminSupportPage />} />
            <Route path="audit-logs" element={<AdminAuditLogsPage />} />
            <Route path="trust-safety" element={<AdminTrustSafetyPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* ========================================== */}
          {/* 2. Service Provider Experience Routes      */}
          {/* ========================================== */}
          <Route
            path="/provider"
            element={
              <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
                <ProviderShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProviderOverviewPage />} />
            <Route path="requests" element={<ProviderRequestsPage />} />
            <Route path="requests/:id" element={<ProviderRequestDetailPage />} />
            <Route path="jobs" element={<ProviderJobsPage />} />
            <Route path="jobs/:id" element={<ProviderJobDetailPage />} />
            <Route path="availability" element={<ProviderAvailabilityPage />} />
            <Route path="services" element={<ProviderServicesPage />} />
            <Route path="profile" element={<ProviderProfilePage />} />
            <Route path="earnings" element={<ProviderEarningsPage />} />
            <Route path="invoices/:invoiceId" element={<InvoicePage userRole="provider" />} />
            <Route path="invoice/:invoiceId" element={<InvoicePage userRole="provider" />} />
            <Route path="reviews" element={<ProviderReviewsPage />} />
            <Route path="messages" element={<MessagesPage userRole="provider" />} />
            <Route path="messages/:conversationId" element={<MessagesPage userRole="provider" />} />
            <Route path="notifications" element={<NotificationsPage userRole="provider" />} />
          </Route>

          {/* ========================================== */}
          {/* 3. Customer Portal Experience Routes       */}
          {/* ========================================== */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<CustomerHomePage />} />
            <Route path="/services" element={<ServiceDiscoveryPage />} />
            <Route path="/services/:category" element={<ServiceDiscoveryPage />} />
            <Route path="/service/:id" element={<ServiceDetailPage />} />
            <Route path="/provider/:id" element={<CustomerProviderProfilePage />} />

            {/* Protected Customer Routes */}
            <Route
              path="/request"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <RequestServicePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <CustomerActivityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity/:id"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <CustomerBookingDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/:id"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <CustomerBookingDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'PROVIDER', 'ADMIN']}>
                  <CustomerProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Transaction & Communication Protected Routes */}
            <Route
              path="/payment/:bookingId"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoice/:invoiceId"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <InvoicePage userRole="customer" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews/:bookingId"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <CustomerReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'PROVIDER', 'ADMIN']}>
                  <MessagesPage userRole="customer" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages/:conversationId"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'PROVIDER', 'ADMIN']}>
                  <MessagesPage userRole="customer" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'PROVIDER', 'ADMIN']}>
                  <NotificationsPage userRole="customer" />
                </ProtectedRoute>
              }
            />

            {/* Foundation & Architecture Views */}
            <Route
              path="/shell-preview"
              element={
                <ShellPreview
                  showSidebar={previewSidebar}
                  onToggleSidebar={() => setPreviewSidebar(!previewSidebar)}
                />
              }
            />
            <Route path="/design-system" element={<DesignSystemPreview />} />
            <Route path="/health" element={<HealthMonitor />} />

            {/* 404 Catch-All */}
            <Route
              path="*"
              element={
                <div className="flex-1 flex items-center justify-center p-6">
                  <EmptyState
                    title="Page Not Found"
                    description="The requested page does not exist within the customer, partner, or admin portals."
                    action={
                      <div className="flex items-center gap-3">
                        <Link to="/">
                          <Button size="sm" variant="primary" leftIcon={<ArrowLeft size={14} />}>
                            Customer Home
                          </Button>
                        </Link>
                        <Link to="/provider">
                          <Button size="sm" variant="outline" leftIcon={<Briefcase size={14} />}>
                            Provider Console
                          </Button>
                        </Link>
                        <Link to="/admin">
                          <Button size="sm" variant="outline" leftIcon={<ShieldCheck size={14} />}>
                            Admin Console
                          </Button>
                        </Link>
                      </div>
                    }
                  />
                </div>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
