import React, { useState } from 'react';
import { CLEAR_EXPRESS_SERVICES, ServiceItem } from '../data/servicesData.ts';
import { ServiceCard } from '../components/ServiceCard.tsx';
import { ServiceDetailModal } from '../components/ServiceDetailModal.tsx';
import { CustomerSupportSection, CompanyContactButtons, COMPANY_CONTACT } from '../components/CompanyContactButtons.tsx';
import { ShieldCheck, Zap, Phone, ArrowRight, Truck } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleBookService = (service: ServiceItem) => {
    if (service.id === 'realtime-tracking') {
      onNavigate('/track');
    } else if (service.id === 'business-delivery') {
      onNavigate('/business');
    } else {
      onNavigate('/send');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header Banner */}
        <div className="bg-[#0A2540] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#FBBF24] backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>CLEAR EXPRESS 555 LOGISTICS PORTFOLIO</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Specialized Delivery Services for Rwanda
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Living our company promise: <em className="text-white font-semibold">“Anything. Anywhere. Fast.”</em> Every service is powered by our calibrated road routing engine, verified couriers, and OTP proof of delivery.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <CompanyContactButtons idPrefix="services-header" layout="wrap" variant="dark" />
              <button
                type="button"
                onClick={() => onNavigate('/send')}
                className="px-6 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-black text-xs sm:text-sm shadow transition flex items-center gap-2"
              >
                <span>BOOK A SHIPMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid with Large Images (Requirement 2 & 4) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] px-3 py-1 rounded-full bg-orange-100">
                All 8 Major Services
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540] mt-2">
                Explore Our Core Delivery Solutions
              </h2>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Click <span className="font-bold text-[#0047AB]">[ LEARN MORE ]</span> on any service for in-depth specifications.
            </div>
          </div>

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
        </div>

        {/* Why Choose Clear Express 555 Pillars */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0047AB]">
              Operational Excellence
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0A2540]">
              Why Rwanda Trusts Clear Express 555
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Modern logistics infrastructure designed for speed, accountability, and total transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0047AB] text-white flex items-center justify-center font-bold">
                01
              </div>
              <h4 className="text-lg font-black text-[#0A2540]">Actual Road Kilometer Calculation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We calculate real road distance using Rwanda’s highway network, ensuring fair and predictable tariffs without hidden surcharges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-bold">
                02
              </div>
              <h4 className="text-lg font-black text-[#0A2540]">Digital Proof of Delivery</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                4-digit recipient OTP authorization, digital stylus signature, and parcel delivery photo ensure zero dispute logistics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                03
              </div>
              <h4 className="text-lg font-black text-[#0A2540]">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant phone and WhatsApp assistance on <span className="font-bold text-emerald-800">0798010110</span> with active parcel monitoring from our Kigali dispatch center.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Support Section */}
        <CustomerSupportSection
          title="Questions About Our Courier & Freight Services?"
          subtitle="Clear Express 555 logistics advisors are standing by to guide you through vehicle selection, scheduled runs, and custom handling."
          theme="light"
        />
      </div>

      {/* Interactive Learn More Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBookService={handleBookService}
      />
    </div>
  );
};
