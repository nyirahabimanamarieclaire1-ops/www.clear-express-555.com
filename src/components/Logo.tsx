import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'full' | 'mark' | 'white' | 'horizontal';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showTagline = true,
}) => {
  const isWhite = variant === 'white';

  // Sizing definitions
  const dimensions = {
    sm: { icon: 'w-9 h-9', title: 'text-base', num: 'text-sm', tag: 'text-[9px]' },
    md: { icon: 'w-12 h-12', title: 'text-xl', num: 'text-base', tag: 'text-[11px]' },
    lg: { icon: 'w-16 h-16', title: 'text-2xl sm:text-3xl', num: 'text-xl sm:text-2xl', tag: 'text-xs sm:text-sm' },
    xl: { icon: 'w-20 h-20 sm:w-24 sm:h-24', title: 'text-3xl sm:text-4xl', num: 'text-2xl sm:text-3xl', tag: 'text-sm sm:text-base' },
    hero: { icon: 'w-24 h-24 sm:w-32 sm:h-32', title: 'text-4xl sm:text-5xl', num: 'text-3xl sm:text-4xl', tag: 'text-base sm:text-lg' },
  }[size];

  // The Exact CLEAR EXPRESS 555 Visual Mark (Globe + Curved Orbit Arrow + Delivery Van with Orange Box + Speed Trails)
  const LogoMarkSvg = (
    <svg
      viewBox="0 0 140 110"
      className={`${dimensions.icon} flex-shrink-0 drop-shadow-md select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CLEAR EXPRESS 555 Logo Mark"
    >
      <defs>
        {/* Globe Blue Gradient */}
        <linearGradient id="ceGlobeGrad" x1="50" y1="5" x2="115" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284C7" />
          <stop offset="0.5" stopColor="#0052CC" />
          <stop offset="1" stopColor="#003580" />
        </linearGradient>

        {/* Orbit Arrow Orange Gradient */}
        <linearGradient id="ceArrowGrad" x1="40" y1="50" x2="125" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="0.4" stopColor="#FF6B00" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>

        {/* Parcel Box Orange Gradient */}
        <linearGradient id="ceBoxGrad" x1="60" y1="12" x2="82" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDBA74" />
          <stop offset="0.5" stopColor="#FF6B00" />
          <stop offset="1" stopColor="#C2410C" />
        </linearGradient>
      </defs>

      {/* 1. Orbit Arrow behind globe curving to top right */}
      <path
        d="M 50 68 C 50 35 75 14 112 18 L 110 9 L 132 21 L 115 37 L 116 28 C 84 24 62 40 62 68 Z"
        fill="url(#ceArrowGrad)"
      />

      {/* 2. Earth Globe */}
      <circle cx="85" cy="46" r="32" fill="url(#ceGlobeGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
      {/* Globe Continents / Longitude Lines */}
      <ellipse cx="85" cy="46" rx="18" ry="32" stroke="#60A5FA" strokeWidth="1" strokeDasharray="3 2" fill="none" opacity="0.6" />
      <path d="M 53 46 L 117 46" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
      <path d="M 58 32 C 72 38 98 38 112 32" stroke="#60A5FA" strokeWidth="1" opacity="0.5" />
      <path d="M 58 60 C 72 54 98 54 112 60" stroke="#60A5FA" strokeWidth="1" opacity="0.5" />
      {/* Stylized continent shapes on globe */}
      <path
        d="M 72 32 C 75 28 82 25 87 29 C 91 32 89 39 84 41 C 80 43 78 48 82 54 C 84 57 80 62 76 60 C 72 58 70 50 71 45 C 72 40 69 36 72 32 Z"
        fill="#FFFFFF"
        opacity="0.35"
      />
      <circle cx="100" cy="38" r="4.5" fill="#FFFFFF" opacity="0.3" />

      {/* 3. Horizontal Speed Trails (Behind Van on the left) */}
      <rect x="6" y="44" width="38" height="3.5" rx="1.75" fill="#FF6B00" />
      <rect x="14" y="51" width="34" height="3.5" rx="1.75" fill="#0052CC" />
      <rect x="4" y="58" width="48" height="3.5" rx="1.75" fill="#F59E0B" />
      <rect x="16" y="65" width="40" height="3.5" rx="1.75" fill="#FF6B00" />

      {/* 4. Orange Shipping Package Cube (Mounted on top of Van body) */}
      <g transform="translate(62, 14)">
        {/* Isometric Cube Top Face */}
        <polygon points="12,0 24,6 12,12 0,6" fill="#FDBA74" stroke="#EA580C" strokeWidth="0.8" />
        {/* Cube Left Face */}
        <polygon points="0,6 12,12 12,24 0,18" fill="#FF6B00" stroke="#EA580C" strokeWidth="0.8" />
        {/* Cube Right Face */}
        <polygon points="12,12 24,6 24,18 12,24" fill="#C2410C" stroke="#EA580C" strokeWidth="0.8" />
        {/* Box Tape Band */}
        <line x1="6" y1="9" x2="18" y2="3" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="6" y1="9" x2="6" y2="21" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
      </g>

      {/* 5. White & Blue High-Speed Delivery Van */}
      {/* Van Main Body (Sleek aerodynamic white body with royal blue swoosh) */}
      <path
        d="M 46 72 L 50 48 C 51 44 54 41 58 41 L 86 41 C 92 41 97 44 100 48 L 108 58 C 110 60 113 62 116 63 L 122 66 C 124 67 125 69 125 72 L 125 76 C 125 78 123 80 121 80 L 48 80 C 46 80 44 78 44 76 Z"
        fill="#FFFFFF"
        stroke="#003580"
        strokeWidth="2.5"
      />

      {/* Van Front Windshield & Side Windows */}
      <path
        d="M 90 45 L 98 46 C 101 47 103 49 105 52 L 110 59 L 90 59 Z"
        fill="#0052CC"
      />
      <rect x="68" y="45" width="18" height="14" rx="2" fill="#0052CC" />
      <rect x="54" y="45" width="11" height="14" rx="2" fill="#0052CC" />

      {/* Van Blue & Orange Dynamic Stripe on Chassis */}
      <path
        d="M 46 68 L 122 68 C 123 68 124 69 124 70 L 124 74 L 46 74 Z"
        fill="#0052CC"
      />
      <rect x="46" y="65" width="46" height="2" fill="#FF6B00" />

      {/* Headlight yellow flare */}
      <polygon points="123,68 132,67 132,74 123,73" fill="#FBBF24" opacity="0.9" />

      {/* Van Wheels */}
      {/* Rear Wheel */}
      <circle cx="62" cy="80" r="9" fill="#1E293B" stroke="#CBD5E1" strokeWidth="2" />
      <circle cx="62" cy="80" r="4.5" fill="#0052CC" />
      <circle cx="62" cy="80" r="2" fill="#FFFFFF" />

      {/* Front Wheel */}
      <circle cx="106" cy="80" r="9" fill="#1E293B" stroke="#CBD5E1" strokeWidth="2" />
      <circle cx="106" cy="80" r="4.5" fill="#0052CC" />
      <circle cx="106" cy="80" r="2" fill="#FFFFFF" />
    </svg>
  );

  if (variant === 'mark') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        {LogoMarkSvg}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* Icon Graphic */}
      {LogoMarkSvg}

      {/* Text Lockup */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1 sm:gap-1.5 flex-nowrap">
          {/* CLEAR */}
          <span
            className={`font-black tracking-tight ${
              isWhite ? 'text-white' : 'text-[#003B95]'
            } ${dimensions.title} uppercase font-sans`}
          >
            CLEAR
          </span>

          {/* EXPRESS */}
          <span
            className={`font-black tracking-tight text-[#FF6B00] ${dimensions.title} uppercase font-sans`}
          >
            EXPRESS
          </span>

          {/* 555 Badge */}
          <span
            className={`font-black tracking-normal px-2 py-0.5 rounded-md bg-gradient-to-r from-[#FF6B00] to-[#EA580C] text-white shadow-sm font-sans ${dimensions.num}`}
          >
            555
          </span>
        </div>

        {/* Tagline */}
        {showTagline && (
          <span
            className={`font-semibold tracking-wide italic mt-1 ${
              isWhite ? 'text-orange-200' : 'text-[#003B95]'
            } ${dimensions.tag}`}
          >
            “Anything. Anywhere. Fast.”
          </span>
        )}
      </div>
    </div>
  );
};
