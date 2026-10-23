'use client';

import React, { useMemo, useState } from 'react';
import {
  calculateCommissionQuote,
  evaluateSpatialClearance,
  parseDimensionsMM,
} from '@/lib/domain/pricing-engine';
import {
  NigerianDeliveryZone,
  PaymentPlanType,
  toMillimeters,
} from '@/lib/domain/types';

interface RoomClearanceCalculatorProps {
  productId: string;
  productName: string;
  basePriceFormatted: string;
  rawDimensions: string;
  selectedScaleDimension?: string;
  selectedScalePrice?: string;
  selectedMaterialName?: string;
  selectedTimberName?: string;
}

const DELIVERY_ZONE_LABELS: Record<NigerianDeliveryZone, string> = {
  ABUJA_FCT: 'Abuja FCT (Maitama / Asokoro / Guzape) — Complimentary',
  LAGOS_ISLAND: 'Lagos (Ikoyi / Victoria Island / Lekki) — Air-Ride Crate',
  PORT_HARCOURT: 'Port Harcourt (GRA Phase II / Peter Odili)',
  KANO_KADUNA: 'Kaduna / Kano Executive Corridor',
  WEST_AFRICA_EXPORT: 'ECOWAS / International Museum Crating',
};

const PAYMENT_PLAN_LABELS: Record<PaymentPlanType, string> = {
  COMMISSION_DEPOSIT_40_60: '40% Commission Deposit + 60% Pre-Dispatch',
  FULL_SETTLEMENT: '100% Upfront Settlement (5% Privilege Rebate)',
  MILESTONE_3_MONTH: '3-Month Executive Milestone Plan (0% Interest)',
  MILESTONE_6_MONTH: '6-Month Turnkey Villa Plan',
};

export default function RoomClearanceCalculator({
  productId,
  productName,
  basePriceFormatted,
  rawDimensions,
  selectedScaleDimension,
  selectedScalePrice,
  selectedMaterialName,
  selectedTimberName,
}: RoomClearanceCalculatorProps) {
  const [roomLengthMM, setRoomLengthMM] = useState(5200);
  const [roomWidthMM, setRoomWidthMM] = useState(4000);
  const [doorwayWidthMM, setDoorwayWidthMM] = useState(900);
  const [deliveryZone, setDeliveryZone] = useState<NigerianDeliveryZone>('ABUJA_FCT');
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlanType>('COMMISSION_DEPOSIT_40_60');
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');

  const furnitureDims = useMemo(
    () => parseDimensionsMM(rawDimensions, selectedScaleDimension),
    [rawDimensions, selectedScaleDimension]
  );

  const quote = useMemo(
    () =>
      calculateCommissionQuote({
        productId,
        productName,
        basePriceFormatted,
        selectedScalePriceFormatted: selectedScalePrice,
        selectedMaterialName,
        selectedTimberName,
        deliveryZone,
        paymentPlan,
      }),
    [
      productId,
      productName,
      basePriceFormatted,
      selectedScalePrice,
      selectedMaterialName,
      selectedTimberName,
      deliveryZone,
      paymentPlan,
    ]
  );

  const clearance = useMemo(
    () =>
      evaluateSpatialClearance(
        furnitureDims,
        {
          roomLengthMM: toMillimeters(roomLengthMM),
          roomWidthMM: toMillimeters(roomWidthMM),
          doorwayWidthMM: toMillimeters(doorwayWidthMM),
        },
        quote.estimatedWeightKg
      ),
    [furnitureDims, roomLengthMM, roomWidthMM, doorwayWidthMM, quote.estimatedWeightKg]
  );

  // Proportional SVG scaling inside a 360x240 viewBox
  const svgW = 360;
  const svgH = 240;
  const scaleFactor = Math.min((svgW - 60) / roomLengthMM, (svgH - 60) / roomWidthMM);
  const roomRectW = Math.round(roomLengthMM * scaleFactor);
  const roomRectH = Math.round(roomWidthMM * scaleFactor);
  const roomX = Math.round((svgW - roomRectW) / 2);
  const roomY = Math.round((svgH - roomRectH) / 2);

  const furnW = Math.min(roomRectW - 6, Math.round(furnitureDims.lengthMM * scaleFactor));
  const furnH = Math.min(roomRectH - 6, Math.round(furnitureDims.depthMM * scaleFactor));
  const furnX = Math.round((svgW - furnW) / 2);
  const furnY = Math.round((svgH - furnH) / 2);

  const statusBadgeStyle =
    clearance.status === 'OPTIMAL_FIT'
      ? 'bg-emerald-950/10 text-emerald-800 border-emerald-700/30'
      : clearance.status === 'TIGHT_CIRCULATION'
      ? 'bg-amber-950/10 text-amber-800 border-amber-700/30'
      : 'bg-red-950/10 text-red-800 border-red-700/30';

  return (
    <section className="w-full py-space-xl px-gutter-mobile lg:px-margin bg-surface-container-low border-t border-outline-variant/20">
      <div className="max-w-6xl mx-auto space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
          <div>
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block uppercase">
              Interactive TypeScript Spatial &amp; BOM Engine
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-normal">
              Room-Fit Clearance Validator &amp; Milestone Estimator
            </h2>
          </div>

          <div className="inline-flex items-center rounded-lg bg-surface-container p-1 border border-outline-variant/30 self-start">
            <button
              type="button"
              onClick={() => setCurrency('NGN')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition cursor-pointer ${
                currency === 'NGN'
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              NGN (₦)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition cursor-pointer ${
                currency === 'USD'
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column: Interactive Room Fit Calculator & Live SVG Floorplan */}
          <div className="lg:col-span-6 p-space-md rounded-xl bg-surface shadow-sm border border-surface-container-high space-y-space-md">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-headline-sm text-headline-sm text-primary">
                1. Verify Your Room &amp; Doorway Clearance
              </h3>
              <span
                className={`px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider font-semibold ${statusBadgeStyle}`}
              >
                {clearance.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Proportional Architectural SVG Floorplan */}
            <div className="rounded-xl bg-surface-container-high p-3 flex flex-col items-center justify-center relative">
              <svg
                viewBox={`0 0 ${svgW} ${svgH}`}
                className="w-full max-w-md h-auto text-primary"
                role="img"
                aria-label="Live scaled architectural room clearance diagram"
              >
                {/* Room Boundary */}
                <rect
                  x={roomX}
                  y={roomY}
                  width={roomRectW}
                  height={roomRectH}
                  fill="#FAF8F5"
                  stroke="#2C1810"
                  strokeWidth="2"
                  rx="4"
                />
                {/* Circulation Safe Zone Ring */}
                <rect
                  x={Math.max(roomX + 2, furnX - 18)}
                  y={Math.max(roomY + 2, furnY - 18)}
                  width={Math.min(roomRectW - 4, furnW + 36)}
                  height={Math.min(roomRectH - 4, furnH + 36)}
                  fill="none"
                  stroke="#775A19"
                  strokeDasharray="4 3"
                  strokeWidth="1.2"
                  rx="4"
                />
                {/* Furniture Footprint */}
                <rect
                  x={furnX}
                  y={furnY}
                  width={furnW}
                  height={furnH}
                  fill="#2C1810"
                  fillOpacity="0.9"
                  stroke="#C5A059"
                  strokeWidth="1.5"
                  rx="5"
                />
                <text
                  x={svgW / 2}
                  y={svgH / 2 + 3}
                  textAnchor="middle"
                  fill="#FAF8F5"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {furnitureDims.lengthMM} × {furnitureDims.depthMM} mm
                </text>
                {/* Room Dimension Callouts */}
                <text
                  x={svgW / 2}
                  y={roomY - 8}
                  textAnchor="middle"
                  fill="#504440"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  Room Length: {(roomLengthMM / 1000).toFixed(2)}m ({roomLengthMM}mm)
                </text>
                <text
                  x={roomX + 8}
                  y={roomY + roomRectH - 8}
                  fill="#775A19"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  Side Walkway: {clearance.sideWalkwayMM}mm | Front/Back: {clearance.frontBackWalkwayMM}mm
                </text>
              </svg>
            </div>

            {/* Sliders */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-on-surface-variant">Room Length</span>
                  <span className="text-primary font-semibold">
                    {(roomLengthMM / 1000).toFixed(2)}m ({roomLengthMM} mm)
                  </span>
                </div>
                <input
                  type="range"
                  min={2800}
                  max={9000}
                  step={100}
                  value={roomLengthMM}
                  onChange={(e) => setRoomLengthMM(Number(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-on-surface-variant">Room Width</span>
                  <span className="text-primary font-semibold">
                    {(roomWidthMM / 1000).toFixed(2)}m ({roomWidthMM} mm)
                  </span>
                </div>
                <input
                  type="range"
                  min={2400}
                  max={7500}
                  step={100}
                  value={roomWidthMM}
                  onChange={(e) => setRoomWidthMM(Number(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-on-surface-variant">Doorway / Elevator Entry Width</span>
                  <span className="text-primary font-semibold">
                    {doorwayWidthMM} mm ({clearance.fitsThroughDoorway ? '✓ Clears' : '⚠ Split-Joinery'})
                  </span>
                </div>
                <input
                  type="range"
                  min={680}
                  max={1400}
                  step={20}
                  value={doorwayWidthMM}
                  onChange={(e) => setDoorwayWidthMM(Number(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
              </div>
            </div>

            {/* Engineering Verdict Box */}
            <div className="p-3.5 rounded-lg bg-surface-container-low border border-surface-container-high space-y-1">
              <p className="font-label-regular text-label-regular text-primary font-semibold">
                {clearance.headline}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {clearance.recommendation}
              </p>
              <div className="pt-2 flex flex-wrap gap-3 text-[11px] font-mono text-secondary">
                <span>Footprint Coverage: {clearance.floorCoveragePercent}%</span>
                <span>•</span>
                <span>Slab Load: {clearance.estimatedFloorLoadKgPerSqm} kg/m²</span>
                <span>•</span>
                <span>Min Entry Profile: {clearance.minEntryDiagonalMM}mm</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic BOM Pricing & Instalment Schedule Engine */}
          <div className="lg:col-span-6 p-space-md rounded-xl bg-surface shadow-sm border border-surface-container-high space-y-space-md">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-primary">
                2. Bespoke BOM &amp; Instalment Schedule
              </h3>
              <span className="font-mono text-xs text-secondary font-semibold">
                Ref: {quote.quoteReference}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-label-uppercase text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
                  White-Glove Logistics Corridor
                </label>
                <select
                  value={deliveryZone}
                  onChange={(e) => setDeliveryZone(e.target.value as NigerianDeliveryZone)}
                  className="w-full px-3 py-2.5 rounded-lg bg-surface-container text-body-sm text-primary border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  {(Object.keys(DELIVERY_ZONE_LABELS) as NigerianDeliveryZone[]).map((z) => (
                    <option key={z} value={z}>
                      {DELIVERY_ZONE_LABELS[z]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-label-uppercase text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
                  Atelier Payment Structure
                </label>
                <select
                  value={paymentPlan}
                  onChange={(e) => setPaymentPlan(e.target.value as PaymentPlanType)}
                  className="w-full px-3 py-2.5 rounded-lg bg-surface-container text-body-sm text-primary border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-secondary"
                >
                  {(Object.keys(PAYMENT_PLAN_LABELS) as PaymentPlanType[]).map((plan) => (
                    <option key={plan} value={plan}>
                      {PAYMENT_PLAN_LABELS[plan]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Milestone Breakdown Cards */}
            <div className="space-y-2">
              <span className="font-label-uppercase text-[10px] text-on-surface-variant uppercase tracking-wider block">
                Payment Milestones ({quote.leadTimeWeeks[0]}–{quote.leadTimeWeeks[1]} Weeks Kiln &amp; Craft Schedule)
              </span>
              {quote.milestones.map((m) => (
                <div
                  key={m.stepNumber}
                  className="p-3 rounded-lg bg-surface-container-low border border-surface-container-high flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-label-regular text-xs text-primary font-semibold">
                      {m.title}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">{m.timing}</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-sm font-semibold text-primary block">
                      {currency === 'NGN' ? m.formattedNaira : m.formattedUSD}
                    </span>
                    <span className="text-[10px] text-secondary">{m.percentage}% Tranche</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary Strip */}
            <div className="p-4 rounded-xl bg-primary text-on-primary flex items-center justify-between">
              <div>
                <span className="font-label-uppercase text-[10px] text-secondary-fixed uppercase tracking-widest block">
                  Due Today to Lock Atelier Slot
                </span>
                <span className="font-headline-md text-headline-md text-surface">
                  {currency === 'NGN' ? quote.formattedDueTodayNaira : quote.formattedDueTodayUSD}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-surface-container-high block">
                  Total Commission Value
                </span>
                <span className="font-mono text-sm text-secondary-fixed font-semibold">
                  {currency === 'NGN' ? quote.formattedTotalNaira : quote.formattedTotalUSD}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
