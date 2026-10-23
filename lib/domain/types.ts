/**
 * ZEBDECOR SPATIAL COMMERCE — CORE TYPESCRIPT DOMAIN LAYER
 * Demonstrates Nominal/Branded Types, Discriminated Unions, Exhaustive Pattern Matching,
 * and Zero-Exception Result Monads for Senior TypeScript & Systems Engineering.
 */

// 1. Nominal / Branded Primitive Types (Compile-time unit safety)
declare const __brand: unique symbol;
export type Brand<T, B extends string> = T & { readonly [__brand]: B };

export type Kobo = Brand<number, 'Kobo'>;
export type Millimeters = Brand<number, 'Millimeters'>;
export type Kilograms = Brand<number, 'Kilograms'>;
export type ProductId = Brand<string, 'ProductId'>;
export type WebhookDeliveryId = Brand<string, 'WebhookDeliveryId'>;

// Safe Brand Constructors & Unit Converters
export const toKobo = (nairaAmount: number): Kobo =>
  Math.round(nairaAmount * 100) as Kobo;

export const parseNairaStringToKobo = (formatted: string): Kobo => {
  const numeric = Number(formatted.replace(/[^0-9.]/g, ''));
  return toKobo(Number.isFinite(numeric) ? numeric : 0);
};

export const formatKoboToNaira = (kobo: Kobo): string => {
  const naira = Math.round(kobo / 100);
  return `₦${naira.toLocaleString('en-NG')}`;
};

export const formatKoboToUSD = (kobo: Kobo, exchangeRateNgnPerUsd = 1600): string => {
  const usd = Math.round(kobo / 100 / exchangeRateNgnPerUsd);
  return `$${usd.toLocaleString('en-US')}`;
};

export const toMillimeters = (mm: number): Millimeters =>
  Math.max(0, Math.round(mm)) as Millimeters;

export const toKilograms = (kg: number): Kilograms =>
  Math.max(0, Math.round(kg * 10) / 10) as Kilograms;

export const toProductId = (id: string): ProductId =>
  id.trim().toLowerCase() as ProductId;

// 2. Functional Result Type (Explicit Error Handling without Uncaught Exceptions)
export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const Err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export function assertNever(value: never, message = 'Unhandled discriminated union member'): never {
  throw new Error(`${message}: ${JSON.stringify(value)}`);
}

// 3. 3D Scene-Graph & WebXR AR Domain Types
export type PBRMaterialSlot = 'Upholstery' | 'TimberPlinth' | 'MarbleSlab' | 'BrassAccent' | 'PipingAccent';

export interface PBRMaterialOverride {
  readonly slot: PBRMaterialSlot;
  readonly label: string;
  readonly hexColor: string;
  readonly baseColorFactor: readonly [number, number, number, number];
  readonly roughnessFactor: number;
  readonly metallicFactor: number;
}

export interface SpatialBoundingBoxMM {
  readonly lengthMM: Millimeters;
  readonly depthMM: Millimeters;
  readonly heightMM: Millimeters;
}

export interface SpatialModelConfig {
  readonly glbPath: string;
  readonly usdzPath?: string;
  readonly posterUrl: string;
  readonly baseDimensions: SpatialBoundingBoxMM;
  readonly defaultCameraOrbit: string;
  readonly materialPresets: Record<string, readonly PBRMaterialOverride[]>;
}

// 4. Room-Fit & Architectural Clearance Engineering Types
export interface RoomDimensionsInput {
  readonly roomLengthMM: Millimeters;
  readonly roomWidthMM: Millimeters;
  readonly doorwayWidthMM: Millimeters;
  readonly ceilingHeightMM?: Millimeters;
}

export type ClearanceStatus = 'OPTIMAL_FIT' | 'TIGHT_CIRCULATION' | 'SPLIT_JOINERY_REQUIRED';

export interface SpatialClearanceReport {
  readonly status: ClearanceStatus;
  readonly headline: string;
  readonly recommendation: string;
  readonly frontBackWalkwayMM: Millimeters;
  readonly sideWalkwayMM: Millimeters;
  readonly minEntryDiagonalMM: Millimeters;
  readonly fitsThroughDoorway: boolean;
  readonly floorCoveragePercent: number;
  readonly estimatedFloorLoadKgPerSqm: number;
  readonly requiresSplitJoinery: boolean;
}

// 5. E-Commerce Pricing, BOM & Instalment Schedule Types
export type NigerianDeliveryZone =
  | 'ABUJA_FCT'
  | 'LAGOS_ISLAND'
  | 'PORT_HARCOURT'
  | 'KANO_KADUNA'
  | 'WEST_AFRICA_EXPORT';

export type PaymentPlanType =
  | 'FULL_SETTLEMENT'
  | 'COMMISSION_DEPOSIT_40_60'
  | 'MILESTONE_3_MONTH'
  | 'MILESTONE_6_MONTH';

export interface InstalmentMilestone {
  readonly stepNumber: number;
  readonly title: string;
  readonly timing: string;
  readonly percentage: number;
  readonly amountKobo: Kobo;
  readonly formattedNaira: string;
  readonly formattedUSD: string;
}

export interface CommissionQuoteBreakdown {
  readonly quoteReference: string;
  readonly productId: ProductId;
  readonly productName: string;
  readonly basePriceKobo: Kobo;
  readonly scaleAdjustmentKobo: Kobo;
  readonly materialUpgradeKobo: Kobo;
  readonly logisticsKobo: Kobo;
  readonly privilegeDiscountKobo: Kobo;
  readonly vatKobo: Kobo;
  readonly totalInvestmentKobo: Kobo;
  readonly formattedTotalNaira: string;
  readonly formattedTotalUSD: string;
  readonly dueTodayKobo: Kobo;
  readonly formattedDueTodayNaira: string;
  readonly formattedDueTodayUSD: string;
  readonly estimatedWeightKg: Kilograms;
  readonly leadTimeWeeks: readonly [number, number];
  readonly milestones: readonly InstalmentMilestone[];
}

// 6. Headless WordPress / WooCommerce Systems Telemetry Types
export type CircuitBreakerState = 'CLOSED' | 'HALF_OPEN' | 'OPEN';
export type CMSDataSource = 'WORDPRESS_HEADLESS_GRAPHQL' | 'WOOCOMMERCE_REST_V3' | 'RESILIENT_STATIC_SNAPSHOT';

export interface WebhookEventRecord {
  readonly deliveryId: WebhookDeliveryId;
  readonly topic: 'product.updated' | 'product.created' | 'product.deleted' | 'inventory.synced';
  readonly productSlug: string;
  readonly revalidatedTags: readonly string[];
  readonly hmacVerified: boolean;
  readonly receivedAtIso: string;
  readonly processingLatencyMs: number;
}

export interface SystemsHealthTelemetry {
  readonly timestampIso: string;
  readonly nodeVersion: string;
  readonly activeAdapter: CMSDataSource;
  readonly wpOriginConfigured: boolean;
  readonly wpOriginUrl: string;
  readonly circuitBreaker: {
    readonly state: CircuitBreakerState;
    readonly consecutiveFailures: number;
    readonly lastFailureIso: string | null;
    readonly lastLatencyMs: number;
  };
  readonly cacheMetrics: {
    readonly strategy: string;
    readonly activeTags: readonly string[];
    readonly totalRevalidations: number;
  };
  readonly recentWebhooks: readonly WebhookEventRecord[];
  readonly memoryUsageMB: {
    readonly rss: number;
    readonly heapUsed: number;
    readonly heapTotal: number;
  };
}
