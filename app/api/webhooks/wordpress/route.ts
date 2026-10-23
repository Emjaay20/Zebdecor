import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { cmsOrchestrator } from '@/lib/cms/wordpress-service';
import { WebhookDeliveryId, WebhookEventRecord } from '@/lib/domain/types';

const DEFAULT_WEBHOOK_SECRET =
  process.env.WORDPRESS_WEBHOOK_SECRET || 'zebdecor-wp-vip-hmac-secret-2026';

/**
 * Constant-time HMAC-SHA256 verification matching WooCommerce (`X-WC-Webhook-Signature`)
 * and the Zebdecor WordPress Headless Bridge MU-Plugin (`X-Zebdecor-Signature`).
 */
function verifyHmacSignature(
  rawBody: string,
  providedSignature: string,
  secret: string
): boolean {
  const expectedBase64 = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');
  const expectedHex = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex');

  const candidate = providedSignature.trim();
  for (const expected of [expectedBase64, expectedHex]) {
    const bufA = Buffer.from(candidate);
    const bufB = Buffer.from(expected);
    if (bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)) {
      return true;
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  const startMs = performance.now();

  try {
    const rawBody = await request.text();
    let parsed: {
      slug?: string;
      product_slug?: string;
      topic?: WebhookEventRecord['topic'];
      delivery_id?: string;
      simulate?: boolean;
    } = {};

    try {
      parsed = JSON.parse(rawBody || '{}');
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Malformed JSON body in webhook request' },
        { status: 400 }
      );
    }

    const topic: WebhookEventRecord['topic'] =
      parsed.topic ||
      (request.headers.get('x-wc-webhook-topic') as WebhookEventRecord['topic']) ||
      'product.updated';

    const productSlug = (
      parsed.slug ||
      parsed.product_slug ||
      'the-aso-curved-sofa'
    )
      .toLowerCase()
      .trim();

    const deliveryId = (
      request.headers.get('x-wc-webhook-delivery-id') ||
      parsed.delivery_id ||
      `wc-dlv-${Date.now().toString(36)}`
    ) as WebhookDeliveryId;

    // Idempotency protection: prevent replay / duplicate webhook execution
    if (cmsOrchestrator.isDuplicateDelivery(deliveryId)) {
      return NextResponse.json({
        ok: true,
        idempotentReplay: true,
        deliveryId,
        message: 'Webhook delivery ID already processed; skipped duplicate revalidation.',
      });
    }

    // Verify HMAC-SHA256 signature (or self-sign when triggered from live telemetry simulator)
    let signatureHeader =
      request.headers.get('x-wc-webhook-signature') ||
      request.headers.get('x-zebdecor-signature') ||
      '';

    if (parsed.simulate && !signatureHeader) {
      signatureHeader = crypto
        .createHmac('sha256', DEFAULT_WEBHOOK_SECRET)
        .update(rawBody, 'utf8')
        .digest('base64');
    }

    const isSignatureValid = verifyHmacSignature(
      rawBody,
      signatureHeader,
      DEFAULT_WEBHOOK_SECRET
    );

    if (!isSignatureValid) {
      return NextResponse.json(
        {
          ok: false,
          error: 'HMAC-SHA256 signature verification failed (timingSafeEqual mismatch)',
        },
        { status: 401 }
      );
    }

    // Surgical Next.js 16 Cache Tag invalidation using recommended two-argument profile="max"
    const tagsToRevalidate = ['catalog', `product:${productSlug}`];
    for (const tag of tagsToRevalidate) {
      revalidateTag(tag, 'max');
    }
    revalidatePath(`/products/${productSlug}`);
    revalidatePath('/');

    const processingLatencyMs = Math.max(1, Math.round(performance.now() - startMs));
    const eventRecord: WebhookEventRecord = {
      deliveryId,
      topic,
      productSlug,
      revalidatedTags: tagsToRevalidate,
      hmacVerified: true,
      receivedAtIso: new Date().toISOString(),
      processingLatencyMs,
    };

    cmsOrchestrator.recordWebhookEvent(eventRecord);

    return NextResponse.json({
      ok: true,
      event: eventRecord,
      telemetry: cmsOrchestrator.getHealthTelemetry(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'Internal webhook handler error',
      },
      { status: 500 }
    );
  }
}
