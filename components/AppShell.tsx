'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isArPage = pathname === '/ar' || pathname.endsWith('/ar');

  if (isArPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="w-full bg-surface min-h-screen pt-20">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
