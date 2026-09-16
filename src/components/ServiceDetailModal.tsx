import React from 'react';
import { ServiceItem } from '../data/servicesData.ts';
import {
  X,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck,
  Send,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { COMPANY_CONTACT } from './CompanyContactButtons.tsx';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookService: (service: ServiceItem) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookService,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition backdrop-blur-sm"
          aria-label="Close service details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
          <img
            src={service.image}
            alt={service.imageAlt}
            onError={(e) => {
              // Graceful fallback to verified remote URL if local asset has any loading anomaly
              (e.target as HTMLImageElement).src = service.fallbackImage;
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Badges and Title */}
          <div className="absolute bottom-5 left-5 right-5 space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FF6B00] text-white text-[11px] font-black uppercase tracking-wider shadow">
              {service.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow">
              {service.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 font-medium line-clamp-2">
              {service.shortDesc}
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0047AB]">
              Service Overview
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {service.fullDesc}
            </p>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0047AB]">
                <Clock className="w-4 h-4" />
                <span>Estimated Speed</span>
              </div>
              <div className="text-xs text-slate-800 font-semibold">{service.estimatedTime}</div>
            </div>

            <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B00]">
                <Truck className="w-4 h-4" />
                <span>Vehicle Fleet</span>
              </div>
              <div className="text-xs text-slate-800 font-semibold">{service.recommendedVehicle}</div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>Starting Rates</span>
              </div>
              <div className="text-xs text-slate-800 font-semibold">{service.startingPrice}</div>
            </div>
          </div>

          {/* Key Features List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Guaranteed Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ideal For */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3">
            <div>
              <strong className="font-bold">Recommended For: </strong>
              <span>{service.idealFor}</span>
            </div>
            <span className="font-bold text-[#FF6B00] flex-shrink-0">CLEAR EXPRESS 555</span>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href="tel:0798010110"
              className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>0798010110</span>
            </a>
            <a
              href="https://wa.me/250798010110?text=Hello%20CLEAR%20EXPRESS%20555,%20I%20would%20like%20to%20inquire%20about%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookService(service);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold shadow-md hover:shadow-orange-500/30 flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Package Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
