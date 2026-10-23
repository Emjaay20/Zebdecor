import { NextResponse } from 'next/server';
import { cmsOrchestrator } from '@/lib/cms/wordpress-service';

/**
 * AetherHost HTTP Readiness & Liveness Probe Endpoint (`GET /api/health`)
 */
export async function GET() {
  const telemetry = cmsOrchestrator.getHealthTelemetry();
  return NextResponse.json(
    {
      status: 'ok',
      service: 'zebdecor-spatial-commerce',
      uptimeSeconds: Math.round(process.uptime()),
      activeAdapter: telemetry.activeAdapter,
      circuitBreaker: telemetry.circuitBreaker.state,
      timestamp: telemetry.timestampIso,
    },
    { status: 200 }
  );
}
