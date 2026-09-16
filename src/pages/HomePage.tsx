import React, { useState } from 'react';
import {
  Package,
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
  Phone,
  MessageSquare,
  Truck,
  Sparkles,
  MapPin,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { InteractiveMap } from '../components/InteractiveMap.tsx';
import { CLEAR_EXPRESS_SERVICES, ServiceItem } from '../data/servicesData.ts';
import { ServiceCard } from '../components/ServiceCard.tsx';
import { ServiceDetailModal } from '../components/ServiceDetailModal.tsx';
import { CustomerSupportSection, CompanyContactButtons, COMPANY_CONTACT } from '../components/CompanyContactButtons.tsx';

const heroBannerImg = '/images/hero-logistics.jpg';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onQuickTrack: (trackingNumber: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onQuickTrack }) => {
  const [trackInput, setTrackInput] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Quick estimator state
  const [quickPickup, setQuickPickup] = useState('Nyarugenge CBD (Kigali)');
  const [quickDropoff, setQuickDropoff] = useState('Remera / Gisimenti');
  const [quickVehicle, setQuickVehicle] = useState<'MOTORCYCLE' | 'CAR' | 'VAN'>('MOTORCYCLE');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      onQuickTrack(trackInput.trim());
    }
  };

  const handleBookService = (service: ServiceItem) => {
    if (service.id === 'realtime-tracking') {
      onNavigate('/track');
    } else if (service.id === 'business-delivery') {
      onNavigate('/business');
    } else {
      onNavigate('/send');
    }
  };

  // Quick distance and price estimator
  const estimateQuickPrice = () => {
    let base = 1000;
    let perKm = 200;
    if (quickVehicle === 'CAR') {
      base = 2000;
      perKm = 300;
    } else if (quickVehicle === 'VAN') {
      base = 3000;
      perKm = 500;
    }
    // Estimated typical distance between common Kigali hubs
    const estimatedKm = quickPickup === quickDropoff ? 3.5 : 8.5;
    const total = base + Math.round(estimatedKm * perKm);
    return { km: estimatedKm, total, time: Math.round(estimatedKm * 2.8 + 10) };
  };

  const quickQuote = estimateQuickPrice();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. HERO SECTION (Requirement 3) */}
      <section className="relative bg-[#0A2540] text-white pt-12 pb-24 overflow-hidden">
        {/* Hero Background Image with Atmospheric Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBannerImg}
            alt="CLEAR EXPRESS 555 Modern Logistics Fleet and Dispatch Center"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80';
            }}
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540] via-[#0A2540]/90 to-[#0A2540]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-transparent to-[#0A2540]/50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Brand & Primary Actions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Company & Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#FBBF24] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
                <span className="tracking-wide">CLEAR EXPRESS 555</span>
                <span className="text-white/40">•</span>
                <span className="italic">“Anything. Anywhere. Fast.”</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                  Anything. Anywhere.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-orange-400 to-[#FBBF24]">
                    Fast.
                  </span>
                </h1>
                <p className="text-base sm:text-xl text-slate-200 font-normal max-w-2xl leading-relaxed">
                  Fast, secure and reliable delivery for packages, documents, e-commerce orders and businesses.
                </p>
              </div>

              {/* Main Buttons (Requirement 3: [ SEND A PACKAGE ] [ TRACK PACKAGE ]) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  id="hero-send-package-btn"
                  onClick={() => onNavigate('/send')}
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-orange-600 hover:to-orange-700 text-white font-black text-sm sm:text-base shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5"
                >
                  <Package className="w-5 h-5 stroke-[2.5]" />
                  <span>SEND A PACKAGE</span>
                </button>

                <button
                  type="button"
                  id="hero-track-package-btn"
                  onClick={() => onNavigate('/track')}
                  className="px-7 py-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm sm:text-base backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5"
                >
                  <Search className="w-5 h-5 text-[#FBBF24] stroke-[2.5]" />
                  <span>TRACK PACKAGE</span>
                </button>
              </div>

              {/* Quick Tracking Search Box */}
              <div className="pt-2 max-w-xl">
                <form
                  onSubmit={handleTrackSubmit}
                  className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex items-center gap-2"
                >
                  <div className="pl-3 text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    placeholder="Enter Tracking No. e.g. CE555-RW-20260915-000001"
                    className="bg-transparent w-full text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#0047AB] hover:bg-blue-600 text-white font-bold text-xs whitespace-nowrap transition shadow"
                  >
                    Track
                  </button>
                </form>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
                  <span>Demo Tracking Codes:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackInput('CE555-RW-20260915-000001');
                      onQuickTrack('CE555-RW-20260915-000001');
                    }}
                    className="text-[#FBBF24] hover:underline font-mono"
                  >
                    CE555-RW-20260915-000001
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackInput('CE555-RW-20260915-000002');
                      onQuickTrack('CE555-RW-20260915-000002');
                    }}
                    className="text-[#FBBF24] hover:underline font-mono"
                  >
                    CE555-RW-20260915-000002
                  </button>
                </div>
              </div>

              {/* Floating Quick-Contact Area (Requirement 3: [ 📞 CALL ] [ 💬 WHATSAPP ]) */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                  Quick Dispatch Desk:
                </span>
                <a
                  id="hero-call-btn"
                  href="tel:0798010110"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black transition backdrop-blur-sm shadow"
                  title="Call 0798010110"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>📞 CALL: 0798010110</span>
                </a>
                <a
                  id="hero-whatsapp-btn"
                  href="https://wa.me/250798010110?text=Hello%20CLEAR%20EXPRESS%20555,%20I%20would%20like%20to%20ask%20about%20your%20delivery%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400 text-emerald-300 hover:text-white text-xs font-black transition backdrop-blur-sm shadow"
                  title="WhatsApp 0798010110"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current text-emerald-400" />
                  <span>💬 WHATSAPP: 0798010110</span>
                </a>
              </div>
            </div>

            {/* Right Col: Interactive Live Route Map Snapshot & Quick Fare Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/10 text-xs px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-black text-white">Live Kigali Road Corridor</span>
                  </div>
                  <span className="text-[#FBBF24] font-mono text-[11px] font-bold">Road Routing (OSRM)</span>
                </div>

                <InteractiveMap
                  pickup={{ lat: -1.9441, lng: 30.0619 }}
                  destination={{ lat: -1.9366, lng: 30.1272 }}
                  driverName="Eric Kwizera"
                  driverSpeed={42}
                  height="260px"
                />

                <div className="mt-3 p-2.5 rounded-xl bg-slate-900/70 flex items-center justify-between text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#FF6B00]" />
                    <span className="font-semibold">Nyarugenge CBD ➔ Kicukiro Sonatubes</span>
                  </div>
                  <span className="font-black text-[#FBBF24]">8.6 KM • ~22 mins</span>
                </div>
              </div>

              {/* Quick Estimate Card */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">
                    Quick Fare Estimate
                  </span>
                  <span className="text-[11px] text-slate-300">Automatic Pricing Engine</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <select
                    value={quickVehicle}
                    onChange={(e) => setQuickVehicle(e.target.value as any)}
                    className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="MOTORCYCLE">Motorcycle (Fast)</option>
                    <option value="CAR">Car / Salon</option>
                    <option value="VAN">Van / Cargo</option>
                  </select>

                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                    <span className="text-slate-400">Total:</span>
                    <span className="font-black text-[#FF6B00] font-mono">
                      RWF {quickQuote.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('/send')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
                >
                  <span>Book with This Rate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & PERFORMANCE METRICS */}
      <section className="bg-white border-y border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-[#0A2540]">99.8%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                On-Time Delivery Rate
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-[#FF6B00]">&lt; 45 Mins</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Kigali Express Direct
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-[#0047AB]">30 / 30</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Rwanda Districts Covered
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600">100%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                OTP Proof of Delivery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION WITH HIGH-QUALITY IMAGES (Requirement 2 & 4: NO ICONS ONLY!) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] px-3 py-1 rounded-full bg-orange-100">
              Clear Express 555 Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A2540]">
              Our Specialized Delivery Solutions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Every major logistics discipline equipped with verified couriers, high-speed tracking, and specialized fleet vehicles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/services')}
            className="text-xs sm:text-sm font-black text-[#0047AB] hover:text-[#FF6B00] transition flex items-center gap-1.5 self-start md:self-end"
          >
            <span>VIEW ALL 8 SERVICES & SPECS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 8 Beautiful Service Cards with Large High-Resolution Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {CLEAR_EXPRESS_SERVICES.map((srv) => (
            <ServiceCard
              key={srv.id}
              service={srv}
              onNavigate={onNavigate}
              featured={srv.popular}
            />
          ))}
        </div>
      </section>

      {/* 4. PRICING CALCULATOR BANNER */}
      <section className="bg-gradient-to-br from-[#0A2540] via-[#003380] to-[#0A2540] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">
                Transparent Automatic Pricing Engine
              </span>
              <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                No Hidden Fees. Real Road Distance.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                Our dynamic formula calculates exact road kilometers based on Rwanda’s hills and arterial routes. Base rates start from RWF 1,000 with transparent per-kilometer tiers.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <div className="text-slate-400">Motorcycle Base</div>
                  <div className="font-bold text-white text-base">RWF 1,000</div>
                  <div className="text-[11px] text-[#FBBF24]">200 RWF / km</div>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <div className="text-slate-400">Car / Salon Base</div>
                  <div className="font-bold text-white text-base">RWF 2,000</div>
                  <div className="text-[11px] text-[#FBBF24]">300 RWF / km</div>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <div className="text-slate-400">Van / Truck Base</div>
                  <div className="font-bold text-white text-base">RWF 3,000</div>
                  <div className="text-[11px] text-[#FBBF24]">500 RWF / km</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center items-center">
              <button
                type="button"
                onClick={() => onNavigate('/pricing')}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-orange-600 hover:to-orange-700 text-white font-black text-center text-sm shadow-xl shadow-orange-500/30 transition"
              >
                OPEN INTERACTIVE PRICING CALCULATOR
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/business')}
                className="w-full py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-center text-sm border border-white/20 transition"
              >
                REQUEST BUSINESS CONTRACT RATES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NATIONWIDE COVERAGE IN RWANDA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] px-3 py-1 rounded-full bg-orange-100">
              Complete Territorial Reach
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A2540]">
              Nationwide Delivery Across Rwanda
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We operate daily scheduled corridors connecting the capital city of Kigali with every secondary city and rural district in Rwanda.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="font-black text-[#0A2540]">Kigali Urban Zone</div>
                <div className="text-slate-500 mt-0.5">Nyarugenge, Gasabo, Kicukiro • Under 45 mins</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="font-black text-[#0A2540]">Northern Province</div>
                <div className="text-slate-500 mt-0.5">Musanze, Gicumbi, Burera, Rulindo • Same day</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="font-black text-[#0A2540]">Southern Province</div>
                <div className="text-slate-500 mt-0.5">Huye, Muhanga, Ruhango, Nyanza • Same day</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="font-black text-[#0A2540]">Western & Eastern</div>
                <div className="text-slate-500 mt-0.5">Rubavu, Rusizi, Rwamagana, Kayonza • Scheduled</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/send')}
              className="px-6 py-3.5 rounded-xl bg-[#0047AB] text-white font-bold text-sm hover:bg-blue-800 transition flex items-center gap-2"
            >
              <span>Book Nationwide Shipment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xl overflow-hidden">
              <InteractiveMap height="360px" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROMINENT CUSTOMER SUPPORT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <CustomerSupportSection
          title="Customer Support & Real-Time Logistics Help"
          subtitle="Have questions about sending a package, driver arrival, or business accounts? The Clear Express 555 team in Kigali is on standby 24/7."
          theme="light"
        />
      </section>

      {/* 7. CALL TO ACTION FOOTER BANNER */}
      <section className="bg-[#0A2540] text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-black">Ready to ship with Clear Express 555?</h3>
            <p className="text-slate-300 text-sm">
              “Anything. Anywhere. Fast.” Connect with us directly or book your delivery online in 2 minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <CompanyContactButtons idPrefix="cta-footer" layout="wrap" variant="dark" />
            <button
              type="button"
              onClick={() => onNavigate('/send')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/20 transition whitespace-nowrap"
            >
              SEND NOW
            </button>
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBookService={handleBookService}
      />
    </div>
  );
};
