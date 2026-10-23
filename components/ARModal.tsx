'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import SpatialModelViewer from './SpatialModelViewer';
import { products } from '@/data/sample';

interface ARModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle?: string;
  productId?: string;
  selectedScale?: string;
  selectedSwatch?: 'boucle' | 'leather' | 'darkTeak';
}

export default function ARModal({
  isOpen,
  onClose,
  itemTitle = 'The Aso Minimalist Curved Sofa',
  productId,
  selectedScale = '280',
  selectedSwatch = 'boucle',
}: ARModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [useLanIp, setUseLanIp] = useState(true);

  const [currentPort, setCurrentPort] = useState<string>('3003');
  const [currentHostname, setCurrentHostname] = useState<string>('192.168.100.64');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const port = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
      setCurrentPort(port);
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        setCurrentHostname(window.location.hostname);
      }
    }
  }, []);

  const matchedProduct =
    products.find(
      (p) =>
        (productId && p.id === productId) ||
        p.name.toLowerCase() === itemTitle.toLowerCase()
    ) || products[0];

  const arRelativeUrl = `/ar?product=${encodeURIComponent(
    matchedProduct.id
  )}&scale=${encodeURIComponent(selectedScale)}&swatch=${encodeURIComponent(selectedSwatch)}`;

  const isLocalDev =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.') ||
      window.location.hostname.startsWith('10.'));

  const portSuffix = currentPort && currentPort !== '80' && currentPort !== '443' ? `:${currentPort}` : '';
  const lanHost = `${currentHostname}${portSuffix}`;

  const resolvedMobileUrl =
    typeof window !== 'undefined'
      ? useLanIp
        ? `${window.location.protocol}//${lanHost}${arRelativeUrl}`
        : `${window.location.origin}${arRelativeUrl}`
      : `https://zebdecor.com${arRelativeUrl}`;

  // Generate standard ISO/IEC 18004 scannable QR Code
  useEffect(() => {
    let active = true;
    QRCode.toDataURL(resolvedMobileUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: '#14110e',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [resolvedMobileUrl]);

  // Open/close native <dialog> using showModal() and wire light-dismiss fallback per modern-web-guidance
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }

    const handleNativeClose = () => {
      onClose();
    };

    // Fallback for browsers without declarative <dialog closedby="any"> support (e.g. Safari)
    const handleBackdropClick = (event: MouseEvent) => {
      if (!('closedBy' in HTMLDialogElement.prototype)) {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
        dialog.close();
      }
    };

    dialog.addEventListener('close', handleNativeClose);
    dialog.addEventListener('click', handleBackdropClick);
    return () => {
      dialog.removeEventListener('close', handleNativeClose);
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(resolvedMobileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="ar-modal-title"
      className="bg-surface text-on-surface rounded-2xl max-w-xl w-full p-0 shadow-2xl border border-surface-container-highest/60 backdrop:bg-primary/80 backdrop:backdrop-blur-md open:animate-in open:fade-in open:zoom-in-95 duration-200 m-auto"
    >
      <div className="p-space-md space-y-space-sm relative">
        <button
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary w-8 h-8 rounded-full bg-surface-container flex items-center justify-center transition-colors cursor-pointer z-20"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close AR Modal"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
            <span className="material-symbols-outlined text-[24px]">view_in_ar</span>
          </div>
          <div>
            <span className="font-label-uppercase text-label-uppercase text-secondary block">
              WebXR &amp; Apple QuickLook 1:1 Spatial Engine
            </span>
            <h4 id="ar-modal-title" className="font-headline-md text-headline-md text-primary">
              {matchedProduct.name}
            </h4>
          </div>
        </div>

        {/* Interactive Live 3D Model Preview Inside Modal */}
        <div className="relative w-full h-60 rounded-xl overflow-hidden bg-gradient-to-b from-[#1d1814] to-[#0d0b09] border border-brand-gold/30">
          <SpatialModelViewer
            productId={matchedProduct.id}
            productName={matchedProduct.name}
            posterUrl={matchedProduct.image}
            rawDimensions={matchedProduct.dimensions}
            activeSwatch={selectedSwatch}
            autoRotate={true}
            showDimensionBadges={true}
            usePosterImage={false}
            className="w-full h-full"
          />
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-brand-gold/30 text-[10px] font-mono text-brand-goldLight pointer-events-none">
            Realistic PBR Model • Drag to Orbit 360°
          </div>
        </div>

        {/* Dynamic Standard Scannable QR Code */}
        <div className="bg-surface-container-low p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 border border-surface-container-high">
          <div className="p-2 bg-white rounded-xl shadow-md border border-outline-variant/30 shrink-0 flex items-center justify-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Scannable QR code to view ${matchedProduct.name} in AR`}
                className="w-28 h-28 object-contain rounded"
              />
            ) : (
              <div className="w-28 h-28 bg-surface-container animate-pulse rounded" />
            )}
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="font-label-regular text-label-regular text-primary font-semibold">
                Scan with iPhone Camera or Android WebXR
              </p>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Instantly launches the camera to project <span className="font-medium text-primary">{matchedProduct.name}</span> onto your room floor at 1:1 scale ({matchedProduct.dimensions}).
            </p>

            {isLocalDev && (
              <div className="pt-1 flex flex-col sm:flex-row items-center sm:items-baseline gap-1.5 sm:gap-2">
                <span className="text-[11px] font-mono text-secondary">
                  Target: <code className="text-primary font-bold bg-surface-container px-1.5 py-0.5 rounded">{useLanIp ? lanHost : (typeof window !== 'undefined' ? window.location.host : `localhost:${currentPort}`)}</code>
                </span>
                <button
                  type="button"
                  onClick={() => setUseLanIp((v) => !v)}
                  className="text-[10px] font-mono underline text-secondary hover:text-primary cursor-pointer"
                >
                  {useLanIp ? 'Switch to Localhost' : 'Switch to Wi-Fi LAN IP'}
                </button>
              </div>
            )}

            <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-[11px] font-mono px-2.5 py-1 rounded bg-surface-container-high hover:bg-secondary-container text-primary transition-colors cursor-pointer"
              >
                {copied ? '✓ Link Copied' : 'Copy Mobile Link'}
              </button>
              <a
                href={`/models/${matchedProduct.id}.glb`}
                download={`${matchedProduct.id}.glb`}
                className="text-[11px] font-mono px-2.5 py-1 rounded bg-surface-container-high hover:bg-secondary-container text-secondary transition-colors"
              >
                ↓ Download .GLB
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <Link
            href={arRelativeUrl}
            onClick={() => dialogRef.current?.close()}
            className="w-full py-3 rounded-lg bg-secondary hover:bg-secondary/90 text-on-secondary font-label-uppercase text-label-uppercase text-center transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
            <span>Launch Fullscreen AR Studio</span>
          </Link>

          <a
            className="w-full py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-uppercase text-label-uppercase text-center transition-all flex items-center justify-center gap-1.5"
            href={`https://wa.me/23480093233267?text=${encodeURIComponent(
              `Hello Zebdecor Team, please send me the 3D USDZ / Revit CAD package for ${matchedProduct.name} (${matchedProduct.ref}) for spatial verification.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>Request Revit / CAD Package</span>
          </a>
        </div>
      </div>
    </dialog>
  );
}
