'use client';

import React from 'react';
import Link from 'next/link';
import { projects } from '@/data/sample';

export default function ProjectsPage() {
  return (
    <div className="w-full px-gutter-mobile lg:px-margin py-space-xl bg-surface">
      {/* Header */}
      <div className="max-w-3xl mb-space-lg space-y-2">
        <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
          Architectural Monographs
        </span>
        <h1 className="font-display-hero text-display-hero-mobile lg:text-headline-xl text-primary font-normal">
          Completed Masterworks &amp; Turnkey Estates
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          A monograph of turnkey interior architecture transformations across Maitama, Asokoro, Guzape, and Lagos Island, where custom joinery and bespoke furnishings coalesce into serene spatial poetry.
        </p>
      </div>

      {/* Projects Showcase */}
      <div className="space-y-space-xl">
        {projects.map((proj, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={proj.slug}
              className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center border-b border-surface-container-high/60 pb-space-xl last:border-b-0"
            >
              {/* Image Frame */}
              <div
                className={`lg:col-span-7 relative rounded-xl overflow-hidden shadow-2xl group ${
                  isEven ? 'order-1' : 'order-1 lg:order-2'
                }`}
              >
                <img
                  className="w-full h-[480px] object-cover group-hover:scale-102 transition-transform duration-700"
                  alt={proj.title}
                  src={proj.image}
                />
                <div
                  className={`absolute bottom-4 ${
                    isEven ? 'left-4' : 'right-4'
                  } px-4 py-2 bg-surface/90 backdrop-blur-md rounded-lg font-label-uppercase text-label-uppercase text-primary shadow-sm`}
                >
                  Scope: {proj.scope}
                </div>
              </div>

              {/* Text Meta */}
              <div
                className={`lg:col-span-5 space-y-space-sm ${
                  isEven ? 'pl-0 lg:pl-space-sm order-2' : 'pr-0 lg:pr-space-sm order-2 lg:order-1'
                }`}
              >
                <div className="flex items-center gap-2 text-secondary font-label-uppercase text-label-uppercase">
                  <span className="material-symbols-outlined text-[18px]">apartment</span>
                  <span>{proj.location}</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary">
                  {proj.title}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {proj.description}
                </p>

                <div className="p-space-sm rounded-lg bg-surface-container-low space-y-2 border-l-2 border-secondary">
                  <p className="font-label-regular text-label-regular text-primary font-semibold">
                    {proj.quoteTitle}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                    {proj.quoteText}
                  </p>
                </div>

                <div className="flex items-center gap-space-md pt-2">
                  {proj.stats.map((st, sidx) => (
                    <React.Fragment key={st.label}>
                      {sidx > 0 && <div className="w-px h-8 bg-surface-container-highest" />}
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

                <div className="pt-2">
                  <a
                    href={`https://wa.me/23480093233267?text=${encodeURIComponent(
                      `Hello Zebdecor Team, I am interested in turnkey spatial architecture similar to ${proj.title}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-on-primary font-label-uppercase text-label-uppercase tracking-wider hover:bg-secondary transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Inquire About Turnkey Architecture</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Private Turnkey Consultation CTA */}
      <div className="mt-space-xl p-space-lg rounded-2xl bg-surface-container-low border border-surface-container-high/60 flex flex-col md:flex-row items-center justify-between gap-space-md">
        <div className="space-y-2 max-w-xl">
          <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
            Private Commissions
          </span>
          <h3 className="font-headline-lg text-primary">Planning a Private Residence in Abuja?</h3>
          <p className="font-body-md text-on-surface-variant">
            Our principal architects and joinery engineers partner directly with private clients and architectural studios from conceptual BIM layout to final on-site installation.
          </p>
        </div>
        <Link
          href="/consultation"
          className="px-8 py-4 rounded-lg bg-secondary text-on-secondary font-label-uppercase text-label-uppercase tracking-widest hover:bg-secondary/90 transition-all shrink-0"
        >
          Book Spatial Scan
        </Link>
      </div>
    </div>
  );
}
