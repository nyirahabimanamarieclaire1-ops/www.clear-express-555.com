import React, { useState } from 'react';
import { Phone, Mail, Send, CheckCircle2, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import { COMPANY_CONTACT, CompanyContactButtons } from '../components/CompanyContactButtons.tsx';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] px-3 py-1 rounded-full bg-orange-100">
            Official Company Contact
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A2540]">
            CLEAR EXPRESS 555 Support & Dispatch
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            “Anything. Anywhere. Fast.” Connect with our operations dispatch desk 24 hours a day for immediate parcel bookings, corporate courier contracts, or delivery assistance.
          </p>

          {/* Prompt-mandated clickable action bar */}
          <div className="pt-2">
            <CompanyContactButtons idPrefix="contact-header" layout="wrap" variant="default" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 5 Cols: Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            {/* Phone & WhatsApp Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0A2540]">Phone / WhatsApp</h3>
                  <p className="text-xs text-slate-500">Live courier dispatch & immediate tracking assistance</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold mb-1">Company Contact Number:</div>
                <div className="text-2xl font-black font-mono text-[#0047AB]">
                  {COMPANY_CONTACT.phone}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="text-xs font-semibold text-slate-600">Click to connect immediately:</div>
                <div className="flex flex-col gap-2">
                  <a
                    id="contact-page-call-btn"
                    href={COMPANY_CONTACT.phoneHref}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF6B00] to-orange-600 text-white font-bold text-xs sm:text-sm text-center shadow-md hover:from-orange-600 hover:to-orange-700 transition"
                  >
                    📞 CALL {COMPANY_CONTACT.phone}
                  </a>
                  <a
                    id="contact-page-whatsapp-btn"
                    href={COMPANY_CONTACT.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm text-center shadow-md hover:from-emerald-700 hover:to-teal-700 transition"
                  >
                    💬 WHATSAPP {COMPANY_CONTACT.whatsapp}
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0047AB] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0A2540]">Company Email</h3>
                  <p className="text-xs text-slate-500">Invoices, quotes, and corporate courier partnerships</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold mb-1">Official Email Address:</div>
                <div className="text-base font-bold text-slate-900 break-all">
                  {COMPANY_CONTACT.email}
                </div>
              </div>

              <div className="pt-1">
                <a
                  id="contact-page-email-btn"
                  href={COMPANY_CONTACT.emailHref}
                  className="w-full block py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#0A2540] text-white font-bold text-xs sm:text-sm text-center shadow-md hover:from-blue-700 hover:to-slate-900 transition"
                >
                  ✉️ EMAIL {COMPANY_CONTACT.email}
                </a>
              </div>
            </div>

            {/* Response Commitment Card */}
            <div className="bg-gradient-to-br from-[#0A2540] to-[#0047AB] text-white rounded-2xl p-6 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Fast Response SLA</span>
              </div>
              <h4 className="font-bold text-base text-white">24/7 Operations Coverage</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct inquiries to phone, WhatsApp, and email are acknowledged immediately by our Rwanda logistics team.
              </p>
            </div>
          </div>

          {/* Right 7 Cols: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-[#0A2540]">Message Received!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out to Clear Express 555. A dispatch supervisor will call or email you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#0047AB] text-white text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="text-lg font-black text-[#0A2540] pb-2 border-b border-slate-100">
                  Send Us a Direct Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jean-Luc Mugisha"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number (Rwanda) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="078... or 079..."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.rw"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message or Logistics Request *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you need delivered or your company logistics inquiry..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-orange-600 hover:to-orange-700 text-white font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>SUBMIT INQUIRY</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
