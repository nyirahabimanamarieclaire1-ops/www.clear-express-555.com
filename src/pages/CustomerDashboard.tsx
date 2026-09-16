import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../shared/types.ts';
import { InvoiceModal } from '../components/InvoiceModal.tsx';
import { CustomerSupportSection, CompanyContactButtons } from '../components/CompanyContactButtons.tsx';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  FileText,
  Search,
  ArrowRight,
  Plus,
  ShieldCheck,
} from 'lucide-react';

interface CustomerDashboardProps {
  onNavigate: (path: string) => void;
  onQuickTrack: (trackingNumber: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onNavigate,
  onQuickTrack,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED
  );

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'ACTIVE') {
      return o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED;
    }
    if (filterStatus === 'DELIVERED') {
      return o.status === OrderStatus.DELIVERED;
    }
    return true;
  });

  const handleOpenInvoice = async (orderId: string) => {
    try {
      const res = await fetch(`/api/invoices/${orderId}`);
      if (res.ok) {
        const inv = await res.json();
        setSelectedInvoice(inv);
        setIsInvoiceOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header with Greeting & Action */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A2540]">
              Welcome back, Aline Uwase
            </h1>
            <p className="text-xs text-slate-500">
              Account: +250 788 123 456 • Kigali, Rwanda
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/send')}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>SEND NEW PACKAGE</span>
          </button>
        </div>

        {/* Active Deliveries Highlight Card */}
        {activeOrders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#0A2540] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active Shipments In Motion ({activeOrders.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeOrders.slice(0, 2).map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl p-6 border-2 border-blue-100 shadow-md space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                      <div className="font-mono font-black text-sm text-[#0A2540] mt-1">
                        {ord.trackingNumber}
                      </div>
                    </div>
                    {ord.otpCode && (
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">Delivery OTP</div>
                        <div className="font-mono font-black text-base text-[#FF6B00]">
                          {ord.otpCode}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>
                      <div className="text-slate-400 text-[11px]">To (Recipient)</div>
                      <div className="font-bold text-slate-800">{ord.destination.contactName}</div>
                      <div className="text-[11px] truncate">{ord.destination.street}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[11px]">Courier</div>
                      <div className="font-bold text-slate-800">{ord.driverName || 'Dispatching'}</div>
                      <div className="text-[11px]">~{ord.estimatedMinutes} mins away</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#0047AB]">
                      RWF {ord.pricing.total.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => onQuickTrack(ord.trackingNumber)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#0047AB] hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1 transition"
                    >
                      <span>Live Satellite Map</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Order History */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-[#0A2540]">Delivery History</h3>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['ALL', 'ACTIVE', 'DELIVERED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg transition ${
                    filterStatus === st ? 'bg-white text-[#0047AB] shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Tracking Number</th>
                  <th className="py-3 px-3">Package Description</th>
                  <th className="py-3 px-3">Destination</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#0047AB]">
                      {o.trackingNumber}
                    </td>
                    <td className="py-3 px-3 font-medium">{o.package.description}</td>
                    <td className="py-3 px-3 text-slate-600">
                      {o.destination.street}, {o.destination.city}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      RWF {o.pricing.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.status === OrderStatus.DELIVERED
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === OrderStatus.CANCELLED
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => onQuickTrack(o.trackingNumber)}
                        className="text-[#FF6B00] hover:underline font-bold"
                      >
                        Track
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() => handleOpenInvoice(o.id)}
                        className="text-[#0047AB] hover:underline font-bold"
                      >
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Support Desk Section */}
        <CustomerSupportSection
          title="Customer Care & Delivery Support"
          subtitle="Need help with an ongoing order, billing receipt, or special pickup? Contact Clear Express 555 dispatch 24/7."
          theme="light"
        />

        {/* Invoice Modal */}
        <InvoiceModal
          invoice={selectedInvoice}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
        />
      </div>
    </div>
  );
};
