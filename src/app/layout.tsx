import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { CommerceProvider } from '@/state/CommerceProvider';
import { SiteShell } from '@/components/SiteShell';
import { site, basePath, absoluteUrl } from '@/domain/paths';
import './globals.css';
const bodoni = localFont({
  src: '../assets/fonts/bodoni-moda-latin-variable.woff2',
  weight: '400 900',
  display: 'swap',
  variable: '--font-display',
});
const manrope = localFont({
  src: '../assets/fonts/manrope-latin-variable.woff2',
  weight: '200 800',
  display: 'swap',
  variable: '--font-ui',
});
export const metadata: Metadata = {
  metadataBase: new URL(`${site}${basePath}/`),
  title: {
    default: 'ErdenVaux — Objects worth carrying',
    template: '%s — ErdenVaux',
  },
  description:
    'Original fictional leather objects. Eight considered silhouettes, sculptural forms and a local shopping demonstration.',
  openGraph: {
    title: 'ErdenVaux — Objects worth carrying',
    description: 'Collection 01. Considered forms, new perspectives.',
    images: [
      {
        url: absoluteUrl('images/campaign-object.webp'),
        width: 1200,
        height: 1800,
        alt: 'ErdenVaux Pleat 01 in Oxblood on an architectural surface',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: absoluteUrl('favicon.svg') },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bodoni.variable} ${manrope.variable}`}>
      <body>
        <CommerceProvider>
          <SiteShell>{children}</SiteShell>
        </CommerceProvider>
      </body>
    </html>
  );
}
