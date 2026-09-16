import React from 'react';
import { Logo } from './Logo.tsx';
import { CompanyContactButtons } from './CompanyContactButtons.tsx';
import { Clock, ShieldCheck, ChevronRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0A2540] text-slate-300 border-t-4 border-[#FF6B00] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="white" size="lg" />
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Rwanda’s premier high-velocity express courier and technology-driven logistics network.
              Delivering anything, anywhere across all 30 districts of Rwanda and connecting to international trade corridors.
            </p>

            <div className="pt-2 space-y-3">
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">
                Direct Contact Channels:
              </div>
              <CompanyContactButtons
                idPrefix="footer-contact"
                layout="col"
                variant="dark"
              />
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-l-2 border-[#FF6B00] pl-2.5">
              Core Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/services')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
                  <span>Package Delivery</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/services')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
                  <span>Document Dispatch</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/services')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
                  <span>E-commerce Fulfillment</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/services')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
                  <span>Same-Day Kigali Express</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/services')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
                  <span>Nationwide Rwanda Delivery</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/services')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
                  <span>International Cargo</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Portals */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-l-2 border-[#FF6B00] pl-2.5">
              Platform & Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/send')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
                  <span>Send a Package</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/track')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
                  <span>Track Consignment</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/customer/dashboard')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
                  <span>Customer Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/driver/dashboard')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
                  <span>Driver Mobile Portal</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/admin/dashboard')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
                  <span>Admin Control Center</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/business')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
                  <span>Business Contract Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Rwanda Trust & Security */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-l-2 border-[#FF6B00] pl-2.5">
              Service Guarantee
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Drivers & OTP</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Every package requires customer OTP verification and digital proof of delivery.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <Clock className="w-4 h-4 text-[#FBBF24]" />
                  <span>Real-Time GPS Tracking</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Live satellite updates for both sender and recipient along actual road routes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong>CLEAR EXPRESS 555</strong>. All rights reserved. Registered logistics operator in the Republic of Rwanda.
          </div>
          <div className="flex items-center gap-6">
            <button type="button" onClick={() => onNavigate('/pricing')} className="hover:text-slate-300">
              Pricing Policy
            </button>
            <button type="button" onClick={() => onNavigate('/contact')} className="hover:text-slate-300">
              Terms & Safety
            </button>
            <button type="button" onClick={() => onNavigate('/test-suite')} className="hover:text-slate-300 text-blue-400">
              System Test Suite
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
