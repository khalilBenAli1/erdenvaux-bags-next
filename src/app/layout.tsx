import type { Metadata } from 'next';
import localFont from 'next/font/local';
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
  title: 'ErdenVaux — Objects worth carrying',
  description: 'An original fictional luxury bags portfolio application.',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bodoni.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
