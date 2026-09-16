import React, { useState, useEffect } from 'react';
import { DriverStatus, Order, OrderStatus, VehicleType } from '../../shared/types.ts';
import { InteractiveMap } from '../components/InteractiveMap.tsx';
import { ProofOfDeliveryModal } from '../components/ProofOfDeliveryModal.tsx';
import {
  Truck,
  Power,
  MapPin,
  CheckCircle2,
  Navigation,
  Clock,
  Phone,
  ShieldCheck,
  CreditCard,
  DollarSign,
  AlertCircle,
  Camera,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface DriverDashboardProps {
  onQuickTrack: (trackingNumber: string) => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({ onQuickTrack }) => {
  const [driver, setDriver] = useState<any>({
    id: 'drv_1',
    name: 'Eric Kwizera',
    phone: '0788111222',
    status: DriverStatus.ONLINE,
    vehicleType: VehicleType.MOTORCYCLE,
    plateNumber: 'RAB 555 A',
    rating: 4.9,
    todayEarnings: 18400,
    todayDeliveries: 6,
    todayKm: 42.5,
  });

  const [activeTab, setActiveTab] = useState<'DELIVERIES' | 'MAP' | 'EARNINGS' | 'PROFILE'>('DELIVERIES');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Fetch orders
  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const allOrders: Order[] = await res.json();
        // Look for order assigned to this driver
        const assigned = allOrders.find(
          (o) =>
            o.driverId === driver.id &&
            o.status !== OrderStatus.DELIVERED &&
            o.status !== OrderStatus.CANCELLED
        );
        setActiveOrder(assigned || null);

        // Look for orders searching for driver
        const pool = allOrders.filter((o) => o.status === OrderStatus.DRIVER_SEARCHING);
        setPendingOrders(pool);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, [driver.id]);

  // Toggle online status
  const handleToggleOnline = async () => {
    const newStatus =
      driver.status === DriverStatus.OFFLINE ? DriverStatus.ONLINE : DriverStatus.OFFLINE;
    try {
      const res = await fetch(`/api/drivers/${driver.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setDriver({ ...driver, status: updated.status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Accept an incoming order
  const handleAcceptOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/drivers/${driver.id}/accept-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveOrder(data.order);
        setDriver(data.driver);
        setStatusMessage('Order accepted! Proceed to pickup location.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update order status step
  const handleUpdateStep = async (nextStatus: OrderStatus, notes?: string) => {
    if (!activeOrder) return;
    try {
      const res = await fetch(`/api/orders/${activeOrder.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, driverId: driver.id, notes }),
      });
      if (res.ok) {
        const updated = await res.json();
        setActiveOrder(updated);
        setStatusMessage(`Status updated to: ${nextStatus.replace(/_/g, ' ')}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Proof of Delivery (Section 14)
  const handleCompleteDelivery = async (podData: any) => {
    if (!activeOrder) return;
    const res = await fetch('/api/drivers/proof-of-delivery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: activeOrder.id,
        driverId: driver.id,
        ...podData,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to verify POD');
    }

    const data = await res.json();
    setActiveOrder(null);
    setDriver((prev: any) => ({
      ...prev,
      todayDeliveries: prev.todayDeliveries + 1,
      todayEarnings: prev.todayEarnings + activeOrder.pricing.total * 0.7,
      todayKm: prev.todayKm + activeOrder.distanceKm,
    }));
    setStatusMessage('Delivery successfully finished! POD logged.');
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-24 sm:py-8 flex justify-center">
      {/* Smartphone Shell Frame (Responsive) */}
      <div className="w-full max-w-md bg-white sm:rounded-3xl sm:border sm:border-slate-300 sm:shadow-2xl overflow-hidden flex flex-col min-h-screen sm:min-h-[850px]">
        {/* Top Driver Header */}
        <div className="bg-[#0A2540] text-white p-5 pt-7 sm:pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center font-black text-emerald-400">
                EK
              </div>
              <div>
                <div className="font-bold text-sm">{driver.name}</div>
                <div className="text-[11px] text-slate-300 font-mono">
                  {driver.plateNumber} • {driver.vehicleType}
                </div>
              </div>
            </div>

            {/* Online / Offline Toggle Button */}
            <button
              type="button"
              onClick={handleToggleOnline}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow ${
                driver.status === DriverStatus.ONLINE || driver.status === DriverStatus.BUSY
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{driver.status === DriverStatus.OFFLINE ? 'OFFLINE' : 'ONLINE'}</span>
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="p-2 rounded-xl bg-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Deliveries</span>
              <span className="text-base font-black text-white">{driver.todayDeliveries}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Distance</span>
              <span className="text-base font-black text-[#FBBF24]">{driver.todayKm.toFixed(1)} km</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Earnings</span>
              <span className="text-base font-black text-emerald-400">
                RWF {Math.round(driver.todayEarnings).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs px-4 py-2 flex items-center justify-between">
            <span>{statusMessage}</span>
            <button
              type="button"
              onClick={() => setStatusMessage('')}
              className="text-emerald-600 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Main Content Area Based on Tab */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {activeTab === 'DELIVERIES' && (
            <>
              {/* If courier has an ACTIVE in-progress order */}
              {activeOrder ? (
                <div className="bg-white rounded-2xl p-5 border-2 border-[#0047AB] shadow-lg space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0047AB] font-mono font-bold text-xs">
                      {activeOrder.trackingNumber}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      Payout: RWF {Math.round(activeOrder.pricing.total * 0.7).toLocaleString()}
                    </span>
                  </div>

                  {/* Route points */}
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>PICKUP: {activeOrder.pickup.street}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        Contact: {activeOrder.customerName} ({activeOrder.customerPhone})
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                      <div className="font-bold text-orange-950 flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-[#FF6B00]" />
                        <span>DESTINATION: {activeOrder.destination.street}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        Recipient: {activeOrder.destination.contactName} ({activeOrder.destination.contactPhone})
                      </div>
                    </div>
                  </div>

                  {/* Progressive Courier Workflow Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Current Step: {activeOrder.status.replace(/_/g, ' ')}
                    </div>

                    {activeOrder.status === OrderStatus.DRIVER_ASSIGNED && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStep(OrderStatus.DRIVER_AT_PICKUP)}
                        className="w-full py-3 rounded-xl bg-[#0047AB] hover:bg-blue-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>ARRIVED AT SENDER PICKUP</span>
                      </button>
                    )}

                    {activeOrder.status === OrderStatus.DRIVER_AT_PICKUP && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStep(OrderStatus.PACKAGE_PICKED_UP)}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>CONFIRM PACKAGE COLLECTED</span>
                      </button>
                    )}

                    {activeOrder.status === OrderStatus.PACKAGE_PICKED_UP && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStep(OrderStatus.IN_TRANSIT)}
                        className="w-full py-3 rounded-xl bg-[#0047AB] hover:bg-blue-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>START ROUTE TO DESTINATION</span>
                      </button>
                    )}

                    {activeOrder.status === OrderStatus.IN_TRANSIT && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStep(OrderStatus.NEAR_DESTINATION)}
                        className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        <span>I AM NEAR DESTINATION (1 KM AWAY)</span>
                      </button>
                    )}

                    {activeOrder.status === OrderStatus.NEAR_DESTINATION && (
                      <button
                        type="button"
                        onClick={() => setIsPodModalOpen(true)}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        <span>RECORD PROOF OF DELIVERY (POD)</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* No active delivery, show pending requests */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                    <span>Available Dispatches in Kigali</span>
                    <span className="text-emerald-600">({pendingOrders.length} New)</span>
                  </div>

                  {pendingOrders.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 space-y-2">
                      <Truck className="w-10 h-10 text-slate-300 mx-auto" />
                      <div className="font-bold text-xs text-slate-700">Waiting for New Dispatches</div>
                      <p className="text-[11px] text-slate-400">
                        Stay online with GPS enabled. When a customer books a package in your zone, it will ping here.
                      </p>
                    </div>
                  ) : (
                    pendingOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-[#0047AB]">
                            {ord.trackingNumber}
                          </span>
                          <span className="font-bold text-sm text-emerald-600">
                            RWF {Math.round(ord.pricing.total * 0.7).toLocaleString()}
                          </span>
                        </div>

                        <div className="text-xs space-y-1 text-slate-600">
                          <div>
                            <strong>Pickup:</strong> {ord.pickup.street}
                          </div>
                          <div>
                            <strong>Dropoff:</strong> {ord.destination.street}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {ord.distanceKm} km • ~{ord.estimatedMinutes} mins • {ord.package.type}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleAcceptOrder(ord.id)}
                            className="flex-1 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition"
                          >
                            ACCEPT DELIVERY
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'MAP' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700">Kigali Road Turn-By-Turn Preview</div>
              <InteractiveMap
                pickup={activeOrder?.pickup}
                destination={activeOrder?.destination}
                routeGeometry={activeOrder?.routeGeometry}
                driverLocation={activeOrder ? undefined : { lat: -1.9441, lng: 30.0619 }}
                driverName={driver.name}
                height="450px"
              />
            </div>
          )}

          {activeTab === 'EARNINGS' && (
            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-2">
                <span className="text-emerald-800 font-bold uppercase tracking-wider text-[10px]">
                  Total Accumulated Balance
                </span>
                <div className="text-2xl font-black text-emerald-950 font-mono">
                  RWF {Math.round(driver.todayEarnings).toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-700">
                  Direct daily MoMo settlement at 7:00 PM
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-[#0A2540]">Recent Completed Jobs</h4>
                <div className="divide-y divide-slate-100">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold">Kigali CBD ➔ Kimironko</div>
                      <div className="text-[10px] text-slate-400">8.6 km • Motorcycle Express</div>
                    </div>
                    <span className="font-bold text-emerald-600">+RWF 2,954</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold">Nyarutarama ➔ Kicukiro</div>
                      <div className="text-[10px] text-slate-400">7.2 km • Small Parcel</div>
                    </div>
                    <span className="font-bold text-emerald-600">+RWF 2,240</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PROFILE' && (
            <div className="space-y-4 text-xs">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-[#0A2540]">Courier Verification</h4>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>National ID Status:</span>
                    <strong className="text-emerald-600">VERIFIED RURA</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Driving License:</span>
                    <strong className="text-slate-900">Valid Cat. A (Motorcycle)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Plate Number:</span>
                    <strong className="font-mono text-slate-900">RAB 555 A</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Safety Rating:</span>
                    <strong className="text-amber-600">★ 4.9 / 5.0</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Smartphone Bottom Navigation Bar */}
        <div className="border-t border-slate-200 bg-white px-2 py-2 flex items-center justify-around text-slate-500">
          <button
            type="button"
            onClick={() => setActiveTab('DELIVERIES')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold p-1 transition ${
              activeTab === 'DELIVERIES' ? 'text-[#0047AB]' : 'hover:text-slate-800'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span>Deliveries</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MAP')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold p-1 transition ${
              activeTab === 'MAP' ? 'text-[#0047AB]' : 'hover:text-slate-800'
            }`}
          >
            <Navigation className="w-5 h-5" />
            <span>Road Map</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('EARNINGS')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold p-1 transition ${
              activeTab === 'EARNINGS' ? 'text-[#0047AB]' : 'hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Earnings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PROFILE')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold p-1 transition ${
              activeTab === 'PROFILE' ? 'text-[#0047AB]' : 'hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>

        {/* Proof of Delivery Modal Triggered by Courier */}
        {activeOrder && (
          <ProofOfDeliveryModal
            order={activeOrder}
            isOpen={isPodModalOpen}
            onClose={() => setIsPodModalOpen(false)}
            onComplete={handleCompleteDelivery}
          />
        )}
      </div>
    </div>
  );
};
