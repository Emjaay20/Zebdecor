'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SpatialModelViewer, { ModelViewerElement } from '@/components/SpatialModelViewer';
import { products } from '@/data/sample';

function ARSpatialStudioContent() {
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get('product') || 'the-aso-curved-sofa';
  const initialScale = (searchParams.get('scale') as '240' | '280' | '340') || '280';
  const initialSwatch =
    (searchParams.get('swatch') as 'boucle' | 'leather' | 'darkTeak') || 'boucle';

  const arProducts = products.filter((p) => p.hasAR);
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId);
  const [activeSwatch, setActiveSwatch] = useState<'boucle' | 'leather' | 'darkTeak'>(initialSwatch);
  const [activeScale, setActiveScale] = useState<'240' | '280' | '340'>(
    ['240', '280', '340'].includes(initialScale) ? initialScale : '280'
  );
  const [lightingMode, setLightingMode] = useState<'daylight' | 'golden' | 'evening'>('daylight');
  const [isLocked, setIsLocked] = useState(true);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [snapshotDataUrl, setSnapshotDataUrl] = useState<string | null>(null);
  const [liveCameraActive, setLiveCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const viewerRef = useRef<ModelViewerElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const activeProduct =
    arProducts.find((p) => p.id === selectedProductId) || arProducts[0] || products[0];

  const scaleDetails = {
    '240': {
      label: activeProduct.scales?.[0]?.name || '240 cm (Petite Scale)',
      depth: '100cm',
      height: '74cm',
      price: activeProduct.scales?.[0]?.price || activeProduct.price,
      multiplier: 0.86,
    },
    '280': {
      label: activeProduct.scales?.[1]?.name || '280 cm (Standard Scale)',
      depth: '115cm',
      height: '78cm',
      price: activeProduct.scales?.[1]?.price || activeProduct.price,
      multiplier: 1.0,
    },
    '340': {
      label: activeProduct.scales?.[2]?.name || '340 cm (Presidential Scale)',
      depth: '125cm',
      height: '78cm',
      price: activeProduct.scales?.[2]?.price || activeProduct.price,
      multiplier: 1.21,
    },
  };

  const currentScale = scaleDetails[activeScale];

  const swatchDetails = {
    boucle: { name: 'Ivory Textured Bouclé & Calacatta', color: '#f4f0e6' },
    leather: { name: 'Cognac Saddle Leather & Teak', color: '#8c4b27' },
    darkTeak: { name: 'Blackened Limba & Smoked Wool', color: '#1e1c1b' },
  };

  // Manage WebRTC Live Camera Pass-Through
  useEffect(() => {
    if (!liveCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      return;
    }

    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraError(null);
      })
      .catch(() => {
        setCameraError('Camera permission denied or unavailable; using architectural salon backdrop.');
        setLiveCameraActive(false);
      });

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [liveCameraActive]);

  const handleTakeSnapshot = () => {
    setShutterFlash(true);
    try {
      const dataUrl = viewerRef.current?.toDataURL?.('image/png');
      if (dataUrl) {
        setSnapshotDataUrl(dataUrl);
      } else {
        setSnapshotDataUrl('captured');
      }
    } catch {
      setSnapshotDataUrl('captured');
    }
    setTimeout(() => {
      setShutterFlash(false);
      setTimeout(() => setSnapshotDataUrl(null), 5000);
    }, 200);
  };

  const handleActivateNativeAR = async () => {
    // 1. Try model-viewer built-in AR first (WebXR immersive-ar session)
    if (viewerRef.current && typeof viewerRef.current.activateAR === 'function') {
      try {
        await viewerRef.current.activateAR();
        return;
      } catch (err) {
        console.warn('[handleActivateNativeAR] activateAR failed, trying intent:', err);
      }
    }

    // 2. On Android, launch Google ARCore Scene Viewer native app
    const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
    if (isAndroid) {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://192.168.100.64:3003';
      const glbUrl = `${origin}/models/${activeProduct.id}.glb`;
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
        glbUrl
      )}&title=${encodeURIComponent(activeProduct.name)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
      window.location.href = intentUrl;
      return;
    }

    // 3. Fallback to WebRTC live room camera pass-through
    setLiveCameraActive((prev) => !prev);
  };

  const handleToggleLighting = () => {
    if (lightingMode === 'daylight') setLightingMode('golden');
    else if (lightingMode === 'golden') setLightingMode('evening');
    else setLightingMode('daylight');
  };

  const handleResetPlane = () => {
    setIsLocked(false);
    if (viewerRef.current) {
      viewerRef.current.cameraOrbit = '28deg 74deg 4.2m';
    }
    setTimeout(() => setIsLocked(true), 650);
  };

  const waLink = `https://wa.me/23480093233267?text=${encodeURIComponent(
    `Hello Zebdecor Concierge, I tested ${activeProduct.name} in 1:1 Spatial AR (${currentScale.label}, ${swatchDetails[activeSwatch].name}, ${currentScale.price}). I would like to proceed with room verification.`
  )}`;

  return (
    <div className="fixed inset-0 w-full h-full bg-black font-sans text-neutral-100 overflow-hidden select-none">
      {/* Camera Shutter Flash Effect */}
      {shutterFlash && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-out fade-out duration-300" />
      )}

      {/* BEGIN: AR Camera / Environment Backdrop Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        {liveCameraActive ? (
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            className="w-full h-full object-cover object-center pointer-events-none"
          />
        ) : (
          <div className="relative w-full h-full bg-[#0a0807] overflow-hidden">
            {/* Architectural Spatial Stage Lighting */}
            <div
              className={`absolute inset-0 transition-all duration-700 ${
                lightingMode === 'golden'
                  ? 'bg-[radial-gradient(ellipse_at_50%_35%,#2c241a_0%,#16120d_50%,#090706_100%)]'
                  : lightingMode === 'evening'
                  ? 'bg-[radial-gradient(ellipse_at_50%_35%,#1b1a1f_0%,#0f0e12_50%,#060608_100%)]'
                  : 'bg-[radial-gradient(ellipse_at_50%_35%,#221d19_0%,#13100e_50%,#080706_100%)]'
              }`}
            />

            {/* Gallery Overhead Spot Beam */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[720px] h-[550px] bg-gradient-to-b from-brand-gold/15 via-brand-gold/5 to-transparent blur-3xl pointer-events-none" />

            {/* Architectural Perspective Metric Floor Grid */}
            <div
              className="absolute bottom-0 inset-x-0 h-[48%] pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(212, 180, 131, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(212, 180, 131, 0.25) 1px, transparent 1px)',
                backgroundSize: '75px 75px',
                transform: 'perspective(500px) rotateX(68deg) scale(2.4)',
                transformOrigin: 'bottom center',
              }}
            />

            {/* Ground Ambient Contact Shadow Under 3D Piece */}
            <div className="absolute bottom-36 left-1/2 -translate-x-1/2 w-[460px] h-[80px] rounded-full bg-black/85 blur-2xl pointer-events-none" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />
      </div>
      {/* END: AR Camera Viewport Layer */}

      {/* BEGIN: LIVE INTERACTIVE 3D WEBGL / WEBXR STAGE */}
      <div className="absolute inset-0 z-15 pb-64 pt-16 flex items-center justify-center">
        <SpatialModelViewer
          viewerRef={viewerRef}
          productId={activeProduct.id}
          productName={activeProduct.name}
          posterUrl={activeProduct.image}
          rawDimensions={activeProduct.dimensions}
          activeSwatch={activeSwatch}
          scaleMultiplier={currentScale.multiplier}
          lightingMode={lightingMode}
          autoRotate={false}
          showDimensionBadges={true}
          usePosterImage={false}
          dimensionLabel={`${currentScale.label} • 1:1 Calibrated`}
          className="w-full h-full"
        />
      </div>
      {/* END: LIVE INTERACTIVE 3D WEBGL / WEBXR STAGE */}

      {/* BEGIN: HUD Viewport Reticle Corners */}
      <div className="absolute inset-0 pointer-events-none z-10 p-5 flex flex-col justify-between">
        <div className="flex justify-between w-full pt-16">
          <div className="w-6 h-6 border-t-[1.5px] border-l-[1.5px] border-brand-gold/60" />
          <div className="w-6 h-6 border-t-[1.5px] border-r-[1.5px] border-brand-gold/60" />
        </div>
        <div className="flex justify-between w-full pb-72">
          <div className="w-6 h-6 border-b-[1.5px] border-l-[1.5px] border-brand-gold/60" />
          <div className="w-6 h-6 border-b-[1.5px] border-r-[1.5px] border-brand-gold/60" />
        </div>
      </div>
      {/* END: HUD Viewport Reticle Corners */}

      {/* BEGIN: Top Viewfinder Bar & Navigation */}
      <header className="absolute top-0 inset-x-0 z-30 pt-safe px-3 sm:px-4 pt-3 sm:pt-4 pb-2">
        <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
          <Link
            href={`/products/${activeProduct.id}`}
            aria-label="Exit AR Mode"
            className="w-10 h-10 rounded-full hud-glass-chip flex items-center justify-center text-brand-goldLight hover:text-white transition active:scale-95 shadow-lg shrink-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {/* Center Brand & LiDAR Telemetry Chip */}
          <div className="flex flex-col items-center">
            <div className="hud-glass-chip px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full flex items-center space-x-2 border border-brand-gold/25 shadow-gold-glow">
              <span
                className={`w-2 h-2 rounded-full ring-2 ${
                  isLocked
                    ? 'bg-emerald-400 animate-lidar ring-emerald-400/30'
                    : 'bg-amber-400 ring-amber-400/30 animate-ping'
                }`}
              />
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-travertine">
                ZEBDECOR <span className="text-brand-gold font-light">WEBXR 3D STUDIO</span>
              </span>
            </div>
            {/* Desktop-only telemetry details to keep mobile viewport uncluttered */}
            <div className="hidden sm:flex items-center space-x-1.5 mt-1">
              <span className="text-[9px] uppercase tracking-wider text-neutral-300/80 font-mono">
                {liveCameraActive ? 'Live Camera Pass-Through' : 'Interactive glTF 2.0 PBR'}
              </span>
              <span className="text-brand-gold/40 text-[9px]">•</span>
              <span className="text-[9px] uppercase tracking-wider text-brand-goldLight/90 font-mono">
                1:1 Metric Scale
              </span>
            </div>
          </div>

          {/* Quick Environment Controls Group */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              onClick={() => setLiveCameraActive((prev) => !prev)}
              aria-label="Toggle Live Camera Feed"
              className={`w-10 h-10 sm:w-auto sm:px-3 rounded-full hud-glass-chip flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-wider transition active:scale-95 shadow-lg cursor-pointer ${
                liveCameraActive ? 'border-emerald-400 text-emerald-300' : 'text-brand-goldLight hover:text-white'
              }`}
              title="Toggle Live Room Camera Pass-Through"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">videocam</span>
              <span className="hidden sm:inline">{liveCameraActive ? 'Camera On' : 'Live Cam'}</span>
            </button>

            <button
              onClick={handleToggleLighting}
              aria-label="Lighting Mode"
              className="w-10 h-10 rounded-full hud-glass-chip flex items-center justify-center text-brand-goldLight hover:text-white transition active:scale-95 shadow-lg cursor-pointer"
              title={`Lighting: ${lightingMode}`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">light_mode</span>
            </button>

            <button
              onClick={handleResetPlane}
              aria-label="Recalibrate Plane"
              className="w-10 h-10 rounded-full hud-glass-chip flex items-center justify-center text-brand-goldLight hover:text-white transition active:scale-95 shadow-lg cursor-pointer"
              title="Reset 3D Orbit & Plane"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>
      </header>
      {/* END: Top Viewfinder Bar & Navigation */}

      {/* Top-Mid Spatial Surface Lock & Native AR Trigger */}
      <div className="absolute top-[4.5rem] sm:top-24 inset-x-0 z-20 flex flex-col items-center gap-2 px-3 pointer-events-none">
        <div className="hud-glass-chip px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full flex items-center space-x-2 border border-brand-gold/30 shadow-md pointer-events-auto max-w-full">
          <span className="text-[10px] sm:text-[11px] font-sans font-medium text-neutral-200 tracking-wide flex items-center gap-1.5 flex-wrap justify-center">
            <span>Drag 360° • Pinch to zoom</span>
            <span className="text-neutral-500">•</span>
            <button
              type="button"
              onClick={handleActivateNativeAR}
              className="text-brand-gold hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
              <span>Launch Phone AR ↗</span>
            </button>
          </span>
        </div>

        {!liveCameraActive && (
          <button
            type="button"
            onClick={() => setLiveCameraActive(true)}
            className="hud-glass-chip px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/10 transition cursor-pointer pointer-events-auto flex items-center gap-2 shadow-xl backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Turn On Room Camera (Pass-Through)</span>
          </button>
        )}

        {cameraError && (
          <div className="hud-glass-chip px-3 py-1 rounded-full text-[10px] text-amber-300 font-mono">
            {cameraError}
          </div>
        )}
      </div>

      {/* Snapshot Toast Notification with Download */}
      {snapshotDataUrl && (
        <div className="absolute top-36 inset-x-0 mx-auto max-w-sm z-50 text-center px-4">
          <div className="hud-glass-chip px-4 py-2.5 rounded-full border border-brand-gold text-brand-goldLight text-xs font-mono shadow-2xl flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
            <span>3D Spatial Frame Captured</span>
            {snapshotDataUrl.startsWith('data:image') && (
              <a
                href={snapshotDataUrl}
                download={`${activeProduct.id}-ar-snapshot.png`}
                className="px-2 py-0.5 rounded bg-brand-gold text-black font-semibold hover:brightness-110"
              >
                Save PNG
              </a>
            )}
          </div>
        </div>
      )}

      {/* BEGIN: Bottom AR Control Tray & Product Drawer */}
      <section className="absolute inset-x-0 bottom-0 z-40 ar-glass-panel rounded-t-[32px] pt-2 pb-safe px-5 shadow-2xl flex flex-col justify-end">
        <div className="w-full flex justify-center py-1">
          <div className="w-10 h-1 rounded-full bg-neutral-600/60" />
        </div>

        <div className="max-w-xl mx-auto w-full space-y-3 pt-1 pb-4">
          {/* Quick Product Switcher Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {arProducts.map((item) => {
              const isSelected = item.id === activeProduct.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedProductId(item.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-brand-gold text-black font-semibold shadow-sm'
                      : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                  }`}
                >
                  {item.name.replace('The ', '')}
                </button>
              );
            })}
          </div>

          {/* Product Quick-Card & Material Finishes Row */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-0.5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-brand-gold font-semibold font-mono">
                  {activeProduct.ref}
                </span>
                <span className="text-[9px] text-neutral-400 font-mono">• Live PBR Mesh</span>
              </div>
              <h2 className="font-serif text-lg text-white font-medium tracking-wide truncate">
                {activeProduct.name}
              </h2>
              <p className="text-xs text-neutral-300 font-light flex items-center space-x-1.5 mt-0.5">
                <span className="text-neutral-300 truncate">{swatchDetails[activeSwatch].name}</span>
                <span className="text-brand-gold/50">•</span>
                <span className="text-brand-goldLight font-medium shrink-0">{currentScale.price}</span>
              </p>
            </div>

            {/* Finish Swatch Selector (Updates 3D PBR Material Live) */}
            <div className="flex items-center space-x-1.5 bg-black/40 p-1.5 rounded-full border border-white/10">
              <button
                aria-label="Select Boucle material"
                onClick={() => setActiveSwatch('boucle')}
                className={`relative w-7 h-7 rounded-full bg-[#f4f0e6] transition cursor-pointer ${
                  activeSwatch === 'boucle'
                    ? 'ring-2 ring-brand-gold ring-offset-2 ring-offset-black scale-105'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Ivory Bouclé & Calacatta"
                type="button"
              />
              <button
                aria-label="Select Cognac Leather material"
                onClick={() => setActiveSwatch('leather')}
                className={`relative w-7 h-7 rounded-full bg-[#8c4b27] transition cursor-pointer ${
                  activeSwatch === 'leather'
                    ? 'ring-2 ring-brand-gold ring-offset-2 ring-offset-black scale-105'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Cognac Saddle Leather & Teak"
                type="button"
              />
              <button
                aria-label="Select Dark Teak Plinth"
                onClick={() => setActiveSwatch('darkTeak')}
                className={`relative w-7 h-7 rounded-full bg-[#1e1c1b] transition cursor-pointer ${
                  activeSwatch === 'darkTeak'
                    ? 'ring-2 ring-brand-gold ring-offset-2 ring-offset-black scale-105'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Blackened Limba & Smoked Wool"
                type="button"
              />
            </div>
          </div>

          {/* Scale Dimension Controls Strip */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
              1:1 Scale:
            </span>
            <div className="flex items-center gap-1.5">
              {(['240', '280', '340'] as const).map((sc) => (
                <button
                  key={sc}
                  onClick={() => setActiveScale(sc)}
                  className={`px-3 py-1 rounded-md text-[11px] font-mono transition cursor-pointer ${
                    activeScale === sc
                      ? 'bg-brand-gold text-black font-semibold'
                      : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                  }`}
                  type="button"
                >
                  {sc === '240' ? 'Petite (0.86x)' : sc === '280' ? 'Standard (1.0x)' : 'Grand (1.21x)'}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Action Cluster: Camera Shutter, Native AR & Concierge Order */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              onClick={handleTakeSnapshot}
              className="w-12 h-12 rounded-full hud-glass-chip flex items-center justify-center text-brand-gold hover:text-white hover:border-brand-gold transition active:scale-90 shadow-shutter shrink-0 cursor-pointer"
              title="Capture 3D WebGL Snapshot"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">photo_camera</span>
            </button>

            <button
              onClick={handleActivateNativeAR}
              className="py-3 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-brand-gold/40 text-brand-goldLight font-label-uppercase text-[10px] tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
              <span>Place in Room</span>
            </button>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldLight text-black font-label-uppercase text-label-uppercase font-semibold tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span className="truncate">Commission Spec</span>
            </a>
          </div>
        </div>
      </section>
      {/* END: Bottom AR Control Tray */}
    </div>
  );
}

export default function ARSpatialStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-black flex items-center justify-center text-brand-goldLight font-mono text-xs">
          Loading Zebdecor WebXR Spatial Studio...
        </div>
      }
    >
      <ARSpatialStudioContent />
    </Suspense>
  );
}
