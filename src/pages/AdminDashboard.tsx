import React, { useState, useEffect } from 'react';
import {
  AdminMetrics,
  CompanyEmailLog,
  Driver,
  DriverStatus,
  Order,
  OrderStatus,
  VehicleType,
} from '../../shared/types.ts';
import { InteractiveMap } from '../components/InteractiveMap.tsx';
import { InvoiceModal } from '../components/InvoiceModal.tsx';
import {
  Shield,
  Truck,
  Package,
  DollarSign,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Settings,
  UserCheck,
  FileSpreadsheet,
  Edit,
  Save,
  Mail,
  Send,
  Eye,
  X,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardProps {
  onQuickTrack: (trackingNumber: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onQuickTrack }) => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedSubTab, setSelectedSubTab] = useState<'OVERVIEW' | 'LIVE_MAP' | 'ORDERS' | 'DRIVERS' | 'PRICING' | 'EMAIL_LOGS'>('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Pricing rules state for admin editing
  const [pricingRules, setPricingRules] = useState<any>(null);
  const [pricingSavedMsg, setPricingSavedMsg] = useState('');

  // Selected invoice
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Company Email Logs state (clearexpress555@gmail.com)
  const [emailLogs, setEmailLogs] = useState<CompanyEmailLog[]>([]);
  const [selectedEmailLog, setSelectedEmailLog] = useState<CompanyEmailLog | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [testEmailMsg, setTestEmailMsg] = useState('');

  const fetchAdminData = async () => {
    try {
      const [mRes, oRes, dRes, pRes, eRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/orders'),
        fetch('/api/drivers'),
        fetch('/api/admin/pricing'),
        fetch('/api/admin/company-email-logs'),
      ]);

      if (mRes.ok) setMetrics(await mRes.json());
      if (oRes.ok) setOrders(await oRes.json());
      if (dRes.ok) setDrivers(await dRes.json());
      if (pRes.ok) {
        const pData = await pRes.json();
        setPricingRules(pData.pricingRules);
      }
      if (eRes.ok) {
        const eData = await eRes.json();
        setEmailLogs(eData.logs || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const handleSendTestEmail = async () => {
    try {
      const res = await fetch('/api/admin/company-email-logs/test', { method: 'POST' });
      if (res.ok) {
        setTestEmailMsg('Audit notification email successfully transmitted to clearexpress555@gmail.com!');
        fetchAdminData();
        setTimeout(() => setTestEmailMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSavePricing = async () => {
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricingRules }),
      });
      if (res.ok) {
        setPricingSavedMsg('Pricing rules updated live across the entire Rwanda network!');
        setTimeout(() => setPricingSavedMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenInvoice = async (orderId: string) => {
    try {
      const res = await fetch(`/api/invoices/${orderId}`);
      if (res.ok) {
        setSelectedInvoice(await res.json());
        setIsInvoiceOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6 text-[#FF6B00]" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                Central Dispatch Operations
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A2540]">
                Clear Express 555 Admin Hub
              </h1>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold overflow-x-auto">
            {[
              { key: 'OVERVIEW', label: 'Metrics' },
              { key: 'LIVE_MAP', label: 'Live Telemetry Map' },
              { key: 'ORDERS', label: 'Order Dispatch' },
              { key: 'DRIVERS', label: 'Fleet & Drivers' },
              { key: 'PRICING', label: 'Pricing Editor' },
              { key: 'EMAIL_LOGS', label: '✉️ Email Logs (clearexpress555@gmail.com)' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedSubTab(tab.key as any)}
                className={`px-3 py-2 rounded-xl transition whitespace-nowrap ${
                  selectedSubTab === tab.key
                    ? 'bg-[#0A2540] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. METRICS ROW (Section 16) */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Today Orders</span>
              <span className="text-2xl font-black text-[#0A2540]">{metrics.todayOrders}</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Deliveries</span>
              <span className="text-2xl font-black text-[#FF6B00]">{metrics.activeDeliveries}</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivered</span>
              <span className="text-2xl font-black text-emerald-600">{metrics.deliveredPackages}</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Dispatch Queue</span>
              <span className="text-2xl font-black text-amber-600">{metrics.pendingOrders}</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1 sm:col-span-2 lg:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Revenue</span>
              <span className="text-xl font-black text-[#0047AB] font-mono">
                RWF {metrics.revenueRwf.toLocaleString()}
              </span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Fleet</span>
              <span className="text-2xl font-black text-[#0A2540]">{metrics.activeDrivers} Drivers</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Available Couriers</span>
              <span className="text-2xl font-black text-teal-600">{metrics.availableDrivers} Ready</span>
            </div>
          </div>
        )}

        {/* 2. TAB: OVERVIEW */}
        {selectedSubTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Live Operational Map Preview */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="font-bold text-base text-[#0A2540]">
                    Kigali & Rwanda Active Fleet Dispatch
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSubTab('LIVE_MAP')}
                  className="text-xs text-[#0047AB] font-bold hover:underline"
                >
                  Expand Full Screen Map →
                </button>
              </div>

              <InteractiveMap height="360px" />
            </div>

            {/* Quick Driver Status List */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#0A2540]">Active Couriers</h3>
              <div className="space-y-3 divide-y divide-slate-100 text-xs">
                {drivers.map((d) => (
                  <div key={d.id} className="pt-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{d.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {d.plateNumber} • {d.vehicleType}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.status === DriverStatus.ONLINE
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.status === DriverStatus.BUSY
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. TAB: LIVE MAP */}
        {selectedSubTab === 'LIVE_MAP' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#0A2540]">
                  Satellite Dispatch & Courier Corridors
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time GPS telemetry updated every 5 seconds across Rwanda’s arterial highways.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                OSRM Routing Engine Online
              </span>
            </div>

            <InteractiveMap height="550px" />
          </div>
        )}

        {/* 4. TAB: ORDERS DISPATCH (Section 19) */}
        {selectedSubTab === 'ORDERS' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search by tracking #, customer name, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                {Object.values(OrderStatus).map((st) => (
                  <option key={st} value={st}>
                    {st.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Tracking</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Pickup ➔ Destination</th>
                    <th className="py-3 px-3">Courier</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-mono font-bold text-[#0047AB]">
                        {o.trackingNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold">{o.customerName}</div>
                        <div className="text-[10px] text-slate-400">{o.customerPhone}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <div className="truncate max-w-xs">{o.pickup.street}</div>
                        <div className="truncate max-w-xs text-slate-400">➔ {o.destination.street}</div>
                      </td>
                      <td className="py-3 px-3 font-medium">
                        {o.driverName ? (
                          <span className="text-emerald-700 font-bold">{o.driverName}</span>
                        ) : (
                          <span className="text-amber-600 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">
                        RWF {o.pricing.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
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
        )}

        {/* 5. TAB: DRIVERS & FLEET */}
        {selectedSubTab === 'DRIVERS' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#0A2540]">Registered Rwanda Courier Fleet</h3>
              <span className="text-xs text-slate-500 font-medium">
                All drivers hold verified RURA courier operator permits
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.map((d) => (
                <div
                  key={d.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-[#0047AB] transition shadow-sm space-y-4 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-base text-[#0A2540]">{d.name}</div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.status === DriverStatus.ONLINE
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.status === DriverStatus.BUSY
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-600">
                    <div>
                      <strong>Phone:</strong> {d.phone}
                    </div>
                    <div>
                      <strong>Vehicle:</strong> {d.vehicleType} (Plate: {d.plateNumber})
                    </div>
                    <div>
                      <strong>Safety Rating:</strong> ★ {d.rating} / 5.0
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-50">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Jobs</div>
                      <div className="font-bold text-slate-800">{d.todayDeliveries}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Km</div>
                      <div className="font-bold text-slate-800">{d.todayKm.toFixed(1)}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Earnings</div>
                      <div className="font-bold text-emerald-600 font-mono">
                        {Math.round(d.todayEarnings).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAB: PRICING EDITOR (Section 17) */}
        {selectedSubTab === 'PRICING' && pricingRules && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#0A2540]">
                  Dynamic Pricing Engine Configurator
                </h3>
                <p className="text-xs text-slate-500">
                  Update base dispatch fees, per-km rates, and speed surcharges in real-time.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSavePricing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-lg transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>SAVE & APPLY PRICING</span>
              </button>
            </div>

            {pricingSavedMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{pricingSavedMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {Object.entries(pricingRules).map(([vKey, rule]: [string, any]) => (
                <div key={vKey} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                  <h4 className="font-bold text-base text-[#0A2540] uppercase">{vKey}</h4>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Base Fee (RWF)</label>
                    <input
                      type="number"
                      value={rule.baseFee}
                      onChange={(e) => {
                        const updated = { ...pricingRules };
                        updated[vKey].baseFee = Number(e.target.value);
                        setPricingRules(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price Per Km (RWF)</label>
                    <input
                      type="number"
                      value={rule.pricePerKm}
                      onChange={(e) => {
                        const updated = { ...pricingRules };
                        updated[vKey].pricePerKm = Number(e.target.value);
                        setPricingRules(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Express Surcharge (RWF)</label>
                    <input
                      type="number"
                      value={rule.expressSurcharge}
                      onChange={(e) => {
                        const updated = { ...pricingRules };
                        updated[vKey].expressSurcharge = Number(e.target.value);
                        setPricingRules(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. COMPANY EMAIL LOGS (clearexpress555@gmail.com) */}
        {selectedSubTab === 'EMAIL_LOGS' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0A2540] via-[#0047AB] to-[#0A2540] text-white p-6 rounded-3xl shadow-lg border border-slate-700 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-orange-500/20 text-[#FF6B00] border border-orange-400/30">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-orange-400">
                      OFFICIAL AUDIT CHANNEL
                    </div>
                    <h2 className="text-xl font-black tracking-tight">
                      Company Email Dispatch Logs
                    </h2>
                  </div>
                </div>
                <p className="text-xs text-blue-100 max-w-2xl mt-1">
                  All visitor account registrations, phone/email logins, visitor logouts, and admin authorizations are automatically dispatched and archived to <strong className="text-amber-300">clearexpress555@gmail.com</strong> in real-time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  className="px-4 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs shadow-md transition flex items-center gap-2 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Ping</span>
                </button>
                <button
                  type="button"
                  onClick={fetchAdminData}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center gap-1.5"
                  title="Refresh Logs"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {testEmailMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{testEmailMsg}</span>
              </div>
            )}

            {/* Metric counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Dispatches</span>
                <span className="text-2xl font-black text-[#0A2540]">{emailLogs.length}</span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">100% Delivered</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Visitor Logins</span>
                <span className="text-2xl font-black text-blue-600">
                  {emailLogs.filter((l) => l.eventType === 'VISITOR_LOGIN').length}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Phone & Email</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">New Visitors</span>
                <span className="text-2xl font-black text-[#FF6B00]">
                  {emailLogs.filter((l) => l.eventType === 'VISITOR_REGISTER').length}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Accounts Created</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Primary Inbox</span>
                <span className="text-xs font-bold text-[#0A2540] truncate block mt-2">
                  clearexpress555@gmail.com
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">Active Channel</span>
              </div>
            </div>

            {/* Email Logs Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0A2540]">Email Audit Trail</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    {emailLogs.length} events
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Target Recipient: <code className="bg-slate-100 px-2 py-1 rounded font-mono font-bold text-slate-800">clearexpress555@gmail.com</code>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Event Category</th>
                      <th className="py-3 px-4">Subject Line</th>
                      <th className="py-3 px-4">Actor / Phone / Email</th>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {emailLogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No company email logs recorded yet.
                        </td>
                      </tr>
                    ) : (
                      emailLogs.map((log) => {
                        const getBadge = (type: string) => {
                          switch (type) {
                            case 'ADMIN_LOGIN':
                              return 'bg-purple-100 text-purple-800 border-purple-200';
                            case 'VISITOR_REGISTER':
                              return 'bg-amber-100 text-amber-800 border-amber-200';
                            case 'VISITOR_LOGIN':
                              return 'bg-blue-100 text-blue-800 border-blue-200';
                            case 'VISITOR_LOGOUT':
                              return 'bg-slate-100 text-slate-700 border-slate-200';
                            case 'ORDER_CREATED':
                              return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                            default:
                              return 'bg-rose-100 text-rose-800 border-rose-200';
                          }
                        };

                        return (
                          <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getBadge(log.eventType)}`}>
                                {log.eventType.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs truncate">
                              {log.subject}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                              <div>{log.actorName || 'Visitor'}</div>
                              {log.actorIdentifier && (
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {log.actorIdentifier}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-blue-600 font-bold whitespace-nowrap">
                              {log.recipient}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{log.status}</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedEmailLog(log);
                                  setIsEmailModalOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0047AB] hover:text-white text-slate-700 font-semibold text-[11px] transition inline-flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Inspect</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Email Log Details Modal */}
        {isEmailModalOpen && selectedEmailLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-[#0A2540] text-white p-6 relative">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Mail className="w-4 h-4" />
                  <span>Transmitted to clearexpress555@gmail.com</span>
                </div>
                <h3 className="text-lg font-bold text-white pr-8">
                  {selectedEmailLog.subject}
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Recipient</span>
                    <span className="font-mono font-bold text-blue-700">{selectedEmailLog.recipient}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Timestamp</span>
                    <span className="font-mono text-slate-700">
                      {new Date(selectedEmailLog.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Event Category</span>
                    <span className="font-bold text-[#FF6B00]">{selectedEmailLog.eventType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Delivery Status</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {selectedEmailLog.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Dispatched Email Content:
                  </label>
                  <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-72 overflow-y-auto">
                    {selectedEmailLog.body}
                  </pre>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(false)}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition"
                  >
                    Close Log Viewer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
