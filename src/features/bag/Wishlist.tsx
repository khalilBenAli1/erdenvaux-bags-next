'use client';
import Link from 'next/link';
import { useCommerce } from '@/state/CommerceProvider';
import { getProduct, getVariant, selectionKey } from '@/domain/catalog';
import { ProductCard } from '@/components/ProductCard';
import { Icon } from '@/components/ui/Icon';
import styles from './BagPage.module.css';
export function Wishlist() {
  const wishlist = useCommerce((s) => s.wishlist);
  const status = useCommerce((s) => s.status);
  if (status === 'loading')
    return (
      <p className="loading" role="status">
        Finding your saved pieces…
      </p>
    );
  if (!wishlist.length)
    return (
      <div className={styles.empty}>
        <h2>A shape to come back to.</h2>
        <p>
          Save the pieces that catch your eye. Your edit stays on this device
          when saving is available.
        </p>
        <Link className="text-link" href="/collection/">
          Find your first piece <Icon name="arrow" />
        </Link>
      </div>
    );
  return (
    <div className={styles.wishlistGrid}>
      {wishlist.map((selection) => {
        const product = getProduct(selection.productId);
        const variant = getVariant(selection.productId, selection.variantId);
        if (!product || !variant) throw new Error('Unknown saved selection');
        return (
          <ProductCard
            headingLevel={2}
            key={selectionKey(selection)}
            product={product}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
