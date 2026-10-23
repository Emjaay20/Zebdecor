'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ARModal from '@/components/ARModal';
import { products, categories } from '@/data/sample';

export default function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [arModalOpen, setArModalOpen] = useState(false);
  const [arModalTitle, setArModalTitle] = useState('The Aso Minimalist Curved Sofa');

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleOpenAR = (title: string) => {
    setArModalTitle(title);
    setArModalOpen(true);
  };

  return (
    <div className="w-full px-gutter-mobile lg:px-margin py-space-xl bg-surface">
      {/* Page Header */}
      <div className="max-w-4xl mb-space-lg space-y-2">
        <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase">
          Abuja Atelier Disciplines
        </span>
        <h1 className="font-display-hero text-display-hero-mobile lg:text-headline-xl text-primary font-normal">
          Architectural Furniture Collections
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Engineered for modern spatial harmony and timeless warmth. Each typology is measured, surfaced, and hand-joined within our Maitama and Guzape workshops.
        </p>
      </div>

      {/* Category Pills Strip */}
      <div className="flex flex-wrap gap-2 mb-space-lg">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-5 py-2.5 rounded-full font-label-uppercase text-label-uppercase tracking-wider transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
          }`}
        >
          All Masterpieces
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full font-label-uppercase text-label-uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Category Overview Cards */}
      {selectedCategory === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-xl">
          {categories.slice(0, 3).map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className="group relative rounded-xl overflow-hidden bg-surface-container-low shadow-sm hover:shadow-md transition-all block h-64"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-surface">
                <span className="font-label-uppercase text-[10px] text-secondary-fixed tracking-widest uppercase">
                  {cat.countBadge}
                </span>
                <h3 className="font-headline-md text-headline-md text-surface flex items-center justify-between">
                  <span>{cat.title}</span>
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} onOpenAR={handleOpenAR} />
        ))}
      </div>

      {/* AR Modal */}
      <ARModal
        isOpen={arModalOpen}
        onClose={() => setArModalOpen(false)}
        itemTitle={arModalTitle}
      />
    </div>
  );
}
