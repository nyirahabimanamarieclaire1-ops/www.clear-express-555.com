import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Building2,
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  AlertCircle,
  Briefcase,
  PhoneCall,
} from 'lucide-react';
import { COMPANY_CONTACT, CompanyContactButtons } from '../components/CompanyContactButtons.tsx';

interface BusinessPageProps {
  onNavigate: (path: string) => void;
  onQuickTrack: (trackingNumber: string) => void;
}

export const BusinessPage: React.FC<BusinessPageProps> = ({ onNavigate, onQuickTrack }) => {
  const [csvContent, setCsvContent] = useState(
    `recipientName,recipientPhone,destStreet,destCity,weightKg,description
Kigali Health Clinic,0788222333,KG 9 Ave Nyarutarama,Kigali,1.5,Medical supplies
Simba Supermarket Branch,0788444555,KN 4 St Kiyovu,Kigali,4.0,Store replenish cartons
Rwanda Tech Hub,0788666777,KG 15 Ave Kacyiru,Kigali,2.0,Hardware components`
  );

  const [isImporting, setIsImporting] = useState(false);
  const [importedOrders, setImportedOrders] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDownloadSample = () => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clear_express_555_bulk_sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProcessCsv = async () => {
    setIsImporting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // Parse CSV text into objects
      const lines = csvContent.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV must have header row and at least 1 order row');
      }

      const headers = lines[0].split(',').map((h) => h.trim());
      const rows = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        const rowObj: any = {};
        headers.forEach((h, i) => {
          rowObj[h] = values[i];
        });
        return rowObj;
      });

      const res = await fetch('/api/orders/bulk-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvRows: rows }),
      });

      if (!res.ok) throw new Error('Bulk import failed');
      const data = await res.json();

      setImportedOrders(data.orders || []);
      setSuccessMsg(`Successfully registered ${data.importedCount} business orders for dispatch!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse CSV');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] px-3 py-1 rounded-full bg-orange-100">
            Enterprise Logistics & E-Commerce Fulfillment
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A2540]">
            Clear Express 555 Business Solutions
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Powering Kigali retailers, pharmaceutical distributors, law firms, and online stores with automated bulk uploads, volume discounts, and monthly consolidated invoicing.
          </p>
        </div>

        {/* Bulk CSV Uploader Tool */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#0047AB]">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0A2540]">Bulk CSV Dispatch Importer</h3>
                <p className="text-xs text-slate-500">
                  Upload up to 500 packages at once for immediate multi-courier dispatch
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadSample}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Sample CSV Template</span>
            </button>
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-semibold">{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
          )}

          {/* CSV Textarea Editor */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              CSV Data Stream (Edit directly or paste file lines)
            </label>
            <textarea
              rows={6}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              className="w-full font-mono text-xs p-4 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Automatic address parsing & Rwandan phone number validation applied.
            </span>
            <button
              type="button"
              onClick={handleProcessCsv}
              disabled={isImporting}
              className="px-6 py-3 rounded-xl bg-[#0047AB] hover:bg-blue-800 text-white text-xs font-bold shadow-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isImporting ? 'Processing Orders...' : 'IMPORT & DISPATCH BATCH'}</span>
            </button>
          </div>

          {/* Imported Results Table */}
          {importedOrders.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h4 className="font-bold text-sm text-[#0A2540]">
                Dispatched Consignments ({importedOrders.length})
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Tracking Number</th>
                      <th className="py-2.5 px-3">Recipient</th>
                      <th className="py-2.5 px-3">Destination</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {importedOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#0047AB]">
                          {ord.trackingNumber}
                        </td>
                        <td className="py-2.5 px-3 font-medium">{ord.customerName}</td>
                        <td className="py-2.5 px-3 text-slate-500">{ord.destination.street}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <button
                            type="button"
                            onClick={() => onQuickTrack(ord.trackingNumber)}
                            className="text-[#FF6B00] hover:underline font-bold"
                          >
                            Live Track
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Business Features Grid with High Quality Logistics Imagery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group hover:shadow-lg transition">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <img
                src="/images/services/business-delivery.jpg"
                alt="Dedicated Clear Express Business Fleet"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FF6B00] text-white">
                  Fleet Dedicated
                </span>
                <h4 className="font-black text-lg mt-1">Dedicated Courier Fleet</h4>
              </div>
            </div>
            <div className="p-6 text-xs text-slate-600 leading-relaxed">
              Assign dedicated motorcycles or vans on monthly retainers for scheduled daily merchant store pick-ups, corporate branch dispatches, and priority city runs.
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group hover:shadow-lg transition">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <img
                src="/images/services/ecommerce-delivery.jpg"
                alt="E-commerce COD Reconciliation and Merchant Fulfillment"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#0047AB] text-white">
                  E-Commerce COD
                </span>
                <h4 className="font-black text-lg mt-1">COD Reconciliation</h4>
              </div>
            </div>
            <div className="p-6 text-xs text-slate-600 leading-relaxed">
              We collect cash or Mobile Money from your customers across Rwanda and remit straight into your bank or MoMo merchant account with daily reconciliation reports.
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group hover:shadow-lg transition">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <img
                src="/images/services/nationwide-delivery.jpg"
                alt="Rwanda Nationwide Regional Distribution Logistics"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white">
                  30 Districts
                </span>
                <h4 className="font-black text-lg mt-1">Nationwide Distribution</h4>
              </div>
            </div>
            <div className="p-6 text-xs text-slate-600 leading-relaxed">
              Connecting your corporate warehouse in Kigali with provincial distributors in Musanze, Huye, Rubavu, Rwamagana, and Rusizi with fixed business tariffs.
            </div>
          </div>
        </div>

        {/* Corporate Account Consultation Card */}
        <div className="bg-gradient-to-br from-[#0A2540] to-[#0047AB] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#FBBF24]">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Enterprise Logistics Desk</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">
                Open a Corporate Courier Account
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Connect directly with our logistics team to establish a tailored commercial agreement, volume-tiered rates, dedicated riders, or nationwide distribution schedules across Rwanda.
              </p>
              <div className="text-xs text-slate-300">
                Phone / WhatsApp: <strong className="text-white">{COMPANY_CONTACT.phone}</strong> • Email: <strong className="text-white">{COMPANY_CONTACT.email}</strong>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col items-center">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Connect Directly:
              </div>
              <CompanyContactButtons idPrefix="biz-corporate" layout="col" variant="dark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
