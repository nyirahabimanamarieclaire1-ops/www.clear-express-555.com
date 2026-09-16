import React, { useState } from 'react';
import { Logo } from './Logo.tsx';
import { UserRole, User } from '../../shared/types.ts';
import { COMPANY_CONTACT, CompanyContactButtons } from './CompanyContactButtons.tsx';
import {
  Phone,
  Mail,
  Search,
  Menu,
  X,
  UserCheck,
  Truck,
  Shield,
  Send,
  Navigation,
  CheckCircle2,
  ChevronDown,
  Building2,
  HelpCircle,
  MessageSquare,
  LogIn,
  LogOut,
  KeyRound,
  User as UserIcon,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onQuickTrack: (trackingNumber: string) => void;
  currentUser: User | null;
  onOpenAdminAuth: () => void;
  onOpenVisitorAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  currentRole,
  onSwitchRole,
  onQuickTrack,
  currentUser,
  onOpenAdminAuth,
  onOpenVisitorAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');

  // Required Navigation:
  // Home, Services, Send Package, Track Package, Pricing, Business, About, Contact
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Send Package', path: '/send', highlight: true },
    { name: 'Track Package', path: '/track' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Business', path: '/business' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      onQuickTrack(trackingInput.trim());
      setTrackingInput('');
      setMobileMenuOpen(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMIN:
        return { label: 'Admin Portal', color: 'bg-indigo-900 text-indigo-100 border-indigo-700' };
      case UserRole.DRIVER:
        return { label: 'Driver App', color: 'bg-emerald-800 text-emerald-100 border-emerald-600' };
      case UserRole.BUSINESS_CUSTOMER:
        return { label: 'Business Client', color: 'bg-amber-900 text-amber-100 border-amber-700' };
      default:
        return { label: 'Customer', color: 'bg-blue-800 text-blue-100 border-blue-600' };
    }
  };

  const roleInfo = getRoleBadge(currentRole);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top Utility & Hotline Bar */}
      <div className="bg-[#0A2540] text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <a
              href="tel:0798010110"
              className="flex items-center gap-1.5 hover:text-[#FF6B00] transition-colors font-medium text-[11px] sm:text-xs text-white"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Call: <strong>0798010110</strong></span>
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://wa.me/250798010110?text=Hello%20CLEAR%20EXPRESS%20555,%20I%20would%20like%20to%20ask%20about%20your%20delivery%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors font-medium text-[11px] sm:text-xs text-emerald-300"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: <strong>0798010110</strong></span>
            </a>
            <span className="hidden md:inline text-slate-600">•</span>
            <a
              href="mailto:clearexpress555@gmail.com"
              className="hidden md:flex items-center gap-1.5 hover:text-[#FF6B00] transition-colors text-[11px] sm:text-xs text-slate-300"
            >
              <Mail className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>clearexpress555@gmail.com</span>
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Rwanda Express Fleet Live
            </span>

            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-[11px] font-bold transition ${roleInfo.color}`}
              >
                <UserCheck className="w-3 h-3" />
                <span>{roleInfo.label}</span>
                <ChevronDown className="w-2.5 h-2.5 opacity-70" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-900">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Switch Test Persona
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSwitchRole(UserRole.CUSTOMER);
                      onNavigate('/customer/dashboard');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition"
                  >
                    <Send className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-semibold text-slate-800">Customer Portal</div>
                      <div className="text-[11px] text-slate-500">Track orders & view invoices</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSwitchRole(UserRole.DRIVER);
                      onNavigate('/driver/dashboard');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition"
                  >
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold text-slate-800">Driver Smartphone App</div>
                      <div className="text-[11px] text-slate-500">Delivery workflow & Proof of Delivery</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSwitchRole(UserRole.SUPER_ADMIN);
                      onNavigate('/admin/dashboard');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition"
                  >
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-semibold text-slate-800">Admin Control Center</div>
                      <div className="text-[11px] text-slate-500">Live dispatch, pricing editor, reports</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSwitchRole(UserRole.BUSINESS_CUSTOMER);
                      onNavigate('/business');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition"
                  >
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-semibold text-slate-800">Business Solutions</div>
                      <div className="text-[11px] text-slate-500">Bulk CSV upload & contract rates</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-3">
          {/* Left: CLEAR EXPRESS 555 logo */}
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="flex-shrink-0 text-left focus:outline-none"
            aria-label="CLEAR EXPRESS 555 Homepage"
          >
            <Logo size="md" />
          </button>

          {/* Navigation Center (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              if (link.highlight) {
                return (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => onNavigate(link.path)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#EA580C] text-white font-bold text-xs 2xl:text-sm shadow-md hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                  </button>
                );
              }
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => onNavigate(link.path)}
                  className={`px-2.5 py-2 rounded-lg text-xs 2xl:text-sm font-bold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#0047AB] bg-blue-50'
                      : 'text-slate-700 hover:text-[#0047AB] hover:bg-slate-100/70'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Right Header Contact Buttons (Section 6 Requirement: [ WhatsApp ] [ Call ]) */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {/* Quick Track Input */}
            <form onSubmit={handleTrackSubmit} className="relative w-32 xl:w-40 mr-0.5">
              <input
                type="text"
                placeholder="Track CE555-..."
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </form>

            {/* Auth Gateways */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                <UserIcon className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span className="font-bold text-slate-800 max-w-[90px] truncate">{currentUser.name}</span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition"
                  title="Log Out (logs to clearexpress555@gmail.com)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onOpenVisitorAuth('login')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50/90 hover:bg-blue-100 text-[#0047AB] text-xs font-bold transition whitespace-nowrap"
                  title="Visitor Login / Register with Phone or Email"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#0047AB]" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenAdminAuth}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-xs whitespace-nowrap"
                  title="Admin Security Gate"
                >
                  <Shield className="w-3.5 h-3.5 text-orange-400" />
                  <span>Admin</span>
                </button>
              </div>
            )}

            {/* Direct WhatsApp Button */}
            <a
              id="nav-whatsapp-btn"
              href="https://wa.me/250798010110?text=Hello%20CLEAR%20EXPRESS%20555,%20I%20would%20like%20to%20ask%20about%20your%20delivery%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition active:scale-95 whitespace-nowrap"
              title="Chat on WhatsApp (0798010110)"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Direct Call Button */}
            <a
              id="nav-call-btn"
              href="tel:0798010110"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#0A2540] hover:from-blue-700 hover:to-blue-900 text-white text-xs font-bold shadow transition active:scale-95 whitespace-nowrap"
              title="Call Clear Express 555 (0798010110)"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>0798010110</span>
            </a>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            <a
              href="tel:0798010110"
              className="p-2 rounded-xl bg-blue-50 text-[#0047AB] font-bold text-xs flex items-center gap-1 border border-blue-200"
              title="Call 0798010110"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="hidden sm:inline">Call</span>
            </a>
            <a
              href="https://wa.me/250798010110?text=Hello%20CLEAR%20EXPRESS%20555,%20I%20would%20like%20to%20ask%20about%20your%20delivery%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1 border border-emerald-200"
              title="WhatsApp 0798010110"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2">
          {/* Quick Track Mobile */}
          <form onSubmit={handleTrackSubmit} className="relative">
            <input
              type="text"
              placeholder="Track package: CE555-RW-..."
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-100 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          {/* Mobile Links */}
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                  currentPath === link.path
                    ? 'bg-[#0047AB] text-white'
                    : link.highlight
                    ? 'bg-orange-100 text-[#FF6B00] border border-orange-200'
                    : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{link.name}</span>
                {link.highlight && <Send className="w-3 h-3" />}
              </button>
            ))}
          </div>

          {/* User Account / Auth Section in Mobile Drawer */}
          <div className="pt-2 border-t border-slate-100">
            {currentUser ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0047AB] flex items-center justify-center font-black text-sm">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500">{currentUser.phone || currentUser.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenVisitorAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-[#0047AB] flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Visitor Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenAdminAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                >
                  <Shield className="w-3.5 h-3.5 text-orange-400" />
                  <span>Admin Gate</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Action Contact Buttons in Mobile Menu */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Direct Contact Desk
            </div>
            <CompanyContactButtons idPrefix="mobile-menu" layout="col" variant="compact" />
          </div>

          {/* Portal Switcher in Mobile Drawer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Switch User Mode:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onSwitchRole(UserRole.CUSTOMER);
                  onNavigate('/customer/dashboard');
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[11px] font-bold"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitchRole(UserRole.DRIVER);
                  onNavigate('/driver/dashboard');
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[11px] font-bold"
              >
                Driver
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitchRole(UserRole.SUPER_ADMIN);
                  onNavigate('/admin/dashboard');
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-[11px] font-bold"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
