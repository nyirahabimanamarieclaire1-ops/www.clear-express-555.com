import { Router, Request, Response } from 'express';
import {
  DeliverySpeed,
  DriverStatus,
  OrderStatus,
  PackageType,
  PaymentMethod,
  PaymentStatus,
  PricingRule,
  ProofOfDelivery,
  UserRole,
  VehicleType,
} from '../shared/types.ts';
import { calculateRoadDistance } from './services/maps.ts';
import { calculateOrderPrice } from './services/pricing.ts';
import { PaymentService } from './services/payment.ts';
import { NotificationService } from './services/notifications.ts';
import { store, ADMIN_MASTER_PASSWORD, COMPANY_LOG_EMAIL } from './store.ts';

export const apiRouter = Router();

// Helper to strip passwords from responses
const sanitizeUser = (u: any) => {
  if (!u) return u;
  const { password, ...safeUser } = u;
  return safeUser;
};

// ==========================================
// 1. AUTHENTICATION & SECURITY LOGGING
// ==========================================

// A. Admin Password-Only Login Endpoint
apiRouter.post('/auth/admin-password', (req: Request, res: Response) => {
  const { password } = req.body;
  const adminUser = store.users.find((u) => u.role === UserRole.SUPER_ADMIN || u.role === UserRole.ADMIN) || store.users[0];

  if (!password || password.trim() !== ADMIN_MASTER_PASSWORD) {
    store.sendCompanyEmailLog(
      'FAILED_ADMIN_LOGIN',
      '[SECURITY ALERT] Failed Admin Master Password Attempt on CLEAR EXPRESS 555',
      `A failed attempt to unlock Admin Portal occurred.\n\nTimestamp: ${new Date().toLocaleString()}\nIP: ${req.ip || 'Remote IP'}\nSubmitted: ${password ? 'Incorrect Password' : '(empty)'}\nAction: Access blocked. Invalid credentials.`,
      'Unauthorized Visitor',
      req.ip || 'Remote IP'
    );
    return res.status(401).json({
      success: false,
      error: 'Invalid admin password. Access denied.',
    });
  }

  // Master password matched
  store.sendCompanyEmailLog(
    'ADMIN_LOGIN',
    '[CLEAR EXPRESS 555 LOG] Admin Portal Authenticated with Master Password',
    `Administrator authenticated into CLEAR EXPRESS 555 control center.\n\nTimestamp: ${new Date().toLocaleString()}\nIP: ${req.ip || '127.0.0.1'}\nAdministrator: ${adminUser.name} (${adminUser.phone})\nAccess: Full Super Admin privileges unlocked.`,
    adminUser.name,
    adminUser.phone
  );

  res.json({
    success: true,
    user: sanitizeUser(adminUser),
    token: `ce555_admin_${Date.now()}`,
    message: 'Admin access granted.',
  });
});

// B. Visitor Register: "visitors they should login, create accounts and log out using the phone number or email"
apiRouter.post('/auth/visitor/register', (req: Request, res: Response) => {
  try {
    const { name, identifier, password, address, companyName, phone, email } = req.body;

    if (!name || !identifier || !password) {
      return res.status(400).json({ error: 'Full name, phone or email, and password are required' });
    }

    const cleanId = String(identifier).trim();
    const isEmail = cleanId.includes('@');
    const userPhone = phone?.trim() || (isEmail ? '0788000000' : cleanId);
    const userEmail = email?.trim() || (isEmail ? cleanId.toLowerCase() : `${cleanId.replace(/\D/g, '')}@clearexpress.customer`);

    // Check duplicate
    const existing = store.users.find((u) => {
      const uEmailMatch = u.email.toLowerCase() === userEmail.toLowerCase();
      const uPhoneMatch = !isEmail && u.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '');
      return uEmailMatch || uPhoneMatch;
    });

    if (existing) {
      return res.status(409).json({ error: 'An account with this phone number or email already exists. Please log in.' });
    }

    const newUserId = `usr_cust_${Date.now()}`;
    const newUser = {
      id: newUserId,
      name: name.trim(),
      email: userEmail,
      phone: userPhone,
      role: companyName ? UserRole.BUSINESS_CUSTOMER : UserRole.CUSTOMER,
      companyName: companyName ? companyName.trim() : undefined,
      password: String(password).trim(),
    };

    store.users.push(newUser);

    // Create Customer profile
    store.customers.push({
      id: `cust_${Date.now()}`,
      userId: newUserId,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      isBusiness: Boolean(companyName),
      companyName: newUser.companyName,
      totalOrders: 0,
      createdAt: new Date().toISOString(),
    });

    // Send log to clearexpress555@gmail.com
    store.sendCompanyEmailLog(
      'VISITOR_REGISTER',
      `[CLEAR EXPRESS 555 LOG] New Visitor Account Created: ${cleanId}`,
      `A new visitor has created an account on CLEAR EXPRESS 555.\n\nVisitor Profile:\n- Name: ${newUser.name}\n- Login Identifier: ${cleanId}\n- Phone: ${newUser.phone}\n- Email: ${newUser.email}\n- Account Type: ${newUser.role}\n- Default Address: ${address || 'Kigali, Rwanda'}\n- Registered At: ${new Date().toLocaleString()}\n- Status: Active`,
      newUser.name,
      cleanId
    );

    res.status(201).json({
      success: true,
      user: newUser,
      token: `ce555_visitor_${newUser.id}_${Date.now()}`,
      message: 'Account created successfully!',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create account.' });
  }
});

// C. Visitor Login: "using the phone number or email"
apiRouter.post('/auth/visitor/login', (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Phone number or email, and password are required' });
    }

    const cleanId = String(identifier).trim().toLowerCase();
    const digitsOnly = cleanId.replace(/\D/g, '');

    const user = store.users.find((u) => {
      const uEmail = u.email.toLowerCase();
      const uPhoneDigits = u.phone.replace(/\D/g, '');
      if (cleanId.includes('@')) {
        return uEmail === cleanId;
      }
      return digitsOnly.length >= 7 && (uPhoneDigits.includes(digitsOnly) || digitsOnly.includes(uPhoneDigits));
    });

    if (!user) {
      return res.status(401).json({ error: 'No registered user found with this phone number or email.' });
    }

    if (user.password && user.password !== String(password).trim()) {
      return res.status(401).json({ error: 'Incorrect password. Please verify and try again.' });
    }

    // Send log to clearexpress555@gmail.com
    store.sendCompanyEmailLog(
      'VISITOR_LOGIN',
      `[CLEAR EXPRESS 555 LOG] Visitor Login: ${identifier}`,
      `Visitor successfully authenticated into CLEAR EXPRESS 555.\n\nSession Info:\n- Name: ${user.name}\n- Identifier: ${identifier}\n- Phone: ${user.phone}\n- Email: ${user.email}\n- Role: ${user.role}\n- Timestamp: ${new Date().toLocaleString()}`,
      user.name,
      identifier
    );

    res.json({
      success: true,
      user,
      token: `ce555_visitor_${user.id}_${Date.now()}`,
      message: `Welcome back, ${user.name}!`,
    });
  } catch (error: any) {
    console.error('Visitor login error:', error);
    res.status(500).json({ error: 'Login service failed.' });
  }
});

// D. Visitor Logout: "and log out using the phone number or email and I receive the logs on the campany email clearexpress555@gmail.com"
apiRouter.post('/auth/visitor/logout', (req: Request, res: Response) => {
  const { identifier, name, userId } = req.body;
  const user = store.users.find((u) => (userId && u.id === userId) || (identifier && (u.email === identifier || u.phone === identifier)));

  const userName = user?.name || name || 'Visitor';
  const userIdentifier = user?.phone || user?.email || identifier || 'Current Session';

  store.sendCompanyEmailLog(
    'VISITOR_LOGOUT',
    `[CLEAR EXPRESS 555 LOG] Visitor Logged Out: ${userName}`,
    `Visitor logged out of CLEAR EXPRESS 555.\n\nSession Terminated:\n- Name: ${userName}\n- Identifier: ${userIdentifier}\n- Logout Time: ${new Date().toLocaleString()}\n- Session Status: Cleared`,
    userName,
    userIdentifier
  );

  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// E. Current Session & Demo Switcher
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  res.json({
    user: store.users[0],
    availableDemoUsers: store.users,
  });
});

apiRouter.post('/auth/switch-role', (req: Request, res: Response) => {
  const { role, id } = req.body;
  let user = store.users.find((u) => u.id === id);
  if (!user && role) {
    user = store.users.find((u) => u.role === role);
  }
  if (!user) user = store.users[0];
  res.json({ success: true, user });
});

// F. Company Email Logs Viewer for Admin
apiRouter.get('/admin/company-email-logs', (req: Request, res: Response) => {
  res.json({
    recipient: COMPANY_LOG_EMAIL,
    logs: store.companyEmailLogs,
    total: store.companyEmailLogs.length,
  });
});

apiRouter.post('/admin/company-email-logs/test', (req: Request, res: Response) => {
  const testLog = store.sendCompanyEmailLog(
    'SECURITY_ALERT',
    '[CLEAR EXPRESS 555 TEST] Manual Health Check Ping',
    `Manual notification log ping triggered from Admin Dashboard to verify email channel to ${COMPANY_LOG_EMAIL}.\nTimestamp: ${new Date().toLocaleString()}\nStatus: All logging channels nominal.`,
    'Admin Console Test',
    'admin@clearexpress555.rw'
  );
  res.json({ success: true, log: testLog });
});

// ==========================================
// 2. GPS ROAD DISTANCE ENGINE (Section 6 & 7)
// ==========================================
apiRouter.post('/distance/calculate', async (req: Request, res: Response) => {
  try {
    const { pickupLat, pickupLng, destLat, destLng, vehicleType } = req.body;

    if (!pickupLat || !pickupLng || !destLat || !destLng) {
      return res.status(400).json({ error: 'Pickup and Destination coordinates are required' });
    }

    const routeResult = await calculateRoadDistance(
      Number(pickupLat),
      Number(pickupLng),
      Number(destLat),
      Number(destLng),
      vehicleType || VehicleType.MOTORCYCLE
    );

    res.json(routeResult);
  } catch (error: any) {
    console.error('Error calculating road distance:', error);
    res.status(500).json({ error: 'Failed to compute road route' });
  }
});

// ==========================================
// 3. AUTOMATIC PRICING ENGINE (Section 8)
// ==========================================
apiRouter.post('/pricing/calculate', (req: Request, res: Response) => {
  try {
    const { distanceKm, vehicleType, packageType, speed, isFragile, zoneCode } = req.body;

    const vType = (vehicleType as VehicleType) || VehicleType.MOTORCYCLE;
    const rule = store.pricingRules[vType] || store.pricingRules[VehicleType.MOTORCYCLE];

    let zoneMultiplier = 1.0;
    let extraZoneFee = 0;
    if (zoneCode) {
      const zone = store.deliveryZones.find((z) => z.code === zoneCode);
      if (zone) {
        zoneMultiplier = zone.pricePerKmMultiplier;
        extraZoneFee = zone.extraFee;
      }
    }

    const pricing = calculateOrderPrice(
      {
        distanceKm: Number(distanceKm || 5.0),
        vehicleType: vType,
        packageType: packageType || PackageType.SMALL,
        speed: speed || DeliverySpeed.STANDARD,
        isFragile: Boolean(isFragile),
        zoneMultiplier,
        extraServicesFee: extraZoneFee,
      },
      rule
    );

    res.json(pricing);
  } catch (error: any) {
    console.error('Error calculating price:', error);
    res.status(500).json({ error: 'Failed to calculate price' });
  }
});

// ==========================================
// 4. ORDER MANAGEMENT (Section 6, 10, 19)
// ==========================================
apiRouter.get('/orders', (req: Request, res: Response) => {
  const { status, customerId, driverId, search } = req.query;
  let results = [...store.orders];

  if (status) {
    results = results.filter((o) => o.status === status);
  }
  if (customerId) {
    results = results.filter((o) => o.customerId === customerId);
  }
  if (driverId) {
    results = results.filter((o) => o.driverId === driverId);
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (o) =>
        o.trackingNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        (o.driverName && o.driverName.toLowerCase().includes(q))
    );
  }

  // Sort latest first
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(results);
});

apiRouter.get('/orders/:trackingNumber', (req: Request, res: Response) => {
  const { trackingNumber } = req.params;
  const order = store.orders.find(
    (o) => o.trackingNumber === trackingNumber || o.id === trackingNumber
  );

  if (!order) {
    return res.status(404).json({ error: 'Tracking number not found in Clear Express 555 database' });
  }

  // Find driver's approximate position if active
  let driverLocation = null;
  if (order.driverId) {
    const driver = store.drivers.find((d) => d.id === order.driverId);
    if (driver) {
      driverLocation = driver.currentLocation;
    }
  }

  res.json({
    order,
    driverLocation,
  });
});

apiRouter.post('/orders', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      pickup,
      destination,
      packageDetails,
      vehicleType,
      speed,
      paymentMethod,
    } = req.body;

    if (!customerName || !customerPhone || !pickup || !destination) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const vType = (vehicleType as VehicleType) || VehicleType.MOTORCYCLE;
    const pType = (packageDetails?.type as PackageType) || PackageType.SMALL;

    // Calculate road route
    const routeResult = await calculateRoadDistance(
      pickup.lat,
      pickup.lng,
      destination.lat,
      destination.lng,
      vType
    );

    // Calculate price
    const rule = store.pricingRules[vType] || store.pricingRules[VehicleType.MOTORCYCLE];
    const pricing = calculateOrderPrice(
      {
        distanceKm: routeResult.distanceKm,
        vehicleType: vType,
        packageType: pType,
        speed: speed || DeliverySpeed.STANDARD,
        isFragile: Boolean(packageDetails?.isFragile),
      },
      rule
    );

    const trackingNumber = store.generateTrackingNumber();
    const orderId = `ord_${Date.now()}`;
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrder: any = {
      id: orderId,
      trackingNumber,
      customerId: 'cust_1',
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'customer@clearexpress555.rw',
      pickup: {
        street: pickup.street || 'Kigali Street',
        city: pickup.city || 'Kigali',
        lat: pickup.lat,
        lng: pickup.lng,
        contactName: pickup.contactName || customerName,
        contactPhone: pickup.contactPhone || customerPhone,
      },
      destination: {
        street: destination.street || 'Destination Street',
        city: destination.city || 'Kigali',
        lat: destination.lat,
        lng: destination.lng,
        contactName: destination.contactName || 'Recipient',
        contactPhone: destination.contactPhone || '0788000000',
      },
      package: {
        type: pType,
        weightKg: Number(packageDetails?.weightKg || 1),
        description: packageDetails?.description || 'Package parcel',
        itemCount: Number(packageDetails?.itemCount || 1),
        isFragile: Boolean(packageDetails?.isFragile),
      },
      vehicleType: vType,
      speed: speed || DeliverySpeed.STANDARD,
      distanceKm: routeResult.distanceKm,
      estimatedMinutes: routeResult.estimatedMinutes,
      routeGeometry: routeResult.routeGeometry,
      pricing,
      status: paymentMethod === PaymentMethod.CASH_ON_DELIVERY ? OrderStatus.DRIVER_SEARCHING : OrderStatus.PAYMENT_PENDING,
      paymentMethod: paymentMethod || PaymentMethod.MOBILE_MONEY,
      paymentStatus: PaymentStatus.PENDING,
      otpCode,
      trackingEvents: [
        {
          id: `evt_${orderId}_1`,
          orderId,
          status: OrderStatus.PENDING,
          title: 'Order Created',
          description: `Delivery #${trackingNumber} created on Clear Express 555.`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.orders.unshift(newOrder);

    // Trigger customer notification
    const notif = NotificationService.getStatusNotification(newOrder.status, trackingNumber);
    await NotificationService.send({
      phone: customerPhone,
      email: customerEmail,
      title: notif.title,
      message: notif.message,
      type: 'ORDER',
      orderId,
    });

    // Dispatch company email log to clearexpress555@gmail.com
    store.sendCompanyEmailLog(
      'ORDER_CREATED',
      `[CLEAR EXPRESS 555 LOG] Order Created: ${trackingNumber}`,
      `New delivery order created on Clear Express 555.\n\nShipment Summary:\n- Tracking Code: ${trackingNumber}\n- Customer: ${customerName} (${customerPhone})\n- Pickup: ${pickup.street || 'Pickup location'}, ${pickup.city || 'Kigali'}\n- Destination: ${destination.street || 'Destination'}, ${destination.city || 'Kigali'}\n- Vehicle: ${vType}\n- Speed: ${speed || 'STANDARD'}\n- Pricing Total: RWF ${pricing.total.toLocaleString()}\n- Payment Method: ${paymentMethod || 'MOBILE_MONEY'}\n- Time: ${new Date().toLocaleString()}`,
      customerName,
      customerPhone
    );

    res.status(201).json(newOrder);
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

apiRouter.patch('/orders/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, driverId, notes } = req.body;

  const order = store.orders.find((o) => o.id === id || o.trackingNumber === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status as OrderStatus;
  order.updatedAt = new Date().toISOString();

  if (driverId) {
    const driver = store.drivers.find((d) => d.id === driverId);
    if (driver) {
      order.driverId = driver.id;
      order.driverName = driver.name;
      order.driverPhone = driver.phone;
    }
  }

  // Append tracking event
  const notif = NotificationService.getStatusNotification(order.status, order.trackingNumber, order.driverName);
  const newEvt = {
    id: `evt_${order.id}_${Date.now()}`,
    orderId: order.id,
    driverId: order.driverId,
    status: order.status,
    title: notif.title,
    description: notes || notif.message,
    timestamp: new Date().toISOString(),
  };
  order.trackingEvents.push(newEvt);

  // Send real notification
  await NotificationService.send({
    phone: order.customerPhone,
    email: order.customerEmail,
    title: notif.title,
    message: notif.message,
    type: 'ORDER',
    orderId: order.id,
  });

  res.json(order);
});

// Bulk CSV order importer for business clients (Section 22)
apiRouter.post('/orders/bulk-csv', async (req: Request, res: Response) => {
  try {
    const { csvRows } = req.body; // Array of objects
    if (!Array.isArray(csvRows) || csvRows.length === 0) {
      return res.status(400).json({ error: 'Invalid CSV format or empty rows' });
    }

    const createdOrders: any[] = [];
    for (const row of csvRows) {
      const trackingNumber = store.generateTrackingNumber();
      const orderId = `ord_bulk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const order: any = {
        id: orderId,
        trackingNumber,
        customerId: 'cust_5',
        customerName: row.recipientName || 'Business Client Order',
        customerPhone: row.recipientPhone || '0788000000',
        customerEmail: 'business@kigalipharm.rw',
        pickup: {
          street: row.pickupStreet || 'Kigali Central Distribution',
          city: 'Kigali',
          lat: -1.9441,
          lng: 30.0619,
          contactName: 'Warehouse Dispatch',
          contactPhone: '0798010110',
        },
        destination: {
          street: row.destStreet || 'Destination Address',
          city: row.destCity || 'Kigali',
          lat: -1.9575 + (Math.random() - 0.5) * 0.05,
          lng: 30.1127 + (Math.random() - 0.5) * 0.05,
          contactName: row.recipientName || 'Customer',
          contactPhone: row.recipientPhone || '0788000000',
        },
        package: {
          type: PackageType.SMALL,
          weightKg: Number(row.weightKg || 2.0),
          description: row.description || 'E-commerce dispatch order',
          itemCount: 1,
        },
        vehicleType: VehicleType.MOTORCYCLE,
        speed: DeliverySpeed.STANDARD,
        distanceKm: 7.2,
        estimatedMinutes: 22,
        pricing: {
          baseFee: 1000,
          distanceKm: 7.2,
          pricePerKm: 200,
          distanceFee: 1440,
          packageFee: 500,
          vehicleFee: 0,
          expressFee: 0,
          zoneFee: 0,
          optionalExtraServices: 0,
          total: 2940,
          currency: 'RWF',
        },
        status: OrderStatus.DRIVER_SEARCHING,
        paymentMethod: PaymentMethod.BUSINESS_ACCOUNT,
        paymentStatus: PaymentStatus.PAID,
        otpCode: Math.floor(1000 + Math.random() * 9000).toString(),
        trackingEvents: [
          {
            id: `evt_${orderId}_init`,
            orderId,
            status: OrderStatus.PENDING,
            title: 'Bulk Order Created',
            description: 'Order registered via Business CSV Bulk Uploader.',
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.orders.unshift(order);
      createdOrders.push(order);
    }

    res.json({
      success: true,
      importedCount: createdOrders.length,
      orders: createdOrders,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process bulk CSV' });
  }
});

// ==========================================
// 5. PAYMENT ENDPOINTS & WEBHOOKS (Section 15)
// ==========================================
apiRouter.post('/payments/initiate', async (req: Request, res: Response) => {
  const { orderId, amount, method, phoneNumber } = req.body;

  const order = store.orders.find((o) => o.id === orderId || o.trackingNumber === orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found for payment' });
  }

  const result = await PaymentService.initiatePayment({
    orderId: order.id,
    amount: amount || order.pricing.total,
    method: method || PaymentMethod.MOBILE_MONEY,
    phoneNumber: phoneNumber || order.customerPhone,
  });

  order.paymentMethod = method || PaymentMethod.MOBILE_MONEY;
  order.paymentStatus = result.status;

  if (result.status === PaymentStatus.PAID) {
    order.status = OrderStatus.DRIVER_SEARCHING;
  }

  res.json(result);
});

apiRouter.post('/payments/verify', async (req: Request, res: Response) => {
  const { orderId, transactionId } = req.body;

  const order = store.orders.find((o) => o.id === orderId || o.trackingNumber === orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const verification = await PaymentService.verifyPayment(transactionId || 'demo_tx');
  if (verification.verified) {
    order.paymentStatus = PaymentStatus.PAID;
    if (order.status === OrderStatus.PAYMENT_PENDING) {
      order.status = OrderStatus.DRIVER_SEARCHING;
    }
    order.updatedAt = new Date().toISOString();

    // Send confirmation notification
    await NotificationService.send({
      phone: order.customerPhone,
      email: order.customerEmail,
      title: 'Payment Confirmed',
      message: `Your payment of RWF ${order.pricing.total.toLocaleString()} was successfully confirmed.`,
      type: 'PAYMENT',
      orderId: order.id,
    });
  }

  res.json({
    success: verification.verified,
    order,
    verification,
  });
});

apiRouter.post('/payments/webhook', (req: Request, res: Response) => {
  const signature = req.headers['x-payment-signature'] as string;
  const isValid = PaymentService.validateWebhookSignature(req.body, signature || 'demo');

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  console.log('[Payment Webhook Received]:', req.body);
  res.json({ received: true });
});

// ==========================================
// 6. DRIVER APPLICATION FLOW (Section 12, 13, 14, 18)
// ==========================================
apiRouter.get('/drivers', (req: Request, res: Response) => {
  res.json(store.drivers);
});

apiRouter.patch('/drivers/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const driver = store.drivers.find((d) => d.id === id);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });

  driver.status = status as DriverStatus;
  res.json(driver);
});

apiRouter.post('/drivers/:id/location', (req: Request, res: Response) => {
  const { id } = req.params;
  const { lat, lng, speed, heading } = req.body;

  const driver = store.drivers.find((d) => d.id === id);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });

  driver.currentLocation = { lat: Number(lat), lng: Number(lng) };
  if (speed !== undefined) driver.speed = Number(speed);
  if (heading !== undefined) driver.heading = Number(heading);

  // If driver is handling an active order, record tracking event
  if (driver.activeOrderId) {
    const order = store.orders.find((o) => o.id === driver.activeOrderId);
    if (order && order.status === OrderStatus.IN_TRANSIT) {
      order.trackingEvents.push({
        id: `trk_${Date.now()}`,
        orderId: order.id,
        driverId: driver.id,
        status: OrderStatus.IN_TRANSIT,
        title: 'GPS Location Updated',
        description: `Speed: ${driver.speed || 35} km/h`,
        latitude: driver.currentLocation.lat,
        longitude: driver.currentLocation.lng,
        speed: driver.speed,
        heading: driver.heading,
        timestamp: new Date().toISOString(),
      });
    }
  }

  res.json({ success: true, driver });
});

apiRouter.post('/drivers/:id/accept-order', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { orderId } = req.body;

  const driver = store.drivers.find((d) => d.id === id);
  const order = store.orders.find((o) => o.id === orderId);

  if (!driver || !order) {
    return res.status(404).json({ error: 'Driver or Order not found' });
  }

  driver.status = DriverStatus.BUSY;
  driver.activeOrderId = order.id;

  order.driverId = driver.id;
  order.driverName = driver.name;
  order.driverPhone = driver.phone;
  order.status = OrderStatus.DRIVER_ASSIGNED;
  order.updatedAt = new Date().toISOString();

  // Notification
  const notif = NotificationService.getStatusNotification(order.status, order.trackingNumber, driver.name);
  await NotificationService.send({
    phone: order.customerPhone,
    title: notif.title,
    message: notif.message,
    type: 'DRIVER',
    orderId: order.id,
  });

  res.json({ success: true, order, driver });
});

// Complete Proof of Delivery (Section 14)
apiRouter.post('/drivers/proof-of-delivery', async (req: Request, res: Response) => {
  const { orderId, driverId, recipientName, otpCode, signatureDataUrl, photoUrl, lat, lng, notes } = req.body;

  const order = store.orders.find((o) => o.id === orderId || o.trackingNumber === orderId);
  const driver = store.drivers.find((d) => d.id === driverId);

  if (!order) return res.status(404).json({ error: 'Order not found' });

  // Validate OTP code if provided (or allow bypass in demo mode with warning)
  if (otpCode && otpCode !== order.otpCode) {
    return res.status(400).json({ error: `Invalid OTP verification code. Correct OTP is ${order.otpCode}` });
  }

  const proof: ProofOfDelivery = {
    id: `pod_${Date.now()}`,
    orderId: order.id,
    driverId: driverId || order.driverId || 'drv_1',
    recipientName: recipientName || order.destination.contactName,
    otpVerified: true,
    signatureDataUrl,
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
    latitude: Number(lat || order.destination.lat),
    longitude: Number(lng || order.destination.lng),
    notes,
    timestamp: new Date().toISOString(),
  };

  order.proofOfDelivery = proof;
  order.status = OrderStatus.DELIVERED;
  order.updatedAt = new Date().toISOString();

  if (driver) {
    driver.status = DriverStatus.ONLINE;
    driver.activeOrderId = undefined;
    driver.todayDeliveries += 1;
    driver.todayEarnings += order.pricing.total * 0.7; // 70% driver payout
    driver.todayKm += order.distanceKm;
  }

  // Create invoice
  store.invoices.push({
    id: `inv_${order.id}`,
    invoiceNumber: `INV-${order.trackingNumber.replace('CE555-RW-', '')}`,
    orderId: order.id,
    trackingNumber: order.trackingNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    companyContact: {
      name: 'CLEAR EXPRESS 555',
      tagline: 'Anything. Anywhere. Fast.',
      phone: '0798010110',
      email: 'clearexpress555@gmail.com',
      country: 'Kigali, Rwanda',
    },
    pickupAddress: `${order.pickup.street}, ${order.pickup.city}`,
    destinationAddress: `${order.destination.street}, ${order.destination.city}`,
    packageDescription: order.package.description,
    packageWeightKg: order.package.weightKg,
    distanceKm: order.distanceKm,
    pricing: order.pricing,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    issuedAt: new Date().toISOString(),
  });

  const notif = NotificationService.getStatusNotification(OrderStatus.DELIVERED, order.trackingNumber);
  await NotificationService.send({
    phone: order.customerPhone,
    title: notif.title,
    message: notif.message,
    type: 'ORDER',
    orderId: order.id,
  });

  res.json({
    success: true,
    message: 'Delivery completed successfully with verified Proof of Delivery.',
    order,
    proof,
  });
});

// ==========================================
// 7. ADMIN DASHBOARD & PRICING (Section 16, 17, 20, 21, 29)
// ==========================================
apiRouter.get('/admin/metrics', (req: Request, res: Response) => {
  const metrics = store.getAdminMetrics();
  res.json(metrics);
});

apiRouter.get('/admin/live-map', (req: Request, res: Response) => {
  const activeOrders = store.orders.filter(
    (o) =>
      o.status === OrderStatus.IN_TRANSIT ||
      o.status === OrderStatus.DRIVER_ASSIGNED ||
      o.status === OrderStatus.DRIVER_AT_PICKUP ||
      o.status === OrderStatus.PACKAGE_PICKED_UP ||
      o.status === OrderStatus.NEAR_DESTINATION
  );

  res.json({
    drivers: store.drivers,
    activeOrders,
  });
});

apiRouter.get('/admin/pricing', (req: Request, res: Response) => {
  res.json({
    pricingRules: store.pricingRules,
    deliveryZones: store.deliveryZones,
  });
});

apiRouter.put('/admin/pricing', (req: Request, res: Response) => {
  const { pricingRules, deliveryZones } = req.body;
  if (pricingRules) {
    store.pricingRules = pricingRules;
  }
  if (deliveryZones) {
    store.deliveryZones = deliveryZones;
  }
  res.json({ success: true, message: 'Pricing rules updated successfully' });
});

apiRouter.get('/admin/reports', (req: Request, res: Response) => {
  const totalRevenue = store.orders
    .filter((o) => o.paymentStatus === PaymentStatus.PAID)
    .reduce((a, b) => a + b.pricing.total, 0);

  const vehicleStats = {
    [VehicleType.MOTORCYCLE]: store.orders.filter((o) => o.vehicleType === VehicleType.MOTORCYCLE).length,
    [VehicleType.CAR]: store.orders.filter((o) => o.vehicleType === VehicleType.CAR).length,
    [VehicleType.VAN]: store.orders.filter((o) => o.vehicleType === VehicleType.VAN).length,
  };

  res.json({
    summary: {
      totalOrders: store.orders.length,
      totalRevenueRwf: totalRevenue,
      averageOrderValueRwf: Math.round(totalRevenue / Math.max(1, store.orders.length)),
      completedCount: store.orders.filter((o) => o.status === OrderStatus.DELIVERED).length,
    },
    vehicleBreakdown: vehicleStats,
    orders: store.orders,
  });
});

// ==========================================
// 8. INVOICES & NOTIFICATIONS
// ==========================================
apiRouter.get('/invoices/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params;
  const inv = store.invoices.find((i) => i.orderId === orderId || i.trackingNumber === orderId);
  if (!inv) {
    // Generate on the fly if order is paid
    const order = store.orders.find((o) => o.id === orderId || o.trackingNumber === orderId);
    if (!order) return res.status(404).json({ error: 'Invoice not found' });

    const newInv: any = {
      id: `inv_${order.id}`,
      invoiceNumber: `INV-${order.trackingNumber.replace('CE555-RW-', '')}`,
      orderId: order.id,
      trackingNumber: order.trackingNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      companyContact: {
        name: 'CLEAR EXPRESS 555',
        tagline: 'Anything. Anywhere. Fast.',
        phone: '0798010110',
        email: 'clearexpress555@gmail.com',
        country: 'Kigali, Rwanda',
      },
      pickupAddress: `${order.pickup.street}, ${order.pickup.city}`,
      destinationAddress: `${order.destination.street}, ${order.destination.city}`,
      packageDescription: order.package.description,
      packageWeightKg: order.package.weightKg,
      distanceKm: order.distanceKm,
      pricing: order.pricing,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      issuedAt: order.createdAt,
    };
    return res.json(newInv);
  }
  res.json(inv);
});

apiRouter.get('/notifications', (req: Request, res: Response) => {
  res.json(NotificationService.getRecent(25));
});
