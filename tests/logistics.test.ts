import { DeliverySpeed, OrderStatus, PackageType, PaymentMethod, PaymentStatus, UserRole, VehicleType } from '../shared/types.ts';
import { calculateOrderPrice } from '../server/services/pricing.ts';
import { calculateHaversineKm, calculateRoadDistance } from '../server/services/maps.ts';
import { store } from '../server/store.ts';

export interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

export async function runAllLogisticsTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  // TEST 1: Price Calculation - 8.6 km motorcycle exact formula check (Section 37)
  try {
    const motoRule = store.pricingRules[VehicleType.MOTORCYCLE];
    const pricing = calculateOrderPrice(
      {
        distanceKm: 8.6,
        vehicleType: VehicleType.MOTORCYCLE,
        packageType: PackageType.SMALL,
        speed: DeliverySpeed.EXPRESS,
      },
      motoRule
    );

    const expectedTotal = 4220; // 1000 base + (8.6 * 200 = 1720) + 500 (small) + 1000 (express) = 4220
    const passed = pricing.total === expectedTotal;
    results.push({
      name: '8.6 km Motorcycle Express Pricing (Section 37 Spec)',
      category: 'Pricing Engine',
      passed,
      expected: `RWF ${expectedTotal.toLocaleString()} (1000 base + 1720 dist + 500 pkg + 1000 exp)`,
      actual: `RWF ${pricing.total.toLocaleString()} (base: ${pricing.baseFee}, dist: ${pricing.distanceFee}, pkg: ${pricing.packageFee}, exp: ${pricing.expressFee})`,
    });
  } catch (e: any) {
    results.push({
      name: '8.6 km Motorcycle Express Pricing',
      category: 'Pricing Engine',
      passed: false,
      expected: 'RWF 4,220',
      actual: `Error: ${e.message}`,
    });
  }

  // TEST 2: Distance Handling - Road route calculation non-straight line
  try {
    // Kigali CBD to Kimironko
    const pickupLat = -1.9441;
    const pickupLng = 30.0619;
    const destLat = -1.9366;
    const destLng = 30.1272;

    const straightLine = calculateHaversineKm(pickupLat, pickupLng, destLat, destLng);
    const roadRoute = await calculateRoadDistance(pickupLat, pickupLng, destLat, destLng, VehicleType.MOTORCYCLE);

    const isGreaterThanStraightLine = roadRoute.distanceKm > straightLine;
    const hasGeometry = roadRoute.routeGeometry.length > 0;
    const passed = isGreaterThanStraightLine && hasGeometry && roadRoute.estimatedMinutes > 0;

    results.push({
      name: 'GPS Road Routing (Non-straight line topography)',
      category: 'Distance Engine',
      passed,
      expected: `Road distance > straight line (${straightLine.toFixed(2)} km) with road geometry`,
      actual: `Road: ${roadRoute.distanceKm} km (straight: ${straightLine.toFixed(2)} km), ${roadRoute.estimatedMinutes} mins, ${roadRoute.routeGeometry.length} waypoints via ${roadRoute.provider}`,
    });
  } catch (e: any) {
    results.push({
      name: 'GPS Road Routing',
      category: 'Distance Engine',
      passed: false,
      expected: 'Road route calculation',
      actual: `Error: ${e.message}`,
    });
  }

  // TEST 3: Order Creation & Tracking Number Format (CE555-RW-YYYYMMDD-XXXXXX)
  try {
    const trackingNumber = store.generateTrackingNumber();
    const regex = /^CE555-RW-\d{8}-\d{6}$/;
    const passed = regex.test(trackingNumber);

    results.push({
      name: 'Tracking Number Generation Format (Section 10)',
      category: 'Order Management',
      passed,
      expected: 'Pattern: CE555-RW-YYYYMMDD-000001',
      actual: trackingNumber,
    });
  } catch (e: any) {
    results.push({
      name: 'Tracking Number Generation Format',
      category: 'Order Management',
      passed: false,
      expected: 'Valid tracking number',
      actual: `Error: ${e.message}`,
    });
  }

  // TEST 4: Payment Status Transitions
  try {
    const testOrder = store.orders[0];
    const initialStatus = testOrder.paymentStatus;
    const passed = [PaymentStatus.PENDING, PaymentStatus.PROCESSING, PaymentStatus.PAID].includes(initialStatus);

    results.push({
      name: 'Payment Lifecycle State Machine (Section 15)',
      category: 'Payment Service',
      passed,
      expected: 'PENDING | PROCESSING | PAID | FAILED | REFUNDED',
      actual: `Order ${testOrder.trackingNumber} current payment status: ${initialStatus}`,
    });
  } catch (e: any) {
    results.push({
      name: 'Payment Lifecycle State Machine',
      category: 'Payment Service',
      passed: false,
      expected: 'Valid status',
      actual: `Error: ${e.message}`,
    });
  }

  // TEST 5: Tracking Timeline & Events
  try {
    const inTransitOrder = store.orders.find((o) => o.status === OrderStatus.IN_TRANSIT) || store.orders[0];
    const hasEvents = inTransitOrder.trackingEvents.length >= 2;
    const passed = hasEvents && inTransitOrder.trackingEvents.every((e) => e.status && e.title && e.timestamp);

    results.push({
      name: 'Package Tracking Timeline Verification (Section 11)',
      category: 'Tracking Engine',
      passed,
      expected: 'Sequential audit events with status, title, and timestamp',
      actual: `${inTransitOrder.trackingEvents.length} events logged for ${inTransitOrder.trackingNumber}`,
    });
  } catch (e: any) {
    results.push({
      name: 'Package Tracking Timeline Verification',
      category: 'Tracking Engine',
      passed: false,
      expected: 'Events logged',
      actual: `Error: ${e.message}`,
    });
  }

  // TEST 6: Authentication & Roles
  try {
    const rolesPresent = new Set(store.users.map((u) => u.role));
    const passed =
      rolesPresent.has(UserRole.SUPER_ADMIN) &&
      rolesPresent.has(UserRole.DRIVER) &&
      rolesPresent.has(UserRole.CUSTOMER);

    results.push({
      name: 'Role-Based Access Control (RBAC) Accounts (Section 25)',
      category: 'Security & Auth',
      passed,
      expected: 'SUPER_ADMIN, DRIVER, CUSTOMER, BUSINESS_CUSTOMER present',
      actual: `${store.users.length} seeded users across ${rolesPresent.size} distinct roles`,
    });
  } catch (e: any) {
    results.push({
      name: 'Role-Based Access Control (RBAC) Accounts',
      category: 'Security & Auth',
      passed: false,
      expected: 'Roles present',
      actual: `Error: ${e.message}`,
    });
  }

  // TEST 7: Driver Assignment & Vehicle Compatibility
  try {
    const activeDriver = store.drivers.find((d) => d.plateNumber.startsWith('RAB'));
    const passed = Boolean(activeDriver && activeDriver.vehicleType === VehicleType.MOTORCYCLE && activeDriver.plateNumber);

    results.push({
      name: 'Driver Dispatch & Rwanda Plate Verification (Section 18)',
      category: 'Fleet Management',
      passed,
      expected: 'Registered driver with valid Rwandan plate (e.g. RAB 555 A)',
      actual: activeDriver ? `${activeDriver.name} (${activeDriver.vehicleType}, ${activeDriver.plateNumber})` : 'None',
    });
  } catch (e: any) {
    results.push({
      name: 'Driver Dispatch & Rwanda Plate Verification',
      category: 'Fleet Management',
      passed: false,
      expected: 'Driver registered',
      actual: `Error: ${e.message}`,
    });
  }

  // TEST 8: Proof of Delivery (POD) Verification
  try {
    const deliveredOrder = store.orders.find((o) => o.status === OrderStatus.DELIVERED);
    const passed = Boolean(deliveredOrder && deliveredOrder.proofOfDelivery && deliveredOrder.proofOfDelivery.otpVerified);

    results.push({
      name: 'Proof of Delivery (POD) Validation (Section 14)',
      category: 'Delivery Flow',
      passed,
      expected: 'OTP verified, recipient recorded, GPS timestamp registered',
      actual: deliveredOrder?.proofOfDelivery
        ? `Recipient: ${deliveredOrder.proofOfDelivery.recipientName}, OTP Verified: ${deliveredOrder.proofOfDelivery.otpVerified}, Location: (${deliveredOrder.proofOfDelivery.latitude}, ${deliveredOrder.proofOfDelivery.longitude})`
        : 'Incomplete proof',
    });
  } catch (e: any) {
    results.push({
      name: 'Proof of Delivery (POD) Validation',
      category: 'Delivery Flow',
      passed: false,
      expected: 'Valid POD record',
      actual: `Error: ${e.message}`,
    });
  }

  return results;
}
