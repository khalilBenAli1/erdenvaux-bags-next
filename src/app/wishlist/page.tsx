import type { Metadata } from 'next';
import { Wishlist } from '@/features/bag/Wishlist';
export const metadata: Metadata = {
  title: 'Saved pieces',
  robots: { index: false, follow: true },
};
export default function WishlistPage() {
  return (
    <div className="wrap">
      <section className="page-heading">
        <p className="eyebrow">Your own edit</p>
        <h1>A second look.</h1>
        <p>The silhouettes you want to come back to.</p>
      </section>
      <Wishlist />
    </div>
  );
}
