'use client';

import React, { useState } from 'react';
import { materials } from '@/data/sample';

export default function MaterialsPage() {
  const [swatchBoxSubmitted, setSwatchBoxSubmitted] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const handleSwatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSwatchBoxSubmitted(true);
  };

  return (
    <div className="w-full px-gutter-mobile lg:px-margin py-space-xl bg-surface">
      {/* Header */}
      <div className="max-w-3xl mb-space-lg space-y-2">
        <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
          Tactile Authenticity
        </span>
        <h1 className="font-display-hero text-display-hero-mobile lg:text-headline-xl text-primary font-normal">
          Precious, Sustainably Sourced Mediums
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          Every Zebdecor commission begins with raw elemental purity. We responsibly harvest certified African hardwoods, cure them in our climate-regulated Abuja kilns, and pair them with the finest global quarry stones and European looms.
        </p>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
        {materials.map((mat) => (
          <div
            key={mat.id}
            className="bg-surface rounded-xl p-space-md space-y-space-sm shadow-[0_12px_32px_-4px_rgba(44,24,16,0.04)] border border-surface-container-highest/40 flex flex-col justify-between"
          >
            <div className="space-y-space-sm">
              <div className="h-52 w-full rounded-lg overflow-hidden relative group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={mat.name}
                  src={mat.image}
                />
                <span className="absolute top-2 left-2 px-2.5 py-1 bg-surface/90 rounded text-[10px] font-label-uppercase text-secondary tracking-widest uppercase shadow-sm">
                  {mat.badge}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-headline-sm text-headline-sm text-primary">{mat.name}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {mat.description}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-surface-container-high/60 flex items-center justify-between text-xs text-secondary font-label-regular">
              <span>Maitama Studio Archive</span>
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </div>
          </div>
        ))}
      </div>

      {/* Material Science & Kiln Stability Deep-Dive */}
      <section className="p-space-lg rounded-2xl bg-surface-container-low mb-space-xl border border-surface-container-high/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          <div className="lg:col-span-7 space-y-space-sm">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
              Tropical Climate Resilience
            </span>
            <h2 className="font-headline-lg text-primary">
              The 60-Day Solar-Kiln Equilibrium Protocol
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Standard imported luxury furniture frequently succumbs to atmospheric warping, joint cracking, or wood-movement in West Africa’s fluctuating tropical humidity. At Zebdecor, every timber plank undergoes a rigorous 60-to-180-day kiln curing process at our Guzape facility, bringing moisture content down to an impervious 8%–10% tropical equilibrium.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-surface rounded-lg">
                <span className="block font-headline-sm text-primary font-semibold">8% - 10%</span>
                <span className="font-label-uppercase text-[11px] text-on-surface-variant">
                  Moisture Content
                </span>
              </div>
              <div className="p-3 bg-surface rounded-lg">
                <span className="block font-headline-sm text-primary font-semibold">Zero VOC</span>
                <span className="font-label-uppercase text-[11px] text-on-surface-variant">
                  Micro-Crystalline Wax
                </span>
              </div>
              <div className="p-3 bg-surface rounded-lg">
                <span className="block font-headline-sm text-primary font-semibold">10 Years</span>
                <span className="font-label-uppercase text-[11px] text-on-surface-variant">
                  Structural Guarantee
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface rounded-xl p-space-md shadow-md border border-surface-container-high/60 space-y-space-sm">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
              Request Samples
            </span>
            <h3 className="font-headline-md text-primary">Order Atelier Fabric &amp; Stone Box</h3>
            <p className="font-body-sm text-on-surface-variant">
              Receive a curated box with authentic timber blocks, honed Calacatta marble chips, and French bouclé swatches couriered to your residence.
            </p>

            {swatchBoxSubmitted ? (
              <div className="p-4 rounded-lg bg-secondary-container/40 text-on-secondary-container text-sm space-y-1">
                <p className="font-semibold">Thank you, {clientName}!</p>
                <p>Your sample box will be dispatched to {clientAddress} within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSwatchSubmit} className="space-y-3">
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full px-3 py-2 rounded bg-surface-container text-body-sm border border-surface-container-highest/60 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
                <input
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Phone / WhatsApp"
                  required
                  type="tel"
                  className="w-full px-3 py-2 rounded bg-surface-container text-body-sm border border-surface-container-highest/60 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
                <input
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Delivery Address (Maitama, Asokoro, Lagos...)"
                  required
                  className="w-full px-3 py-2 rounded bg-surface-container text-body-sm border border-surface-container-highest/60 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-primary text-on-primary font-label-uppercase text-label-uppercase tracking-wider hover:bg-secondary transition-all"
                >
                  Dispatch Swatch Archive Box
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
