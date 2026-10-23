'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { products, Product } from '@/data/sample';
import ARModal from '@/components/ARModal';
import SpatialConsultationModal from '@/components/SpatialConsultationModal';
import SpatialModelViewer from '@/components/SpatialModelViewer';
import RoomClearanceCalculator from '@/components/RoomClearanceCalculator';
import { addToCommissionBag } from '@/lib/store/commission-bag';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  // Normalize id lookup
  const targetId = id.toLowerCase();
  const product = products.find(
    (p) =>
      p.id.toLowerCase() === targetId ||
      p.id.replace(/-/g, '') === targetId.replace(/-/g, '') ||
      (targetId.includes('zuma') && p.id.includes('zuma')) ||
      (targetId.includes('aso') && p.id.includes('aso')) ||
      (targetId.includes('credenza') && p.id.includes('credenza')) ||
      (targetId.includes('lounge') && p.id.includes('lounge'))
  ) || products[0];

  const [activeImage, setActiveImage] = useState(product.gallery[0]?.src || product.image);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');
  const [bagAddedToast, setBagAddedToast] = useState(false);

  // Configuration States
  const [selectedScale, setSelectedScale] = useState(
    product.scales ? product.scales[product.scales.length > 1 ? 1 : 0] : null
  );
  const [currentPrice, setCurrentPrice] = useState(
    product.scales ? product.scales[product.scales.length > 1 ? 1 : 0]?.price : product.price
  );

  const [selectedSlab, setSelectedSlab] = useState(
    product.slabOptions ? product.slabOptions[0]?.name : ''
  );
  const [selectedTextile, setSelectedTextile] = useState(
    product.textiles ? product.textiles[0]?.name : ''
  );
  const [selectedTimber, setSelectedTimber] = useState(
    product.timberOptions
      ? product.timberOptions[0]?.name
      : product.finishes
      ? product.finishes[0]?.name
      : 'Kiln-Dried Benue Teak'
  );

  // Modals
  const [arModalOpen, setArModalOpen] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  useEffect(() => {
    setActiveImage(product.gallery[0]?.src || product.image);
    setActiveThumbIndex(0);
    if (product.scales && product.scales.length > 0) {
      const defaultScale = product.scales.length > 1 ? product.scales[1] : product.scales[0];
      setSelectedScale(defaultScale);
      setCurrentPrice(defaultScale.price);
    } else {
      setCurrentPrice(product.price);
    }
  }, [product]);

  const handleSelectThumb = (src: string, index: number) => {
    setActiveImage(src);
    setActiveThumbIndex(index);
    setViewMode('photo');
  };

  const handleScaleChange = (scale: { name: string; dimension: string; price: string }) => {
    setSelectedScale(scale);
    setCurrentPrice(scale.price);
  };

  const mappedSwatchFor3D: 'boucle' | 'leather' | 'darkTeak' =
    (selectedTextile || selectedSlab || '').toLowerCase().includes('leather') ||
    (selectedTextile || selectedSlab || '').toLowerCase().includes('camel') ||
    (selectedTextile || selectedSlab || '').toLowerCase().includes('travertine')
      ? 'leather'
      : (selectedTimber || '').toLowerCase().includes('limba') ||
        (selectedTextile || selectedSlab || '').toLowerCase().includes('olive') ||
        (selectedTextile || selectedSlab || '').toLowerCase().includes('nero')
      ? 'darkTeak'
      : 'boucle';

  const scaleMultiplierFor3D =
    selectedScale?.name.toLowerCase().includes('petite') ||
    selectedScale?.name.toLowerCase().includes('8-seater')
      ? 0.86
      : selectedScale?.name.toLowerCase().includes('grand') ||
        selectedScale?.name.toLowerCase().includes('12-seater')
      ? 1.21
      : 1.0;

  const handleAddToBag = () => {
    addToCommissionBag({
      productId: product.id,
      productName: product.name,
      ref: product.ref,
      image: product.image,
      scaleLabel: selectedScale ? selectedScale.name : product.dimensions,
      materialLabel: selectedSlab || selectedTextile || product.swatches?.[0]?.name || 'Atelier Standard',
      timberLabel: selectedTimber,
      unitPriceFormatted: currentPrice,
    });
    setBagAddedToast(true);
    setTimeout(() => setBagAddedToast(false), 2500);
  };

  // Find complementary products
  const complementaryProducts = (product.complementaryIds || [])
    .map((cid) => products.find((p) => p.id === cid))
    .filter(Boolean) as Product[];

  const isZuma = product.id.includes('zuma');
  const isAso = product.id.includes('aso');

  const waOrderLink = `https://wa.me/23480093233267?text=${encodeURIComponent(
    `Good day Zebdecor Atelier, I wish to place a priority commission for ${product.name} (${
      selectedScale ? selectedScale.dimension : product.dimensions
    }) in ${selectedSlab || selectedTextile || 'Bespoke Atelier Spec'} and ${selectedTimber}. Estimated investment: ${currentPrice}.`
  )}`;

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Top Breadcrumbs & Atelier Reference */}
      <section className="w-full px-gutter-mobile lg:px-margin pt-space-md pb-space-sm">
        <div className="flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant font-label-uppercase text-label-uppercase">
          <nav className="flex items-center gap-space-xs tracking-widest">
            <Link className="hover:text-primary transition-colors" href="/">
              Atelier
            </Link>
            <span className="text-outline-variant font-light">/</span>
            <Link
              className="hover:text-primary transition-colors capitalize"
              href={`/collections/${product.category}`}
            >
              {product.category} Sanctuaries
            </Link>
            <span className="text-outline-variant font-light">/</span>
            <span className="text-primary font-bold">{product.name}</span>
          </nav>
          <div className="flex items-center gap-space-xs text-secondary">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="tracking-widest">
              {isZuma
                ? 'Commission Slot 04/12 Available for 2025'
                : 'Commission Slot 03/10 Available for 2025'}
            </span>
          </div>
        </div>
      </section>

      {/* Master Stage: Asymmetrical Product Gallery & Atelier Customizer */}
      <section className="w-full px-gutter-mobile lg:px-margin py-space-sm pb-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg xl:gap-space-xl items-start">
          {/* Left Column: Spatial Visualizer & Editorial Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {/* Main Hero Image or Live 3D WebGL Frame */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container shadow-[0_16px_40px_rgba(44,24,16,0.06)] group">
              {viewMode === '3d' ? (
                <div className="w-full h-full bg-gradient-to-b from-[#1f1a16] to-[#0f0c0a]">
                  <SpatialModelViewer
                    productId={product.id}
                    productName={product.name}
                    posterUrl={activeImage}
                    rawDimensions={product.dimensions}
                    activeSwatch={mappedSwatchFor3D}
                    scaleMultiplier={scaleMultiplierFor3D}
                    autoRotate={true}
                    showDimensionBadges={true}
                    dimensionLabel={selectedScale ? selectedScale.dimension : product.dimensions}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <img
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  src={activeImage}
                />
              )}

              {/* Floating Visual Badges */}
              <div className="absolute top-space-sm left-space-sm flex flex-wrap gap-space-xs z-10">
                <span className="px-space-sm py-1 rounded-full bg-surface/90 backdrop-blur-md text-primary font-label-uppercase text-label-uppercase shadow-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-secondary">
                    verified_user
                  </span>
                  {product.badge || 'Flagship Masterpiece'}
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode((m) => (m === 'photo' ? '3d' : 'photo'))}
                  className={`px-space-sm py-1 rounded-full backdrop-blur-md font-label-uppercase text-label-uppercase shadow-sm flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface/90 text-primary hover:bg-secondary-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">3d_rotation</span>
                  <span>{viewMode === '3d' ? 'Back to Editorial Photos' : 'Interactive 3D Mesh'}</span>
                </button>
              </div>

              {/* Modern AR Quick Trigger Overlaid */}
              <button
                onClick={() => setArModalOpen(true)}
                className="absolute bottom-space-sm right-space-sm px-space-md py-2.5 rounded-full bg-primary/90 hover:bg-primary text-on-primary backdrop-blur-xl shadow-lg flex items-center gap-2 group/ar transition-all hover:pr-5 cursor-pointer z-10"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary-container">
                  view_in_ar
                </span>
                <span className="font-label-uppercase text-label-uppercase tracking-widest">
                  View 1:1 Scale in AR
                </span>
                <span className="material-symbols-outlined text-[14px] text-on-primary-container group-hover/ar:translate-x-0.5 transition-transform">
                  qr_code_2
                </span>
              </button>

              {/* 360 Spatial Orbit Toggle */}
              <button
                type="button"
                onClick={() => setViewMode((m) => (m === 'photo' ? '3d' : 'photo'))}
                className="absolute bottom-space-sm left-space-sm flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/85 hover:bg-surface backdrop-blur-md text-on-surface-variant font-label-uppercase text-[10px] tracking-widest shadow-sm cursor-pointer z-10"
              >
                <span className="material-symbols-outlined text-[14px] text-secondary">360</span>
                <span>{viewMode === '3d' ? 'Live glTF 2.0 Active' : 'Click to Orbit 360° in 3D'}</span>
              </button>
            </div>

            {/* Editorial Thumbnails Strip */}
            <div className="grid grid-cols-5 gap-space-xs sm:gap-space-sm">
              {product.gallery.map((thumb, idx) => {
                const isActive = activeThumbIndex === idx;
                return (
                  <button
                    key={idx}
                    className={`gallery-thumb aspect-square rounded-lg overflow-hidden bg-surface-container relative p-0.5 transition-all shadow-sm focus:outline-none cursor-pointer ${
                      isActive ? 'ring-2 ring-secondary' : 'opacity-80 hover:opacity-100'
                    }`}
                    onClick={() => handleSelectThumb(thumb.src, idx)}
                    type="button"
                  >
                    <img alt={thumb.label} className="w-full h-full object-cover rounded" src={thumb.src} />
                    <span className="absolute bottom-1 left-1 font-label-uppercase text-[9px] px-1 bg-surface/90 text-primary rounded backdrop-blur-xs hidden sm:inline-block">
                      {thumb.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Atelier Spatial Proofs Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-xs">
              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-xs shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  architecture
                </span>
                <div>
                  <p className="font-label-uppercase text-[10px] text-on-surface-variant uppercase tracking-widest">
                    Dimensioning
                  </p>
                  <p className="font-body-sm text-body-sm font-medium text-on-surface">
                    {selectedScale ? selectedScale.dimension : product.dimensions}
                  </p>
                </div>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-xs shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  nest_eco_leaf
                </span>
                <div>
                  <p className="font-label-uppercase text-[10px] text-on-surface-variant uppercase tracking-widest">
                    Sourcing
                  </p>
                  <p className="font-body-sm text-body-sm font-medium text-on-surface">
                    Ethical Nigerian Teak
                  </p>
                </div>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-xs shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  home_pin
                </span>
                <div>
                  <p className="font-label-uppercase text-[10px] text-on-surface-variant uppercase tracking-widest">
                    Showroom
                  </p>
                  <p className="font-body-sm text-body-sm font-medium text-on-surface">
                    Aguiyi Ironsi, Maitama
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bespoke Atelier Specifications & Order Concierge */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Master Header */}
            <div className="space-y-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-uppercase text-label-uppercase tracking-widest text-secondary font-semibold">
                  Bespoke Atelier Commission
                </span>
                <span className="font-label-regular text-label-regular text-on-surface-variant">
                  {product.ref}
                </span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-primary font-normal leading-tight">
                {product.name}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant pt-1 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price & Spatial Commission Estimator */}
            <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm space-y-space-xs">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-label-uppercase text-label-uppercase tracking-widest text-on-surface-variant block">
                    Commission Investment
                  </span>
                  <span className="font-headline-md text-headline-md text-primary font-normal tracking-tight">
                    {currentPrice}
                  </span>
                </div>
                <span className="px-space-sm py-1 rounded bg-secondary-container text-on-secondary-container font-label-uppercase text-[10px] font-semibold tracking-wider">
                  {selectedScale ? selectedScale.name : 'Atelier Masterpiece'}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Includes comprehensive spatial survey in Abuja/Lagos, white-glove inside delivery, and in-situ seismic leveling.
              </p>
            </div>

            {/* Bespoke Configurators */}
            <div className="space-y-space-md">
              {/* Config 1: Suite Seating Scale */}
              {product.scales && product.scales.length > 0 && (
                <div className="space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-uppercase text-label-uppercase tracking-widest text-primary font-semibold">
                      Seating Spatial Scale
                    </span>
                    <span className="font-label-regular text-label-regular text-secondary">
                      {selectedScale?.dimension}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-space-xs">
                    {product.scales.map((scale) => {
                      const isSel = selectedScale?.name === scale.name;
                      return (
                        <button
                          key={scale.name}
                          onClick={() => handleScaleChange(scale)}
                          className={`px-space-sm py-2.5 rounded-lg font-label-regular text-label-regular text-center transition-all shadow-sm cursor-pointer ${
                            isSel
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                          }`}
                          type="button"
                        >
                          {scale.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Config 2: Table Slab Material Selection (Zuma) or Textile Palette (Aso) */}
              {product.slabOptions && product.slabOptions.length > 0 && (
                <div className="space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-uppercase text-label-uppercase tracking-widest text-primary font-semibold">
                      Monolithic Table Slab
                    </span>
                    <span className="font-label-regular text-label-regular text-secondary">
                      {selectedSlab}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-space-xs">
                    {product.slabOptions.map((slab) => {
                      const isSel = selectedSlab === slab.name;
                      return (
                        <button
                          key={slab.name}
                          onClick={() => setSelectedSlab(slab.name)}
                          className={`p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-left flex flex-col items-center text-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                            isSel ? 'ring-2 ring-primary' : ''
                          }`}
                          type="button"
                        >
                          <span
                            className={`w-8 h-8 rounded-full shadow-inner bg-gradient-to-tr ${slab.gradient}`}
                          />
                          <span
                            className={`font-label-uppercase text-[10px] tracking-wider ${
                              isSel ? 'text-primary font-semibold' : 'text-on-surface-variant'
                            }`}
                          >
                            {slab.name.replace('Honed ', '').replace(' Velvet', '')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Config 2b: Upholstery Textile Palette (for Sofas/Seating) */}
              {product.textiles && product.textiles.length > 0 && (
                <div className="space-y-space-xs">
                  <div className="flex justify-between items-center">
                    <label className="font-label-uppercase text-label-uppercase text-primary tracking-wider">
                      Upholstery Textile Palette
                    </label>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {selectedTextile}
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    {product.textiles.map((textile) => {
                      const isSel = selectedTextile === textile.name;
                      return (
                        <button
                          key={textile.name}
                          onClick={() => setSelectedTextile(textile.name)}
                          className={`relative w-10 h-10 rounded-full transition-transform hover:scale-105 shadow-sm cursor-pointer ${
                            isSel
                              ? 'ring-2 ring-offset-2 ring-secondary'
                              : 'ring-1 ring-offset-2 ring-transparent'
                          }`}
                          style={{ backgroundColor: textile.color }}
                          title={textile.name}
                          type="button"
                        />
                      );
                    })}
                    <span className="font-body-sm text-[11px] text-secondary pl-2">
                      Swatches mailed to residence
                    </span>
                  </div>
                </div>
              )}

              {/* Config 3: Architectural Timber Pedestal Base */}
              {product.timberOptions && product.timberOptions.length > 0 && (
                <div className="space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-uppercase text-label-uppercase tracking-widest text-primary font-semibold">
                      Pedestal Joinery Timber
                    </span>
                    <span className="font-label-regular text-label-regular text-secondary">
                      {selectedTimber}
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    {product.timberOptions.map((timber) => {
                      const isSel = selectedTimber === timber.name;
                      return (
                        <button
                          key={timber.name}
                          onClick={() => setSelectedTimber(timber.name)}
                          className={`flex-1 py-2 px-space-sm rounded-lg bg-surface-container text-on-surface font-label-regular text-label-regular flex items-center gap-2 transition-all cursor-pointer ${
                            isSel ? 'ring-2 ring-primary font-medium' : ''
                          }`}
                          type="button"
                        >
                          <span
                            className="w-4 h-4 rounded-full shadow-sm shrink-0"
                            style={{ backgroundColor: timber.color }}
                          />
                          <span className="truncate">{timber.name.replace('Kiln-Dried ', '')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Config 3b: Finishes */}
              {product.finishes && product.finishes.length > 0 && (
                <div className="space-y-space-xs">
                  <div className="flex justify-between items-center">
                    <label className="font-label-uppercase text-label-uppercase text-primary tracking-wider">
                      Organic Plinth Finish
                    </label>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {selectedTimber}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-space-xs">
                    {product.finishes.map((f) => {
                      const isSel = selectedTimber === f.name;
                      return (
                        <button
                          key={f.name}
                          onClick={() => setSelectedTimber(f.name)}
                          className={`p-2.5 rounded-lg text-center text-body-sm font-label-regular transition-all cursor-pointer ${
                            isSel
                              ? 'bg-primary text-surface-bright shadow-sm font-semibold'
                              : 'bg-surface-container-high text-primary hover:bg-surface-container-highest'
                          }`}
                          type="button"
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Triggers */}
              <div className="pt-space-xs flex flex-col gap-space-xs">
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="w-full py-3.5 px-space-md rounded-lg bg-secondary hover:bg-secondary/90 text-on-secondary font-label-uppercase text-label-uppercase tracking-widest flex items-center justify-center gap-space-xs shadow-md transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  <span>
                    {bagAddedToast
                      ? '✓ Added to Atelier Commission Bag'
                      : 'Reserve in Atelier Commission Bag (40% Deposit)'}
                  </span>
                </button>

                <a
                  className="w-full py-3.5 px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-uppercase text-label-uppercase tracking-widest flex items-center justify-center gap-space-xs shadow-md transition-all group"
                  href={waOrderLink}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary-container">
                    chat
                  </span>
                  <span>Commission via WhatsApp Atelier (+234 800 ZEBDECOR)</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </a>

                <div className="grid grid-cols-2 gap-space-xs">
                  <button
                    className="py-3 px-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-uppercase text-label-uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    onClick={() => setConsultModalOpen(true)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      request_quote
                    </span>
                    <span>Architectural Quote</span>
                  </button>

                  <button
                    className="py-3 px-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-uppercase text-label-uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    onClick={() => setConsultModalOpen(true)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      home_pin
                    </span>
                    <span>In-Situ Maitama Scan</span>
                  </button>
                </div>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-space-xs flex items-center justify-between text-on-surface-variant font-label-regular text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">
                    verified
                  </span>
                  10-Yr Structural Warranty
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">
                    local_shipping
                  </span>
                  Free Abuja &amp; Lagos Logistics
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">
                    handyman
                  </span>
                  White-Glove Assembly
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Focus: Provenance & Craftsmanship Pillars */}
      <section className="w-full bg-surface-container-low py-space-xl px-gutter-mobile lg:px-margin">
        <div className="max-w-5xl mx-auto space-y-space-lg">
          <div className="text-center max-w-2xl mx-auto space-y-space-xs">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
              Architectural Provenance
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-normal">
              {isZuma
                ? "Sculpted After Zuma's Timeless Monolith"
                : 'Echoing the Timeless Contours of Aso Rock'}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {isZuma
                ? 'Conceived as an homage to the towering natural monument of Abuja. The table balances heavy geological balance with the tactile gentleness of kiln-treated Nigerian timber and soft Italian leather.'
                : 'Designed to reject rigid orthogonal layouts. The Aso series introduces gentle planetary movement to living spaces, framing human conversation in an organic amphitheater.'}
            </p>
          </div>

          {/* 3 Feature Pillars */}
          {product.pillarCards && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {product.pillarCards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm space-y-space-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[26px]">{card.icon}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-primary">{card.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {card.desc}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-secondary font-label-uppercase text-[11px] tracking-wider">
                    <span>{card.note}</span>
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Technical Blueprint & Spatial Dimensions Specification */}
      <section className="w-full py-space-xl px-gutter-mobile lg:px-margin bg-surface">
        <div className="max-w-6xl mx-auto space-y-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
            <div>
              <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block uppercase">
                Spatial Engineering
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary font-normal">
                Architectural Specifications &amp; Blueprints
              </h2>
            </div>
            <a
              className="inline-flex items-center gap-1.5 font-label-uppercase text-label-uppercase tracking-wider text-secondary hover:text-primary transition-colors"
              href={`https://wa.me/23480093233267?text=Hello%20Zebdecor%2C%20please%20send%20me%20the%20CAD/Revit%20files%20for%20${encodeURIComponent(
                product.name
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download CAD / Revit / 3DS Model</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            {/* Blueprint Vector Diagram */}
            <div className="lg:col-span-6 p-space-md rounded-xl bg-surface-container-high shadow-inner flex flex-col items-center justify-center relative min-h-[340px]">
              <div className="absolute top-space-sm left-space-sm font-label-uppercase text-[10px] text-on-surface-variant tracking-widest">
                Plan &amp; Elevation Projection (1:25 Metric)
              </div>

              {isZuma ? (
                /* Stylized Zuma Blueprint SVG */
                <svg
                  className="w-full max-w-md h-auto text-on-surface-variant"
                  fill="none"
                  viewBox="0 0 500 320"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    fill="#FAF8F5"
                    fillOpacity="0.6"
                    height="150"
                    rx="6"
                    stroke="currentColor"
                    strokeDasharray="4 2"
                    strokeWidth="1.5"
                    width="400"
                    x="50"
                    y="30"
                  />
                  <ellipse
                    cx="140"
                    cy="105"
                    rx="35"
                    ry="35"
                    stroke="currentColor"
                    strokeDasharray="2 2"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="360"
                    cy="105"
                    rx="35"
                    ry="35"
                    stroke="currentColor"
                    strokeDasharray="2 2"
                    strokeWidth="1.5"
                  />
                  <line stroke="currentColor" strokeWidth="1" x1="50" x2="450" y1="15" y2="15" />
                  <circle cx="50" cy="15" fill="currentColor" r="2.5" />
                  <circle cx="450" cy="15" fill="currentColor" r="2.5" />
                  <text
                    fill="currentColor"
                    fontFamily="Plus Jakarta Sans"
                    fontSize="11"
                    textAnchor="middle"
                    x="250"
                    y="10"
                  >
                    3,000 mm Length
                  </text>
                  <line stroke="currentColor" strokeWidth="1" x1="465" x2="465" y1="30" y2="180" />
                  <circle cx="465" cy="30" fill="currentColor" r="2.5" />
                  <circle cx="465" cy="180" fill="currentColor" r="2.5" />
                  <text
                    fill="currentColor"
                    fontFamily="Plus Jakarta Sans"
                    fontSize="11"
                    transform="rotate(90 475 110)"
                    x="475"
                    y="110"
                  >
                    1,200 mm Width
                  </text>
                  <line stroke="currentColor" strokeWidth="3" x1="50" x2="450" y1="210" y2="210" />
                  <rect
                    fill="#F5EFEB"
                    height="75"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    width="50"
                    x="115"
                    y="213"
                  />
                  <line stroke="currentColor" strokeWidth="0.7" x1="125" x2="125" y1="213" y2="288" />
                  <line stroke="currentColor" strokeWidth="0.7" x1="135" x2="135" y1="213" y2="288" />
                  <line stroke="currentColor" strokeWidth="0.7" x1="145" x2="145" y1="213" y2="288" />
                  <line stroke="currentColor" strokeWidth="0.7" x1="155" x2="155" y1="213" y2="288" />
                  <rect
                    fill="#F5EFEB"
                    height="75"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    width="50"
                    x="335"
                    y="213"
                  />
                  <line stroke="currentColor" strokeWidth="0.7" x1="345" x2="345" y1="213" y2="288" />
                  <line stroke="currentColor" strokeWidth="0.7" x1="355" x2="355" y1="213" y2="288" />
                  <line stroke="currentColor" strokeWidth="0.7" x1="365" x2="365" y1="213" y2="288" />
                  <line stroke="currentColor" strokeWidth="0.7" x1="375" x2="375" y1="213" y2="288" />
                  <line stroke="currentColor" strokeWidth="1.5" x1="30" x2="470" y1="288" y2="288" />
                  <line stroke="currentColor" strokeWidth="1" x1="35" x2="35" y1="210" y2="288" />
                  <circle cx="35" cy="210" fill="currentColor" r="2.5" />
                  <circle cx="35" cy="288" fill="currentColor" r="2.5" />
                  <text
                    fill="currentColor"
                    fontFamily="Plus Jakarta Sans"
                    fontSize="10"
                    textAnchor="end"
                    x="25"
                    y="254"
                  >
                    760 mm Height
                  </text>
                </svg>
              ) : (
                /* Stylized Aso Blueprint SVG */
                <svg
                  className="w-full h-auto text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 540 320"
                >
                  <path
                    d="M 20 20 H 520 M 20 80 H 520 M 20 140 H 520 M 20 200 H 520 M 20 260 H 520"
                    stroke="currentColor"
                    strokeDasharray="4 4"
                    strokeOpacity="0.06"
                  />
                  <path
                    d="M 60 20 V 300 M 160 20 V 300 M 260 20 V 300 M 360 20 V 300 M 460 20 V 300"
                    stroke="currentColor"
                    strokeDasharray="4 4"
                    strokeOpacity="0.06"
                  />
                  <path
                    d="M 80,120 C 130,50 380,50 440,110 C 470,140 450,180 400,195 C 330,215 190,200 110,185 C 70,175 60,145 80,120 Z"
                    fill="#FAF8F5"
                    fillOpacity="0.8"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 115,128 C 150,75 365,75 410,120 C 425,138 410,165 375,176 C 315,192 195,182 135,168 C 105,160 98,142 115,128 Z"
                    stroke="#775A19"
                    strokeDasharray="2 3"
                    strokeWidth="1.5"
                  />
                  <line stroke="#775A19" strokeWidth="1.2" x1="80" x2="450" y1="230" y2="230" />
                  <line stroke="#775A19" strokeWidth="1.2" x1="80" x2="80" y1="222" y2="238" />
                  <line stroke="#775A19" strokeWidth="1.2" x1="450" x2="450" y1="222" y2="238" />
                  <text
                    fill="#2C1810"
                    fontFamily="Plus Jakarta Sans"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                    x="265"
                    y="248"
                  >
                    2,800 mm (Standard Length)
                  </text>
                  <line stroke="#775A19" strokeWidth="1.2" x1="480" x2="480" y1="90" y2="200" />
                  <line stroke="#775A19" strokeWidth="1.2" x1="472" x2="488" y1="90" y2="90" />
                  <line stroke="#775A19" strokeWidth="1.2" x1="472" x2="488" y1="200" y2="200" />
                  <text
                    fill="#2C1810"
                    fontFamily="Plus Jakarta Sans"
                    fontSize="10"
                    textAnchor="start"
                    transform="rotate(90, 500, 150)"
                    x="500"
                    y="150"
                  >
                    1,150 mm Depth
                  </text>
                  <circle cx="260" cy="130" fill="#775A19" r="3" />
                  <line stroke="#775A19" strokeWidth="1" x1="260" x2="295" y1="130" y2="95" />
                  <text fill="#504440" fontFamily="Plus Jakarta Sans" fontSize="10" x="305" y="93">
                    R 1840mm Arc
                  </text>
                </svg>
              )}
              <span className="mt-space-sm font-label-regular text-body-sm text-on-surface-variant">
                Recommended Dining/Living Room Clearance: Min. 4.6m × 3.2m
              </span>
            </div>

            {/* Structured Specs Table */}
            <div className="lg:col-span-6 space-y-space-xs font-body-md">
              {product.specs.map((sp, idx) => (
                <div
                  key={sp.label}
                  className={`flex items-center justify-between py-3 px-space-sm rounded ${
                    idx % 2 === 0 ? 'bg-surface-container-low' : 'bg-surface-container'
                  }`}
                >
                  <span className="text-on-surface-variant">{sp.label}</span>
                  <span className="font-medium text-primary text-right">{sp.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Room-Fit Clearance Validator & Milestone BOM Estimator */}
      <RoomClearanceCalculator
        productId={product.id}
        productName={product.name}
        basePriceFormatted={product.price}
        rawDimensions={product.dimensions}
        selectedScaleDimension={selectedScale?.dimension}
        selectedScalePrice={currentPrice}
        selectedMaterialName={selectedSlab || selectedTextile}
        selectedTimberName={selectedTimber}
      />

      {/* Complete The Living Narrative: Curated Complementary Pieces */}
      {complementaryProducts.length > 0 && (
        <section className="w-full py-space-xl px-gutter-mobile lg:px-margin bg-surface-container-low">
          <div className="max-w-6xl mx-auto space-y-space-lg">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
              <div>
                <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block uppercase">
                  Curated Ensemble
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary font-normal">
                  Complete the Architectural Sanctuary
                </h2>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Harmonized in matching Calacatta Viola, Travertine and Benue Teak
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {complementaryProducts.map((comp) => (
                <div
                  key={comp.id}
                  className="group rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col border border-surface-container-highest/40"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container relative">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={comp.name}
                      src={comp.image}
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-surface/90 text-primary font-label-uppercase text-[10px] shadow-sm">
                      Companion Piece
                    </span>
                  </div>
                  <div className="p-space-md flex-1 flex flex-col justify-between space-y-space-xs">
                    <div>
                      <p className="font-label-uppercase text-label-uppercase text-secondary">
                        {comp.tag}
                      </p>
                      <h4 className="font-headline-sm text-headline-sm text-primary">
                        {comp.name}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 line-clamp-2">
                        {comp.subtitle}
                      </p>
                    </div>
                    <div className="pt-space-sm flex items-center justify-between">
                      <span className="font-label-regular text-body-md font-semibold text-primary">
                        {comp.price}
                      </span>
                      <Link
                        className="font-label-uppercase text-label-uppercase text-secondary hover:text-primary transition-colors flex items-center gap-1"
                        href={`/products/${comp.id}`}
                      >
                        <span>Explore</span>
                        <span className="material-symbols-outlined text-[14px]">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Architectural Bottom Action Bar */}
      <div className="fixed bottom-0 z-40 w-full bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 py-3 px-gutter-mobile lg:px-margin shadow-[0_-4px_24px_rgba(44,24,16,0.08)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-space-sm">
          {/* Miniature Suite Identity */}
          <div className="flex items-center gap-space-sm min-w-0">
            <img
              alt={product.name}
              className="w-12 h-12 object-cover rounded shadow-sm hidden sm:block shrink-0"
              src={product.image}
            />
            <div className="min-w-0">
              <p className="font-headline-sm text-[15px] sm:text-headline-sm text-primary truncate leading-tight">
                {product.name}
              </p>
              <p className="font-label-regular text-[11px] sm:text-label-regular text-secondary truncate">
                {product.materialsNote} • <span>{currentPrice}</span>
              </p>
            </div>
          </div>

          {/* Sticky Quick Actions */}
          <div className="flex items-center gap-space-xs shrink-0">
            <button
              className="px-space-sm py-2.5 rounded-lg bg-surface-container-high hover:bg-secondary-container hover:text-on-secondary-container text-on-surface font-label-uppercase text-[11px] tracking-wider hidden md:flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              onClick={() => setArModalOpen(true)}
              type="button"
            >
              <span className="material-symbols-outlined text-[17px] text-secondary">
                view_in_ar
              </span>
              <span>Room AR</span>
            </button>
            <button
              className="px-space-sm py-2.5 rounded-lg bg-secondary hover:bg-secondary/90 text-on-secondary font-label-uppercase text-[11px] tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              onClick={handleAddToBag}
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">shopping_bag</span>
              <span>{bagAddedToast ? '✓ Reserved' : 'Reserve 40%'}</span>
            </button>
            <a
              className="px-space-md py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-uppercase text-label-uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
              href={waOrderLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary-container">
                chat
              </span>
              <span>Atelier WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ARModal
        isOpen={arModalOpen}
        onClose={() => setArModalOpen(false)}
        itemTitle={product.name}
        productId={product.id}
        selectedScale={
          scaleMultiplierFor3D < 0.9 ? '240' : scaleMultiplierFor3D > 1.1 ? '340' : '280'
        }
        selectedSwatch={mappedSwatchFor3D}
      />

      <SpatialConsultationModal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
        productTitle={product.name}
      />
    </div>
  );
}
