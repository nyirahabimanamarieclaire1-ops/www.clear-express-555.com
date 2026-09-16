import React, { useState } from 'react';
import { MessageSquare, Phone, X } from 'lucide-react';
import { COMPANY_CONTACT } from './CompanyContactButtons.tsx';

export const FloatingWhatsAppButton: React.FC = () => {
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  // Message required: “Hello CLEAR EXPRESS 555, I would like to ask about your delivery services.”
  const whatsappUrl = `https://wa.me/250798010110?text=${encodeURIComponent(
    'Hello CLEAR EXPRESS 555, I would like to ask about your delivery services.'
  )}`;

  return (
    <div
      id="floating-whatsapp-container"
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 pointer-events-auto"
    >
      {/* Floating Tooltip Bubble */}
      {!tooltipDismissed && (
        <div className="relative bg-white text-slate-800 rounded-2xl p-3 shadow-2xl border border-emerald-200 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={() => setTooltipDismissed(true)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-xs transition"
            aria-label="Close tooltip"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider">
              CLEAR EXPRESS 555 Online
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-snug">
            Need an instant courier quote or parcel pickup? Chat with our Kigali dispatch team right now.
          </p>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <a
              href="tel:0798010110"
              className="text-[#0047AB] hover:underline font-bold flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>0798010110</span>
            </a>
            <span className="text-slate-400 font-mono">Rwanda 24/7</span>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white shadow-xl hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Chat on WhatsApp with CLEAR EXPRESS 555"
        title="Chat on WhatsApp with CLEAR EXPRESS 555 (0798010110)"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none group-hover:opacity-60"></span>

        {/* WhatsApp Icon */}
        <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow relative z-10" />

        {/* Floating badge */}
        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#FF6B00] text-white text-[10px] font-black shadow-md border-2 border-white z-20">
          555
        </span>
      </a>
    </div>
  );
};
