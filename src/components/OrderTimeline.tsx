import React from 'react';
import { Order, OrderStatus, TrackingEvent } from '../../shared/types.ts';
import { Check, Clock, Truck, ShieldCheck, MapPin, Package, UserCheck, CheckCircle2 } from 'lucide-react';
import { COMPANY_CONTACT, CompanyContactButtons } from './CompanyContactButtons.tsx';

interface OrderTimelineProps {
  order: Order;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const steps = [
    {
      key: OrderStatus.PENDING,
      label: 'Order Created',
      icon: Package,
      desc: 'Order registered in Clear Express 555 database',
    },
    {
      key: OrderStatus.DRIVER_SEARCHING,
      label: 'Payment Confirmed',
      icon: ShieldCheck,
      desc: 'Payment received, searching closest Rwanda courier',
    },
    {
      key: OrderStatus.DRIVER_ASSIGNED,
      label: 'Driver Assigned',
      icon: UserCheck,
      desc: order.driverName ? `Assigned to ${order.driverName}` : 'Courier dispatched',
    },
    {
      key: OrderStatus.PACKAGE_PICKED_UP,
      label: 'Package Picked Up',
      icon: Truck,
      desc: 'Courier collected parcel from sender address',
    },
    {
      key: OrderStatus.IN_TRANSIT,
      label: 'In Transit',
      icon: MapPin,
      desc: 'Moving along active road route towards destination',
    },
    {
      key: OrderStatus.NEAR_DESTINATION,
      label: 'Near Destination',
      icon: Clock,
      desc: 'Driver within 1-2 km of delivery point',
    },
    {
      key: OrderStatus.DELIVERED,
      label: 'Delivered & Signed',
      icon: Check,
      desc: 'Verified by OTP and digital Proof of Delivery',
    },
  ];

  // Helper to determine step completion index
  const statusRank: Record<OrderStatus, number> = {
    [OrderStatus.PENDING]: 0,
    [OrderStatus.PAYMENT_PENDING]: 0,
    [OrderStatus.PAID]: 1,
    [OrderStatus.DRIVER_SEARCHING]: 1,
    [OrderStatus.DRIVER_ASSIGNED]: 2,
    [OrderStatus.DRIVER_AT_PICKUP]: 2,
    [OrderStatus.PACKAGE_PICKED_UP]: 3,
    [OrderStatus.IN_TRANSIT]: 4,
    [OrderStatus.NEAR_DESTINATION]: 5,
    [OrderStatus.DELIVERED]: 6,
    [OrderStatus.FAILED_DELIVERY]: -1,
    [OrderStatus.RETURNING]: 4,
    [OrderStatus.RETURNED]: -1,
    [OrderStatus.CANCELLED]: -1,
  };

  const currentRank = statusRank[order.status] ?? 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            Live Consignment Status
          </span>
          <h3 className="text-lg font-black text-[#0A2540] mt-0.5">
            {order.status.replace(/_/g, ' ')}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Tracking Code</span>
          <div className="font-mono font-bold text-sm text-[#0047AB]">
            {order.trackingNumber}
          </div>
        </div>
      </div>

      {/* Vertical Stepper with Connectors */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => {
          const isDone = currentRank >= idx;
          const isCurrent = currentRank === idx;
          const IconComponent = step.icon;

          // Find if there is an exact tracking event logged for this step
          const event = order.trackingEvents?.find((e) => e.status === step.key);

          return (
            <div key={step.key} className="relative flex items-start gap-4">
              {/* Step Circle Node */}
              <div
                className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isDone
                    ? 'bg-[#0047AB] border-[#0047AB] text-white shadow-md'
                    : isCurrent
                    ? 'bg-white border-[#FF6B00] text-[#FF6B00] ring-4 ring-orange-100 animate-pulse'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <IconComponent className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span
                    className={`font-bold text-sm ${
                      isCurrent ? 'text-[#FF6B00]' : isDone ? 'text-[#0A2540]' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {event?.timestamp && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(event.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    isDone || isCurrent ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {event?.description || step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety & OTP Notice */}
      {order.otpCode && order.status !== OrderStatus.DELIVERED && (
        <div className="mt-6 p-4 rounded-xl bg-orange-50/80 border border-orange-200/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-orange-950">Security OTP Code</div>
            <div className="text-xs text-orange-800">
              Share this 4-digit code with the courier only when receiving the package.
            </div>
          </div>
          <div className="px-3 py-1.5 bg-white border border-orange-300 rounded-lg font-mono font-black text-lg text-[#FF6B00] tracking-widest shadow-sm">
            {order.otpCode}
          </div>
        </div>
      )}

      {/* Delivery Confirmation Card */}
      {order.status === OrderStatus.DELIVERED && (
        <div className="mt-6 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded">
                Official Delivery Confirmation
              </span>
              <h4 className="text-base font-black text-emerald-950 mt-0.5">
                Consignment Successfully Delivered
              </h4>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Delivered To:</span>
              <span className="font-bold text-slate-900">{order.destination.contactName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivered At:</span>
              <span className="font-medium text-slate-900">
                {order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : 'Verified'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Security Verification:</span>
              <span className="font-mono text-emerald-700 font-bold">OTP + Digital Signature</span>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200 space-y-2">
            <div className="text-xs font-bold text-emerald-950">
              Delivery Support & Confirmation Inquiries:
            </div>
            <p className="text-[11px] text-emerald-800">
              Need assistance regarding this completed delivery? Clear Express 555 support is available 24/7:
            </p>
            <CompanyContactButtons idPrefix="timeline-delivered" layout="col" variant="compact" />
          </div>
        </div>
      )}

      {/* In-Transit Support Card */}
      {order.status !== OrderStatus.DELIVERED && (
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
          <div className="text-xs font-bold text-slate-700">Questions About This Delivery?</div>
          <p className="text-[11px] text-slate-500">
            Contact Clear Express 555 operations dispatch hotline anytime:
          </p>
          <CompanyContactButtons idPrefix="timeline-support" layout="col" variant="compact" />
        </div>
      )}
    </div>
  );
};
