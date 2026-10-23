import { NextResponse } from 'next/server';
import { cmsOrchestrator } from '@/lib/cms/wordpress-service';

export async function GET() {
  const { products, source, latencyMs } = await cmsOrchestrator.getProducts();
  const telemetry = cmsOrchestrator.getHealthTelemetry();

  return NextResponse.json(
    {
      status: 'HEALTHY',
      service: 'zebdecor-spatial-commerce-edge',
      catalogCount: products.length,
      lastFetchSource: source,
      lastFetchLatencyMs: latencyMs,
      telemetry,
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
