import React, { useState, useEffect } from 'react';
import { UserRole, User } from '../shared/types.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { AdminPasswordModal } from './components/AdminPasswordModal.tsx';
import { VisitorAuthModal } from './components/VisitorAuthModal.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { SendPackagePage } from './pages/SendPackagePage.tsx';
import { TrackPackagePage } from './pages/TrackPackagePage.tsx';
import { PricingPage } from './pages/PricingPage.tsx';
import { BusinessPage } from './pages/BusinessPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { CustomerDashboard } from './pages/CustomerDashboard.tsx';
import { DriverDashboard } from './pages/DriverDashboard.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { SystemTestPage } from './pages/SystemTestPage.tsx';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('CE555-RW-20260915-000001');

  // Auth states
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('ce555_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ce555_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Modal states
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [visitorModalMode, setVisitorModalMode] = useState<'login' | 'register'>('login');
  const [logoutNotice, setLogoutNotice] = useState('');

  // Sync window history and hash for navigation support
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    // If navigating to admin dashboard and not authenticated with master password, gate it
    if (path === '/admin/dashboard' && !isAdminAuthenticated) {
      setIsAdminModalOpen(true);
      return;
    }

    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({}, '', path);
    } catch (e) {
      // In sandboxed iframe pushState might be restricted
    }
  };

  const handleQuickTrack = (trackingNumber: string) => {
    setActiveTrackingCode(trackingNumber);
    navigateTo('/track');
  };

  const handleOrderCreated = (trackingNumber: string) => {
    setActiveTrackingCode(trackingNumber);
    navigateTo('/track');
  };

  const handleSwitchRole = (newRole: UserRole) => {
    if (newRole === UserRole.SUPER_ADMIN && !isAdminAuthenticated) {
      setIsAdminModalOpen(true);
      return;
    }

    setCurrentRole(newRole);
    fetch('/api/auth/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    }).catch((err) => console.error(err));
  };

  // Auth Handlers
  const handleAdminSuccess = (adminUser: User) => {
    setIsAdminAuthenticated(true);
    setCurrentUser(adminUser);
    setCurrentRole(UserRole.SUPER_ADMIN);
    try {
      sessionStorage.setItem('ce555_admin_authenticated', 'true');
      localStorage.setItem('ce555_user', JSON.stringify(adminUser));
    } catch (e) {}
    navigateTo('/admin/dashboard');
  };

  const handleVisitorSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role || UserRole.CUSTOMER);
    try {
      localStorage.setItem('ce555_user', JSON.stringify(user));
    } catch (e) {}
    navigateTo('/customer/dashboard');
  };

  const handleLogout = async () => {
    const userToLogout = currentUser;
    if (userToLogout) {
      try {
        await fetch('/api/auth/visitor/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userToLogout.id,
            name: userToLogout.name,
            identifier: userToLogout.phone || userToLogout.email,
          }),
        });
      } catch (err) {
        console.error('Logout log error:', err);
      }
    }

    setCurrentUser(null);
    setIsAdminAuthenticated(false);
    setCurrentRole(UserRole.CUSTOMER);
    try {
      localStorage.removeItem('ce555_user');
      sessionStorage.removeItem('ce555_admin_authenticated');
    } catch (e) {}

    setLogoutNotice('Logged out. Audit log dispatched to clearexpress555@gmail.com');
    setTimeout(() => setLogoutNotice(''), 5000);
    navigateTo('/');
  };

  const handleOpenVisitorAuth = (mode: 'login' | 'register' = 'login') => {
    setVisitorModalMode(mode);
    setIsVisitorModalOpen(true);
  };

  // Render Page Content
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigateTo} onQuickTrack={handleQuickTrack} />;
      case '/services':
        return <ServicesPage onNavigate={navigateTo} />;
      case '/send':
        return <SendPackagePage onOrderCreated={handleOrderCreated} />;
      case '/track':
        return (
          <TrackPackagePage
            initialTrackingNumber={activeTrackingCode}
            onNavigate={navigateTo}
          />
        );
      case '/pricing':
        return <PricingPage onNavigate={navigateTo} />;
      case '/business':
        return <BusinessPage onNavigate={navigateTo} onQuickTrack={handleQuickTrack} />;
      case '/about':
        return <AboutPage onNavigate={navigateTo} />;
      case '/contact':
        return <ContactPage />;
      case '/customer/dashboard':
        return (
          <CustomerDashboard
            onNavigate={navigateTo}
            onQuickTrack={handleQuickTrack}
          />
        );
      case '/driver/dashboard':
        return <DriverDashboard onQuickTrack={handleQuickTrack} />;
      case '/admin/dashboard':
        return <AdminDashboard onQuickTrack={handleQuickTrack} />;
      case '/test-suite':
        return <SystemTestPage />;
      default:
        return <HomePage onNavigate={navigateTo} onQuickTrack={handleQuickTrack} />;
    }
  };

  // Hide full footer only when in driver dashboard for a clean native smartphone feel
  const isDriverView = currentPath === '/driver/dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-100 selection:text-orange-900 font-sans antialiased">
      {/* Logout Notice Banner */}
      {logoutNotice && (
        <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium border-b border-slate-800 flex items-center justify-center gap-2 animate-in fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{logoutNotice}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        currentRole={currentRole}
        onSwitchRole={handleSwitchRole}
        onQuickTrack={handleQuickTrack}
        currentUser={currentUser}
        onOpenAdminAuth={() => setIsAdminModalOpen(true)}
        onOpenVisitorAuth={handleOpenVisitorAuth}
        onLogout={handleLogout}
      />

      {/* Main Content View */}
      <main className="flex-1">{renderCurrentPage()}</main>

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Footer */}
      {!isDriverView && <Footer onNavigate={navigateTo} />}

      {/* Admin Password-Only Security Modal */}
      <AdminPasswordModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      {/* Visitor Auth Modal: Phone or Email Login / Register */}
      <VisitorAuthModal
        isOpen={isVisitorModalOpen}
        onClose={() => setIsVisitorModalOpen(false)}
        onSuccess={handleVisitorSuccess}
        initialMode={visitorModalMode}
      />
    </div>
  );
}
