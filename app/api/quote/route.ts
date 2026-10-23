import { NextRequest, NextResponse } from 'next/server';
import { cmsOrchestrator } from '@/lib/cms/wordpress-service';
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

const VALID_ZONES = new Set<NigerianDeliveryZone>([
  'ABUJA_FCT',
  'LAGOS_ISLAND',
  'PORT_HARCOURT',
  'KANO_KADUNA',
  'WEST_AFRICA_EXPORT',
]);

const VALID_PLANS = new Set<PaymentPlanType>([
  'FULL_SETTLEMENT',
  'COMMISSION_DEPOSIT_40_60',
  'MILESTONE_3_MONTH',
  'MILESTONE_6_MONTH',
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productSlug = String(body.productId || 'the-aso-curved-sofa');
    const { product, source } = await cmsOrchestrator.getProductBySlug(productSlug);

    const deliveryZone: NigerianDeliveryZone = VALID_ZONES.has(body.deliveryZone)
      ? body.deliveryZone
      : 'ABUJA_FCT';

    const paymentPlan: PaymentPlanType = VALID_PLANS.has(body.paymentPlan)
      ? body.paymentPlan
      : 'COMMISSION_DEPOSIT_40_60';

    const quote = calculateCommissionQuote({
      productId: product.id,
      productName: product.name,
      basePriceFormatted: product.price,
      selectedScalePriceFormatted: body.selectedScalePrice,
      selectedMaterialName: body.selectedMaterial,
      selectedTimberName: body.selectedTimber,
      deliveryZone,
      paymentPlan,
    });

    let clearanceReport = null;
    if (body.roomLengthMM && body.roomWidthMM && body.doorwayWidthMM) {
      const furnitureDims = parseDimensionsMM(
        product.dimensions,
        body.selectedScaleDimension
      );
      clearanceReport = evaluateSpatialClearance(
        furnitureDims,
        {
          roomLengthMM: toMillimeters(Number(body.roomLengthMM)),
          roomWidthMM: toMillimeters(Number(body.roomWidthMM)),
          doorwayWidthMM: toMillimeters(Number(body.doorwayWidthMM)),
        },
        quote.estimatedWeightKg
      );
    }

    return NextResponse.json({
      ok: true,
      cmsSource: source,
      quote,
      clearanceReport,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'Invalid quote request payload',
      },
      { status: 400 }
    );
  }
}
