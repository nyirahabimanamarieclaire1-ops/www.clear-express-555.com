import React, { useState } from 'react';
import { MessageSquare, Phone, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  // Exact pre-filled message required by Section 22:
  // “Hello CLEAR EXPRESS 555, I would like to ask about your delivery services.”
  const prefilledText = encodeURIComponent(
    'Hello CLEAR EXPRESS 555, I would like to ask about your delivery services.'
  );
  const waUrl = `https://wa.me/250798010110?text=${prefilledText}`;

  return (
    <aside
      aria-label="Contact CLEAR EXPRESS 555 via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto select-none"
    >
      {/* Floating Prompt Bubble */}
      {showTooltip && (
        <div className="mb-2 p-3 rounded-2xl bg-white shadow-2xl border border-emerald-200 text-slate-800 text-xs max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200 relative">
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
            aria-label="Dismiss message"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>CLEAR EXPRESS 555 Online</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-tight">
            Chat with Kigali dispatch directly for instant courier rates and tracking:
          </p>
          <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <a
              href="tel:0798010110"
              className="text-[#0047AB] font-bold hover:underline flex items-center gap-1"
            >
              <Phone className="w-2.5 h-2.5" />
              <span>0798010110</span>
            </a>
            <span className="text-emerald-600 font-semibold font-mono">WhatsApp 24/7</span>
          </div>
        </div>
      )}

      {/* Main WhatsApp Floating Action Button (Direct Link to WhatsApp) */}
      <a
        id="floating-whatsapp-btn"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Open WhatsApp Chat with CLEAR EXPRESS 555"
        title="WhatsApp: 0798010110"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none group-hover:opacity-60"></span>

        {/* WhatsApp Icon */}
        <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow relative z-10" />

        {/* 555 Badge */}
        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#FF6B00] text-white text-[10px] font-black shadow-md border-2 border-white z-20">
          555
        </span>
      </a>
    </aside>
  );
};
