'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ARModal from '@/components/ARModal';
import { products, categories, projects, materials, testimonials } from '@/data/sample';

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('All Pieces');
  const [arModalOpen, setArModalOpen] = useState(false);
  const [arModalTitle, setArModalTitle] = useState('The Aso Minimalist Curved Sofa');
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');

  const filterTabs = ['All Pieces', 'Seating', 'Tables & Consoles', 'Storage'];

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'All Pieces') return true;
    if (activeFilter === 'Seating') return p.category === 'living';
    if (activeFilter === 'Tables & Consoles') return p.category === 'dining' || p.category === 'tables';
    if (activeFilter === 'Storage') return p.category === 'storage';
    return true;
  });

  const handleOpenAR = (title: string) => {
    setArModalTitle(title);
    setArModalOpen(true);
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative w-full -mt-20 overflow-hidden bg-primary-container text-on-primary">
        {/* Hero Background with Warm Scrim Overlay */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAr4IGvktAMQ4w7mxV77d4wQnIb8vQ3xFjBr0LDvweAWI4FlN7M2ng2iDYB-0f5UTsjRorgvWJ1fY3-D2PNkE9vlZ5A3HqTRT8qKmdmoBCgyI490l7MGUydxDFTlzW9b8qrGE1ZzsiwZRVDH4dsMA7OCpYz_EKL4ArfyDAIbPbaW7qplHcUhCdg9T1ZpcHhKiIGBtU3b7a_gLME-TgUibFPRP5HwQMrCXyRkV5vFYTJdWXjIiB3LyUh')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary-container/60 to-primary/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-container/85 via-primary-container/40 to-transparent" />

        <div className="relative z-10 w-full px-gutter-mobile lg:px-margin pt-36 pb-20 lg:pt-48 lg:pb-32 flex flex-col justify-end min-h-[92vh]">
          <div className="max-w-4xl space-y-space-md">
            {/* Atelier Tag */}
            <div className="inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-secondary-container/20 backdrop-blur-md border border-secondary/30">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
              <span className="font-label-uppercase text-label-uppercase text-secondary-fixed tracking-widest uppercase">
                Maitama Flagship Atelier • Abuja
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display-hero text-display-hero-mobile lg:text-display-hero text-surface tracking-tight leading-tight max-w-3xl">
              Transform Your Space with <span className="italic font-light text-secondary-fixed">Custom</span> Craftsmanship
            </h1>

            {/* Subtitle */}
            <p className="font-body-xl text-body-lg lg:text-body-xl text-surface-container-high max-w-2xl font-light leading-relaxed">
              Handcrafted architectural furniture and bespoke interior masterworks tailored for discerning residences across Maitama, Asokoro, and beyond.
            </p>

            {/* CTA Cluster */}
            <div className="pt-space-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
              <a
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-surface text-primary font-label-uppercase text-label-uppercase tracking-widest shadow-xl hover:bg-surface-container-high transition-all group"
                href="#collections"
              >
                <span>View Collections</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </a>

              <a
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-secondary text-on-secondary font-label-uppercase text-label-uppercase tracking-widest shadow-lg hover:bg-secondary/90 transition-all"
                href="https://wa.me/23480093233267"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Direct Concierge (+234 800 ZEBDECOR)</span>
              </a>
            </div>
          </div>

          {/* Trust Indicators Strip */}
          <div className="mt-space-xl pt-space-md border-t border-surface-container-highest/20 grid grid-cols-2 md:grid-cols-4 gap-space-sm">
            <div className="flex items-center gap-3 text-surface-container-high">
              <span className="material-symbols-outlined text-secondary-fixed text-[22px]">handyman</span>
              <span className="font-label-regular text-label-regular tracking-wide">Bespoke Abuja Atelier</span>
            </div>
            <div className="flex items-center gap-3 text-surface-container-high">
              <span className="material-symbols-outlined text-secondary-fixed text-[22px]">forest</span>
              <span className="font-label-regular text-label-regular tracking-wide">Certified Hardwood Timber</span>
            </div>
            <div className="flex items-center gap-3 text-surface-container-high">
              <span className="material-symbols-outlined text-secondary-fixed text-[22px]">texture</span>
              <span className="font-label-regular text-label-regular tracking-wide">Hand-Finished Italian Leathers</span>
            </div>
            <Link
              href="/ar"
              className="flex items-center gap-3 text-surface-container-high hover:text-secondary-fixed transition-colors"
            >
              <span className="material-symbols-outlined text-secondary-fixed text-[22px]">view_in_ar</span>
              <span className="font-label-regular text-label-regular tracking-wide">AR Space Scale Planning</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY CARDS SECTION */}
      <section className="w-full px-gutter-mobile lg:px-margin py-space-xl bg-surface" id="collections">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg">
          <div className="space-y-2">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
              Architectural Disciplines
            </span>
            <h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-primary font-normal">
              Curated Living Collections
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-4 md:mt-0 leading-relaxed">
            Engineered for modern spatial harmony and timeless warmth. Each typology is measured, surfaced, and joined within our Abuja workshop.
          </p>
        </div>

        {/* 6-Grid Category Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className="group relative rounded-xl overflow-hidden bg-surface-container-low shadow-[0_12px_32px_-4px_rgba(44,24,16,0.04)] hover:shadow-[0_24px_48px_-8px_rgba(44,24,16,0.08)] transition-all duration-500 block"
            >
              <div className="h-80 w-full overflow-hidden relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={cat.title}
                  src={cat.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md font-label-uppercase text-label-uppercase text-primary tracking-widest shadow-sm">
                  {cat.countBadge}
                </span>
              </div>
              <div className="p-space-md space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-md text-headline-md text-primary group-hover:text-secondary transition-colors">
                    {cat.title}
                  </h3>
                  <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                    north_east
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED CUSTOM FURNITURE (WITH AR VIEWER & DIRECT WHATSAPP) */}
      <section className="w-full px-gutter-mobile lg:px-margin py-space-xl bg-surface-container-low">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-md">
          <div className="space-y-2">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
              Atelier Masterpieces
            </span>
            <h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-primary font-normal">
              Signature Tailored Creations
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {filterTabs.map((tab) => {
              const active = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-2 rounded-full font-label-uppercase text-label-uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md pt-4">
          {filteredProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} onOpenAR={handleOpenAR} />
          ))}
        </div>
      </section>

      {/* RECENT PROJECTS SHOWCASE (ARCHITECTURAL MONOGRAPHS) */}
      <section className="w-full px-gutter-mobile lg:px-margin py-space-xl bg-surface">
        <div className="max-w-3xl mb-space-lg">
          <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
            Case Studies
          </span>
          <h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-primary font-normal mt-1">
            Completed Masterworks in Abuja &amp; Environs
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            A glimpse into recent turnkey interior architecture transformations, where custom joinery and bespoke furnishings coalesce into serene spatial poetry.
          </p>
        </div>

        <div className="space-y-space-xl">
          {/* Project 1: Villa Bella, Maitama */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            <div className="lg:col-span-7 relative rounded-xl overflow-hidden shadow-2xl group">
              <img
                className="w-full h-[480px] object-cover group-hover:scale-102 transition-transform duration-700"
                alt="Villa Bella Penthouse in Maitama"
                src={projects[0].image}
              />
              <div className="absolute bottom-4 left-4 px-4 py-2 bg-surface/90 backdrop-blur-md rounded-lg font-label-uppercase text-label-uppercase text-primary shadow-sm">
                Scope: {projects[0].scope}
              </div>
            </div>
            <div className="lg:col-span-5 space-y-space-sm pl-0 lg:pl-space-sm">
              <div className="flex items-center gap-2 text-secondary font-label-uppercase text-label-uppercase">
                <span className="material-symbols-outlined text-[18px]">apartment</span>
                <span>{projects[0].location}</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary">
                {projects[0].title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {projects[0].description}
              </p>
              <div className="p-space-sm rounded-lg bg-surface-container-low space-y-2 border-l-2 border-secondary">
                <p className="font-label-regular text-label-regular text-primary font-semibold">
                  {projects[0].quoteTitle}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                  {projects[0].quoteText}
                </p>
              </div>
              <div className="flex items-center gap-space-md pt-2">
                {projects[0].stats.map((st, i) => (
                  <React.Fragment key={st.label}>
                    {i > 0 && <div className="w-px h-8 bg-surface-container-highest" />}
                    <div>
                      <span className="block font-headline-sm text-headline-sm text-primary">
                        {st.value}
                      </span>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                        {st.label}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Project 2: The Ridge Residence, Asokoro */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 space-y-space-sm pr-0 lg:pr-space-sm">
              <div className="flex items-center gap-2 text-secondary font-label-uppercase text-label-uppercase">
                <span className="material-symbols-outlined text-[18px]">villa</span>
                <span>{projects[1].location}</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary">
                {projects[1].title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {projects[1].description}
              </p>
              <div className="p-space-sm rounded-lg bg-surface-container-low space-y-2 border-l-2 border-secondary">
                <p className="font-label-regular text-label-regular text-primary font-semibold">
                  {projects[1].quoteTitle}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                  {projects[1].quoteText}
                </p>
              </div>
              <div className="flex items-center gap-space-md pt-2">
                {projects[1].stats.map((st, i) => (
                  <React.Fragment key={st.label}>
                    {i > 0 && <div className="w-px h-8 bg-surface-container-highest" />}
                    <div>
                      <span className="block font-headline-sm text-headline-sm text-primary">
                        {st.value}
                      </span>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                        {st.label}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 relative rounded-xl overflow-hidden shadow-2xl group">
              <img
                className="w-full h-[480px] object-cover group-hover:scale-102 transition-transform duration-700"
                alt="The Ridge Sanctuary in Asokoro"
                src={projects[1].image}
              />
              <div className="absolute bottom-4 right-4 px-4 py-2 bg-surface/90 backdrop-blur-md rounded-lg font-label-uppercase text-label-uppercase text-primary shadow-sm">
                Scope: {projects[1].scope}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUSTAINABLE & PRECIOUS MATERIALS */}
      <section className="w-full px-gutter-mobile lg:px-margin py-space-xl bg-surface-container-high/40">
        <div className="max-w-2xl text-center mx-auto mb-space-lg space-y-2">
          <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
            Tactile Authenticity
          </span>
          <h2 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-primary font-normal">
            Precious, Sustainably Sourced Mediums
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Every commission begins with the raw elements. We responsibly harvest African hardwoods and pair them with the finest global stones and textiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="bg-surface rounded-xl p-space-md space-y-space-sm shadow-[0_12px_32px_-4px_rgba(44,24,16,0.04)] border border-surface-container-highest/30"
            >
              <div className="h-44 w-full rounded-lg overflow-hidden relative">
                <img
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  alt={mat.name}
                  src={mat.image}
                />
                <span className="absolute top-2 left-2 px-2.5 py-1 bg-surface/90 rounded text-[10px] font-label-uppercase text-secondary tracking-widest uppercase shadow-sm">
                  {mat.badge}
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="font-headline-sm text-headline-sm text-primary">
                  {mat.name}
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {mat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP CONSULTATION & CLIENT TESTIMONIALS */}
      <section className="w-full px-gutter-mobile lg:px-margin py-space-xl bg-surface">
        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-xl">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-space-md rounded-xl bg-surface-container-low border border-surface-container-high/50 space-y-4 shadow-sm"
            >
              <div className="flex text-secondary gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]">
                    star
                  </span>
                ))}
              </div>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <h5 className="font-headline-sm text-headline-sm text-primary">
                  {t.author}
                </h5>
                <span className="font-label-uppercase text-label-uppercase text-on-surface-variant">
                  {t.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* VIP Atelier Booking Banner */}
        <div className="w-full rounded-2xl bg-primary text-on-primary p-space-md lg:p-space-lg relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-secondary/20 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-space-sm">
            <span className="font-label-uppercase text-label-uppercase text-secondary-fixed tracking-widest uppercase">
              Private Consultation
            </span>
            <h3 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-surface">
              Schedule a Private Atelier Visit or Laser Spatial Scan
            </h3>
            <p className="font-body-md text-body-md text-surface-container-high max-w-xl font-light leading-relaxed">
              Visit our Maitama studio to touch raw timber slabs, explore live 3D joinery mockups, or request an architectural surveyor with laser spatial scanning tools directly at your residence.
            </p>

            {consultationSubmitted ? (
              <div className="pt-4 p-4 rounded-xl bg-secondary-container/20 border border-secondary/30 text-surface">
                <p className="font-headline-sm text-secondary-fixed mb-1">
                  Thank you, {consultName || 'esteemed client'}!
                </p>
                <p className="font-body-sm text-surface-container-high">
                  A senior interior concierge from our Maitama Atelier will contact you via WhatsApp ({consultPhone || '+234'}) within 2 business hours.
                </p>
              </div>
            ) : (
              <form
                className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3"
                onSubmit={handleConsultationSubmit}
              >
                <input
                  className="px-4 py-3 rounded-lg bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Your Name"
                  required
                  type="text"
                  value={consultName}
                  onChange={(e) => setConsultName(e.target.value)}
                />
                <input
                  className="px-4 py-3 rounded-lg bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Phone Number (e.g. +234)"
                  required
                  type="tel"
                  value={consultPhone}
                  onChange={(e) => setConsultPhone(e.target.value)}
                />
                <button
                  className="px-6 py-3 rounded-lg bg-secondary text-on-secondary font-label-uppercase text-label-uppercase tracking-wider hover:bg-secondary/90 transition-all shadow-md cursor-pointer"
                  type="submit"
                >
                  Request Private Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* AR Modal */}
      <ARModal
        isOpen={arModalOpen}
        onClose={() => setArModalOpen(false)}
        itemTitle={arModalTitle}
      />
    </div>
  );
}
