'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-surface-container-low mt-space-xl pt-space-xl pb-space-lg shadow-[0_-1px_8px_rgba(44,24,16,0.03)] border-t border-surface-container-highest/30">
      <div className="w-full px-gutter-mobile lg:px-margin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-lg pb-space-lg">
          {/* Brand & Provenance */}
          <div className="lg:col-span-4 space-y-space-sm">
            <Link href="/" className="flex items-center gap-space-sm">
              <img
                alt="Zebdecor Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1Vt5qAzgJnaAF4xy0TdCCMqRtRsYL_mACNRoIprmjvtb9vVIDeWtw33slnAV10voqA-ikANQ3FYKtu_j4w_JBhH0b1V2c_L4C4Ic6Ptz1F7ynLNH3WECjxTJSQ6cpkNmlDnkDoQN1oEpBLDzPUc7dcSdSIDF-GG3czPTsng3QhF_s6pTbdSh1BSlPTl4oK_f175WIm4I5mmfaxHSVPYBc0QZpujOTaA0WQlzFAK37Sz_g2VPGwPno9IHA"
              />
              <span className="font-headline-sm text-headline-sm uppercase tracking-widest text-primary">
                Zebdecor
              </span>
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm leading-relaxed">
              Architectural interiors and bespoke handcrafted furniture atelier. Conceived in Abuja for Nigeria’s finest private residences and commercial spaces.
            </p>
            <div className="flex items-center gap-space-xs font-label-regular text-label-regular text-secondary">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Bespoke Nigerian Joinery &amp; Global Luxury Finishes</span>
            </div>
          </div>

          {/* Private Ateliers & Showrooms */}
          <div className="lg:col-span-3 space-y-space-sm">
            <p className="font-label-uppercase text-label-uppercase tracking-widest text-primary">
              Private Ateliers &amp; Showrooms
            </p>
            <div className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <p className="font-label-regular text-label-regular text-on-surface font-semibold">
                Maitama Flagship Atelier
              </p>
              <p>Plot 1128, Aguiyi Ironsi Street, Maitama, Abuja</p>
              <p className="font-label-regular text-label-regular text-on-surface pt-space-xs font-semibold">
                Guzape Studio &amp; Workshop
              </p>
              <p>Diplomatic Zone Road, Guzape Hills, Abuja</p>
              <p className="text-secondary font-medium pt-1">
                appointments@zebdecor.ng | +234 9 290 8400
              </p>
            </div>
          </div>

          {/* Collections Navigation */}
          <div className="lg:col-span-2 space-y-space-sm">
            <p className="font-label-uppercase text-label-uppercase tracking-widest text-primary">
              Collections
            </p>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <li>
                <Link className="hover:text-primary transition-colors" href="/collections/living">
                  Living Sanctuaries
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/collections/dining">
                  Bespoke Dining
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/products/the-zuma-dining-suite">
                  The Zuma Dining Suite
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/products/the-aso-curved-sofa">
                  The Aso Curved Sofa
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/collections/bedroom">
                  Master Suites
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/collections/office">
                  Executive Studies
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/materials">
                  Tactile Material Swatches
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/ar">
                  Spatial 1:1 AR Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Private Gazette Newsletter */}
          <div className="lg:col-span-3 space-y-space-sm">
            <p className="font-label-uppercase text-label-uppercase tracking-widest text-primary">
              Private Gazette
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Receive exclusive architectural project monographs and private preview invitations.
            </p>
            {subscribed ? (
              <p className="text-sm text-secondary font-medium bg-secondary-container/30 px-3 py-2 rounded-lg">
                Thank you for joining our Private Gazette.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-space-xs">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-space-sm py-2 rounded-lg bg-surface-container-lowest text-body-sm font-body-sm text-on-surface focus:outline-none shadow-[0_2px_6px_rgba(44,24,16,0.02)] border border-surface-container-highest/60"
                  placeholder="Your email address"
                  type="email"
                  required
                />
                <button
                  className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-uppercase text-label-uppercase tracking-wider hover:bg-secondary hover:text-on-secondary transition-all"
                  type="submit"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Legal & Showroom Links */}
        <div className="pt-space-md border-t border-surface-container-highest/50 flex flex-col md:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
          <p>© 2025 Zebdecor Nigeria Ltd. Architectural Elegance. All rights reserved.</p>
          <div className="flex gap-space-md font-label-regular text-label-regular">
            <Link className="hover:text-primary transition-colors" href="/about">
              About Atelier
            </Link>
            <Link className="hover:text-primary transition-colors" href="/consultation">
              Private Consultation
            </Link>
            <Link className="hover:text-primary transition-colors" href="/about">
              Visit Showroom
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
