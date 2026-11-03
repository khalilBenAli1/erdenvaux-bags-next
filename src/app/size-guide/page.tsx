import type { Metadata } from 'next';
import { SizeComparison } from '@/features/product/SizeComparison';
import { absoluteUrl } from '@/domain/paths';
export const metadata: Metadata = {
  title: 'A sense of proportion',
  description:
    'Compare the fictional bag body dimensions at an accurate shared centimeter scale.',
  alternates: { canonical: absoluteUrl('size-guide/') },
};
export default function SizeGuidePage() {
  return (
    <div className="wrap">
      <section className="page-heading">
        <p className="eyebrow">A sense of proportion</p>
        <h1>The shape of your day.</h1>
        <p>
          Compact or generous. Held close or carried further.
          <br />
          See how two silhouettes compare.
        </p>
      </section>
      <SizeComparison />
    </div>
  );
}
