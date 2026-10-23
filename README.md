# Zebdecor Spatial Commerce — Next.js 16 + Headless WordPress & WebXR AR

An architectural luxury furniture and bespoke interior spatial commerce platform engineered with **Next.js 16 (App Router)**, **React 19**, **Strict TypeScript**, **WebXR / `@google/model-viewer` 3D**, and a **Decoupled Headless WordPress + WooCommerce** backend with **AetherHost** container orchestration support.

---

## Architectural Highlights (Systems & TypeScript Engineering Showcase)

### 1. Real-Time 1:1 WebXR & Apple QuickLook 3D Studio (`/ar` & Product Stage)
* **Local Binary glTF 2.0 (`.glb`) Assets (`public/models/*.glb`):** Multi-material 3D furniture meshes (`Upholstery`, `TimberPlinth`, `MarbleSlab`, `BrassAccent`, `PipingAccent`) served with `model/gltf-binary` and immutable caching headers.
* **Live Scene-Graph PBR Material Switching (`components/SpatialModelViewer.tsx`):** Dynamically updates `pbrMetallicRoughness.setBaseColorFactor` and `setRoughnessFactor` on the live WebGL mesh without reloading models.
* **1:1 Physical Metric Scaling & Live Camera Pass-Through (`app/ar/page.tsx`):** Supports WebXR (`ar-modes="webxr scene-viewer quick-look"`), dynamic scale multipliers (`240cm Petite`, `280cm Standard`, `340cm Grand`), WebRTC camera pass-through, and deterministic SVG QR handoff (`components/ARModal.tsx`).

### 2. Decoupled Headless WordPress + WooCommerce Systems Layer (`lib/cms/` & `cms/wordpress/`)
* **WordPress Must-Use Bridge Plugin (`cms/wordpress/zebdecor-headless-bridge.php`):**
  * Whitelists `.glb` (`model/gltf-binary`) and `.usdz` (`model/vnd.usdz+zip`) uploads in the WordPress Media Library with binary magic-byte verification.
  * Exposes `/wp-json/zebdecor/v1/products` and WPGraphQL fields (`zebdecorGlbUrl`, `zebdecorDimensionsMM`).
  * Dispatches asynchronous **HMAC-SHA256 signed webhooks** on `save_post_product`.
* **Constant-Time HMAC Webhook Receiver & Surgical ISR (`app/api/webhooks/wordpress/route.ts`):**
  * Verifies `X-WC-Webhook-Signature` / `X-Zebdecor-Signature` using `crypto.timingSafeEqual`.
  * Enforces delivery idempotency (`X-WC-Webhook-Delivery-ID`) and triggers surgical Next.js 16 cache invalidation via `revalidateTag(tag, 'max')`.
* **Circuit Breaker & Resilient Snapshot Fallback (`lib/cms/wordpress-service.ts`):**
  * Automatic state transitions (`CLOSED` → `OPEN` → `HALF_OPEN`) with `AbortSignal.timeout(2500)` and runtime boundary validation, guaranteeing 100% availability even if the WordPress origin is offline.

### 3. Deterministic TypeScript Pricing, BOM & Spatial Clearance Engine (`lib/domain/`)
* **Nominal / Branded Types (`lib/domain/types.ts`):** Compile-time unit safety for `Kobo`, `Millimeters`, `Kilograms`, `ProductId`, and `WebhookDeliveryId`, paired with `Result<T, E>` monads and exhaustive `assertNever` checks.
* **Interactive 2D Room-Fit & Doorway Clearance Validator (`components/RoomClearanceCalculator.tsx`):** Computes lateral/frontal walkways, doorway entry passability, floor coverage percentage, and concrete slab load (`kg/m²`) alongside multi-currency (`NGN ₦` / `USD $`) milestone payment schedules.

---

## Local Development & Spatial AR Testing

Run the development server listening on all network interfaces (`0.0.0.0`) for both local browser testing and physical mobile / WebXR AR pass-through across your local network:

```bash
npm run dev
# Or with explicit flags:
npm run dev -- -H 0.0.0.0
```

* **Local Address:** `http://localhost:3003` (or next free port)
* **Network Address:** `http://0.0.0.0:3003` (or `http://<your-lan-ip>:3003` for testing on iPhone/Android devices)

---

## Deploying to AetherHost

This project includes turnkey **AetherHost** container and Traefik v3 ingress configuration:

1. **Multi-Stage Production Container (`Dockerfile`):**
   * Built on `node:20-alpine` with an automated `HEALTHCHECK` polling `GET /api/health`.
2. **AetherHost Traefik Ingress (`docker-compose.aetherhost.yml`):**
   ```bash
   docker compose -f docker-compose.aetherhost.yml up -d --build
   ```
3. **AetherHost CLI (`aether-cli`):**
   ```bash
   aether create zebdecor --runtime nodejs
   ```
