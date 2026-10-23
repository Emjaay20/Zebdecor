'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/data/sample';
import { addToCommissionBag } from '@/lib/store/commission-bag';

interface ProductCardProps {
  product: Product;
  onOpenAR?: (title: string) => void;
}

export default function ProductCard({ product, onOpenAR }: ProductCardProps) {
  const waLink = `https://wa.me/23480093233267?text=${encodeURIComponent(
    `Hello Zebdecor, I would like to order/customize ${product.name} (${product.price}).`
  )}`;

  const handleQuickReserve = () => {
    addToCommissionBag({
      productId: product.id,
      productName: product.name,
      ref: product.ref,
      image: product.image,
      scaleLabel: product.scales?.[0]?.name || product.dimensions,
      materialLabel: product.swatches?.[0]?.name || 'Atelier Standard',
      timberLabel: 'Kiln-Dried Benue Teak',
      unitPriceFormatted: product.price,
    });
  };

  return (
    <div className="bg-surface rounded-xl overflow-hidden p-space-sm flex flex-col justify-between shadow-[0_12px_32px_-4px_rgba(44,24,16,0.04)] group hover:shadow-[0_24px_48px_-8px_rgba(44,24,16,0.08)] transition-all duration-300 border border-surface-container-high/40">
      <div>
        <div className="relative w-full h-72 rounded-lg overflow-hidden bg-surface-container">
          <Link href={`/products/${product.id}`} className="block w-full h-full">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt={product.name}
              src={product.image}
            />
          </Link>

          {/* AR Quick Trigger Badge */}
          {product.hasAR && (
            <button
              onClick={() => onOpenAR ? onOpenAR(product.name) : window.location.assign(`/ar?product=${product.id}`)}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/90 backdrop-blur-md shadow-md text-primary font-label-uppercase text-label-uppercase hover:bg-secondary hover:text-on-secondary transition-all cursor-pointer z-10"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
              <span>View in AR</span>
            </button>
          )}

          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-primary-container/85 text-surface font-label-uppercase text-label-uppercase backdrop-blur-xs">
            {product.tag}
          </span>
        </div>

        <div className="pt-4 space-y-1.5">
          <Link href={`/products/${product.id}`} className="block">
            <h4 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">
              {product.name}
            </h4>
          </Link>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
            {product.subtitle}
          </p>

          {/* Swatches */}
          {product.swatches && product.swatches.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              {product.swatches.map((swatch, idx) => (
                <span
                  key={idx}
                  className={`w-4 h-4 rounded-full border border-black/10 ${
                    idx === 0 ? 'ring-1 ring-secondary ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: swatch.color }}
                  title={swatch.name}
                />
              ))}
              <span className="font-label-regular text-label-regular text-on-surface-variant ml-1">
                {product.swatches.length} Materials
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-surface-container-high flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="font-label-uppercase text-label-uppercase text-on-surface-variant">
            Client Price
          </span>
          <span className="font-headline-sm text-headline-sm text-primary font-semibold">
            {product.price}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-uppercase text-label-uppercase text-center transition-colors flex items-center justify-center gap-1"
          >
            <span>Explore</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
          <button
            type="button"
            onClick={handleQuickReserve}
            className="px-3 py-2.5 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-on-secondary transition-colors flex items-center justify-center cursor-pointer"
            title="Reserve in Atelier Commission Bag"
          >
            <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
          </button>
          <a
            className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-label-uppercase text-label-uppercase flex items-center justify-center gap-1.5 hover:bg-secondary transition-colors text-center"
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
