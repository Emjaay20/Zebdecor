import {
  CommissionQuoteBreakdown,
  InstalmentMilestone,
  Kilograms,
  Kobo,
  Millimeters,
  NigerianDeliveryZone,
  PBRMaterialOverride,
  PaymentPlanType,
  RoomDimensionsInput,
  SpatialBoundingBoxMM,
  SpatialClearanceReport,
  SpatialModelConfig,
  assertNever,
  formatKoboToNaira,
  formatKoboToUSD,
  parseNairaStringToKobo,
  toKilograms,
  toKobo,
  toMillimeters,
  toProductId,
} from './types';

/**
 * Parses dimension strings such as "2800L x 1150W x 780H mm" or "3000 × 1200 × 760 mm"
 * into strongly-typed Millimeters bounding boxes.
 */
export function parseDimensionsMM(
  rawDimensions: string,
  scaleOverrideText?: string
): SpatialBoundingBoxMM {
  const nums = (rawDimensions.match(/\d{3,4}/g) || []).map(Number);
  let length = nums[0] || 2400;
  let depth = nums[1] || 1000;
  const height = nums[2] || 750;

  if (scaleOverrideText) {
    // Check for e.g. "240cm", "3400mm", "(360 × 125 cm)"
    const cmPair = scaleOverrideText.match(/(\d{3})\s*[×x]\s*(\d{2,3})\s*cm/i);
    if (cmPair) {
      length = Number(cmPair[1]) * 10;
      depth = Number(cmPair[2]) * 10;
    } else {
      const mmMatch = scaleOverrideText.match(/(\d{4})\s*mm/i);
      const cmMatch = scaleOverrideText.match(/(\d{3})\s*cm/i);
      if (mmMatch) {
        const newLen = Number(mmMatch[1]);
        const ratio = newLen / length;
        length = newLen;
        depth = Math.round(depth * (0.85 + ratio * 0.15));
      } else if (cmMatch) {
        const newLen = Number(cmMatch[1]) * 10;
        const ratio = newLen / length;
        length = newLen;
        depth = Math.round(depth * (0.85 + ratio * 0.15));
      }
    }
  }

  return {
    lengthMM: toMillimeters(length),
    depthMM: toMillimeters(depth),
    heightMM: toMillimeters(height),
  };
}

/**
 * Evaluates whether a bespoke piece fits comfortably inside a client's room and through their doorway/elevator.
 */
export function evaluateSpatialClearance(
  furniture: SpatialBoundingBoxMM,
  room: RoomDimensionsInput,
  netWeightKg: number = 160
): SpatialClearanceReport {
  const sideWalkway = Math.max(0, Math.round((room.roomLengthMM - furniture.lengthMM) / 2));
  const frontBackWalkway = Math.max(0, Math.round((room.roomWidthMM - furniture.depthMM) / 2));

  // Minimum cross-section to angle through a doorway (min of depth or height, with 45mm crating margin)
  const minProfileMM = Math.min(furniture.depthMM, furniture.heightMM) + 45;
  const fitsThroughDoorway = room.doorwayWidthMM >= minProfileMM;

  const roomAreaSqm = (room.roomLengthMM / 1000) * (room.roomWidthMM / 1000);
  const furnitureFootprintSqm = (furniture.lengthMM / 1000) * (furniture.depthMM / 1000);
  const floorCoveragePercent = Math.min(
    100,
    Math.round((furnitureFootprintSqm / Math.max(1, roomAreaSqm)) * 100)
  );
  const estimatedFloorLoadKgPerSqm = Math.round(netWeightKg / Math.max(0.5, furnitureFootprintSqm));

  // Architectural luxury standard recommends >= 850mm primary circulation path
  const requiresSplitJoinery = !fitsThroughDoorway || furniture.lengthMM >= 3400;

  if (sideWalkway >= 800 && frontBackWalkway >= 800 && fitsThroughDoorway) {
    return {
      status: 'OPTIMAL_FIT',
      headline: 'Optimal Architectural Proportion & Circulation',
      recommendation: `Your space provides generous ${sideWalkway}mm lateral and ${frontBackWalkway}mm frontal circulation walkways (exceeding the 800mm Maitama gallery standard). Standard single-piece white-glove delivery is cleared.`,
      frontBackWalkwayMM: toMillimeters(frontBackWalkway),
      sideWalkwayMM: toMillimeters(sideWalkway),
      minEntryDiagonalMM: toMillimeters(minProfileMM),
      fitsThroughDoorway: true,
      floorCoveragePercent,
      estimatedFloorLoadKgPerSqm,
      requiresSplitJoinery: false,
    };
  }

  if (sideWalkway >= 500 && frontBackWalkway >= 550 && fitsThroughDoorway) {
    return {
      status: 'TIGHT_CIRCULATION',
      headline: 'Intimate Fit — Consider Petite Scale or Floating Layout',
      recommendation: `Clearance is ${sideWalkway}mm on the sides and ${frontBackWalkway}mm front/back. While physically compatible with your ${room.doorwayWidthMM}mm doorway, we recommend floating the piece away from walls or selecting the Petite scale for airier circulation.`,
      frontBackWalkwayMM: toMillimeters(frontBackWalkway),
      sideWalkwayMM: toMillimeters(sideWalkway),
      minEntryDiagonalMM: toMillimeters(minProfileMM),
      fitsThroughDoorway: true,
      floorCoveragePercent,
      estimatedFloorLoadKgPerSqm,
      requiresSplitJoinery,
    };
  }

  return {
    status: 'SPLIT_JOINERY_REQUIRED',
    headline: 'Bespoke Concealed Split-Joinery Recommended',
    recommendation: !fitsThroughDoorway
      ? `Your ${room.doorwayWidthMM}mm doorway is narrower than the ${minProfileMM}mm crated profile. Our Guzape master joiners will fabricate this commission with concealed interlocking brass-dowel split joinery for seamless in-room assembly.`
      : `At ${furniture.lengthMM}mm length in a ${room.roomLengthMM}mm room (${floorCoveragePercent}% footprint coverage), we recommend a custom dimension adjustment or concealed modular split-frame construction.`,
    frontBackWalkwayMM: toMillimeters(frontBackWalkway),
    sideWalkwayMM: toMillimeters(sideWalkway),
    minEntryDiagonalMM: toMillimeters(minProfileMM),
    fitsThroughDoorway,
    floorCoveragePercent,
    estimatedFloorLoadKgPerSqm,
    requiresSplitJoinery: true,
  };
}

/**
 * Exhaustive logistics calculation using TypeScript's assertNever pattern.
 */
export function calculateLogisticsKobo(zone: NigerianDeliveryZone, weightKg: number): Kobo {
  switch (zone) {
    case 'ABUJA_FCT':
      // Complimentary white-glove delivery in Maitama, Asokoro, Guzape, Wuse II
      return toKobo(0);
    case 'LAGOS_ISLAND':
      // Climate-controlled air-ride crate to Ikoyi, Victoria Island, Lekki
      return toKobo(weightKg > 250 ? 450_000 : 250_000);
    case 'PORT_HARCOURT':
      return toKobo(weightKg > 250 ? 520_000 : 320_000);
    case 'KANO_KADUNA':
      return toKobo(weightKg > 250 ? 280_000 : 180_000);
    case 'WEST_AFRICA_EXPORT':
      // ECOWAS / International museum-grade crating
      return toKobo(1_450_000);
    default:
      return assertNever(zone);
  }
}

/**
 * Deterministic Server/Client BOM & Instalment Quote Engine.
 */
export function calculateCommissionQuote(params: {
  productId: string;
  productName: string;
  basePriceFormatted: string;
  selectedScalePriceFormatted?: string;
  selectedMaterialName?: string;
  selectedTimberName?: string;
  deliveryZone: NigerianDeliveryZone;
  paymentPlan: PaymentPlanType;
  baseWeightKg?: number;
}): CommissionQuoteBreakdown {
  const baseKobo = parseNairaStringToKobo(params.basePriceFormatted);
  const scalePriceKobo = params.selectedScalePriceFormatted
    ? parseNairaStringToKobo(params.selectedScalePriceFormatted)
    : baseKobo;

  const scaleAdjustmentKobo = toKobo(Math.round((scalePriceKobo - baseKobo) / 100));

  // Material tier surcharge (e.g. Calacatta Viola, Cognac Saddle Leather, Brushed Brass)
  let materialUpgradeNaira = 0;
  const matLower = (params.selectedMaterialName || '').toLowerCase();
  const timLower = (params.selectedTimberName || '').toLowerCase();

  if (matLower.includes('viola') || matLower.includes('nero marquina')) {
    materialUpgradeNaira += 350_000;
  } else if (matLower.includes('leather') || matLower.includes('cognac') || matLower.includes('velvet')) {
    materialUpgradeNaira += 180_000;
  }

  if (timLower.includes('limba') || timLower.includes('brass')) {
    materialUpgradeNaira += 120_000;
  }

  const materialUpgradeKobo = toKobo(materialUpgradeNaira);
  const weightKg = params.baseWeightKg || (params.productId.includes('zuma-dining') ? 480 : 145);
  const logisticsKobo = calculateLogisticsKobo(params.deliveryZone, weightKg);

  const subtotalNaira =
    Math.round(scalePriceKobo / 100) +
    materialUpgradeNaira +
    Math.round(logisticsKobo / 100);

  // 5% privilege rebate when settling 100% upfront
  const privilegeDiscountNaira =
    params.paymentPlan === 'FULL_SETTLEMENT' ? Math.round(subtotalNaira * 0.05) : 0;
  const privilegeDiscountKobo = toKobo(privilegeDiscountNaira);

  const netBeforeVatNaira = subtotalNaira - privilegeDiscountNaira;
  // Inclusive luxury atelier pricing; expose 7.5% Nigerian VAT line item transparently
  const vatKobo = toKobo(Math.round(netBeforeVatNaira * 0.075));
  const totalInvestmentKobo = toKobo(netBeforeVatNaira);

  const buildMilestone = (
    stepNumber: number,
    title: string,
    timing: string,
    percentage: number
  ): InstalmentMilestone => {
    const amountKobo = toKobo(Math.round((netBeforeVatNaira * percentage) / 100));
    return {
      stepNumber,
      title,
      timing,
      percentage,
      amountKobo,
      formattedNaira: formatKoboToNaira(amountKobo),
      formattedUSD: formatKoboToUSD(amountKobo),
    };
  };

  let milestones: readonly InstalmentMilestone[];
  switch (params.paymentPlan) {
    case 'FULL_SETTLEMENT':
      milestones = [
        buildMilestone(1, 'Full Atelier Settlement (5% Privilege Rebate Applied)', 'Due Upon Commission', 100),
      ];
      break;
    case 'COMMISSION_DEPOSIT_40_60':
      milestones = [
        buildMilestone(1, 'Timber & Quarry Allocation Deposit (40%)', 'Due Today to Lock Slot', 40),
        buildMilestone(2, 'White-Glove Dispatch Balance (60%)', 'Upon Abuja Workshop QC Sign-Off', 60),
      ];
      break;
    case 'MILESTONE_3_MONTH':
      milestones = [
        buildMilestone(1, 'Tranche 1: Kiln & Material Mobilization (40%)', 'Month 1 (Immediate)', 40),
        buildMilestone(2, 'Tranche 2: Joinery & Upholstery Mid-Point (30%)', 'Month 2 (Day 30)', 30),
        buildMilestone(3, 'Tranche 3: Final Inspection & Installation (30%)', 'Month 3 (Pre-Delivery)', 30),
      ];
      break;
    case 'MILESTONE_6_MONTH':
      milestones = [
        buildMilestone(1, 'Initial Retainer & Spatial Scan (30%)', 'Month 1 (Immediate)', 30),
        buildMilestone(2, 'Structural Frame & Stone Cutting (25%)', 'Month 2', 25),
        buildMilestone(3, 'Artisanal Finishing & Leatherwork (25%)', 'Month 4', 25),
        buildMilestone(4, 'White-Glove Handover & Leveling (20%)', 'Month 6', 20),
      ];
      break;
    default:
      milestones = assertNever(params.paymentPlan);
  }

  const dueTodayKobo = milestones[0]?.amountKobo ?? totalInvestmentKobo;
  const hashSuffix = Math.abs(
    (params.productId.length * 31 + netBeforeVatNaira) % 9000
  ) + 1000;

  return {
    quoteReference: `ZEB-2026-${hashSuffix}`,
    productId: toProductId(params.productId),
    productName: params.productName,
    basePriceKobo: baseKobo,
    scaleAdjustmentKobo,
    materialUpgradeKobo,
    logisticsKobo,
    privilegeDiscountKobo,
    vatKobo,
    totalInvestmentKobo,
    formattedTotalNaira: formatKoboToNaira(totalInvestmentKobo),
    formattedTotalUSD: formatKoboToUSD(totalInvestmentKobo),
    dueTodayKobo,
    formattedDueTodayNaira: formatKoboToNaira(dueTodayKobo),
    formattedDueTodayUSD: formatKoboToUSD(dueTodayKobo),
    estimatedWeightKg: toKilograms(weightKg),
    leadTimeWeeks: params.productId.includes('zuma') ? [6, 8] : [5, 7],
    milestones,
  };
}

/**
 * Maps every Zebdecor catalog piece to its physical 3D GLB model and real-time PBR material presets.
 */
export function getSpatialModelConfig(
  productId: string,
  posterUrl: string,
  rawDimensions: string
): SpatialModelConfig {
  const normalized = productId.toLowerCase();
  const baseDimensions = parseDimensionsMM(rawDimensions);

  let glbPath = '/models/the-aso-curved-sofa.glb?v=20261017d';
  let defaultCameraOrbit = '30deg 75deg 3.6m';

  if (normalized.includes('zuma-dining')) {
    glbPath = '/models/chair-damask-purplegold.glb?v=20261017d';
    defaultCameraOrbit = '35deg 68deg 2.4m';
  } else if (normalized.includes('credenza')) {
    glbPath = '/models/aso-curved-daybed.glb?v=20261017d';
    defaultCameraOrbit = '25deg 75deg 3.6m';
  } else if (normalized.includes('lounge')) {
    glbPath = '/models/guzape-lounge-chair.glb?v=20261017d';
    defaultCameraOrbit = '32deg 72deg 2.4m';
  } else if (normalized.includes('travertine')) {
    glbPath = '/models/specular-silk-pouf.glb?v=20261017d';
    defaultCameraOrbit = '30deg 66deg 2.2m';
  } else if (normalized.includes('daybed')) {
    glbPath = '/models/aso-curved-daybed.glb?v=20261017d';
    defaultCameraOrbit = '30deg 72deg 3.2m';
  }

  const materialPresets: Record<string, readonly PBRMaterialOverride[]> = {
    boucle: [
      {
        slot: 'Upholstery',
        label: 'Ivory Textured Bouclé',
        hexColor: '#f4f0e6',
        baseColorFactor: [0.956, 0.941, 0.902, 1.0],
        roughnessFactor: 0.9,
        metallicFactor: 0.02,
      },
      {
        slot: 'TimberPlinth',
        label: 'Kiln-Dried Benue Teak',
        hexColor: '#8f5d34',
        baseColorFactor: [0.56, 0.36, 0.2, 1.0],
        roughnessFactor: 0.52,
        metallicFactor: 0.05,
      },
      {
        slot: 'MarbleSlab',
        label: 'Honed Calacatta Viola',
        hexColor: '#e8dfd9',
        baseColorFactor: [0.91, 0.87, 0.85, 1.0],
        roughnessFactor: 0.28,
        metallicFactor: 0.05,
      },
    ],
    leather: [
      {
        slot: 'Upholstery',
        label: 'Cognac Saddle Leather',
        hexColor: '#8c4b27',
        baseColorFactor: [0.55, 0.29, 0.15, 1.0],
        roughnessFactor: 0.38,
        metallicFactor: 0.08,
      },
      {
        slot: 'TimberPlinth',
        label: 'Seasoned Sapele Mahogany',
        hexColor: '#4a2511',
        baseColorFactor: [0.29, 0.145, 0.067, 1.0],
        roughnessFactor: 0.45,
        metallicFactor: 0.06,
      },
      {
        slot: 'MarbleSlab',
        label: 'Roman Silver Travertine',
        hexColor: '#d9d0c5',
        baseColorFactor: [0.85, 0.815, 0.77, 1.0],
        roughnessFactor: 0.58,
        metallicFactor: 0.03,
      },
    ],
    darkTeak: [
      {
        slot: 'Upholstery',
        label: 'Smoked Olive Pure Wool',
        hexColor: '#4e5142',
        baseColorFactor: [0.306, 0.318, 0.259, 1.0],
        roughnessFactor: 0.85,
        metallicFactor: 0.03,
      },
      {
        slot: 'TimberPlinth',
        label: 'Blackened Nigerian Limba',
        hexColor: '#1e1c1b',
        baseColorFactor: [0.118, 0.11, 0.106, 1.0],
        roughnessFactor: 0.48,
        metallicFactor: 0.1,
      },
      {
        slot: 'MarbleSlab',
        label: 'Nero Marquina Velvet Stone',
        hexColor: '#1c1b1a',
        baseColorFactor: [0.11, 0.105, 0.1, 1.0],
        roughnessFactor: 0.24,
        metallicFactor: 0.12,
      },
    ],
  };

  return {
    glbPath,
    posterUrl,
    baseDimensions,
    defaultCameraOrbit,
    materialPresets,
  };
}
