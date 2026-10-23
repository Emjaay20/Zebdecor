'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CommissionBagItem } from '@/lib/store/commission-bag';

interface CommissionCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommissionBagItem[];
  totalNaira: string;
  totalUSD: string;
  deposit40Naira: string;
  deposit40USD: string;
  onRemoveItem: (uid: string) => void;
}

export default function CommissionCartDrawer({
  isOpen,
  onClose,
  items,
  totalNaira,
  totalUSD,
  deposit40Naira,
  deposit40USD,
  onRemoveItem,
}: CommissionCartDrawerProps) {
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const waSummaryText = items
    .map(
      (i) =>
        `• ${i.quantity}x ${i.productName} (${i.scaleLabel}, ${i.materialLabel}, ${i.timberLabel}) — ${i.unitPriceFormatted}`
    )
    .join('\n');

  const waCheckoutLink = `https://wa.me/23480093233267?text=${encodeURIComponent(
    `Good day Zebdecor Maitama Atelier,\n\nI would like to lock my 40% Commission Deposit (${
      currency === 'NGN' ? deposit40Naira : deposit40USD
    }) for the following bespoke selection:\n${waSummaryText}\n\nTotal Portfolio Investment: ${
      currency === 'NGN' ? totalNaira : totalUSD
    }`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-primary/70 backdrop-blur-sm flex justify-end">
      <div className="bg-surface text-on-surface w-full max-w-md h-full shadow-2xl border-l border-outline-variant/30 flex flex-col justify-between p-space-md animate-in slide-in-from-right duration-200">
        {/* Top Drawer Header */}
        <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
          <div>
            <span className="font-label-uppercase text-[10px] text-secondary uppercase tracking-widest block">
              Maitama Bespoke Portfolio
            </span>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              Atelier Commission Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrency((c) => (c === 'NGN' ? 'USD' : 'NGN'))}
              className="px-2.5 py-1 rounded bg-surface-container-high text-xs font-mono text-primary hover:bg-secondary-container transition cursor-pointer"
            >
              {currency === 'NGN' ? '₦ NGN' : '$ USD'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high cursor-pointer"
              aria-label="Close Commission Bag"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-3">
              <span className="material-symbols-outlined text-[42px] text-secondary/60">
                weekend
              </span>
              <p className="font-headline-sm text-primary">Your Atelier Bag is Empty</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Configure any bespoke sofa, monolithic marble dining table, or credenza and add it to your commission portfolio.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.uid}
                className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high flex gap-3 items-start"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 bg-surface-container"
                />
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-start justify-between gap-1">
                    <Link
                      href={`/products/${item.productId}`}
                      onClick={onClose}
                      className="font-label-regular text-primary font-semibold truncate hover:text-secondary"
                    >
                      {item.productName}
                    </Link>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.uid)}
                      className="text-on-surface-variant hover:text-error text-xs cursor-pointer"
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {item.scaleLabel} • {item.materialLabel}
                  </p>
                  <p className="text-[11px] text-secondary truncate">{item.timberLabel}</p>
                  <div className="pt-1 flex items-center justify-between text-xs font-mono">
                    <span className="text-on-surface-variant">Qty: {item.quantity}</span>
                    <span className="font-semibold text-primary">{item.unitPriceFormatted}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Actions */}
        {items.length > 0 && (
          <div className="border-t border-surface-container-high pt-4 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Total Portfolio Value</span>
                <span className="font-mono font-semibold text-primary">
                  {currency === 'NGN' ? totalNaira : totalUSD}
                </span>
              </div>
              <div className="flex justify-between text-secondary font-semibold">
                <span>40% Kiln &amp; Quarry Deposit Due Today</span>
                <span className="font-mono text-sm">
                  {currency === 'NGN' ? deposit40Naira : deposit40USD}
                </span>
              </div>
            </div>

            {checkoutSuccess ? (
              <div className="p-3 rounded-lg bg-secondary-container/40 border border-secondary text-xs text-primary space-y-1">
                <p className="font-semibold">✓ Pro-Forma Commission Reference Generated</p>
                <p className="text-on-surface-variant">
                  Your bespoke specification has been prepared. Click below to finalize slot allocation with our Maitama Concierge.
                </p>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setCheckoutSuccess(true)}
                className="w-full py-3 rounded-lg bg-secondary text-on-secondary font-label-uppercase text-label-uppercase tracking-widest hover:bg-secondary/90 transition cursor-pointer shadow-sm"
              >
                Generate Pro-Forma Spec &amp; Reserve Slot
              </button>

              <a
                href={waCheckoutLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-lg bg-primary text-on-primary font-label-uppercase text-label-uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-container transition"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Finalize Commission on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
