'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ConsultationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    neighborhood: 'Maitama, Abuja',
    type: 'In-Situ Villa Laser Spatial Scan',
    scope: 'Living Sanctuary & Bespoke Millwork',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full px-gutter-mobile lg:px-margin py-space-xl bg-surface">
      <div className="max-w-4xl mx-auto space-y-space-lg">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
            Private Consultation
          </span>
          <h1 className="font-display-hero text-display-hero-mobile lg:text-headline-xl text-primary font-normal">
            Schedule a Private Atelier Visit or Laser Spatial Scan
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Visit our Maitama studio to touch raw timber slabs and explore live 3D joinery mockups, or request an architectural surveyor with laser spatial scanning tools directly at your residence.
          </p>
        </div>

        {submitted ? (
          <div className="p-space-xl rounded-2xl bg-surface-container-low border border-secondary/40 text-center space-y-space-sm shadow-xl max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-secondary-container text-secondary mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[44px]">verified</span>
            </div>
            <h2 className="font-headline-lg text-primary">Consultation Scheduled</h2>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-primary">{formData.name}</span>. A senior interior architect will connect with you via WhatsApp ({formData.phone}) within 2 business hours to finalize arrival details.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/collections"
                className="px-6 py-3 rounded-lg bg-surface-container-high text-primary font-label-uppercase text-label-uppercase"
              >
                Browse Collections
              </Link>
              <Link
                href="/ar"
                className="px-6 py-3 rounded-lg bg-primary text-on-primary font-label-uppercase text-label-uppercase flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                <span>Open Spatial AR Studio</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Left: What to Expect */}
            <div className="lg:col-span-5 space-y-space-md">
              <div className="p-space-md rounded-xl bg-surface-container-low space-y-space-sm border border-surface-container-high/60">
                <h3 className="font-headline-sm text-primary">What to Expect</h3>
                <ul className="space-y-3 font-body-sm text-on-surface-variant">
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                      view_in_ar
                    </span>
                    <span>
                      <strong className="text-primary font-medium">Digital LiDAR Scan:</strong> Precise millimetric measurements of ceilings, doors, and clearance paths.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                      texture
                    </span>
                    <span>
                      <strong className="text-primary font-medium">Physical Material Kit:</strong> In-situ swatch review with Italian leathers, French bouclés, and Calacatta marble.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                      draw
                    </span>
                    <span>
                      <strong className="text-primary font-medium">Bespoke 3D CAD Mockup:</strong> Tailored floor plans scaled directly for your villa or penthouse layout.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-space-md rounded-xl bg-primary text-surface space-y-2 shadow-lg">
                <span className="font-label-uppercase text-label-uppercase text-secondary-fixed tracking-widest uppercase">
                  Immediate Concierge
                </span>
                <p className="font-headline-sm text-surface">Prefer a Direct Conversation?</p>
                <p className="font-body-sm text-surface-container-high">
                  Reach our Maitama studio concierge directly on WhatsApp or telephone.
                </p>
                <div className="pt-2 flex flex-col gap-2 font-label-uppercase text-label-uppercase text-xs">
                  <a
                    href="https://wa.me/23480093233267"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-2.5 px-3 rounded bg-secondary text-on-secondary"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>WhatsApp Concierge (+234 800 ZEBDECOR)</span>
                  </a>
                  <a
                    href="tel:+23492908400"
                    className="flex items-center gap-2 py-2.5 px-3 rounded bg-white/10 text-surface hover:bg-white/20"
                  >
                    <span className="material-symbols-outlined text-[16px]">phone</span>
                    <span>Call +234 9 290 8400</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Booking Form */}
            <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-space-lg shadow-md border border-surface-container-high/60">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-label-uppercase text-[11px] text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Your Full Name &amp; Title
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Arch. / Dr. / Alhaji / Chief..."
                    required
                    className="w-full px-4 py-3 rounded-lg bg-surface text-body-md text-on-surface border border-surface-container-highest/60 focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-label-uppercase text-[11px] text-on-surface-variant uppercase tracking-wider mb-1.5">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234..."
                      required
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg bg-surface text-body-md text-on-surface border border-surface-container-highest/60 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block font-label-uppercase text-[11px] text-on-surface-variant uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="client@domain.ng"
                      required
                      type="email"
                      className="w-full px-4 py-3 rounded-lg bg-surface text-body-md text-on-surface border border-surface-container-highest/60 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-label-uppercase text-[11px] text-on-surface-variant uppercase tracking-wider mb-1.5">
                      Residence / Neighborhood
                    </label>
                    <input
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      placeholder="Maitama, Asokoro, Guzape..."
                      required
                      className="w-full px-4 py-3 rounded-lg bg-surface text-body-md text-on-surface border border-surface-container-highest/60 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block font-label-uppercase text-[11px] text-on-surface-variant uppercase tracking-wider mb-1.5">
                      Consultation Format
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-surface text-body-md text-on-surface border border-surface-container-highest/60 focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option>In-Situ Villa Laser Spatial Scan</option>
                      <option>Private Maitama Atelier Visit</option>
                      <option>Guzape Workshop Joinery Tour</option>
                      <option>Virtual Video Architecture Review</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-label-uppercase text-[11px] text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Spatial Scope
                  </label>
                  <select
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-surface text-body-md text-on-surface border border-surface-container-highest/60 focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option>Living Sanctuary &amp; Bespoke Millwork</option>
                    <option>Dining Sanctuary &amp; Monolithic Table</option>
                    <option>Full Penthouse / Villa Turnkey Fit-Out</option>
                    <option>Master Suite &amp; Dressing Room</option>
                    <option>Executive Study &amp; Acoustic Panelling</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-uppercase text-[11px] text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Special Design Requirements (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us about your room dimensions, architectural preferences, or target move-in timeline..."
                    className="w-full px-4 py-3 rounded-lg bg-surface text-body-md text-on-surface border border-surface-container-highest/60 focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-lg bg-secondary text-on-secondary font-label-uppercase text-label-uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-md cursor-pointer mt-2"
                >
                  Request Private Atelier Appointment
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
