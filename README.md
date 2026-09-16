# CLEAR EXPRESS 555 - Logistics & Delivery Platform

> **“Anything. Anywhere. Fast.”**

A full-stack, enterprise-grade logistics and parcel delivery platform designed for Rwanda and cross-border operations. Powered by React 19, TypeScript, Tailwind CSS, Express backend, PostgreSQL with Prisma ORM, real-time GPS telemetry, and an automated dynamic road pricing engine.

---

## 1. Company Information & Direct Contact

All company contact channels are verified and linked throughout the application:

* **Company Name:** CLEAR EXPRESS 555
* **Tagline:** “Anything. Anywhere. Fast.”
* **Direct Phone:** `0798010110` (`tel:0798010110`)
* **WhatsApp Chat:** `0798010110` (`https://wa.me/250798010110`)
* **Official Email:** `clearexpress555@gmail.com` (`mailto:clearexpress555@gmail.com`)
* **Operations Center:** Kigali, Rwanda (Coverage across all 30 districts)

---

## 2. Core Features & Capabilities

1. **Services Catalog with High-Resolution Imagery:**
   * **Package Delivery**: Door-to-door retail and personal parcel transit.
   * **Document Delivery**: Waterproof, tamper-evident security pouches for legal and banking documents.
   * **E-commerce Delivery**: Last-mile fulfillment with Cash-on-Delivery (COD) cash collection.
   * **Express Delivery**: Priority dispatch with courier mobilization in under 3 minutes.
   * **Rwanda Nationwide Delivery**: Daily linehaul corridors connecting Kigali to all 30 districts.
   * **International Logistics**: Air freight and East African Community (EAC) cross-border transport.
   * **Business Delivery**: Corporate accounts with consolidated monthly VAT invoicing and bulk CSV uploads.
   * **Real-Time Package Tracking**: Live satellite GPS route map, odometer, and minute-by-minute ETA.

2. **Road-Calibrated GPS Kilometer Calculator:**
   * Real road routing calculations (via OSRM road geometry engine) rather than straight-line distance.
   * Accurate coverage of Kigali sectors and provincial hubs (Musanze, Huye, Rubavu, Rusizi, Rwamagana).

3. **Automatic Pricing Engine:**
   * Formula:
     ```text
     TOTAL = Base Fee + (Distance × Price/km) + Package Fee + Vehicle Fee + Express Fee
     ```
   * Default starting tariffs:
     * **Motorcycle**: Base RWF 1,000 | RWF 200/km
     * **Car / Salon**: Base RWF 2,000 | RWF 300/km
     * **Van / Cargo**: Base RWF 3,000 | RWF 500/km
     * **Package Types**: Document (RWF 0), Small (RWF 500), Medium (RWF 1,000), Large (RWF 2,000), Fragile (+RWF 1,500)
     * **Express Priority Surcharge**: RWF 1,000
   * Dynamic Admin Settings: All pricing rules, per-km rates, and zone multipliers can be updated live from the Admin Dashboard without changing source code.

4. **Driver Smartphone Application & Workflow:**
   * Online/Offline dispatch toggle.
   * Real-time GPS location broadcast.
   * 6-step delivery milestone tracker:
     * Navigate to Pickup ➔ Arrived ➔ Picked Up ➔ Start Delivery ➔ Arrived at Destination ➔ Complete Delivery.
   * Multi-factor **Proof of Delivery (POD)**: 4-digit recipient OTP verification, digital signature pad, delivery photo capture, and GPS coordinates.

5. **Customer & Corporate Portals:**
   * Active delivery live tracking with interactive route polyline and driver simulation.
   * Downloadable official tax invoices (RRA-compliant format) and signed POD delivery receipts.
   * Bulk order batch dispatch via CSV spreadsheet or table input.

6. **Floating WhatsApp Assistance:**
   * Bottom-right floating button linking to `https://wa.me/250798010110` with prefilled message:
     * *“Hello CLEAR EXPRESS 555, I would like to ask about your delivery services.”*

---

## 3. Database Architecture (PostgreSQL + Prisma)

The database schema is defined in `prisma/schema.prisma` with 16 comprehensive relational models:

1. `User` (Authentication, roles, contact credentials)
2. `Customer` (Profiles, saved addresses, delivery history)
3. `Driver` (Vehicle assignment, license, online status, ratings, earnings)
4. `Business` (Corporate tax ID, billing contacts, contract pricing tiers)
5. `Vehicle` (Plate number, make, model, capacity, insurance)
6. `Order` (Origin, destination, route, status, speed, timestamps)
7. `Package` (Weight, dimensions, category, fragile flag, barcode)
8. `Address` (Sector, district, street, coordinates, landmarks)
9. `TrackingEvent` (Milestone updates, telemetry, courier logs)
10. `Payment` (MoMo, Card, COD, transaction status, reference)
11. `PricingRule` (Base fees, kilometer rates, vehicle modifiers)
12. `DeliveryZone` (Provincial tariffs and zone multipliers)
13. `ProofOfDelivery` (OTP, recipient signature data, photo URL, GPS coordinates)
14. `Invoice` (Tax breakdown, itemized line items, payment status)
15. `Notification` (SMS, WhatsApp, and email dispatch logs)
16. `AuditLog` (Security and dispatch actions audit trail)

### Running Database Migrations

When connecting to your live PostgreSQL database:

```bash
# 1. Configure DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@localhost:5432/clearexpress555?schema=public"

# 2. Generate Prisma client
npx prisma generate

# 3. Apply migrations to PostgreSQL
npx prisma migrate dev --name init

# 4. View and manage data with Prisma Studio
npx prisma studio
```

---

## 4. Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server Port (Defaults to 3000)
PORT=3000

# PostgreSQL Database Connection URL
DATABASE_URL="postgresql://user:password@localhost:5432/clearexpress555?schema=public"

# Optional Payment Gateway API Credentials (MTN MoMo / Airtel Money / Card)
# When omitted, the platform runs in full Demo Mode with zero errors
MOMO_API_KEY=
MOMO_USER_ID=
MOMO_TARGET_ENVIRONMENT=sandbox

# Optional Google Gemini API Key (Server-Side)
GEMINI_API_KEY=
```

---

## 5. Development & Production Run Commands

```bash
# Install dependencies
npm install

# Run full-stack development server (Express API + Vite HMR)
npm run dev

# Run TypeScript type check
npm run lint

# Build for production (Frontend build + esbuild Node server bundle)
npm run build

# Start production server
npm start
```

---

## 6. Demo Mode & Quick Persona Switcher

The application includes an in-app **Persona Switcher** in the top navigation bar:
* **Customer Portal**: Create orders, preview road distances, pay via simulated MoMo/Card, and track live deliveries.
* **Driver Smartphone App**: Simulate incoming deliveries, step through pickup/dropoff milestones, and capture digital signatures.
* **Admin Control Center**: Live dispatch map, order dispatching, driver management, and live pricing tariff editor.
* **Business Solutions**: Bulk CSV uploads, corporate billing, and volume shipment tracking.

Sample tracking codes for instant testing:
* `CE555-RW-20260915-000001` (In Transit in Kigali)
* `CE555-RW-20260915-000002` (Near Destination)
