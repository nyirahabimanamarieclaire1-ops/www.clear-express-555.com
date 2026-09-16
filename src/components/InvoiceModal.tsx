import React from 'react';
import { Invoice } from '../../shared/types.ts';
import { Logo } from './Logo.tsx';
import { X, Printer, Download, CheckCircle2, Shield } from 'lucide-react';
import { COMPANY_CONTACT, CompanyContactButtons } from './CompanyContactButtons.tsx';

interface InvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, isOpen, onClose }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            Tax Invoice & Delivery Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0047AB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 sm:p-10 space-y-8 print:p-0">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div>
              <Logo size="md" />
              <p className="text-xs text-slate-500 mt-2 font-medium">
                “Anything. Anywhere. Fast.” • Clear Express 555
              </p>
              <div className="text-xs text-slate-700 mt-2 space-y-0.5">
                <div>Phone / WhatsApp: <strong>{COMPANY_CONTACT.phone}</strong></div>
                <div>Email: <strong>{COMPANY_CONTACT.email}</strong></div>
              </div>

              {/* Clickable Actions (Hidden on print) */}
              <div className="mt-3 print:hidden">
                <CompanyContactButtons idPrefix="invoice-header" layout="wrap" variant="compact" />
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 rounded bg-slate-100 text-slate-900 font-mono font-black text-sm border border-slate-300">
                {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Date: {new Date(invoice.issuedAt).toLocaleDateString()}
              </div>
              <div className="text-xs text-slate-500">
                Tracking: <strong className="font-mono text-[#0047AB]">{invoice.trackingNumber}</strong>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{invoice.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Customer & Route Meta */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Billed To (Customer)
              </span>
              <div className="font-bold text-sm text-slate-900">{invoice.customerName}</div>
              <div className="text-slate-600">{invoice.customerPhone}</div>
              <div className="text-slate-600">{invoice.customerEmail}</div>
              <div className="mt-2 text-slate-700">
                <strong>Pickup:</strong> {invoice.pickupAddress}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Delivery Route Details
              </span>
              <div className="text-slate-700">
                <strong>Destination:</strong> {invoice.destinationAddress}
              </div>
              <div className="mt-1 text-slate-700">
                <strong>Road Distance:</strong> {invoice.distanceKm} km
              </div>
              <div className="mt-1 text-slate-700">
                <strong>Package:</strong> {invoice.packageDescription} ({invoice.packageWeightKg} kg)
              </div>
              <div className="mt-1 text-slate-700">
                <strong>Method:</strong> {invoice.paymentMethod.replace(/_/g, ' ')}
              </div>
            </div>
          </div>

          {/* Pricing Breakdown Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center">Qty / Rate</th>
                  <th className="py-2.5 text-right">Amount (RWF)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 font-medium">Base Dispatch & Booking Fee</td>
                  <td className="py-3 text-center">Flat</td>
                  <td className="py-3 text-right font-mono">{invoice.pricing.baseFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">
                    Road Distance Fee ({invoice.pricing.distanceKm} km @ {invoice.pricing.pricePerKm} RWF/km)
                  </td>
                  <td className="py-3 text-center">{invoice.pricing.distanceKm} km</td>
                  <td className="py-3 text-right font-mono">{invoice.pricing.distanceFee.toLocaleString()}</td>
                </tr>
                {invoice.pricing.packageFee > 0 && (
                  <tr>
                    <td className="py-3 font-medium">Package Size & Handling Surcharge</td>
                    <td className="py-3 text-center">Weight tier</td>
                    <td className="py-3 text-right font-mono">{invoice.pricing.packageFee.toLocaleString()}</td>
                  </tr>
                )}
                {invoice.pricing.expressFee > 0 && (
                  <tr>
                    <td className="py-3 font-medium text-[#FF6B00]">Priority Express Surcharge</td>
                    <td className="py-3 text-center">Immediate dispatch</td>
                    <td className="py-3 text-right font-mono text-[#FF6B00]">
                      {invoice.pricing.expressFee.toLocaleString()}
                    </td>
                  </tr>
                )}
                {invoice.pricing.zoneFee > 0 && (
                  <tr>
                    <td className="py-3 font-medium">Out-of-Kigali Province Zone Fee</td>
                    <td className="py-3 text-center">Zone tariff</td>
                    <td className="py-3 text-right font-mono">{invoice.pricing.zoneFee.toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 font-bold text-sm">
                  <td className="py-4 text-slate-900" colSpan={2}>
                    Total Amount Due
                  </td>
                  <td className="py-4 text-right text-base text-[#0047AB] font-black font-mono">
                    RWF {invoice.pricing.total.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer & Security Stamp */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Verified Authentic Electronic Logistics Invoice • Clear Express 555</span>
              </div>
              <div className="font-mono text-[10px] text-slate-400">
                HASH-{invoice.id.toUpperCase()}
              </div>
            </div>

            {/* Support bar for invoice queries */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 print:hidden flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Questions regarding this invoice or payment reconciliation?
              </div>
              <CompanyContactButtons idPrefix="invoice-footer" layout="wrap" variant="compact" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
