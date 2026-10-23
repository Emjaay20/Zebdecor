import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/AppShell';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Zebdecor — Bespoke Luxury Furniture & Interiors Abuja',
  description:
    'Handcrafted architectural furniture and bespoke interior masterworks tailored for discerning residences across Maitama, Asokoro, Guzape, and beyond.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakarta.variable} ${cormorant.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.customElements) {
                const origDefine = window.customElements.define;
                window.customElements.define = function(name, constructor, options) {
                  if (this.get(name)) return;
                  return origDefine.call(this, name, constructor, options);
                };
              }
            `,
          }}
        />
        <script
          type="module"
          src="/vendor/model-viewer.min.js"
        />
      </head>
      <body className="bg-surface font-body-md text-on-surface antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
