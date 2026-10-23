'use client';

import { useEffect, useState } from 'react';
import { formatKoboToNaira, formatKoboToUSD, parseNairaStringToKobo, toKobo } from '@/lib/domain/types';

export interface CommissionBagItem {
  readonly uid: string;
  readonly productId: string;
  readonly productName: string;
  readonly ref: string;
  readonly image: string;
  readonly scaleLabel: string;
  readonly materialLabel: string;
  readonly timberLabel: string;
  readonly unitPriceFormatted: string;
  readonly quantity: number;
}

const STORAGE_KEY = 'zebdecor_atelier_bag_v1';
const EVENT_NAME = 'zebdecor:bag-updated';

export function getStoredBag(): CommissionBagItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToCommissionBag(item: Omit<CommissionBagItem, 'uid' | 'quantity'>): void {
  if (typeof window === 'undefined') return;
  const current = getStoredBag();
  const uid = `${item.productId}::${item.scaleLabel}::${item.materialLabel}::${item.timberLabel}`;
  const existingIdx = current.findIndex((x) => x.uid === uid);

  let updated: CommissionBagItem[];
  if (existingIdx >= 0) {
    updated = current.map((x, idx) =>
      idx === existingIdx ? { ...x, quantity: x.quantity + 1 } : x
    );
  } else {
    updated = [{ ...item, uid, quantity: 1 }, ...current];
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { openDrawer: true } }));
}

export function removeFromCommissionBag(uid: string): void {
  if (typeof window === 'undefined') return;
  const updated = getStoredBag().filter((x) => x.uid !== uid);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { openDrawer: false } }));
}

export function useCommissionBag() {
  const [items, setItems] = useState<CommissionBagItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setItems(getStoredBag());

    const handleSync = (evt: Event) => {
      setItems(getStoredBag());
      const customEvt = evt as CustomEvent<{ openDrawer?: boolean }>;
      if (customEvt.detail?.openDrawer) {
        setDrawerOpen(true);
      }
    };

    window.addEventListener(EVENT_NAME, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const totalKobo = toKobo(
    items.reduce((acc, item) => {
      const kobo = parseNairaStringToKobo(item.unitPriceFormatted);
      return acc + Math.round(kobo / 100) * item.quantity;
    }, 0)
  );

  const deposit40Kobo = toKobo(Math.round((totalKobo / 100) * 0.4));

  return {
    items,
    totalCount: items.reduce((sum, i) => sum + i.quantity, 0),
    totalNaira: formatKoboToNaira(totalKobo),
    totalUSD: formatKoboToUSD(totalKobo),
    deposit40Naira: formatKoboToNaira(deposit40Kobo),
    deposit40USD: formatKoboToUSD(deposit40Kobo),
    drawerOpen,
    setDrawerOpen,
    removeItem: removeFromCommissionBag,
  };
}
