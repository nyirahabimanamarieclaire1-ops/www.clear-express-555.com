import {
  DeliverySpeed,
  PackageType,
  PricingBreakdown,
  PricingRule,
  VehicleType,
} from '../../shared/types.ts';

export interface PricingInput {
  distanceKm: number;
  vehicleType: VehicleType;
  packageType: PackageType;
  speed: DeliverySpeed;
  isFragile?: boolean;
  zoneMultiplier?: number;
  extraServicesFee?: number;
}

/**
 * Calculates itemized pricing using the formula from Section 8:
 * TOTAL = baseFee + (distanceKm × pricePerKm) + packageFee + vehicleFee + expressFee + optionalExtraServices
 */
export function calculateOrderPrice(
  input: PricingInput,
  rule: PricingRule
): PricingBreakdown {
  const { distanceKm, packageType, speed, isFragile, zoneMultiplier = 1.0, extraServicesFee = 0 } = input;

  const baseFee = rule.baseFee;
  const rawDistanceFee = distanceKm * rule.pricePerKm * zoneMultiplier;
  // Round to nearest 10 RWF for currency elegance
  const distanceFee = Math.round(rawDistanceFee);

  let packageFee = rule.packageFees[packageType] || 0;
  if (isFragile && packageType !== PackageType.FRAGILE) {
    packageFee += rule.packageFees[PackageType.FRAGILE] || 1500;
  }

  // Vehicle fee is 0 if vehicle base is already selected, or any special surcharge
  const vehicleFee = 0;

  const expressFee = speed === DeliverySpeed.EXPRESS ? rule.expressFee : 0;

  const zoneFee = zoneMultiplier > 1.0 ? Math.round(distanceKm * rule.pricePerKm * (zoneMultiplier - 1.0)) : 0;

  const optionalExtraServices = extraServicesFee;

  let total = baseFee + distanceFee + packageFee + vehicleFee + expressFee + optionalExtraServices;

  // Enforce minimum fee if total is below threshold
  if (total < rule.minimumFee) {
    total = rule.minimumFee;
  }

  return {
    baseFee,
    distanceKm,
    pricePerKm: rule.pricePerKm,
    distanceFee,
    packageFee,
    vehicleFee,
    expressFee,
    zoneFee,
    optionalExtraServices,
    total,
    currency: 'RWF',
  };
}
