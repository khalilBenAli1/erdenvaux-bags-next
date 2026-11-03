import type { Metadata } from 'next';
import { BagPage } from '@/features/bag/BagPage';
export const metadata: Metadata = {
  title: 'Your bag',
  robots: { index: false, follow: true },
};
export default function BagRoute() {
  return (
    <div className="wrap">
      <section className="page-heading">
        <p className="eyebrow">Your selection</p>
        <h1>Worth carrying.</h1>
      </section>
      <BagPage />
    </div>
  );
}
