'use client';

import React, { useEffect, useState } from 'react';
import { SystemsHealthTelemetry } from '@/lib/domain/types';

interface SystemsTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SystemsTelemetryModal({
  isOpen,
  onClose,
}: SystemsTelemetryModalProps) {
  const [telemetry, setTelemetry] = useState<SystemsHealthTelemetry | null>(null);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState('the-aso-curved-sofa');
  const [lastWebhookResult, setLastWebhookResult] = useState<string | null>(null);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/system/health', { cache: 'no-store' });
      const data = await res.json();
      if (data.telemetry) {
        setTelemetry(data.telemetry);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTelemetry();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateWebhook = async () => {
    setSimulating(true);
    setLastWebhookResult(null);
    try {
      const res = await fetch('/api/webhooks/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simulate: true,
          topic: 'product.updated',
          product_slug: selectedSlug,
          delivery_id: `wc-dlv-${Date.now().toString(36)}`,
        }),
      });
      const data = await res.json();
      if (data.ok && data.telemetry) {
        setTelemetry(data.telemetry);
        setLastWebhookResult(
          `✓ Verified HMAC-SHA256 signature & invalidated tags: [${data.event.revalidatedTags.join(', ')}] in ${data.event.processingLatencyMs}ms`
        );
      } else {
        setLastWebhookResult(`⚠ ${data.error || 'Webhook simulation failed'}`);
      }
    } catch {
      setLastWebhookResult('⚠ Network error dispatching webhook');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12100e] text-neutral-100 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-brand-gold/30 space-y-5 font-sans">
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-brand-gold">
                Decoupled WordPress VIP / WooCommerce Systems Telemetry
              </span>
            </div>
            <h3 className="font-serif text-2xl text-white mt-1">
              Headless CMS &amp; Edge Cache Architecture
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live Node.js runtime diagnostics, Circuit Breaker status, and HMAC-SHA256 On-Demand ISR webhook inspector.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 cursor-pointer"
            aria-label="Close Systems Telemetry"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {loading && !telemetry ? (
          <div className="py-12 text-center font-mono text-xs text-brand-goldLight animate-pulse">
            Querying /api/system/health...
          </div>
        ) : telemetry ? (
          <>
            {/* 3 Telemetry KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase text-neutral-400">
                  Circuit Breaker &amp; Adapter
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold">
                    {telemetry.circuitBreaker.state}
                  </span>
                  <span className="font-mono text-xs text-brand-goldLight truncate">
                    {telemetry.circuitBreaker.lastLatencyMs}ms Latency
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-300 truncate">
                  {telemetry.activeAdapter}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase text-neutral-400">
                  Next.js 16 Cache Tags
                </span>
                <p className="font-mono text-lg font-semibold text-white">
                  {telemetry.cacheMetrics.activeTags.length} Active Tags
                </p>
                <p className="text-[11px] font-mono text-brand-goldLight">
                  {telemetry.cacheMetrics.totalRevalidations} Surgical Revalidations
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase text-neutral-400">
                  Node.js {telemetry.nodeVersion} Worker
                </span>
                <p className="font-mono text-lg font-semibold text-white">
                  {telemetry.memoryUsageMB.heapUsed} MB Heap
                </p>
                <p className="text-[11px] font-mono text-neutral-400">
                  RSS: {telemetry.memoryUsageMB.rss} MB / Total: {telemetry.memoryUsageMB.heapTotal} MB
                </p>
              </div>
            </div>

            {/* Interactive WordPress HMAC Webhook Simulator */}
            <div className="p-4 rounded-xl bg-brand-gold/10 border border-brand-gold/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand-gold block">
                    Live Interactive Test (`POST /api/webhooks/wordpress`)
                  </span>
                  <h4 className="text-sm font-semibold text-white">
                    Simulate Signed WooCommerce `product.updated` Webhook
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedSlug}
                    onChange={(e) => setSelectedSlug(e.target.value)}
                    className="px-2.5 py-1.5 rounded bg-black/60 border border-white/15 text-xs font-mono text-neutral-200"
                  >
                    <option value="the-aso-curved-sofa">the-aso-curved-sofa</option>
                    <option value="the-zuma-dining-suite">the-zuma-dining-suite</option>
                    <option value="maitama-fluted-credenza">maitama-fluted-credenza</option>
                    <option value="guzape-lounge-chair">guzape-lounge-chair</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleSimulateWebhook}
                    disabled={simulating}
                    className="px-3.5 py-1.5 rounded-lg bg-brand-gold text-black font-mono text-xs font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                  >
                    {simulating ? 'Verifying HMAC...' : 'Dispatch Signed Webhook'}
                  </button>
                </div>
              </div>

              {lastWebhookResult && (
                <div className="p-2.5 rounded bg-black/60 border border-emerald-500/30 font-mono text-xs text-emerald-300">
                  {lastWebhookResult}
                </div>
              )}
            </div>

            {/* Recent Webhook Event Log */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                Recent HMAC-SHA256 Webhook Deliveries &amp; Cache Tag Invalidations
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {telemetry.recentWebhooks.map((wh) => (
                  <div
                    key={wh.deliveryId}
                    className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                        HMAC OK
                      </span>
                      <span className="text-brand-goldLight">{wh.topic}</span>
                      <span className="text-neutral-400">({wh.deliveryId})</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-neutral-300">
                        Tags: {wh.revalidatedTags.join(', ')}
                      </span>
                      <span className="text-emerald-400">{wh.processingLatencyMs}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WordPress Bridge Plugin Reference */}
            <div className="p-3 rounded-lg bg-black/50 border border-white/10 text-[11px] font-mono text-neutral-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>
                Companion WordPress MU-Plugin:{' '}
                <code className="text-brand-goldLight">
                  cms/wordpress/zebdecor-headless-bridge.php
                </code>
              </span>
              <span>
                Origin: <code className="text-neutral-300">{telemetry.wpOriginUrl}</code>
              </span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
