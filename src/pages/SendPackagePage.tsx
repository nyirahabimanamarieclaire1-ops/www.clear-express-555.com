import React, { useState, useEffect } from 'react';
import {
  Coordinates,
  DeliverySpeed,
  PackageType,
  PaymentMethod,
  VehicleType,
} from '../../shared/types.ts';
import { InteractiveMap } from '../components/InteractiveMap.tsx';
import { RWANDA_LOCATIONS } from '../../server/services/maps.ts';
import {
  Package,
  FileText,
  Truck,
  Car,
  Zap,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  Phone,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Headphones,
} from 'lucide-react';
import { COMPANY_CONTACT, CompanyContactButtons } from '../components/CompanyContactButtons.tsx';

interface SendPackagePageProps {
  onOrderCreated: (trackingNumber: string) => void;
}

export const SendPackagePage: React.FC<SendPackagePageProps> = ({ onOrderCreated }) => {
  // 1. Sender Details
  const [customerName, setCustomerName] = useState('Aline Uwase');
  const [customerPhone, setCustomerPhone] = useState('0788123456');
  const [customerEmail, setCustomerEmail] = useState('aline.uwase@gmail.com');

  // 2. Pickup & Destination Coordinates & Street
  const [pickupPreset, setPickupPreset] = useState('KIGALI_CBD');
  const [destPreset, setDestPreset] = useState('KIMIRONKO');

  const [pickupStreet, setPickupStreet] = useState('KN 3 Ave, Nyarugenge');
  const [pickupCoords, setPickupCoords] = useState<Coordinates>({
    lat: RWANDA_LOCATIONS.KIGALI_CBD.lat,
    lng: RWANDA_LOCATIONS.KIGALI_CBD.lng,
  });

  const [destRecipient, setDestRecipient] = useState('Jean-Pierre Habimana');
  const [destPhone, setDestPhone] = useState('0788987654');
  const [destStreet, setDestStreet] = useState('KG 11 Ave, Kimironko');
  const [destCoords, setDestCoords] = useState<Coordinates>({
    lat: RWANDA_LOCATIONS.KIMIRONKO.lat,
    lng: RWANDA_LOCATIONS.KIMIRONKO.lng,
  });

  // 3. Package Info
  const [packageType, setPackageType] = useState<PackageType>(PackageType.SMALL);
  const [weightKg, setWeightKg] = useState(2.5);
  const [description, setDescription] = useState('Electronics & accessories package');
  const [isFragile, setIsFragile] = useState(false);

  // 4. Vehicle & Delivery Speed
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.MOTORCYCLE);
  const [speed, setSpeed] = useState<DeliverySpeed>(DeliverySpeed.STANDARD);

  // 5. Payment Choice
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MOBILE_MONEY);
  const [momoNumber, setMomoNumber] = useState('0788123456');

  // 6. Live Distance & Pricing State
  const [calculatedDistance, setCalculatedDistance] = useState(8.6);
  const [estimatedMinutes, setEstimatedMinutes] = useState(22);
  const [routeGeometry, setRouteGeometry] = useState<any[]>([]);
  const [pricingBreakdown, setPricingBreakdown] = useState<any>({
    baseFee: 1000,
    distanceKm: 8.6,
    pricePerKm: 200,
    distanceFee: 1720,
    packageFee: 500,
    vehicleFee: 0,
    expressFee: 0,
    zoneFee: 0,
    total: 3220,
    currency: 'RWF',
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto calculate road distance when coordinates or vehicle changes
  useEffect(() => {
    let isCurrent = true;

    async function compute() {
      setIsCalculating(true);
      try {
        const distRes = await fetch('/api/distance/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pickupLat: pickupCoords.lat,
            pickupLng: pickupCoords.lng,
            destLat: destCoords.lat,
            destLng: destCoords.lng,
            vehicleType,
          }),
        });

        if (!distRes.ok) throw new Error('Failed to compute distance');
        const distData = await distRes.json();

        if (isCurrent) {
          setCalculatedDistance(distData.distanceKm);
          setEstimatedMinutes(distData.estimatedMinutes);
          setRouteGeometry(distData.routeGeometry || []);
        }

        // Compute price with returned distance
        const priceRes = await fetch('/api/pricing/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            distanceKm: distData.distanceKm,
            vehicleType,
            packageType,
            speed,
            isFragile,
          }),
        });

        if (!priceRes.ok) throw new Error('Failed to compute price');
        const priceData = await priceRes.json();

        if (isCurrent) {
          setPricingBreakdown(priceData);
        }
      } catch (err) {
        console.error('Calculation error:', err);
      } finally {
        if (isCurrent) setIsCalculating(false);
      }
    }

    compute();

    return () => {
      isCurrent = false;
    };
  }, [pickupCoords, destCoords, vehicleType, packageType, speed, isFragile]);

  const handlePickupPresetChange = (presetKey: string) => {
    setPickupPreset(presetKey);
    const loc = RWANDA_LOCATIONS[presetKey as keyof typeof RWANDA_LOCATIONS];
    if (loc) {
      setPickupCoords({ lat: loc.lat, lng: loc.lng });
      setPickupStreet(`${loc.name}, Rwanda`);
    }
  };

  const handleDestPresetChange = (presetKey: string) => {
    setDestPreset(presetKey);
    const loc = RWANDA_LOCATIONS[presetKey as keyof typeof RWANDA_LOCATIONS];
    if (loc) {
      setDestCoords({ lat: loc.lat, lng: loc.lng });
      setDestStreet(`${loc.name}, Rwanda`);
    }
  };

  const handleMapCoordSelect = (coords: Coordinates, type: 'pickup' | 'destination') => {
    if (type === 'pickup') {
      setPickupCoords(coords);
      setPickupStreet(`Custom Coordinate: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
    } else {
      setDestCoords(coords);
      setDestStreet(`Custom Coordinate: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const payload = {
        customerName,
        customerPhone,
        customerEmail,
        pickup: {
          street: pickupStreet,
          city: 'Kigali',
          lat: pickupCoords.lat,
          lng: pickupCoords.lng,
          contactName: customerName,
          contactPhone: customerPhone,
        },
        destination: {
          street: destStreet,
          city: 'Kigali',
          lat: destCoords.lat,
          lng: destCoords.lng,
          contactName: destRecipient,
          contactPhone: destPhone,
        },
        packageDetails: {
          type: packageType,
          weightKg,
          description,
          isFragile,
        },
        vehicleType,
        speed,
        paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await res.json();

      // If Mobile money, trigger automatic payment simulation
      if (paymentMethod === PaymentMethod.MOBILE_MONEY) {
        await fetch('/api/payments/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            amount: order.pricing.total,
            method: paymentMethod,
            phoneNumber: momoNumber,
          }),
        });
      }

      onOrderCreated(order.trackingNumber);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Clear Express 555</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#0047AB]">Book a Delivery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A2540]">
            Send a Package in Rwanda
          </h1>
          <p className="text-sm text-slate-600">
            Real road distance routing, automated dynamic pricing, and immediate courier dispatch.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 7 Columns: Delivery Input Steps */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: SENDER & RECIPIENT */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0047AB] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h2 className="font-bold text-base text-[#0A2540]">Customer Contact Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sender Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sender Phone (Rwanda) *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Email (For Invoices & Updates)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: PICKUP & DESTINATION LOCATIONS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="font-bold text-base text-[#0A2540]">Pickup & Destination (Rwanda)</h2>
              </div>

              {/* Pickup Address */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Pickup Location (Where should we collect?)</span>
                  </div>
                  <select
                    value={pickupPreset}
                    onChange={(e) => handlePickupPresetChange(e.target.value)}
                    className="px-2.5 py-1 text-xs bg-white border border-emerald-300 rounded-lg text-emerald-900 font-semibold focus:outline-none"
                  >
                    {Object.entries(RWANDA_LOCATIONS).map(([key, loc]) => (
                      <option key={key} value={key}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  required
                  value={pickupStreet}
                  onChange={(e) => setPickupStreet(e.target.value)}
                  placeholder="Street / building / landmark name"
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Destination Address */}
              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-orange-950 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#FF6B00]" />
                    <span>Destination (Where is it going?)</span>
                  </div>
                  <select
                    value={destPreset}
                    onChange={(e) => handleDestPresetChange(e.target.value)}
                    className="px-2.5 py-1 text-xs bg-white border border-orange-300 rounded-lg text-orange-950 font-semibold focus:outline-none"
                  >
                    {Object.entries(RWANDA_LOCATIONS).map(([key, loc]) => (
                      <option key={key} value={key}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  required
                  value={destStreet}
                  onChange={(e) => setDestStreet(e.target.value)}
                  placeholder="Street / house / office number"
                  className="w-full px-3 py-2 bg-white border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={destRecipient}
                      onChange={(e) => setDestRecipient(e.target.value)}
                      placeholder="Receiver name"
                      className="w-full px-3 py-1.5 bg-white border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Recipient Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={destPhone}
                      onChange={(e) => setDestPhone(e.target.value)}
                      placeholder="078... for SMS alerts"
                      className="w-full px-3 py-1.5 bg-white border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Rwanda Map Coordinate Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    Live Rwanda Road Topology Preview
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Click map to pinpoint custom coordinates
                  </span>
                </div>
                <InteractiveMap
                  pickup={pickupCoords}
                  destination={destCoords}
                  routeGeometry={routeGeometry}
                  interactiveSelect={true}
                  onSelectCoordinates={handleMapCoordSelect}
                  height="260px"
                />
              </div>
            </div>

            {/* STEP 3: PACKAGE DETAILS & VEHICLE */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h2 className="font-bold text-base text-[#0A2540]">Package & Vehicle Selection</h2>
              </div>

              {/* Package Type Pills */}
              <div className="space-y-2">
                <label className="block font-bold text-xs text-slate-700">Package Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { type: PackageType.DOCUMENT, label: 'Document', sub: 'Passports, tenders' },
                    { type: PackageType.SMALL, label: 'Small Parcel', sub: 'Up to 5 kg' },
                    { type: PackageType.MEDIUM, label: 'Medium Box', sub: '5 – 15 kg' },
                    { type: PackageType.LARGE, label: 'Large / Cargo', sub: '15+ kg' },
                  ].map((p) => (
                    <button
                      key={p.type}
                      type="button"
                      onClick={() => setPackageType(p.type)}
                      className={`p-3 rounded-xl border text-left transition ${
                        packageType === p.type
                          ? 'border-[#0047AB] bg-blue-50/70 text-[#0047AB] ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold">{p.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{p.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Package Weight & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Est. Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Description of Contents *
                  </label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Spare automotive parts, laptop, contract files"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>

              {/* Fragile Checkbox */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isFragile}
                  onChange={(e) => setIsFragile(e.target.checked)}
                  className="rounded text-[#FF6B00] focus:ring-[#FF6B00] w-4 h-4"
                />
                <span>Package contains fragile / delicate items (+500 RWF handling)</span>
              </label>

              {/* Vehicle Options */}
              <div className="space-y-2 pt-2">
                <label className="block font-bold text-xs text-slate-700">
                  Select Dispatch Vehicle
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setVehicleType(VehicleType.MOTORCYCLE)}
                    className={`p-3.5 rounded-xl border text-center transition ${
                      vehicleType === VehicleType.MOTORCYCLE
                        ? 'border-[#FF6B00] bg-orange-50/70 text-orange-950 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Truck className="w-6 h-6 mx-auto text-[#0047AB] mb-1" />
                    <div className="font-bold">Motorcycle</div>
                    <div className="text-[10px] text-slate-500">Fastest in Kigali traffic</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType(VehicleType.CAR)}
                    className={`p-3.5 rounded-xl border text-center transition ${
                      vehicleType === VehicleType.CAR
                        ? 'border-[#FF6B00] bg-orange-50/70 text-orange-950 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Car className="w-6 h-6 mx-auto text-[#0047AB] mb-1" />
                    <div className="font-bold">Car / Salon</div>
                    <div className="text-[10px] text-slate-500">Weather-protected parcels</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType(VehicleType.VAN)}
                    className={`p-3.5 rounded-xl border text-center transition ${
                      vehicleType === VehicleType.VAN
                        ? 'border-[#FF6B00] bg-orange-50/70 text-orange-950 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Truck className="w-6 h-6 mx-auto text-[#0047AB] mb-1" />
                    <div className="font-bold">Van / Pickup</div>
                    <div className="text-[10px] text-slate-500">Heavy cargo & cartons</div>
                  </button>
                </div>
              </div>

              {/* Delivery Speed */}
              <div className="space-y-2 pt-2">
                <label className="block font-bold text-xs text-slate-700">Delivery Speed</label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setSpeed(DeliverySpeed.STANDARD)}
                    className={`p-3 rounded-xl border text-left transition ${
                      speed === DeliverySpeed.STANDARD
                        ? 'border-[#0047AB] bg-blue-50/70 text-[#0047AB]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Standard Delivery</span>
                      <span className="text-[10px] text-slate-500">Regular fee</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Same-day within 2-4 hours</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSpeed(DeliverySpeed.EXPRESS)}
                    className={`p-3 rounded-xl border text-left transition ${
                      speed === DeliverySpeed.EXPRESS
                        ? 'border-[#FF6B00] bg-orange-50/70 text-orange-950 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[#FF6B00]">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Express Direct</span>
                      </span>
                      <span className="text-[10px] font-bold text-[#FF6B00]">+1,000 RWF</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Immediate courier pickup &lt; 45 mins
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 4: PAYMENT SELECTION */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <h2 className="font-bold text-base text-[#0A2540]">Select Payment Method</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  {
                    method: PaymentMethod.MOBILE_MONEY,
                    title: 'Mobile Money',
                    desc: 'MTN MoMo / Airtel',
                  },
                  { method: PaymentMethod.CARD, title: 'Card', desc: 'Visa / Mastercard' },
                  {
                    method: PaymentMethod.CASH_ON_DELIVERY,
                    title: 'Cash On Delivery',
                    desc: 'Pay courier at door',
                  },
                  {
                    method: PaymentMethod.BUSINESS_ACCOUNT,
                    title: 'Business Account',
                    desc: 'Monthly invoice',
                  },
                ].map((pm) => (
                  <button
                    key={pm.method}
                    type="button"
                    onClick={() => setPaymentMethod(pm.method)}
                    className={`p-3 rounded-xl border text-left transition ${
                      paymentMethod === pm.method
                        ? 'border-[#0047AB] bg-blue-50 text-[#0047AB] font-bold ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold">{pm.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{pm.desc}</div>
                  </button>
                ))}
              </div>

              {paymentMethod === PaymentMethod.MOBILE_MONEY && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <Phone className="w-4 h-4 text-amber-700" />
                    <span>Rwanda Mobile Money Number for USSD Prompt</span>
                  </div>
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="e.g. 0788123456"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg font-mono font-bold text-slate-800"
                  />
                  <div className="text-[11px] text-amber-800">
                    A secure push prompt will be simulated to confirm RWF{' '}
                    {pricingBreakdown.total?.toLocaleString()}.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right 5 Columns: Sticky Order Summary & Price Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                    Clear Express 555
                  </span>
                  <h3 className="text-xl font-black text-[#0A2540]">Order Summary</h3>
                </div>
                {isCalculating && (
                  <span className="text-xs text-blue-600 animate-pulse font-medium">
                    Calculating...
                  </span>
                )}
              </div>

              {/* Road Route Metrics */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block">Road Distance</span>
                  <span className="text-lg font-black text-[#0A2540]">{calculatedDistance} km</span>
                  <span className="text-[10px] text-slate-500 block">Actual topography</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Estimated Time</span>
                  <span className="text-lg font-black text-[#FF6B00]">
                    ~{estimatedMinutes} mins
                  </span>
                  <span className="text-[10px] text-slate-500 block">Kigali road traffic</span>
                </div>
              </div>

              {/* Route Summary */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700">Pickup Address</span>
                    <p className="text-slate-500">{pickupStreet}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700">Destination</span>
                    <p className="text-slate-500">
                      {destStreet} (Attn: {destRecipient})
                    </p>
                  </div>
                </div>
              </div>

              {/* Itemized Price Breakdown Table */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Base Booking & Courier Dispatch</span>
                  <span className="font-mono font-medium">
                    {pricingBreakdown.baseFee?.toLocaleString()} RWF
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>
                    Distance Fee ({calculatedDistance} km @ {pricingBreakdown.pricePerKm} RWF/km)
                  </span>
                  <span className="font-mono font-medium">
                    {pricingBreakdown.distanceFee?.toLocaleString()} RWF
                  </span>
                </div>

                {pricingBreakdown.packageFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Package Weight Tier Fee</span>
                    <span className="font-mono font-medium">
                      +{pricingBreakdown.packageFee?.toLocaleString()} RWF
                    </span>
                  </div>
                )}

                {pricingBreakdown.vehicleFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Vehicle Upgrade</span>
                    <span className="font-mono font-medium">
                      +{pricingBreakdown.vehicleFee?.toLocaleString()} RWF
                    </span>
                  </div>
                )}

                {pricingBreakdown.expressFee > 0 && (
                  <div className="flex items-center justify-between text-[#FF6B00]">
                    <span>Priority Express Direct</span>
                    <span className="font-mono font-bold">
                      +{pricingBreakdown.expressFee?.toLocaleString()} RWF
                    </span>
                  </div>
                )}

                {pricingBreakdown.optionalExtraServices > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Fragile Goods Protection</span>
                    <span className="font-mono font-medium">
                      +{pricingBreakdown.optionalExtraServices?.toLocaleString()} RWF
                    </span>
                  </div>
                )}

                {/* Total Line */}
                <div className="border-t-2 border-slate-900 pt-3 flex items-center justify-between text-base">
                  <span className="font-black text-slate-900">Total Delivery Price</span>
                  <span className="font-mono font-black text-xl text-[#0047AB]">
                    RWF {pricingBreakdown.total?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-orange-600 hover:to-orange-700 text-white font-black text-base shadow-xl shadow-orange-500/20 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>DISPATCHING COURIER...</span>
                ) : (
                  <>
                    <span>CONFIRM & BOOK DELIVERY</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted Rwanda Transaction • 100% Guaranteed Delivery</span>
              </div>

              {/* Instant Booking Support Card */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0A2540]">
                  <Headphones className="w-4 h-4 text-[#FF6B00]" />
                  <span>Need Dispatch Assistance?</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Call or WhatsApp our Kigali dispatch controller directly for custom cargo or priority assistance:
                </p>
                <CompanyContactButtons idPrefix="send-sidebar" layout="col" variant="compact" />
              </div>
            </div>
          </div>
        </form>

        {/* Dedicated Bottom Customer Support Card */}
        <div className="pt-8 border-t border-slate-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                CLEAR EXPRESS 555 Dispatch Desk
              </span>
              <h3 className="text-xl font-black text-[#0A2540]">
                Have Special Cargo or Urgent Inquiries?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our support team is available 24/7 across Rwanda. Connect directly with our dispatch supervisors:
              </p>
              <div className="text-xs font-semibold text-slate-500">
                Phone / WhatsApp: <strong className="text-slate-800">{COMPANY_CONTACT.phone}</strong> • Email: <strong className="text-slate-800">{COMPANY_CONTACT.email}</strong>
              </div>
            </div>
            <CompanyContactButtons idPrefix="send-bottom" layout="col" variant="default" />
          </div>
        </div>
      </div>
    </div>
  );
};
