import type { Metadata } from 'next';
import { Collection } from '@/features/catalog/Collection';
import { absoluteUrl } from '@/domain/paths';
export const metadata: Metadata = {
  title: 'The collection',
  description:
    'Eight original fictional bag silhouettes. Explore shape, material, colour and illustrative prices.',
  alternates: { canonical: absoluteUrl('collection/') },
};
export default function CollectionPage() {
  return (
    <div className="wrap">
      <section className="page-heading">
        <p className="eyebrow">Collection 01 / Eight considered forms</p>
        <h1>Objects worth carrying.</h1>
        <p>
          A study in proportion, texture and the space between.
          <br />
          Find a form that feels like you.
        </p>
      </section>
      <Collection />
    </div>
  );
}
