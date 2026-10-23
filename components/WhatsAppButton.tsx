'use client';

import React from 'react';

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-secondary text-on-secondary shadow-2xl hover:bg-secondary/90 hover:scale-105 transition-all border border-secondary-container/40"
        href="https://wa.me/23480093233267?text=Hello%20Zebdecor%2C%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20interior%20piece"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Concierge"
      >
        <span className="material-symbols-outlined text-[22px]">chat</span>
        <span className="font-label-uppercase text-label-uppercase tracking-wider hidden sm:inline">
          WhatsApp Atelier (+234 800 ZEBDECOR)
        </span>
        <span className="font-label-uppercase text-label-uppercase tracking-wider sm:hidden">
          Concierge
        </span>
      </a>
    </div>
  );
}
