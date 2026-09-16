import React from 'react';

export const COMPANY_CONTACT = {
  company: 'CLEAR EXPRESS 555',
  tagline: 'Anything. Anywhere. Fast.',
  phone: '0798010110',
  phoneHref: 'tel:0798010110',
  whatsapp: '0798010110',
  whatsappHref: 'https://wa.me/250798010110',
  email: 'clearexpress555@gmail.com',
  emailHref: 'mailto:clearexpress555@gmail.com',
};

interface CompanyContactButtonsProps {
  layout?: 'row' | 'col' | 'grid' | 'wrap';
  variant?: 'default' | 'dark' | 'outline' | 'compact' | 'invoice';
  className?: string;
  idPrefix?: string;
}

export const CompanyContactButtons: React.FC<CompanyContactButtonsProps> = ({
  layout = 'wrap',
  variant = 'default',
  className = '',
  idPrefix = 'contact-btn',
}) => {
  const getButtonStyles = (type: 'call' | 'whatsapp' | 'email') => {
    if (variant === 'compact') {
      if (type === 'call') {
        return 'bg-[#FF6B00] hover:bg-orange-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm';
      }
      if (type === 'whatsapp') {
        return 'bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm';
      }
      return 'bg-[#0047AB] hover:bg-blue-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm';
    }

    if (variant === 'dark') {
      if (type === 'call') {
        return 'bg-[#FF6B00] hover:bg-orange-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md border border-orange-400/30';
      }
      if (type === 'whatsapp') {
        return 'bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md border border-emerald-400/30';
      }
      return 'bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md border border-slate-600/50';
    }

    if (variant === 'outline') {
      if (type === 'call') {
        return 'bg-white hover:bg-orange-50 text-[#FF6B00] border-2 border-[#FF6B00] text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm';
      }
      if (type === 'whatsapp') {
        return 'bg-white hover:bg-emerald-50 text-emerald-600 border-2 border-emerald-600 text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm';
      }
      return 'bg-white hover:bg-blue-50 text-[#0047AB] border-2 border-[#0047AB] text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm';
    }

    if (variant === 'invoice') {
      return 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-[11px] font-bold px-2.5 py-1.5 rounded-md';
    }

    // Default vibrant buttons
    if (type === 'call') {
      return 'bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-orange-600 hover:to-orange-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-orange-500/25 active:scale-95';
    }
    if (type === 'whatsapp') {
      return 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-emerald-500/25 active:scale-95';
    }
    return 'bg-gradient-to-r from-[#0047AB] to-[#0A2540] hover:from-blue-700 hover:to-slate-900 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-blue-500/25 active:scale-95';
  };

  const layoutClasses = {
    row: 'flex flex-row items-center gap-2.5 flex-nowrap overflow-x-auto',
    col: 'flex flex-col gap-2.5 w-full',
    grid: 'grid grid-cols-1 sm:grid-cols-3 gap-3 w-full',
    wrap: 'flex flex-wrap items-center gap-2.5',
  }[layout];

  return (
    <div className={`${layoutClasses} ${className}`}>
      {/* 📞 CALL 0798010110 */}
      <a
        id={`${idPrefix}-call`}
        href={COMPANY_CONTACT.phoneHref}
        className={`inline-flex items-center justify-center text-center transition-all whitespace-nowrap ${getButtonStyles('call')}`}
      >
        📞 CALL 0798010110
      </a>

      {/* 💬 WHATSAPP 0798010110 */}
      <a
        id={`${idPrefix}-whatsapp`}
        href={COMPANY_CONTACT.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center text-center transition-all whitespace-nowrap ${getButtonStyles('whatsapp')}`}
      >
        💬 WHATSAPP 0798010110
      </a>

      {/* ✉️ EMAIL clearexpress555@gmail.com */}
      <a
        id={`${idPrefix}-email`}
        href={COMPANY_CONTACT.emailHref}
        className={`inline-flex items-center justify-center text-center transition-all whitespace-nowrap ${getButtonStyles('email')}`}
      >
        ✉️ EMAIL clearexpress555@gmail.com
      </a>
    </div>
  );
};

interface CustomerSupportSectionProps {
  title?: string;
  subtitle?: string;
  theme?: 'light' | 'dark';
  className?: string;
}

export const CustomerSupportSection: React.FC<CustomerSupportSectionProps> = ({
  title = 'Customer Support & Dispatch Hotline',
  subtitle = 'Need assistance with a delivery, parcel booking, or corporate inquiry? Our dispatch team is on standby 24/7.',
  theme = 'light',
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <section
      id="customer-support-section"
      className={`rounded-3xl p-6 sm:p-8 border transition-all ${
        isDark
          ? 'bg-[#0A2540] text-white border-slate-800 shadow-2xl'
          : 'bg-white text-slate-800 border-slate-200 shadow-lg'
      } ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#FF6B00]">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
            24/7 Dedicated Support
          </div>
          <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-[#0A2540]'}`}>
            {title}
          </h3>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {subtitle}
          </p>
          <div className="pt-1 text-xs font-semibold text-slate-400">
            Company: <strong className={isDark ? 'text-white' : 'text-slate-800'}>CLEAR EXPRESS 555</strong> • “Anything. Anywhere. Fast.”
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <CompanyContactButtons
            idPrefix="support-sec"
            layout="col"
            variant={isDark ? 'dark' : 'default'}
          />
        </div>
      </div>
    </section>
  );
};
