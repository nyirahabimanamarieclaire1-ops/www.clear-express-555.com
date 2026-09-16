import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../shared/types.ts';
import { InteractiveMap } from '../components/InteractiveMap.tsx';
import { OrderTimeline } from '../components/OrderTimeline.tsx';
import { InvoiceModal } from '../components/InvoiceModal.tsx';
import { CustomerSupportSection } from '../components/CompanyContactButtons.tsx';
import {
  Search,
  Truck,
  Phone,
  Clock,
  MapPin,
  Package,
  ShieldCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface TrackPackagePageProps {
  initialTrackingNumber?: string;
  onNavigate: (path: string) => void;
}

export const TrackPackagePage: React.FC<TrackPackagePageProps> = ({
  initialTrackingNumber = 'CE555-RW-20260915-000001',
  onNavigate,
}) => {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [driverLocation, setDriverLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  const fetchTracking = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(codeToSearch.trim())}`);
      if (!res.ok) {
        throw new Error('Tracking number not found in Clear Express 555 database');
      }
      const data = await res.json();
      setOrder(data.order);
      setDriverLocation(data.driverLocation);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to locate order');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialTrackingNumber) {
      setTrackingNumber(initialTrackingNumber);
      fetchTracking(initialTrackingNumber);
    }
  }, [initialTrackingNumber]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(trackingNumber);
  };

  const handleOpenInvoice = async () => {
    if (!order) return;
    try {
      const res = await fetch(`/api/invoices/${order.id}`);
      if (res.ok) {
        const inv = await res.json();
        setInvoiceData(inv);
        setIsInvoiceOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header & Search Bar */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] px-3 py-1 rounded-full bg-orange-100">
            Real-Time Satellite Dispatch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A2540]">
            Track Your Clear Express Consignment
          </h1>
          <p className="text-slate-600 text-sm">
            Enter your 16-character tracking identifier to see live driver telemetry, road route, and delivery progression.
          </p>

          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto mt-4">
            <input
              type="text"
              required
              placeholder="Enter CE555-RW-..."
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full pl-10 pr-28 py-3.5 bg-white border-2 border-slate-300 rounded-2xl text-sm font-mono font-bold text-slate-800 shadow-md focus:border-[#FF6B00] focus:outline-none"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-4" />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold shadow transition disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'TRACK'}
            </button>
          </form>

          {/* Quick Demo Track Code Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-2">
            <span>Quick Samples:</span>
            {[
              'CE555-RW-20260915-000001',
              'CE555-RW-20260915-000002',
              'CE555-RW-20260915-000003',
            ].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setTrackingNumber(sample);
                  fetchTracking(sample);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#0047AB] hover:text-[#0047AB] font-mono text-[11px] transition shadow-sm"
              >
                {sample.slice(-6)}
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Live Order Card & Tracking Details */}
        {order && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-2">
            {/* Left 7 Cols: Interactive Map & Courier Card */}
            <div className="lg:col-span-7 space-y-6">
              {/* Map Canvas */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-bold text-[#0A2540]">Active Road Telemetry</span>
                  </div>
                  <div className="font-mono text-slate-500">
                    Est. Arrival: ~{order.estimatedMinutes} mins
                  </div>
                </div>

                <InteractiveMap
                  pickup={order.pickup}
                  destination={order.destination}
                  routeGeometry={order.routeGeometry}
                  driverLocation={driverLocation}
                  driverVehicle={order.vehicleType}
                  driverName={order.driverName}
                  driverSpeed={38}
                  height="340px"
                />

                <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Distance</div>
                    <div className="font-black text-[#0A2540] text-sm">{order.distanceKm} km</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Vehicle</div>
                    <div className="font-black text-[#0A2540] text-sm">{order.vehicleType}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Speed Tier</div>
                    <div className="font-black text-[#FF6B00] text-sm">{order.speed}</div>
                  </div>
                </div>
              </div>

              {/* Courier Contact Card */}
              {order.driverName ? (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-[#0047AB] flex items-center justify-center text-[#0047AB] font-black text-xl">
                      {order.driverName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Assigned Rwanda Courier</span>
                      </div>
                      <h4 className="text-base font-black text-[#0A2540]">{order.driverName}</h4>
                      <p className="text-xs text-slate-500">Plate: RAB 555 A • Clear Express Courier</p>
                    </div>
                  </div>

                  {order.driverPhone && (
                    <a
                      href={`tel:${order.driverPhone}`}
                      className="px-4 py-2.5 rounded-xl bg-[#0047AB] hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow transition"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Driver</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold">Courier Dispatching in Progress</div>
                    <div>Looking for the closest available driver in your sector.</div>
                  </div>
                  <span className="font-mono font-bold text-xs bg-white px-2.5 py-1 rounded-md border border-amber-300">
                    DISPATCH QUEUE
                  </span>
                </div>
              )}

              {/* Package Details & Actions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-[#0A2540]">Package Manifest</h3>
                  <button
                    type="button"
                    onClick={handleOpenInvoice}
                    className="flex items-center gap-1.5 text-[#0047AB] hover:text-blue-800 font-bold"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Official Invoice</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Contents</span>
                    <div className="font-bold text-slate-800">{order.package.description}</div>
                    <div className="text-slate-500">{order.package.weightKg} kg • {order.package.type}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Billing</span>
                    <div className="font-bold text-slate-800">
                      RWF {order.pricing.total.toLocaleString()}
                    </div>
                    <div className="text-emerald-600 font-semibold">{order.paymentStatus} via {order.paymentMethod.replace(/_/g, ' ')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: 7-Step Progression Timeline */}
            <div className="lg:col-span-5">
              <OrderTimeline order={order} />
            </div>
          </div>
        )}

        {/* Customer Support Section */}
        <div className="mt-12">
          <CustomerSupportSection
            title="Consignment Tracking & Operations Helpdesk"
            subtitle="Need live assistance with an ongoing transit, delivery address modification, or driver arrival status? Our Kigali operations center is available 24/7."
            theme="light"
          />
        </div>

        {/* Invoice Modal */}
        <InvoiceModal
          invoice={invoiceData}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
        />
      </div>
    </div>
  );
};
