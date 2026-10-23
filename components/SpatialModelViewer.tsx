'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getSpatialModelConfig } from '@/lib/domain/pricing-engine';
import { PBRMaterialOverride } from '@/lib/domain/types';

/**
 * Strongly-typed Scene-Graph interface for @google/model-viewer
 * Avoids `any` while accessing WebGL PBR materials and WebXR methods.
 */
interface ModelViewerPBRMetallicRoughness {
  setBaseColorFactor: (rgba: readonly [number, number, number, number] | number[]) => void;
  setRoughnessFactor: (value: number) => void;
  setMetallicFactor: (value: number) => void;
}

interface ModelViewerMaterial {
  name: string;
  readonly isLoaded?: boolean;
  ensureLoaded?: () => Promise<void>;
  pbrMetallicRoughness: ModelViewerPBRMetallicRoughness;
}

export interface ModelViewerElement extends HTMLElement {
  src: string;
  poster?: string;
  alt?: string;
  loading?: string;
  reveal?: string;
  ar?: boolean;
  arModes?: string;
  arScale?: string;
  cameraControls?: boolean;
  autoRotate?: boolean;
  shadowIntensity?: string;
  exposure?: string;
  scale?: string;
  cameraOrbit?: string;
  readonly loaded?: boolean;
  readonly canActivateAR?: boolean;
  readonly model?: {
    readonly materials: readonly ModelViewerMaterial[];
  };
  dismissPoster: () => void;
  showPoster: () => void;
  activateAR: () => Promise<void>;
  toDataURL: (type?: string, quality?: number) => string;
}

interface SpatialModelViewerProps {
  productId: string;
  productName: string;
  posterUrl: string;
  rawDimensions: string;
  activeSwatch?: 'boucle' | 'leather' | 'darkTeak';
  customHexColor?: string;
  scaleMultiplier?: number;
  lightingMode?: 'daylight' | 'golden' | 'evening';
  autoRotate?: boolean;
  showDimensionBadges?: boolean;
  dimensionLabel?: string;
  className?: string;
  usePosterImage?: boolean;
  onModelReady?: (canAR: boolean) => void;
  viewerRef?: React.MutableRefObject<ModelViewerElement | null>;
}

function hexToRgbaTuple(hex: string): [number, number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean.length === 3 ? clean.replace(/(.)/g, '$1$1') : clean, 16);
  if (Number.isNaN(num)) return [0.95, 0.93, 0.89, 1.0];
  // Convert sRGB to linear approximation for glTF PBR
  const r = Math.pow(((num >> 16) & 255) / 255, 2.2);
  const g = Math.pow(((num >> 8) & 255) / 255, 2.2);
  const b = Math.pow((num & 255) / 255, 2.2);
  return [
    Math.round(r * 1000) / 1000,
    Math.round(g * 1000) / 1000,
    Math.round(b * 1000) / 1000,
    1.0,
  ];
}

function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

export default function SpatialModelViewer({
  productId,
  productName,
  posterUrl,
  rawDimensions,
  activeSwatch = 'boucle',
  customHexColor,
  scaleMultiplier = 1.0,
  lightingMode = 'daylight',
  autoRotate = true,
  showDimensionBadges = true,
  dimensionLabel,
  className = 'w-full h-full',
  usePosterImage = false,
  onModelReady,
  viewerRef,
}: SpatialModelViewerProps) {
  const internalRef = useRef<ModelViewerElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState<boolean>(true);

  const modelConfig = getSpatialModelConfig(productId, posterUrl, rawDimensions);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Always allow the component to render — we no longer gate on custom element
    // registration, because the gating logic itself was failing (whenDefined promise
    // lost on HMR/StrictMode cleanup) and left the page stuck on "Loading...".
    setMounted(true);

    const hasGL = isWebGLSupported();
    setWebglAvailable(hasGL);
    if (!hasGL) return;

    // If the layout's <script type="module"> hasn't loaded yet, register via
    // dynamic import as a fallback (e.g. module blocked on Android Chrome over LAN).
    if (!customElements.get('model-viewer')) {
      import('@google/model-viewer').catch((err) => {
        console.warn('[SpatialModelViewer] dynamic import failed:', err);
      });
    }

    // Once the custom element is defined, explicitly upgrade any <model-viewer>
    // tag that React already rendered into the DOM. Without this, the element
    // stays as HTMLUnknownElement and never loads the model.
    customElements.whenDefined('model-viewer').then(() => {
      if (internalRef.current && typeof customElements.upgrade === 'function') {
        try { customElements.upgrade(internalRef.current); } catch {}
      }
    }).catch(() => {});
  }, []);

  // Apply PBR Material overrides to the live 3D Scene Graph
  const applyPBRMaterials = async (el: ModelViewerElement) => {
    if (!el.model || !el.model.materials) return;

    // Ensure all materials are loaded before accessing pbrMetallicRoughness
    await Promise.all(
      el.model.materials.map(async (mat) => {
        if (typeof mat.ensureLoaded === 'function' && !mat.isLoaded) {
          try {
            await mat.ensureLoaded();
          } catch (err) {
            console.warn(`[SpatialModelViewer] Material "${mat.name}" ensureLoaded failed:`, err);
          }
        }
      })
    );

    const presets: readonly PBRMaterialOverride[] =
      modelConfig.materialPresets[activeSwatch] || modelConfig.materialPresets.boucle || [];

    const upholsteryPreset = presets.find((p) => p.slot === 'Upholstery');
    const plinthPreset = presets.find((p) => p.slot === 'TimberPlinth');
    const marblePreset = presets.find((p) => p.slot === 'MarbleSlab');
    const brassPreset = presets.find((p) => p.slot === 'BrassAccent');

    for (const mat of el.model.materials) {
      try {
        if (typeof mat.ensureLoaded === 'function' && !mat.isLoaded) {
          try {
            await mat.ensureLoaded();
          } catch {}
        }
        if (!mat.pbrMetallicRoughness) continue;

        const name = (mat.name || '').toLowerCase();

        if (name.includes('fabric') || name.includes('upholstery') || name.includes('cushion') || name.includes('seat')) {
          const color = customHexColor ? hexToRgbaTuple(customHexColor) : upholsteryPreset?.baseColorFactor || [0.95, 0.93, 0.89, 1.0];
          mat.pbrMetallicRoughness.setBaseColorFactor(color);
          mat.pbrMetallicRoughness.setRoughnessFactor(upholsteryPreset?.roughnessFactor ?? 0.88);
          mat.pbrMetallicRoughness.setMetallicFactor(upholsteryPreset?.metallicFactor ?? 0.02);
        } else if (name.includes('wood') || name.includes('timber') || name.includes('plinth') || name.includes('leg')) {
          if (plinthPreset) {
            mat.pbrMetallicRoughness.setBaseColorFactor(plinthPreset.baseColorFactor);
            mat.pbrMetallicRoughness.setRoughnessFactor(plinthPreset.roughnessFactor);
            mat.pbrMetallicRoughness.setMetallicFactor(plinthPreset.metallicFactor);
          }
        } else if (name.includes('marble') || name.includes('slab') || name.includes('stone') || name.includes('top')) {
          if (marblePreset) {
            mat.pbrMetallicRoughness.setBaseColorFactor(marblePreset.baseColorFactor);
            mat.pbrMetallicRoughness.setRoughnessFactor(marblePreset.roughnessFactor);
            mat.pbrMetallicRoughness.setMetallicFactor(marblePreset.metallicFactor);
          }
        } else if (name.includes('brass') || name.includes('metal') || name.includes('gold') || name.includes('feet')) {
          mat.pbrMetallicRoughness.setBaseColorFactor(brassPreset?.baseColorFactor || [0.77, 0.63, 0.35, 1.0]);
          mat.pbrMetallicRoughness.setMetallicFactor(0.85);
          mat.pbrMetallicRoughness.setRoughnessFactor(0.22);
        }
      } catch (err) {
        console.warn(`[SpatialModelViewer] Error applying PBR overrides to material "${mat.name}":`, err);
      }
    }
  };

  // Bind model-viewer lifecycle and load events once mounted
  useEffect(() => {
    if (!mounted) return;
    const el = internalRef.current;
    if (!el) return;

    let isDisposed = false;
    let modelReady = false; // guards against double-firing from immediate `loaded` check + event
    const markReady = async () => {
      if (isDisposed || modelReady) return;
      modelReady = true;
      setIsLoaded(true);
      setLoadProgress(100);
      try {
        el.dismissPoster();
      } catch {}
      await applyPBRMaterials(el);
      if (onModelReady) {
        onModelReady(Boolean(el.canActivateAR));
      }
    };

    const handleLoad = () => {
      void markReady();
    };

    const handleProgress = (event: Event) => {
      const customEvent = event as CustomEvent<{ totalProgress: number }>;
      const progress = customEvent.detail?.totalProgress ?? 0;
      if (!isDisposed) {
        setLoadProgress(Math.round(progress * 100));
      }
      if (progress >= 1) {
        setTimeout(() => {
          if (!isDisposed && !modelReady) {
            try {
              el.dismissPoster();
            } catch {}
          }
        }, 150);
      }
    };

    const handlePosterDismissed = () => {
      // CRITICAL: only mark loaded when model-viewer itself fires this — NOT a fallback timer
      // We keep the timer, but poster-dismissed is the canonical mobile-safe signal.
      void markReady();
    };

    const handleError = (e: Event) => {
      console.warn('[SpatialModelViewer] model-viewer error event:', e);
      if (!isDisposed) {
        // Unblock UI so user can interact even if non-critical shader warning occurred
        void markReady();
      }
    };

    el.addEventListener('load', handleLoad);
    el.addEventListener('progress', handleProgress);
    el.addEventListener('poster-dismissed', handlePosterDismissed);
    el.addEventListener('error', handleError);

    // If already loaded into scene-graph when we attach (e.g. cached / second mount)
    if (el.loaded || el.model) {
      void markReady();
    }

    // Mobile fallback timer: auto-dismiss poster if browser drops load/poster-dismissed events.
    // Shortened to 2.5s so the UI is never visibly stuck, and re-armed only once.
    const safetyTimer = setTimeout(() => {
      if (!isDisposed && !modelReady) {
        try {
          el.dismissPoster();
        } catch {}
        void markReady();
      }
    }, 2500);

    return () => {
      isDisposed = true;
      clearTimeout(safetyTimer);
      el.removeEventListener('load', handleLoad);
      el.removeEventListener('progress', handleProgress);
      el.removeEventListener('poster-dismissed', handlePosterDismissed);
      el.removeEventListener('error', handleError);
    };
  }, [mounted, modelConfig.glbPath]);

  // Re-apply PBR material parameters whenever swatch or custom color changes
  useEffect(() => {
    const el = internalRef.current;
    if (el && isLoaded) {
      applyPBRMaterials(el);
    }
  }, [activeSwatch, customHexColor, isLoaded]);

  // Update 1:1 physical scale dynamically in 3D & WebXR
  useEffect(() => {
    const el = internalRef.current;
    if (!el) return;
    const sx = Math.round(scaleMultiplier * 100) / 100;
    const sz = Math.round((0.88 + scaleMultiplier * 0.12) * 100) / 100;
    el.scale = `${sx} 1 ${sz}`;
  }, [scaleMultiplier]);

  const exposureValue =
    lightingMode === 'daylight' ? '1.1' : lightingMode === 'golden' ? '0.95' : '0.68';
  const shadowValue =
    lightingMode === 'daylight' ? '1.15' : lightingMode === 'golden' ? '1.4' : '0.85';

  const scaledLengthMM = Math.round(modelConfig.baseDimensions.lengthMM * scaleMultiplier);

  if (!webglAvailable && mounted) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://192.168.100.64:3003';
    const absoluteGlb = `${origin}${modelConfig.glbPath.split('?')[0]}`;
    const sceneViewerIntent = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
      absoluteGlb
    )}&title=${encodeURIComponent(productName)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;

    return (
      <div className={`relative select-none flex items-center justify-center p-4 ${className}`}>
        <div className="max-w-sm w-full p-6 rounded-2xl bg-[#14110e]/95 border border-brand-gold/40 text-center shadow-2xl backdrop-blur-xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">view_in_ar</span>
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-base text-white font-medium">
              Mobile 3D Acceleration Paused
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              Your browser&apos;s WebGL memory is temporarily reserved by open background tabs. You can view <strong className="text-white">{productName}</strong> directly in native Android ARCore:
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <a
              href={sceneViewerIntent}
              className="w-full py-2.5 rounded-lg bg-brand-gold hover:brightness-110 text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
              <span>Launch ARCore Camera (Bypass WebGL)</span>
            </a>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 text-[11px] font-mono uppercase tracking-wider transition cursor-pointer"
            >
              Close Background Tabs &amp; Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative select-none ${className}`}>
      {/* Floating non-blocking loading HUD — disappears once loaded or via safety timer */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-opacity duration-500">
          <div className="px-4 py-2.5 rounded-full hud-glass-chip border border-brand-gold/40 text-[11px] font-mono text-brand-goldLight flex items-center gap-2.5 shadow-2xl backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
            <span>
              {loadProgress > 0 && loadProgress < 100
                ? `Loading 1:1 3D Spatial Mesh (${loadProgress}%)...`
                : 'Rendering 1:1 3D Spatial Mesh...'}
            </span>
          </div>
        </div>
      )}

      {React.createElement(
        'model-viewer',
        {
          suppressHydrationWarning: true,
          ref: (node: ModelViewerElement | null) => {
            internalRef.current = node;
            if (viewerRef) {
              viewerRef.current = node;
            }
          },
          src: modelConfig.glbPath,
          poster: usePosterImage ? modelConfig.posterUrl : undefined,
          alt: `Interactive 1:1 3D & WebXR model of ${productName}`,
          loading: 'eager',
          reveal: 'auto',
          ar: true,
          'ar-modes': 'webxr scene-viewer quick-look',
          'ar-scale': 'fixed',
          'camera-controls': true,
          'auto-rotate': autoRotate ? true : undefined,
          'auto-rotate-delay': '1000',
          'rotation-per-second': '16deg',
          'shadow-intensity': shadowValue,
          'shadow-softness': '0.85',
          exposure: exposureValue,
          'camera-orbit': modelConfig.defaultCameraOrbit,
          'camera-target': 'auto auto auto',
          'interaction-prompt': 'none',
          'min-camera-orbit': 'auto 15deg auto',
          'max-camera-orbit': 'auto 88deg auto',
          'touch-action': 'pan-y',
          style: {
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            '--poster-color': 'transparent',
          } as React.CSSProperties,
        },
        showDimensionBadges ? (
          <div
            key="dimensions-badge"
            slot="hotspot-dimensions"
            data-position="0 0.82 0"
            data-normal="0 1 0"
            className="pointer-events-none select-none"
          >
            <div className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-brand-gold/50 text-[10px] font-mono text-brand-goldLight shadow-lg whitespace-nowrap flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>
                {dimensionLabel ||
                  `${scaledLengthMM}L × ${modelConfig.baseDimensions.depthMM}D × ${modelConfig.baseDimensions.heightMM}H mm`}
              </span>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
