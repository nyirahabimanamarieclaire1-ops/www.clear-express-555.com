import React, { useState } from 'react';
import { ServiceItem } from '../data/servicesData.ts';
import { ArrowRight, CheckCircle2, X, Shield, PhoneCall } from 'lucide-react';
import { COMPANY_CONTACT } from './CompanyContactButtons.tsx';

interface ServiceCardProps {
  service: ServiceItem;
  onNavigate: (path: string) => void;
  featured?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onNavigate,
  featured = false,
}) => {
  const [imgSrc, setImgSrc] = useState(service.image);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImgError = () => {
    if (imgSrc !== service.fallbackImage) {
      setImgSrc(service.fallbackImage);
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group ${
          featured
            ? 'border-[#0047AB] shadow-xl ring-2 ring-blue-500/20'
            : 'border-slate-200 hover:border-[#0047AB] hover:shadow-xl'
        }`}
      >
        <div>
          {/* Service Image Container with rounded upper corners */}
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <img
              src={imgSrc}
              alt={service.alt}
              onError={handleImgError}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

            {/* Badge */}
            {service.badge && (
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/95 text-[#0047AB] shadow-md backdrop-blur-sm">
                  {service.badge}
                </span>
              </div>
            )}

            {/* Title Overlay in Image */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h3 className="text-lg sm:text-xl font-black drop-shadow-sm leading-snug">
                {service.title}
              </h3>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[3rem]">
              {service.desc}
            </p>

            {/* Key Service Highlights */}
            <div className="space-y-1.5 pt-1 text-xs">
              {service.features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="line-clamp-1">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-6 pt-0">
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-[#0047AB] hover:text-[#FF6B00] transition py-2 px-3 rounded-lg hover:bg-blue-50"
            >
              LEARN MORE
            </button>

            <button
              type="button"
              onClick={() => {
                if (service.id === 'realtime-tracking') {
                  onNavigate('/track');
                } else if (service.id === 'business-delivery') {
                  onNavigate('/business');
                } else {
                  onNavigate('/send');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/10 transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>{service.id === 'realtime-tracking' ? 'Track Package' : 'Book Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Learn More Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
              <img
                src={imgSrc}
                alt={service.alt}
                onError={handleImgError}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
                {service.badge && (
                  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF6B00] text-white">
                    {service.badge}
                  </span>
                )}
                <h3 className="text-2xl sm:text-3xl font-black">{service.title}</h3>
                <p className="text-xs sm:text-sm text-slate-200">
                  CLEAR EXPRESS 555 • “Anything. Anywhere. Fast.”
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Service Overview
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed">{service.fullDesc}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Service Specifications & Key Inclusions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Clear Express Guarantee */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-xs text-blue-900">
                  <div className="font-bold">Guaranteed Delivery & Verified Proof of Delivery</div>
                  <div className="text-blue-700">
                    Protected transit with OTP receiver authorization, digital signature, and live GPS tracking across Rwanda.
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <a
                  href={`tel:${COMPANY_CONTACT.phone}`}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <PhoneCall className="w-4 h-4 text-[#FF6B00]" />
                  <span>Call Dispatch: {COMPANY_CONTACT.phone}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    if (service.id === 'realtime-tracking') {
                      onNavigate('/track');
                    } else if (service.id === 'business-delivery') {
                      onNavigate('/business');
                    } else {
                      onNavigate('/send');
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
                >
                  <span>{service.id === 'realtime-tracking' ? 'TRACK NOW' : 'PROCEED TO BOOKING'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
