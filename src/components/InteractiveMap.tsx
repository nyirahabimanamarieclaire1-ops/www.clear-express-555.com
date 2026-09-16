import React, { useState, useEffect, useRef } from 'react';
import { Coordinates, RouteGeometryPoint, VehicleType } from '../../shared/types.ts';
import { Navigation, MapPin, Truck, ZoomIn, ZoomOut, Compass, RefreshCw } from 'lucide-react';
import { RWANDA_LOCATIONS } from '../../server/services/maps.ts';

interface InteractiveMapProps {
  pickup?: Coordinates;
  destination?: Coordinates;
  routeGeometry?: RouteGeometryPoint[];
  driverLocation?: Coordinates;
  driverVehicle?: VehicleType;
  driverName?: string;
  driverSpeed?: number;
  height?: string;
  interactiveSelect?: boolean;
  onSelectCoordinates?: (coords: Coordinates, type: 'pickup' | 'destination') => void;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  pickup,
  destination,
  routeGeometry = [],
  driverLocation,
  driverVehicle = VehicleType.MOTORCYCLE,
  driverName,
  driverSpeed = 35,
  height = '420px',
  interactiveSelect = false,
  onSelectCoordinates,
  className = '',
}) => {
  const [zoom, setZoom] = useState(1);
  const [activeSelectType, setActiveSelectType] = useState<'pickup' | 'destination'>('pickup');
  const [simulatedProgress, setSimulatedProgress] = useState(0.4);
  const [isSimulating, setIsSimulating] = useState(true);

  // SVG coordinate transformation centered on Rwanda (approx Lat: -1.94, Lng: 30.06 for Kigali)
  // Mapping Lat [-2.8 to -1.3] and Lng [29.2 to 30.8]
  const minLat = -2.7;
  const maxLat = -1.4;
  const minLng = 29.2;
  const maxLng = 30.8;

  // If both pickup and destination are in Kigali (approx Lat [-2.02, -1.90], Lng [30.00, 30.18]), zoom closer!
  const isKigaliFocus =
    pickup &&
    destination &&
    Math.abs(pickup.lat - -1.95) < 0.15 &&
    Math.abs(destination.lat - -1.95) < 0.15;

  const latRange = isKigaliFocus ? 0.12 : maxLat - minLat;
  const lngRange = isKigaliFocus ? 0.16 : maxLng - minLng;
  const centerLat = isKigaliFocus ? -1.95 : (minLat + maxLat) / 2;
  const centerLng = isKigaliFocus ? 30.09 : (minLng + maxLng) / 2;

  const toMapX = (lng: number) => {
    const fraction = (lng - (centerLng - lngRange / 2)) / lngRange;
    return Math.max(20, Math.min(780, fraction * 800));
  };

  const toMapY = (lat: number) => {
    // Latitude is inverted in SVG Y
    const fraction = (maxLat - lat) / latRange;
    if (isKigaliFocus) {
      const kFraction = (centerLat + latRange / 2 - lat) / latRange;
      return Math.max(20, Math.min(580, kFraction * 600));
    }
    return Math.max(20, Math.min(580, fraction * 600));
  };

  // Build SVG path from route geometry
  const pathD = React.useMemo(() => {
    if (!routeGeometry || routeGeometry.length < 2) {
      if (pickup && destination) {
        return `M ${toMapX(pickup.lng)} ${toMapY(pickup.lat)} L ${toMapX(destination.lng)} ${toMapY(destination.lat)}`;
      }
      return '';
    }

    return routeGeometry.reduce((acc, pt, index) => {
      const x = toMapX(pt.lng);
      const y = toMapY(pt.lat);
      return index === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }, [routeGeometry, pickup, destination, isKigaliFocus]);

  // Simulated live driver coordinate if no explicit live driver given
  useEffect(() => {
    if (!isSimulating || !routeGeometry || routeGeometry.length === 0) return;

    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        const next = prev + 0.015;
        return next > 0.95 ? 0.05 : next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating, routeGeometry]);

  const activeDriverPoint = React.useMemo(() => {
    if (driverLocation) return driverLocation;
    if (routeGeometry && routeGeometry.length > 2) {
      const idx = Math.floor(simulatedProgress * (routeGeometry.length - 1));
      return routeGeometry[idx];
    }
    if (pickup && destination) {
      return {
        lat: pickup.lat + (destination.lat - pickup.lat) * simulatedProgress,
        lng: pickup.lng + (destination.lng - pickup.lng) * simulatedProgress,
      };
    }
    return null;
  }, [driverLocation, routeGeometry, simulatedProgress, pickup, destination]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-700 bg-[#0c1829] shadow-xl ${className}`}
      style={{ height }}
    >
      {/* Map Control HUD Overlay */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Clear Express GPS Network (Rwanda)</span>
        </div>

        {interactiveSelect && (
          <div className="flex rounded-xl bg-slate-900/90 p-0.5 border border-slate-700 shadow-md">
            <button
              type="button"
              onClick={() => setActiveSelectType('pickup')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                activeSelectType === 'pickup'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Set Pickup
            </button>
            <button
              type="button"
              onClick={() => setActiveSelectType('destination')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                activeSelectType === 'destination'
                  ? 'bg-[#FF6B00] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Set Destination
            </button>
          </div>
        )}
      </div>

      {/* Preset Rwanda Hub Buttons */}
      {interactiveSelect && (
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900/80 px-2 py-1 rounded-md">
            Quick Hubs:
          </span>
          {Object.entries(RWANDA_LOCATIONS).slice(0, 6).map(([key, loc]) => (
            <button
              key={key}
              type="button"
              onClick={() => onSelectCoordinates?.({ lat: loc.lat, lng: loc.lng }, activeSelectType)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium whitespace-nowrap shadow transition"
            >
              {loc.name.split(' (')[0]}
            </button>
          ))}
        </div>
      )}

      {/* SVG Canvas Map */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full select-none cursor-crosshair"
        onClick={(e) => {
          if (!interactiveSelect || !onSelectCoordinates) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = ((e.clientX - rect.left) / rect.width) * 800;
          const clickY = ((e.clientY - rect.top) / rect.height) * 600;

          // Inverse map
          const lng = (clickX / 800) * lngRange + (centerLng - lngRange / 2);
          const lat = isKigaliFocus
            ? centerLat + latRange / 2 - (clickY / 600) * latRange
            : maxLat - (clickY / 600) * latRange;

          onSelectCoordinates({ lat, lng }, activeSelectType);
        }}
      >
        {/* Background Grid Lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#162740" strokeWidth="0.8" />
          </pattern>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect width="800" height="600" fill="#0A1626" />
        <rect width="800" height="600" fill="url(#grid)" />

        {/* Rwanda Boundary & Major Arterial Roads */}
        <g stroke="#1e3a5f" strokeWidth="1.5" fill="none" opacity="0.6">
          {/* RN1 Kigali to Huye */}
          <path d="M 410 270 Q 360 380 320 480" strokeDasharray="3 3" />
          {/* RN4 Kigali to Musanze */}
          <path d="M 410 270 Q 320 180 230 110" strokeDasharray="3 3" />
          {/* RN3 Kigali to Rwamagana */}
          <path d="M 410 270 Q 520 280 620 275" strokeDasharray="3 3" />
          {/* Kigali Ring Corridors */}
          <circle cx="410" cy="270" r="45" stroke="#254d7e" strokeWidth="1" />
          <circle cx="410" cy="270" r="90" stroke="#193556" strokeWidth="0.8" />
        </g>

        {/* Major Rwanda Landmark Hubs */}
        {Object.entries(RWANDA_LOCATIONS).map(([k, loc]) => {
          const x = toMapX(loc.lng);
          const y = toMapY(loc.lat);
          return (
            <g key={k} className="pointer-events-none">
              <circle cx={x} cy={y} r="3" fill="#4B6A9B" opacity="0.6" />
              <text
                x={x + 5}
                y={y + 3}
                fill="#829ab9"
                fontSize="9"
                fontFamily="system-ui"
                fontWeight="500"
              >
                {loc.name.split(' (')[0]}
              </text>
            </g>
          );
        })}

        {/* Active Route Polyline with Road Glow */}
        {pathD && (
          <>
            <path
              d={pathD}
              fill="none"
              stroke="#0047AB"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.3"
            />
            <path
              d={pathD}
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
            {/* Animated Directional Dash */}
            <path
              d={pathD}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 14"
              className="animate-dash"
            />
          </>
        )}

        {/* Pickup Marker */}
        {pickup && (
          <g transform={`translate(${toMapX(pickup.lng)}, ${toMapY(pickup.lat)})`}>
            <circle r="14" fill="#10B981" opacity="0.25" className="animate-ping" />
            <circle r="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
            <text
              y="3"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="9"
              fontWeight="900"
              fontFamily="system-ui"
            >
              P
            </text>
            <text
              y="-12"
              textAnchor="middle"
              fill="#A7F3D0"
              fontSize="10"
              fontWeight="700"
              fontFamily="system-ui"
            >
              PICKUP
            </text>
          </g>
        )}

        {/* Destination Marker */}
        {destination && (
          <g transform={`translate(${toMapX(destination.lng)}, ${toMapY(destination.lat)})`}>
            <circle r="14" fill="#FF6B00" opacity="0.25" className="animate-ping" />
            <circle r="8" fill="#FF6B00" stroke="#FFFFFF" strokeWidth="2.5" />
            <text
              y="3"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="9"
              fontWeight="900"
              fontFamily="system-ui"
            >
              D
            </text>
            <text
              y="-12"
              textAnchor="middle"
              fill="#FED7AA"
              fontSize="10"
              fontWeight="700"
              fontFamily="system-ui"
            >
              DESTINATION
            </text>
          </g>
        )}

        {/* Live Driver Position Marker */}
        {activeDriverPoint && (
          <g transform={`translate(${toMapX(activeDriverPoint.lng)}, ${toMapY(activeDriverPoint.lat)})`}>
            <circle r="18" fill="#3B82F6" opacity="0.3" className="animate-ping" />
            <circle r="11" fill="#0047AB" stroke="#FBBF24" strokeWidth="2.5" />
            {/* Vehicle Icon */}
            <g transform="translate(-6, -6) scale(0.6)">
              <polygon points="10,0 20,20 10,15 0,20" fill="#FFFFFF" />
            </g>
            {/* Driver Tooltip Badge */}
            <g transform="translate(14, -8)">
              <rect width="90" height="22" rx="4" fill="#0F172A" stroke="#334155" />
              <text x="6" y="14" fill="#F8FAFC" fontSize="9" fontWeight="700" fontFamily="system-ui">
                {driverName || 'Driver'} • {driverSpeed} km/h
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
