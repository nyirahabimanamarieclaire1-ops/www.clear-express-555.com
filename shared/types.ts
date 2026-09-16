export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  DISPATCHER = 'DISPATCHER',
  DRIVER = 'DRIVER',
  CUSTOMER = 'CUSTOMER',
  BUSINESS_CUSTOMER = 'BUSINESS_CUSTOMER',
  SUPPORT = 'SUPPORT',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAID = 'PAID',
  DRIVER_SEARCHING = 'DRIVER_SEARCHING',
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  DRIVER_AT_PICKUP = 'DRIVER_AT_PICKUP',
  PACKAGE_PICKED_UP = 'PACKAGE_PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  NEAR_DESTINATION = 'NEAR_DESTINATION',
  DELIVERED = 'DELIVERED',
  FAILED_DELIVERY = 'FAILED_DELIVERY',
  RETURNING = 'RETURNING',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  MOBILE_MONEY = 'MOBILE_MONEY',
  CARD = 'CARD',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  BUSINESS_ACCOUNT = 'BUSINESS_ACCOUNT',
}

export enum VehicleType {
  MOTORCYCLE = 'MOTORCYCLE',
  CAR = 'CAR',
  VAN = 'VAN',
}

export enum PackageType {
  DOCUMENT = 'DOCUMENT',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  FRAGILE = 'FRAGILE',
}

export enum DeliverySpeed {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
}

export enum DriverStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  BUSY = 'BUSY',
  SUSPENDED = 'SUSPENDED',
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  id?: string;
  street: string;
  city: string;
  district?: string;
  landmark?: string;
  lat: number;
  lng: number;
  contactName: string;
  contactPhone: string;
}

export interface PackageDetails {
  type: PackageType;
  weightKg: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  description: string;
  itemCount: number;
  isFragile?: boolean;
}

export interface RouteGeometryPoint {
  lat: number;
  lng: number;
}

export interface RouteCalculationResult {
  distanceKm: number;
  estimatedMinutes: number;
  routeGeometry: RouteGeometryPoint[];
  waypoints?: string[];
  trafficDelayMinutes?: number;
  provider: 'osrm' | 'google' | 'mapbox' | 'local_topology';
}

export interface PricingBreakdown {
  baseFee: number;
  distanceKm: number;
  pricePerKm: number;
  distanceFee: number;
  packageFee: number;
  vehicleFee: number;
  expressFee: number;
  zoneFee: number;
  optionalExtraServices: number;
  total: number;
  currency: 'RWF';
}

export interface PricingRule {
  id: string;
  vehicleType: VehicleType;
  baseFee: number;
  pricePerKm: number;
  packageFees: Record<PackageType, number>;
  expressFee: number;
  minimumFee: number;
  updatedAt: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  code: string;
  minimumFee: number;
  pricePerKmMultiplier: number;
  extraFee: number;
  polygon?: RouteGeometryPoint[];
  isActive: boolean;
}

export interface TrackingEvent {
  id: string;
  orderId: string;
  driverId?: string;
  status: OrderStatus;
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
  speed?: number;
  heading?: number;
  timestamp: string;
}

export interface ProofOfDelivery {
  id: string;
  orderId: string;
  driverId: string;
  recipientName: string;
  otpVerified: boolean;
  signatureDataUrl?: string;
  photoUrl?: string;
  latitude: number;
  longitude: number;
  notes?: string;
  timestamp: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  amount: number;
  currency: 'RWF';
  method: PaymentMethod;
  status: PaymentStatus;
  providerReference?: string;
  phone?: string;
  paidAt?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  pickup: Address;
  destination: Address;
  package: PackageDetails;
  vehicleType: VehicleType;
  speed: DeliverySpeed;
  distanceKm: number;
  estimatedMinutes: number;
  routeGeometry?: RouteGeometryPoint[];
  pricing: PricingBreakdown;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  trackingEvents: TrackingEvent[];
  proofOfDelivery?: ProofOfDelivery;
  otpCode: string; // 4-digit code for delivery verification
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: VehicleType;
  vehicleModel: string;
  plateNumber: string;
  status: DriverStatus;
  currentLocation: Coordinates;
  heading?: number;
  speed?: number;
  rating: number;
  totalDeliveries: number;
  todayDeliveries: number;
  todayEarnings: number;
  todayKm: number;
  activeOrderId?: string;
  avatarUrl?: string;
  isApproved: boolean;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  isBusiness: boolean;
  companyName?: string;
  totalOrders: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  password?: string;
}

export interface CompanyEmailLog {
  id: string;
  recipient: string; // 'clearexpress555@gmail.com'
  subject: string;
  eventType: 'VISITOR_REGISTER' | 'VISITOR_LOGIN' | 'VISITOR_LOGOUT' | 'ADMIN_LOGIN' | 'ORDER_CREATED' | 'FAILED_ADMIN_LOGIN' | 'SECURITY_ALERT';
  timestamp: string;
  senderName?: string;
  senderIdentifier?: string;
  body: string;
  status: 'DELIVERED' | 'QUEUED';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  trackingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyContact: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    country: string;
  };
  pickupAddress: string;
  destinationAddress: string;
  packageDescription: string;
  packageWeightKg: number;
  distanceKm: number;
  pricing: PricingBreakdown;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  issuedAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  orderId?: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PAYMENT' | 'DRIVER' | 'SYSTEM';
  channel: 'SMS' | 'EMAIL' | 'PUSH' | 'WHATSAPP';
  read: boolean;
  createdAt: string;
}

export interface AdminMetrics {
  todaysOrders: number;
  activeDeliveries: number;
  deliveredPackages: number;
  pendingOrders: number;
  revenueRwf: number;
  activeDrivers: number;
  availableDrivers: number;
  failedDeliveries: number;
  totalKmTraveled: number;
}
