'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ARModal from '@/components/ARModal';
import { products, categories } from '@/data/sample';

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = React.use(params);
  const [arModalOpen, setArModalOpen] = useState(false);
  const [arModalTitle, setArModalTitle] = useState('The Aso Minimalist Curved Sofa');

  const catParam = category.toLowerCase();
  const currentCategory = categories.find(
    (c) => c.slug === catParam || c.id === catParam
  ) || {
    id: catParam,
    slug: catParam,
    title: catParam.charAt(0).toUpperCase() + catParam.slice(1),
    badge: 'Curated Category',
    countBadge: 'Atelier Collection',
    description: 'Bespoke hand-joined pieces for architectural residences.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmw-Jz4i5NMI4n0xM0rBzqI7uLoB6SORsMdOU6laT7g0vbNd0NG7hF0UFpN1NRfIHNN3agn-zbmO2l6NZcGNSBKqS3mf5atCqE6QwPtb3pbjcOeexpJiGTELgkbrQCUh1qC7sQT-7Z4J2JI0gvJ8qi2Uuru4FR7fRPyNlVfrHEOo6rNzng-15YKkog42FuuxyYd2XgiIpCKplYVRrBHqrOGmNlrQ_JlJNBlydgICXYmZsK19D7TQ6p',
  };

  const filteredProducts = products.filter(
    (p) =>
      p.category === catParam ||
      (catParam === 'living' && (p.category === 'living' || p.category === 'storage')) ||
      (catParam === 'dining' && (p.category === 'dining' || p.category === 'tables'))
  );

  const handleOpenAR = (title: string) => {
    setArModalTitle(title);
    setArModalOpen(true);
  };

  return (
    <div className="w-full px-gutter-mobile lg:px-margin py-space-xl bg-surface">
      {/* Category Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-space-xl bg-primary text-surface h-[360px] flex flex-col justify-end p-space-lg shadow-2xl">
        <img
          src={currentCategory.image}
          alt={currentCategory.title}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent" />
        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="font-label-uppercase text-label-uppercase text-secondary-fixed tracking-widest uppercase">
            {currentCategory.countBadge} • Abuja Atelier
          </span>
          <h1 className="font-headline-xl text-headline-xl-mobile lg:text-headline-xl text-surface font-normal">
            {currentCategory.title} Sanctuaries
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-high max-w-xl font-light">
            {currentCategory.description}
          </p>
        </div>
      </div>

      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between mb-space-lg text-on-surface-variant font-label-uppercase text-label-uppercase">
        <div className="flex items-center gap-2">
          <Link href="/collections" className="hover:text-primary transition-colors">
            All Collections
          </Link>
          <span>/</span>
          <span className="text-primary font-semibold">{currentCategory.title}</span>
        </div>
        <Link
          href="/consultation"
          className="hidden sm:inline-flex items-center gap-1.5 text-secondary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
          <span>Book Atelier Consultation</span>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onOpenAR={handleOpenAR} />
          ))
        ) : (
          <div className="col-span-full py-16 text-center space-y-4">
            <span className="material-symbols-outlined text-[48px] text-secondary">handyman</span>
            <h3 className="font-headline-md text-primary">Private Commissions in Progress</h3>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
              Our master joiners are currently crafting new {currentCategory.title} commissions in our Maitama studio. Contact concierge to view private lookbooks.
            </p>
            <a
              href="https://wa.me/23480093233267"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-on-primary font-label-uppercase text-label-uppercase tracking-wider hover:bg-secondary transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        )}
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
