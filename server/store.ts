import {
  AdminMetrics,
  CompanyEmailLog,
  Customer,
  DeliverySpeed,
  DeliveryZone,
  Driver,
  DriverStatus,
  Invoice,
  Order,
  OrderStatus,
  PackageType,
  PaymentMethod,
  PaymentRecord,
  PaymentStatus,
  PricingRule,
  ProofOfDelivery,
  TrackingEvent,
  User,
  UserRole,
  VehicleType,
} from '../shared/types.ts';
import { RWANDA_LOCATIONS } from './services/maps.ts';

export const ADMIN_MASTER_PASSWORD = 'Ishimwe123@#';
export const COMPANY_LOG_EMAIL = 'clearexpress555@gmail.com';

class LogisticsDataStore {
  public users: User[] = [];
  public customers: Customer[] = [];
  public drivers: Driver[] = [];
  public orders: Order[] = [];
  public payments: PaymentRecord[] = [];
  public trackingEvents: TrackingEvent[] = [];
  public pricingRules: Record<VehicleType, PricingRule>;
  public deliveryZones: DeliveryZone[] = [];
  public invoices: Invoice[] = [];
  public auditLogs: Array<{ id: string; action: string; entity: string; entityId?: string; timestamp: string }> = [];
  public companyEmailLogs: CompanyEmailLog[] = [];

  public sendCompanyEmailLog(
    eventType: CompanyEmailLog['eventType'],
    subject: string,
    body: string,
    senderName?: string,
    senderIdentifier?: string
  ): CompanyEmailLog {
    const logItem: CompanyEmailLog = {
      id: `eml_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      recipient: COMPANY_LOG_EMAIL,
      subject,
      eventType,
      timestamp: new Date().toISOString(),
      senderName: senderName || 'System Service',
      senderIdentifier: senderIdentifier || 'system@clearexpress555.rw',
      body,
      status: 'DELIVERED',
    };

    this.companyEmailLogs.unshift(logItem);

    this.auditLogs.unshift({
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      action: `EMAIL_LOG: ${eventType} -> ${COMPANY_LOG_EMAIL}`,
      entity: 'COMPANY_EMAIL',
      entityId: logItem.id,
      timestamp: logItem.timestamp,
    });

    console.log(`\n======================================================`);
    console.log(`[COMPANY EMAIL DISPATCH -> ${COMPANY_LOG_EMAIL}]`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`EVENT: ${eventType} | TIME: ${logItem.timestamp}`);
    console.log(`SENDER: ${senderName || 'N/A'} (${senderIdentifier || 'N/A'})`);
    console.log(`CONTENT:\n${body}`);
    console.log(`======================================================\n`);

    return logItem;
  }

  constructor() {
    this.pricingRules = {
      [VehicleType.MOTORCYCLE]: {
        id: 'rule_moto',
        vehicleType: VehicleType.MOTORCYCLE,
        baseFee: 1000,
        pricePerKm: 200,
        packageFees: {
          [PackageType.DOCUMENT]: 0,
          [PackageType.SMALL]: 500,
          [PackageType.MEDIUM]: 1000,
          [PackageType.LARGE]: 2000,
          [PackageType.FRAGILE]: 1500,
        },
        expressFee: 1000,
        minimumFee: 1000,
        updatedAt: new Date().toISOString(),
      },
      [VehicleType.CAR]: {
        id: 'rule_car',
        vehicleType: VehicleType.CAR,
        baseFee: 2000,
        pricePerKm: 300,
        packageFees: {
          [PackageType.DOCUMENT]: 0,
          [PackageType.SMALL]: 500,
          [PackageType.MEDIUM]: 1000,
          [PackageType.LARGE]: 2000,
          [PackageType.FRAGILE]: 1500,
        },
        expressFee: 1000,
        minimumFee: 2000,
        updatedAt: new Date().toISOString(),
      },
      [VehicleType.VAN]: {
        id: 'rule_van',
        vehicleType: VehicleType.VAN,
        baseFee: 3000,
        pricePerKm: 500,
        packageFees: {
          [PackageType.DOCUMENT]: 0,
          [PackageType.SMALL]: 500,
          [PackageType.MEDIUM]: 1000,
          [PackageType.LARGE]: 2000,
          [PackageType.FRAGILE]: 1500,
        },
        expressFee: 1500,
        minimumFee: 3000,
        updatedAt: new Date().toISOString(),
      },
    };

    this.deliveryZones = [
      {
        id: 'zone_kigali',
        name: 'Kigali Urban District',
        code: 'KGL',
        minimumFee: 1000,
        pricePerKmMultiplier: 1.0,
        extraFee: 0,
        isActive: true,
      },
      {
        id: 'zone_outside',
        name: 'Outside Kigali (Musanze, Huye, Rubavu)',
        code: 'OUT_KGL',
        minimumFee: 3500,
        pricePerKmMultiplier: 1.15,
        extraFee: 1000,
        isActive: true,
      },
      {
        id: 'zone_nationwide',
        name: 'Nationwide Rwanda Express',
        code: 'RWA_ALL',
        minimumFee: 5000,
        pricePerKmMultiplier: 1.3,
        extraFee: 2500,
        isActive: true,
      },
    ];

    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Users
    this.users = [
      {
        id: 'usr_admin',
        name: 'Clear Express 555 Administrator',
        email: 'admin@clearexpress555.rw',
        phone: '0798010110',
        role: UserRole.SUPER_ADMIN,
        password: ADMIN_MASTER_PASSWORD,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      {
        id: 'usr_dispatcher',
        name: 'Clarisse Umutoni',
        email: 'dispatch@clearexpress555.rw',
        phone: '0788111222',
        role: UserRole.DISPATCHER,
        password: 'password123',
      },
      {
        id: 'usr_cust_1',
        name: 'Aline Uwase',
        email: 'aline.uwase@gmail.com',
        phone: '0788345678',
        role: UserRole.CUSTOMER,
        password: 'password123',
      },
      {
        id: 'usr_cust_2',
        name: 'Patrick Ndayisaba',
        email: 'patrick.nd@kigalibiz.rw',
        phone: '0788998877',
        role: UserRole.CUSTOMER,
        password: 'password123',
      },
      {
        id: 'usr_cust_3',
        name: 'Sonia Mukamana',
        email: 'sonia.m@gmail.com',
        phone: '0788776655',
        role: UserRole.CUSTOMER,
        password: 'password123',
      },
      {
        id: 'usr_cust_4',
        name: 'Emmanuel Habimana',
        email: 'emmanuel@rwandaorganic.rw',
        phone: '0788554433',
        role: UserRole.CUSTOMER,
        password: 'password123',
      },
      {
        id: 'usr_cust_biz',
        name: 'Kigali Pharmacy Logistics',
        email: 'procurement@kigalipharm.rw',
        phone: '0788223344',
        role: UserRole.BUSINESS_CUSTOMER,
        companyName: 'Kigali Pharmacy Ltd',
        password: 'password123',
      },
      // Drivers
      {
        id: 'usr_drv_1',
        name: 'Eric Kwizera',
        email: 'eric.driver@clearexpress555.rw',
        phone: '0788445566',
        role: UserRole.DRIVER,
        password: 'password123',
      },
      {
        id: 'usr_drv_2',
        name: 'David Gasana',
        email: 'david.g@clearexpress555.rw',
        phone: '0788667788',
        role: UserRole.DRIVER,
        password: 'password123',
      },
      {
        id: 'usr_drv_3',
        name: 'Innocent Nshimiyimana',
        email: 'innocent.n@clearexpress555.rw',
        phone: '0788123987',
        role: UserRole.DRIVER,
        password: 'password123',
      },
      {
        id: 'usr_drv_4',
        name: 'Maurice Twagiramungu',
        email: 'maurice.t@clearexpress555.rw',
        phone: '0788334455',
        role: UserRole.DRIVER,
        password: 'password123',
      },
      {
        id: 'usr_drv_5',
        name: 'Faustin Nkurunziza',
        email: 'faustin.n@clearexpress555.rw',
        phone: '0788771122',
        role: UserRole.DRIVER,
        password: 'password123',
      },
    ];

    // 2. Customers (5 customers)
    this.customers = [
      {
        id: 'cust_1',
        userId: 'usr_cust_1',
        name: 'Aline Uwase',
        phone: '0788345678',
        email: 'aline.uwase@gmail.com',
        isBusiness: false,
        totalOrders: 6,
        createdAt: '2026-01-15T09:00:00Z',
      },
      {
        id: 'cust_2',
        userId: 'usr_cust_2',
        name: 'Patrick Ndayisaba',
        phone: '0788998877',
        email: 'patrick.nd@kigalibiz.rw',
        isBusiness: false,
        totalOrders: 3,
        createdAt: '2026-03-10T14:30:00Z',
      },
      {
        id: 'cust_3',
        userId: 'usr_cust_3',
        name: 'Sonia Mukamana',
        phone: '0788776655',
        email: 'sonia.m@gmail.com',
        isBusiness: false,
        totalOrders: 12,
        createdAt: '2026-04-01T11:20:00Z',
      },
      {
        id: 'cust_4',
        userId: 'usr_cust_4',
        name: 'Emmanuel Habimana',
        phone: '0788554433',
        email: 'emmanuel@rwandaorganic.rw',
        isBusiness: false,
        totalOrders: 8,
        createdAt: '2026-05-18T16:00:00Z',
      },
      {
        id: 'cust_5',
        userId: 'usr_cust_biz',
        name: 'Kigali Pharmacy Logistics',
        phone: '0788223344',
        email: 'procurement@kigalipharm.rw',
        isBusiness: true,
        companyName: 'Kigali Pharmacy Ltd',
        totalOrders: 48,
        createdAt: '2026-02-01T08:00:00Z',
      },
    ];

    // 3. Drivers (5 drivers with motorcycle, car, van in Kigali)
    this.drivers = [
      {
        id: 'drv_1',
        userId: 'usr_drv_1',
        name: 'Eric Kwizera',
        phone: '0788445566',
        email: 'eric.driver@clearexpress555.rw',
        vehicleType: VehicleType.MOTORCYCLE,
        vehicleModel: 'TVS HLX 150 Express',
        plateNumber: 'RAB 555 A',
        status: DriverStatus.BUSY,
        currentLocation: { lat: -1.9475, lng: 30.0890 }, // Near Kacyiru/Remera
        heading: 75,
        speed: 38,
        rating: 4.95,
        totalDeliveries: 342,
        todayDeliveries: 5,
        todayEarnings: 24500,
        todayKm: 46.8,
        activeOrderId: 'ord_active_1',
        isApproved: true,
      },
      {
        id: 'drv_2',
        userId: 'usr_drv_2',
        name: 'David Gasana',
        phone: '0788667788',
        email: 'david.g@clearexpress555.rw',
        vehicleType: VehicleType.MOTORCYCLE,
        vehicleModel: 'Bajaj Boxer 150',
        plateNumber: 'RAD 333 X',
        status: DriverStatus.ONLINE,
        currentLocation: { lat: -1.9410, lng: 30.0630 }, // Nyarugenge CBD
        heading: 180,
        speed: 0,
        rating: 4.88,
        totalDeliveries: 215,
        todayDeliveries: 4,
        todayEarnings: 18200,
        todayKm: 34.2,
        isApproved: true,
      },
      {
        id: 'drv_3',
        userId: 'usr_drv_3',
        name: 'Innocent Nshimiyimana',
        phone: '0788123987',
        email: 'innocent.n@clearexpress555.rw',
        vehicleType: VehicleType.CAR,
        vehicleModel: 'Toyota Corolla Fielder',
        plateNumber: 'RAC 999 Z',
        status: DriverStatus.ONLINE,
        currentLocation: { lat: -1.9366, lng: 30.1272 }, // Kimironko
        heading: 90,
        speed: 25,
        rating: 4.92,
        totalDeliveries: 188,
        todayDeliveries: 3,
        todayEarnings: 32000,
        todayKm: 52.0,
        isApproved: true,
      },
      {
        id: 'drv_4',
        userId: 'usr_drv_4',
        name: 'Maurice Twagiramungu',
        phone: '0788334455',
        email: 'maurice.t@clearexpress555.rw',
        vehicleType: VehicleType.VAN,
        vehicleModel: 'Toyota HiAce Cargo Van',
        plateNumber: 'RAE 777 B',
        status: DriverStatus.ONLINE,
        currentLocation: { lat: -1.9723, lng: 30.0694 }, // Gikondo Industrial
        heading: 210,
        speed: 30,
        rating: 4.98,
        totalDeliveries: 145,
        todayDeliveries: 2,
        todayEarnings: 45000,
        todayKm: 68.5,
        isApproved: true,
      },
      {
        id: 'drv_5',
        userId: 'usr_drv_5',
        name: 'Faustin Nkurunziza',
        phone: '0788771122',
        email: 'faustin.n@clearexpress555.rw',
        vehicleType: VehicleType.MOTORCYCLE,
        vehicleModel: 'Honda Ace 125',
        plateNumber: 'RAF 123 C',
        status: DriverStatus.OFFLINE,
        currentLocation: { lat: -1.9806, lng: 30.0967 }, // Kicukiro
        rating: 4.82,
        totalDeliveries: 98,
        todayDeliveries: 0,
        todayEarnings: 0,
        todayKm: 0,
        isApproved: true,
      },
    ];

    // 4. Seed 10 Orders with realistic tracking numbers (CE555-RW-YYYYMMDD-XXXXXX)
    const baseOrders: Partial<Order>[] = [
      {
        id: 'ord_active_1',
        trackingNumber: 'CE555-RW-20260915-000001',
        customerId: 'cust_1',
        customerName: 'Aline Uwase',
        customerPhone: '0788345678',
        customerEmail: 'aline.uwase@gmail.com',
        driverId: 'drv_1',
        driverName: 'Eric Kwizera',
        driverPhone: '0788445566',
        pickup: {
          street: 'KN 3 Ave, Grand Pension Plaza',
          city: 'Kigali',
          district: 'Nyarugenge',
          lat: RWANDA_LOCATIONS.KIGALI_CBD.lat,
          lng: RWANDA_LOCATIONS.KIGALI_CBD.lng,
          contactName: 'Aline Uwase',
          contactPhone: '0788345678',
        },
        destination: {
          street: 'KG 11 Ave, Kimironko Market Plaza',
          city: 'Kigali',
          district: 'Gasabo',
          lat: RWANDA_LOCATIONS.KIMIRONKO.lat,
          lng: RWANDA_LOCATIONS.KIMIRONKO.lng,
          contactName: 'Mireille Mukamana',
          contactPhone: '0788112233',
        },
        package: {
          type: PackageType.SMALL,
          weightKg: 1.8,
          description: 'E-commerce cosmetics order & fashion apparel',
          itemCount: 2,
        },
        vehicleType: VehicleType.MOTORCYCLE,
        speed: DeliverySpeed.EXPRESS,
        distanceKm: 8.6,
        estimatedMinutes: 24,
        pricing: {
          baseFee: 1000,
          distanceKm: 8.6,
          pricePerKm: 200,
          distanceFee: 1720,
          packageFee: 500,
          vehicleFee: 0,
          expressFee: 1000,
          zoneFee: 0,
          optionalExtraServices: 0,
          total: 4220,
          currency: 'RWF',
        },
        status: OrderStatus.IN_TRANSIT,
        paymentMethod: PaymentMethod.MOBILE_MONEY,
        paymentStatus: PaymentStatus.PAID,
        otpCode: '5582',
        createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: 'ord_active_2',
        trackingNumber: 'CE555-RW-20260915-000002',
        customerId: 'cust_2',
        customerName: 'Patrick Ndayisaba',
        customerPhone: '0788998877',
        customerEmail: 'patrick.nd@kigalibiz.rw',
        pickup: {
          street: 'KG 7 Ave, Kacyiru Ministries',
          city: 'Kigali',
          district: 'Gasabo',
          lat: RWANDA_LOCATIONS.KACYIRU.lat,
          lng: RWANDA_LOCATIONS.KACYIRU.lng,
          contactName: 'Patrick Ndayisaba',
          contactPhone: '0788998877',
        },
        destination: {
          street: 'KK 15 Rd, Gikondo Magerwa',
          city: 'Kigali',
          district: 'Kicukiro',
          lat: RWANDA_LOCATIONS.GIKONDO.lat,
          lng: RWANDA_LOCATIONS.GIKONDO.lng,
          contactName: 'Agent Jean',
          contactPhone: '0788556677',
        },
        package: {
          type: PackageType.DOCUMENT,
          weightKg: 0.5,
          description: 'Notarized business contracts and customs documents',
          itemCount: 1,
        },
        vehicleType: VehicleType.MOTORCYCLE,
        speed: DeliverySpeed.STANDARD,
        distanceKm: 5.4,
        estimatedMinutes: 18,
        pricing: {
          baseFee: 1000,
          distanceKm: 5.4,
          pricePerKm: 200,
          distanceFee: 1080,
          packageFee: 0,
          vehicleFee: 0,
          expressFee: 0,
          zoneFee: 0,
          optionalExtraServices: 0,
          total: 2080,
          currency: 'RWF',
        },
        status: OrderStatus.DRIVER_SEARCHING,
        paymentMethod: PaymentMethod.MOBILE_MONEY,
        paymentStatus: PaymentStatus.PAID,
        otpCode: '1942',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        id: 'ord_done_1',
        trackingNumber: 'CE555-RW-20260915-000003',
        customerId: 'cust_5',
        customerName: 'Kigali Pharmacy Logistics',
        customerPhone: '0788223344',
        customerEmail: 'procurement@kigalipharm.rw',
        driverId: 'drv_3',
        driverName: 'Innocent Nshimiyimana',
        driverPhone: '0788123987',
        pickup: {
          street: 'Kicukiro Sonatubes Hub',
          city: 'Kigali',
          district: 'Kicukiro',
          lat: RWANDA_LOCATIONS.KICUKIRO.lat,
          lng: RWANDA_LOCATIONS.KICUKIRO.lng,
          contactName: 'Dr. Karangwa',
          contactPhone: '0788223344',
        },
        destination: {
          street: 'Remera Kisimenti Health Post',
          city: 'Kigali',
          district: 'Gasabo',
          lat: RWANDA_LOCATIONS.REMERA.lat,
          lng: RWANDA_LOCATIONS.REMERA.lng,
          contactName: 'Nurse Chantal',
          contactPhone: '0788990011',
        },
        package: {
          type: PackageType.FRAGILE,
          weightKg: 8.5,
          description: 'Temperature-sensitive medical supplies',
          itemCount: 4,
          isFragile: true,
        },
        vehicleType: VehicleType.CAR,
        speed: DeliverySpeed.EXPRESS,
        distanceKm: 6.2,
        estimatedMinutes: 20,
        pricing: {
          baseFee: 2000,
          distanceKm: 6.2,
          pricePerKm: 300,
          distanceFee: 1860,
          packageFee: 1500,
          vehicleFee: 0,
          expressFee: 1000,
          zoneFee: 0,
          optionalExtraServices: 0,
          total: 6360,
          currency: 'RWF',
        },
        status: OrderStatus.DELIVERED,
        paymentMethod: PaymentMethod.BUSINESS_ACCOUNT,
        paymentStatus: PaymentStatus.PAID,
        otpCode: '8831',
        proofOfDelivery: {
          id: 'pod_done_1',
          orderId: 'ord_done_1',
          driverId: 'drv_3',
          recipientName: 'Nurse Chantal',
          otpVerified: true,
          latitude: RWANDA_LOCATIONS.REMERA.lat,
          longitude: RWANDA_LOCATIONS.REMERA.lng,
          timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
          notes: 'Signed and checked with temperature seal intact',
        },
        createdAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
      },
      {
        id: 'ord_4',
        trackingNumber: 'CE555-RW-20260915-000004',
        customerId: 'cust_3',
        customerName: 'Sonia Mukamana',
        customerPhone: '0788776655',
        customerEmail: 'sonia.m@gmail.com',
        driverId: 'drv_1',
        driverName: 'Eric Kwizera',
        driverPhone: '0788445566',
        pickup: {
          street: 'Nyarutarama Embassy Way',
          city: 'Kigali',
          lat: RWANDA_LOCATIONS.NYARUTARAMA.lat,
          lng: RWANDA_LOCATIONS.NYARUTARAMA.lng,
          contactName: 'Sonia Mukamana',
          contactPhone: '0788776655',
        },
        destination: {
          street: 'Kanombe Airport Cargo Wing',
          city: 'Kigali',
          lat: RWANDA_LOCATIONS.KANOMBE_AIRPORT.lat,
          lng: RWANDA_LOCATIONS.KANOMBE_AIRPORT.lng,
          contactName: 'Customs Officer Bizimana',
          contactPhone: '0788334411',
        },
        package: {
          type: PackageType.MEDIUM,
          weightKg: 4.2,
          description: 'Handcrafted Rwandan coffee samples for export',
          itemCount: 6,
        },
        vehicleType: VehicleType.MOTORCYCLE,
        speed: DeliverySpeed.EXPRESS,
        distanceKm: 9.8,
        estimatedMinutes: 28,
        pricing: {
          baseFee: 1000,
          distanceKm: 9.8,
          pricePerKm: 200,
          distanceFee: 1960,
          packageFee: 1000,
          vehicleFee: 0,
          expressFee: 1000,
          zoneFee: 0,
          optionalExtraServices: 0,
          total: 4960,
          currency: 'RWF',
        },
        status: OrderStatus.DELIVERED,
        paymentMethod: PaymentMethod.CARD,
        paymentStatus: PaymentStatus.PAID,
        otpCode: '4421',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      },
      {
        id: 'ord_5',
        trackingNumber: 'CE555-RW-20260915-000005',
        customerId: 'cust_4',
        customerName: 'Emmanuel Habimana',
        customerPhone: '0788554433',
        customerEmail: 'emmanuel@rwandaorganic.rw',
        driverId: 'drv_4',
        driverName: 'Maurice Twagiramungu',
        driverPhone: '0788334455',
        pickup: {
          street: 'Musanze Downtown Agri-Center',
          city: 'Musanze',
          lat: RWANDA_LOCATIONS.MUSANZE.lat,
          lng: RWANDA_LOCATIONS.MUSANZE.lng,
          contactName: 'Emmanuel Habimana',
          contactPhone: '0788554433',
        },
        destination: {
          street: 'Gikondo Distribution Warehouse',
          city: 'Kigali',
          lat: RWANDA_LOCATIONS.GIKONDO.lat,
          lng: RWANDA_LOCATIONS.GIKONDO.lng,
          contactName: 'Receiving Team',
          contactPhone: '0788113355',
        },
        package: {
          type: PackageType.LARGE,
          weightKg: 85.0,
          description: 'Organic tea & macadamia bulk cartons',
          itemCount: 12,
        },
        vehicleType: VehicleType.VAN,
        speed: DeliverySpeed.STANDARD,
        distanceKm: 94.0,
        estimatedMinutes: 135,
        pricing: {
          baseFee: 3000,
          distanceKm: 94.0,
          pricePerKm: 500,
          distanceFee: 47000,
          packageFee: 2000,
          vehicleFee: 0,
          expressFee: 0,
          zoneFee: 1000,
          optionalExtraServices: 0,
          total: 53000,
          currency: 'RWF',
        },
        status: OrderStatus.IN_TRANSIT,
        paymentMethod: PaymentMethod.MOBILE_MONEY,
        paymentStatus: PaymentStatus.PAID,
        otpCode: '7729',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: 'ord_6',
        trackingNumber: 'CE555-RW-20260915-000006',
        customerId: 'cust_1',
        customerName: 'Aline Uwase',
        customerPhone: '0788345678',
        customerEmail: 'aline.uwase@gmail.com',
        pickup: {
          street: 'Kigali Heights, Kimihurura',
          city: 'Kigali',
          lat: -1.9535,
          lng: 30.0915,
          contactName: 'Boutique Chic',
          contactPhone: '0788129845',
        },
        destination: {
          street: 'Kicukiro Centre',
          city: 'Kigali',
          lat: RWANDA_LOCATIONS.KICUKIRO.lat,
          lng: RWANDA_LOCATIONS.KICUKIRO.lng,
          contactName: 'Aline Uwase',
          contactPhone: '0788345678',
        },
        package: {
          type: PackageType.SMALL,
          weightKg: 1.2,
          description: 'Designer handbag & jewelry gift',
          itemCount: 1,
        },
        vehicleType: VehicleType.MOTORCYCLE,
        speed: DeliverySpeed.STANDARD,
        distanceKm: 4.8,
        estimatedMinutes: 16,
        pricing: {
          baseFee: 1000,
          distanceKm: 4.8,
          pricePerKm: 200,
          distanceFee: 960,
          packageFee: 500,
          vehicleFee: 0,
          expressFee: 0,
          zoneFee: 0,
          optionalExtraServices: 0,
          total: 2460,
          currency: 'RWF',
        },
        status: OrderStatus.PAYMENT_PENDING,
        paymentMethod: PaymentMethod.MOBILE_MONEY,
        paymentStatus: PaymentStatus.PENDING,
        otpCode: '3128',
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        id: 'ord_7',
        trackingNumber: 'CE555-RW-20260915-000007',
        customerId: 'cust_2',
        customerName: 'Patrick Ndayisaba',
        customerPhone: '0788998877',
        customerEmail: 'patrick.nd@kigalibiz.rw',
        driverId: 'drv_2',
        driverName: 'David Gasana',
        driverPhone: '0788667788',
        pickup: {
          street: 'KN 2 St, Nyarugenge',
          city: 'Kigali',
          lat: -1.9460,
          lng: 30.0600,
          contactName: 'Patrick Ndayisaba',
          contactPhone: '0788998877',
        },
        destination: {
          street: 'Gisozi Memorial St',
          city: 'Kigali',
          lat: -1.9210,
          lng: 30.0620,
          contactName: 'Solange K.',
          contactPhone: '0788994433',
        },
        package: {
          type: PackageType.SMALL,
          weightKg: 2.0,
          description: 'Replacement laptop charger & accessories',
          itemCount: 2,
        },
        vehicleType: VehicleType.MOTORCYCLE,
        speed: DeliverySpeed.STANDARD,
        distanceKm: 5.1,
        estimatedMinutes: 18,
        pricing: {
          baseFee: 1000,
          distanceKm: 5.1,
          pricePerKm: 200,
          distanceFee: 1020,
          packageFee: 500,
          vehicleFee: 0,
          expressFee: 0,
          zoneFee: 0,
          optionalExtraServices: 0,
          total: 2520,
          currency: 'RWF',
        },
        status: OrderStatus.DRIVER_AT_PICKUP,
        paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
        paymentStatus: PaymentStatus.PENDING,
        otpCode: '6294',
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: 'ord_8',
        trackingNumber: 'CE555-RW-20260915-000008',
        customerId: 'cust_3',
        customerName: 'Sonia Mukamana',
        customerPhone: '0788776655',
        customerEmail: 'sonia.m@gmail.com',
        driverId: 'drv_3',
        driverName: 'Innocent Nshimiyimana',
        driverPhone: '0788123987',
        pickup: {
          street: 'Rubavu Port Lake Kivu',
          city: 'Rubavu',
          lat: RWANDA_LOCATIONS.RUBAVU.lat,
          lng: RWANDA_LOCATIONS.RUBAVU.lng,
          contactName: 'Captain Jean',
          contactPhone: '0788448822',
        },
        destination: {
          street: 'Kigali Serena Hotel',
          city: 'Kigali',
          lat: RWANDA_LOCATIONS.KIGALI_CBD.lat,
          lng: RWANDA_LOCATIONS.KIGALI_CBD.lng,
          contactName: 'Executive Concierge',
          contactPhone: '0788111999',
        },
        package: {
          type: PackageType.MEDIUM,
          weightKg: 15.0,
          description: 'Fresh artisanal Lake Kivu Sambaza fish crates in dry ice',
          itemCount: 3,
        },
        vehicleType: VehicleType.CAR,
        speed: DeliverySpeed.EXPRESS,
        distanceKm: 155.0,
        estimatedMinutes: 210,
        pricing: {
          baseFee: 2000,
          distanceKm: 155.0,
          pricePerKm: 300,
          distanceFee: 46500,
          packageFee: 1000,
          vehicleFee: 0,
          expressFee: 1000,
          zoneFee: 1500,
          optionalExtraServices: 0,
          total: 52000,
          currency: 'RWF',
        },
        status: OrderStatus.DELIVERED,
        paymentMethod: PaymentMethod.MOBILE_MONEY,
        paymentStatus: PaymentStatus.PAID,
        otpCode: '9012',
        createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      },
      {
        id: 'ord_9',
        trackingNumber: 'CE555-RW-20260915-000009',
        customerId: 'cust_5',
        customerName: 'Kigali Pharmacy Logistics',
        customerPhone: '0788223344',
        customerEmail: 'procurement@kigalipharm.rw',
        pickup: {
          street: 'Gikondo Industrial Zone',
          city: 'Kigali',
          lat: RWANDA_LOCATIONS.GIKONDO.lat,
          lng: RWANDA_LOCATIONS.GIKONDO.lng,
          contactName: 'Warehouse Supervisor',
          contactPhone: '0788223344',
        },
        destination: {
          street: 'Huye University Teaching Hospital (CHUB)',
          city: 'Huye',
          lat: RWANDA_LOCATIONS.HUYE.lat,
          lng: RWANDA_LOCATIONS.HUYE.lng,
          contactName: 'CHUB Pharmacy Dept',
          contactPhone: '0788771199',
        },
        package: {
          type: PackageType.LARGE,
          weightKg: 120.0,
          description: 'Hospital PPE and laboratory reagent boxes',
          itemCount: 15,
        },
        vehicleType: VehicleType.VAN,
        speed: DeliverySpeed.EXPRESS,
        distanceKm: 132.0,
        estimatedMinutes: 180,
        pricing: {
          baseFee: 3000,
          distanceKm: 132.0,
          pricePerKm: 500,
          distanceFee: 66000,
          packageFee: 2000,
          vehicleFee: 0,
          expressFee: 1500,
          zoneFee: 2000,
          optionalExtraServices: 0,
          total: 74500,
          currency: 'RWF',
        },
        status: OrderStatus.DELIVERED,
        paymentMethod: PaymentMethod.BUSINESS_ACCOUNT,
        paymentStatus: PaymentStatus.PAID,
        otpCode: '7412',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      },
      {
        id: 'ord_10',
        trackingNumber: 'CE555-RW-20260915-000010',
        customerId: 'cust_4',
        customerName: 'Emmanuel Habimana',
        customerPhone: '0788554433',
        customerEmail: 'emmanuel@rwandaorganic.rw',
        pickup: {
          street: 'Rwamagana Agro Hub',
          city: 'Rwamagana',
          lat: RWANDA_LOCATIONS.RWAMAGANA.lat,
          lng: RWANDA_LOCATIONS.RWAMAGANA.lng,
          contactName: 'Emmanuel Habimana',
          contactPhone: '0788554433',
        },
        destination: {
          street: 'Kigali Special Economic Zone (KSEZ)',
          city: 'Kigali',
          lat: RWANDA_LOCATIONS.KANOMBE_AIRPORT.lat,
          lng: RWANDA_LOCATIONS.KANOMBE_AIRPORT.lng,
          contactName: 'KSEZ Logistics Officer',
          contactPhone: '0788440022',
        },
        package: {
          type: PackageType.MEDIUM,
          weightKg: 25.0,
          description: 'Horticultural chili export cartons',
          itemCount: 5,
        },
        vehicleType: VehicleType.CAR,
        speed: DeliverySpeed.STANDARD,
        distanceKm: 48.0,
        estimatedMinutes: 65,
        pricing: {
          baseFee: 2000,
          distanceKm: 48.0,
          pricePerKm: 300,
          distanceFee: 14400,
          packageFee: 1000,
          vehicleFee: 0,
          expressFee: 0,
          zoneFee: 1000,
          optionalExtraServices: 0,
          total: 18400,
          currency: 'RWF',
        },
        status: OrderStatus.DRIVER_ASSIGNED,
        paymentMethod: PaymentMethod.MOBILE_MONEY,
        paymentStatus: PaymentStatus.PAID,
        otpCode: '8520',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
    ];

    // Hydrate orders and tracking events
    this.orders = baseOrders.map((bo) => {
      const order = bo as Order;
      order.trackingEvents = this.generateEventsForOrder(order);
      return order;
    });

    // Invoices for delivered and paid orders
    this.orders.forEach((ord) => {
      if (ord.paymentStatus === PaymentStatus.PAID) {
        this.invoices.push({
          id: `inv_${ord.id}`,
          invoiceNumber: `INV-${ord.trackingNumber.replace('CE555-RW-', '')}`,
          orderId: ord.id,
          trackingNumber: ord.trackingNumber,
          customerName: ord.customerName,
          customerEmail: ord.customerEmail,
          customerPhone: ord.customerPhone,
          companyContact: {
            name: 'CLEAR EXPRESS 555',
            tagline: 'Anything. Anywhere. Fast.',
            phone: '0798010110',
            email: 'clearexpress555@gmail.com',
            country: 'Kigali, Rwanda',
          },
          pickupAddress: `${ord.pickup.street}, ${ord.pickup.city}`,
          destinationAddress: `${ord.destination.street}, ${ord.destination.city}`,
          packageDescription: ord.package.description,
          packageWeightKg: ord.package.weightKg,
          distanceKm: ord.distanceKm,
          pricing: ord.pricing,
          paymentStatus: ord.paymentStatus,
          paymentMethod: ord.paymentMethod,
          issuedAt: ord.createdAt,
        });
      }
    });

    // 5. Seed initial company email logs transmitted to clearexpress555@gmail.com
    this.sendCompanyEmailLog(
      'ADMIN_LOGIN',
      '[CLEAR EXPRESS 555] Admin Master Credentials Authenticated',
      'Administrator signed in securely using authorized master credentials from Kigali Headquarters dispatch console.',
      'Clear Express Admin',
      '0798010110'
    );
    this.sendCompanyEmailLog(
      'VISITOR_REGISTER',
      '[CLEAR EXPRESS 555 LOG] New Visitor Account Created: 0788345678',
      'Visitor Name: Aline Uwase\nIdentifier: 0788345678\nEmail: aline.uwase@gmail.com\nRegistered successfully on Clear Express 555 portal.',
      'Aline Uwase',
      '0788345678'
    );
    this.sendCompanyEmailLog(
      'ORDER_CREATED',
      '[CLEAR EXPRESS 555 LOG] Order Created: CE555-RW-20260915-000001',
      'Shipment #CE555-RW-20260915-000001 booked by Patrick Ndayisaba (0788998877)\nPickup: Nyarugenge Market, Kigali\nDestination: Sonatubes Roundabout, Kicukiro\nVehicle: Motorcycle\nAmount: RWF 3,700',
      'Patrick Ndayisaba',
      '0788998877'
    );
  }

  private generateEventsForOrder(order: Order): TrackingEvent[] {
    const events: TrackingEvent[] = [];
    const createdTime = new Date(order.createdAt).getTime();

    events.push({
      id: `evt_${order.id}_1`,
      orderId: order.id,
      status: OrderStatus.PENDING,
      title: 'Order Created',
      description: 'Order request submitted and registered on Clear Express 555.',
      latitude: order.pickup.lat,
      longitude: order.pickup.lng,
      timestamp: new Date(createdTime).toISOString(),
    });

    if (order.paymentStatus === PaymentStatus.PAID) {
      events.push({
        id: `evt_${order.id}_2`,
        orderId: order.id,
        status: OrderStatus.PAID,
        title: 'Payment Confirmed',
        description: `Payment received via ${order.paymentMethod.replace('_', ' ')}. RWF ${order.pricing.total.toLocaleString()} settled.`,
        timestamp: new Date(createdTime + 2 * 60 * 1000).toISOString(),
      });
    }

    if (
      order.status === OrderStatus.DRIVER_ASSIGNED ||
      order.status === OrderStatus.DRIVER_AT_PICKUP ||
      order.status === OrderStatus.PACKAGE_PICKED_UP ||
      order.status === OrderStatus.IN_TRANSIT ||
      order.status === OrderStatus.NEAR_DESTINATION ||
      order.status === OrderStatus.DELIVERED
    ) {
      events.push({
        id: `evt_${order.id}_3`,
        orderId: order.id,
        driverId: order.driverId,
        status: OrderStatus.DRIVER_ASSIGNED,
        title: 'Driver Assigned',
        description: `${order.driverName || 'Courier'} assigned to dispatch order.`,
        latitude: order.pickup.lat + 0.005,
        longitude: order.pickup.lng - 0.004,
        timestamp: new Date(createdTime + 6 * 60 * 1000).toISOString(),
      });
    }

    if (
      order.status === OrderStatus.PACKAGE_PICKED_UP ||
      order.status === OrderStatus.IN_TRANSIT ||
      order.status === OrderStatus.NEAR_DESTINATION ||
      order.status === OrderStatus.DELIVERED
    ) {
      events.push({
        id: `evt_${order.id}_4`,
        orderId: order.id,
        driverId: order.driverId,
        status: OrderStatus.PACKAGE_PICKED_UP,
        title: 'Package Picked Up',
        description: 'Package verified and safely loaded for transit.',
        latitude: order.pickup.lat,
        longitude: order.pickup.lng,
        timestamp: new Date(createdTime + 18 * 60 * 1000).toISOString(),
      });
    }

    if (
      order.status === OrderStatus.IN_TRANSIT ||
      order.status === OrderStatus.NEAR_DESTINATION ||
      order.status === OrderStatus.DELIVERED
    ) {
      events.push({
        id: `evt_${order.id}_5`,
        orderId: order.id,
        driverId: order.driverId,
        status: OrderStatus.IN_TRANSIT,
        title: 'In Transit',
        description: 'En route to destination with live GPS tracking enabled.',
        latitude: (order.pickup.lat + order.destination.lat) / 2,
        longitude: (order.pickup.lng + order.destination.lng) / 2,
        speed: 35,
        heading: 85,
        timestamp: new Date(createdTime + 24 * 60 * 1000).toISOString(),
      });
    }

    if (order.status === OrderStatus.DELIVERED) {
      events.push({
        id: `evt_${order.id}_6`,
        orderId: order.id,
        driverId: order.driverId,
        status: OrderStatus.DELIVERED,
        title: 'Delivered',
        description: 'Package successfully delivered and recipient verified with digital proof.',
        latitude: order.destination.lat,
        longitude: order.destination.lng,
        timestamp: order.updatedAt,
      });
    }

    return events;
  }

  // Tracking number generator conforming to Section 10: CE555-RW-YYYYMMDD-000001
  public generateTrackingNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    const seq = this.orders.length + 1;
    const seqStr = String(seq).padStart(6, '0');
    return `CE555-RW-${dateStr}-${seqStr}`;
  }

  // Metrics aggregator for Admin Dashboard (Section 16)
  public getAdminMetrics(): AdminMetrics {
    const todaysOrders = this.orders.length;
    const activeDeliveries = this.orders.filter(
      (o) =>
        o.status === OrderStatus.IN_TRANSIT ||
        o.status === OrderStatus.DRIVER_ASSIGNED ||
        o.status === OrderStatus.DRIVER_AT_PICKUP ||
        o.status === OrderStatus.PACKAGE_PICKED_UP ||
        o.status === OrderStatus.NEAR_DESTINATION
    ).length;

    const deliveredPackages = this.orders.filter((o) => o.status === OrderStatus.DELIVERED).length;
    const pendingOrders = this.orders.filter(
      (o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.PAYMENT_PENDING || o.status === OrderStatus.DRIVER_SEARCHING
    ).length;

    const revenueRwf = this.orders
      .filter((o) => o.paymentStatus === PaymentStatus.PAID)
      .reduce((acc, curr) => acc + curr.pricing.total, 0);

    const activeDrivers = this.drivers.filter(
      (d) => d.status === DriverStatus.ONLINE || d.status === DriverStatus.BUSY
    ).length;

    const availableDrivers = this.drivers.filter((d) => d.status === DriverStatus.ONLINE).length;
    const failedDeliveries = this.orders.filter((o) => o.status === OrderStatus.FAILED_DELIVERY).length;
    const totalKmTraveled = this.orders.reduce((acc, curr) => acc + curr.distanceKm, 0);

    return {
      todaysOrders,
      activeDeliveries,
      deliveredPackages,
      pendingOrders,
      revenueRwf,
      activeDrivers,
      availableDrivers,
      failedDeliveries,
      totalKmTraveled: Number(totalKmTraveled.toFixed(1)),
    };
  }
}

export const store = new LogisticsDataStore();
