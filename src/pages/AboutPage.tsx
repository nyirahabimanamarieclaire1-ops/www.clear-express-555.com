import React from 'react';
import { Logo } from '../components/Logo.tsx';
import { ShieldCheck, Target, Zap, Globe, Award, Users, Truck } from 'lucide-react';
import { CustomerSupportSection } from '../components/CompanyContactButtons.tsx';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Logo size="lg" />
            <h1 className="text-3xl sm:text-5xl font-black text-[#0A2540] leading-tight">
              Building Rwanda’s Most Dependable Logistics Infrastructure
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              <strong>CLEAR EXPRESS 555</strong> was established with a singular, unshakeable mission: to make transport and delivery across Rwanda friction-free, instantaneous, and radically transparent. Guided by our motto — <em>“Anything. Anywhere. Fast.”</em> — we merge intelligent GPS road routing with a disciplined fleet of professional couriers.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/send')}
                className="px-6 py-3 rounded-xl bg-[#FF6B00] text-white font-bold text-sm shadow-lg hover:bg-orange-600 transition"
              >
                Send A Package Now
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className="px-6 py-3 rounded-xl bg-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-300 transition"
              >
                Get In Touch
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-[#0A2540] to-[#0047AB] text-white rounded-3xl p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-[#FBBF24]">Our Operational Pillars</h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Velocity & Agility</div>
                  <p className="text-slate-300 mt-0.5">
                    Sub-3 minute courier assignment with dynamic traffic avoidance on Kigali roads.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Zero Compromise Security</div>
                  <p className="text-slate-300 mt-0.5">
                    Strict background-checked drivers, biometric digital signatures, and customer OTP codes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-300 flex-shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Regional & Global Reach</div>
                  <p className="text-slate-300 mt-0.5">
                    Connecting Rwandan enterprise to East African trade corridors and global cargo flights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet & Coverage Stats */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              Operational Footprint
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540]">
              Clear Express 555 by the Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-[#0047AB]">500+</div>
              <div className="text-xs font-bold text-slate-500 uppercase">Verified Couriers</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-[#FF6B00]">30</div>
              <div className="text-xs font-bold text-slate-500 uppercase">Rwanda Districts</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600">99.8%</div>
              <div className="text-xs font-bold text-slate-500 uppercase">Delivery Success</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-[#0A2540]">24/7</div>
              <div className="text-xs font-bold text-slate-500 uppercase">Customer Support</div>
            </div>
          </div>
        </div>

        {/* Customer Support Desk */}
        <CustomerSupportSection
          title="Speak With Clear Express 555"
          subtitle="Our central dispatch desk is ready to assist with deliveries, enterprise accounts, and nationwide shipping inquiries."
          theme="light"
        />
      </div>
    </div>
  );
};
