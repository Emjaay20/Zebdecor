'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCommissionBag } from '@/lib/store/commission-bag';
import CommissionCartDrawer from './CommissionCartDrawer';
import SystemsTelemetryModal from './SystemsTelemetryModal';
import AuthModal from './auth/AuthModal';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [telemetryOpen, setTelemetryOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pathname = usePathname();
  const bag = useCommissionBag();

  const navLinks = [
    { label: 'Living', href: '/collections/living' },
    { label: 'Dining', href: '/collections/dining' },
    { label: 'Bedroom', href: '/collections/bedroom' },
    { label: 'Office', href: '/collections/office' },
    { label: 'Bespoke Projects', href: '/projects' },
    { label: 'Materials', href: '/materials' },
    { label: 'Abuja Showroom', href: '/about' },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(44,24,16,0.04)]">
        <div className="h-20 w-full px-gutter-mobile lg:px-margin flex items-center justify-between">
          {/* Brand Logo & Atelier Mark */}
          <div className="flex items-center gap-space-md">
            <Link href="/" className="flex items-center gap-space-sm group">
              <img
                alt="Zebdecor Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida/AEtjO1Vt5qAzgJnaAF4xy0TdCCMqRtRsYL_mACNRoIprmjvtb9vVIDeWtw33slnAV10voqA-ikANQ3FYKtu_j4w_JBhH0b1V2c_L4C4Ic6Ptz1F7ynLNH3WECjxTJSQ6cpkNmlDnkDoQN1oEpBLDzPUc7dcSdSIDF-GG3czPTsng3QhF_s6pTbdSh1BSlPTl4oK_f175WIm4I5mmfaxHSVPYBc0QZpujOTaA0WQlzFAK37Sz_g2VPGwPno9IHA"
              />
              <span className="font-headline-sm text-headline-sm uppercase tracking-widest text-primary">
                Zebdecor
              </span>
            </Link>
            <span className="hidden 2xl:inline-block font-label-uppercase text-label-uppercase text-secondary tracking-widest pl-space-sm border-l border-outline-variant/40">
              Abuja Atelier
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-space-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`font-label-uppercase text-label-uppercase tracking-widest transition-colors ${
                    isActive
                      ? 'text-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-space-xs sm:gap-space-sm">
            {/* Headless WordPress Systems Telemetry Trigger */}
            <button
              type="button"
              onClick={() => setTelemetryOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-surface-container-high hover:bg-secondary-container text-primary font-mono text-[10px] uppercase tracking-wider border border-outline-variant/30 transition cursor-pointer"
              title="Inspect Headless WordPress Circuit Breaker & Webhook Telemetry"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>WP Headless Edge</span>
            </button>

            <Link
              className="hidden lg:inline-flex items-center px-space-sm py-2 rounded-lg bg-surface-container-high text-secondary hover:bg-secondary hover:text-on-secondary transition-all shadow-sm"
              href="/consultation"
            >
              <span className="font-label-uppercase text-label-uppercase tracking-widest">
                Book Consultation
              </span>
            </Link>

            {/* Atelier Commission Bag Button */}
            <button
              type="button"
              onClick={() => bag.setDrawerOpen(true)}
              className="relative px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-secondary-container text-primary flex items-center gap-1.5 transition cursor-pointer"
              title="Open Atelier Commission Bag"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">
                shopping_bag
              </span>
              <span className="font-mono text-xs font-semibold">{bag.totalCount}</span>
            </button>

            {/* Atelier Client Account Trigger */}
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="w-9 h-9 rounded-full bg-surface-container-high hover:bg-secondary-container text-primary flex items-center justify-center transition cursor-pointer"
              title="Client Atelier Account / Sign In / Password Reset"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>

            <Link
              href="/ar"
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-secondary transition-colors"
              title="Launch 3D & WebXR Spatial Studio"
            >
              <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
              aria-label="Toggle Navigation"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-surface/98 backdrop-blur-2xl border-t border-outline-variant/30 px-gutter-mobile py-6 shadow-2xl space-y-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-label-uppercase text-label-uppercase tracking-widest text-on-surface hover:text-secondary py-2 border-b border-surface-container transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-2 flex flex-col gap-3 font-label-uppercase text-label-uppercase">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTelemetryOpen(true);
                }}
                className="w-full text-center py-3 rounded-lg bg-surface-container-high text-primary tracking-widest flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Headless WP Systems Telemetry</span>
              </button>
              <Link
                href="/consultation"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-lg bg-secondary text-on-secondary tracking-widest"
              >
                Book Consultation
              </Link>
              <Link
                href="/ar"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-lg bg-primary text-on-primary tracking-widest flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                Open 3D &amp; WebXR AR Studio
              </Link>
            </div>
          </div>
        )}
      </header>

      <CommissionCartDrawer
        isOpen={bag.drawerOpen}
        onClose={() => bag.setDrawerOpen(false)}
        items={bag.items}
        totalNaira={bag.totalNaira}
        totalUSD={bag.totalUSD}
        deposit40Naira={bag.deposit40Naira}
        deposit40USD={bag.deposit40USD}
        onRemoveItem={bag.removeItem}
      />

      <SystemsTelemetryModal
        isOpen={telemetryOpen}
        onClose={() => setTelemetryOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
