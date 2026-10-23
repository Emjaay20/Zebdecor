'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="w-full px-gutter-mobile lg:px-margin py-space-xl bg-surface">
      {/* Hero Header */}
      <div className="max-w-4xl mb-space-lg space-y-2">
        <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
          The Abuja Atelier Story
        </span>
        <h1 className="font-display-hero text-display-hero-mobile lg:text-headline-xl text-primary font-normal">
          Architectural Interiors &amp; Bespoke Nigerian Joinery
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          Conceived in Abuja to serve Nigeria’s most discerning private residences and executive penthouses. Zebdecor unites centuries-old woodturning craft with computerized spatial engineering and precious global materials.
        </p>
      </div>

      {/* Two Flagship Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg mb-space-xl">
        {/* Location 1: Maitama */}
        <div className="p-space-lg rounded-2xl bg-surface-container-low border border-surface-container-high/60 space-y-space-sm shadow-sm flex flex-col justify-between">
          <div className="space-y-space-xs">
            <div className="flex items-center gap-2 text-secondary font-label-uppercase text-label-uppercase">
              <span className="material-symbols-outlined text-[20px]">storefront</span>
              <span>Flagship Atelier &amp; Studio</span>
            </div>
            <h2 className="font-headline-lg text-primary">Maitama Flagship Atelier</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Situated in the diplomatic heart of Maitama. An intimate spatial gallery where clients and interior specifiers can touch cured timber slabs, review full-scale living mockups, and experience augmented reality previews before commissioning.
            </p>
            <div className="pt-2 space-y-1 font-body-sm text-on-surface">
              <p className="font-medium text-primary">Address:</p>
              <p className="text-on-surface-variant">Plot 1128, Aguiyi Ironsi Street, Maitama, Abuja, Nigeria</p>
              <p className="font-medium text-primary pt-2">Hours:</p>
              <p className="text-on-surface-variant">Monday – Saturday: 09:00 – 18:00 (Private Sessions by Appointment)</p>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <Link
              href="/consultation"
              className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-uppercase text-label-uppercase tracking-wider hover:bg-secondary transition-all"
            >
              Book Studio Visit
            </Link>
            <a
              href="https://wa.me/23480093233267"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-surface-container-high text-primary font-label-uppercase text-label-uppercase tracking-wider hover:bg-surface-container-highest transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Location 2: Guzape */}
        <div className="p-space-lg rounded-2xl bg-surface-container-low border border-surface-container-high/60 space-y-space-sm shadow-sm flex flex-col justify-between">
          <div className="space-y-space-xs">
            <div className="flex items-center gap-2 text-secondary font-label-uppercase text-label-uppercase">
              <span className="material-symbols-outlined text-[20px]">carpenter</span>
              <span>Production &amp; Solar Kilns</span>
            </div>
            <h2 className="font-headline-lg text-primary">Guzape Workshop &amp; Studio</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Perched in the hills of Guzape, our primary manufacturing atelier houses 60-day solar kilns, multi-axis joinery saws, and master woodturners, leather tailors, and stone finishers.
            </p>
            <div className="pt-2 space-y-1 font-body-sm text-on-surface">
              <p className="font-medium text-primary">Address:</p>
              <p className="text-on-surface-variant">Diplomatic Zone Road, Guzape Hills, Abuja, Nigeria</p>
              <p className="font-medium text-primary pt-2">Facility Scope:</p>
              <p className="text-on-surface-variant">Kiln Drying, Hardwood Joinery, Saddle Stitching, Metal Casting</p>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <Link
              href="/materials"
              className="px-5 py-2.5 rounded-lg bg-surface-container-high hover:bg-secondary hover:text-on-secondary text-primary font-label-uppercase text-label-uppercase tracking-wider transition-all"
            >
              Explore Materials
            </Link>
            <a
              href="tel:+23492908400"
              className="px-5 py-2.5 rounded-lg bg-surface-container-high text-primary font-label-uppercase text-label-uppercase tracking-wider hover:bg-surface-container-highest transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">phone</span>
              <span>+234 9 290 8400</span>
            </a>
          </div>
        </div>
      </div>

      {/* Craftsmanship Philosophy */}
      <div className="p-space-lg rounded-2xl bg-primary text-surface shadow-2xl relative overflow-hidden space-y-space-md">
        <div className="max-w-3xl space-y-2">
          <span className="font-label-uppercase text-label-uppercase text-secondary-fixed tracking-widest uppercase">
            Artisanal Philosophy
          </span>
          <h2 className="font-headline-xl text-surface">The Discipline of Millimetric Precision</h2>
          <p className="font-body-md text-surface-container-high leading-relaxed">
            Every dining slab, curved bouclé silhouette, and architectural credenza is fabricated with millimetric tolerance. We believe luxury in Nigeria should not mean importing standard catalogue items that swell or deform in our climate. By combining indigenous African hardwoods with specialized solar-kiln seasoning and Italian joinery hardware, we craft heirloom pieces built to endure for generations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-surface-container-highest/20">
          <div>
            <span className="block font-headline-md text-secondary-fixed">100%</span>
            <span className="font-label-uppercase text-xs text-surface-container-high">Abuja Handcrafted</span>
          </div>
          <div>
            <span className="block font-headline-md text-secondary-fixed">60 Days</span>
            <span className="font-label-uppercase text-xs text-surface-container-high">Solar Kiln Seasoning</span>
          </div>
          <div>
            <span className="block font-headline-md text-secondary-fixed">10-Year</span>
            <span className="font-label-uppercase text-xs text-surface-container-high">Joinery Guarantee</span>
          </div>
          <div>
            <span className="block font-headline-md text-secondary-fixed">1:1 Scale</span>
            <span className="font-label-uppercase text-xs text-surface-container-high">Web AR Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
}
