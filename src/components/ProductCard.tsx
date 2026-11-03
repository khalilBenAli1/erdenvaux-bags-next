'use client';
import Link from 'next/link';
import type { Product, Variant } from '@/domain/types';
import { formatMoney, productHref, sameSelection } from '@/domain/catalog';
import { useCommerce } from '@/state/CommerceProvider';
import { Photo } from './ui/Photo';
import { Icon } from './ui/Icon';
import styles from './ProductCard.module.css';
export function ProductCard({
  product,
  variant: chosen,
}: {
  product: Product;
  variant?: Variant;
}) {
  const variant = chosen ?? product.variants[0]!;
  const selection = { productId: product.id, variantId: variant.id };
  const wishlist = useCommerce((state) => state.wishlist);
  const status = useCommerce((state) => state.status);
  const toggle = useCommerce((state) => state.toggleWishlist);
  const saved = wishlist.some((item) => sameSelection(item, selection));
  return (
    <article className={styles.card}>
      <div className={styles.image}>
        <Link
          href={productHref(product.id, variant.id)}
          aria-label={`Explore ${product.name} in ${variant.color}`}
        >
          <Photo
            image={variant.image}
            alt={`${product.name}, ${variant.color.toLowerCase()} ${variant.material.toLowerCase()}, with silver-tone fittings`}
            sizes="(max-width:700px) 50vw, 25vw"
          />
        </Link>
        <button
          className={styles.save}
          type="button"
          aria-label={`${saved ? 'Unsave' : 'Save'} ${product.name} in ${variant.color}`}
          aria-pressed={saved}
          disabled={status === 'loading'}
          onClick={() => toggle(selection)}
        >
          <Icon name="heart" filled={saved} />
        </button>
        {variant.stock === 0 && (
          <span className={styles.unavailable}>Currently unavailable</span>
        )}
      </div>
      <div className={styles.caption}>
        <h3>
          <Link href={productHref(product.id, variant.id)}>{product.name}</Link>
        </h3>
        <p>{formatMoney(product.priceCents)}</p>
      </div>
      <div className={styles.meta}>
        <p>
          {variant.color} / {variant.material}
        </p>
        {product.variants.length > 1 && (
          <span>{product.variants.length} colours</span>
        )}
      </div>
    </article>
  );
}
