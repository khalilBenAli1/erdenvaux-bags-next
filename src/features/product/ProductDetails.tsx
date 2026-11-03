'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/domain/types';
import { formatMoney, sameSelection } from '@/domain/catalog';
import { useUrlSearch, updateSearch } from '@/hooks/use-url-state';
import { useCommerce } from '@/state/CommerceProvider';
import { QuantityControl } from '@/components/ui/QuantityControl';
import { Icon } from '@/components/ui/Icon';
import { ProductGallery } from './ProductGallery';
import styles from './Product.module.css';
export function ProductDetails({ product }: { product: Product }) {
  const query = new URLSearchParams(useUrlSearch());
  const variant =
    product.variants.find((v) => v.id === query.get('variant')) ??
    product.variants[0]!;
  const cart = useCommerce((s) => s.cart);
  const wishlist = useCommerce((s) => s.wishlist);
  const add = useCommerce((s) => s.add);
  const toggleSaved = useCommerce((s) => s.toggleWishlist);
  const status = useCommerce((s) => s.status);
  const [requested, setRequested] = useState(1);
  const [feedback, setFeedback] = useState('');
  const selection = { productId: product.id, variantId: variant.id };
  const inBag =
    cart.find((line) => sameSelection(line, selection))?.quantity ?? 0;
  const remaining = variant.stock - inBag;
  const quantity = Math.min(requested, Math.max(remaining, 1));
  const saved = wishlist.some((item) => sameSelection(item, selection));
  const ready = status !== 'loading';
  return (
    <div className={styles.layout}>
      <ProductGallery product={product} variant={variant} />
      <section className={styles.info} aria-label={`${product.name} details`}>
        <p className="eyebrow">{product.category} / Collection 01</p>
        <h1>{product.name}</h1>
        <p className={styles.price}>{formatMoney(product.priceCents)}</p>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.variantHeader}>
          <span>Colour / {variant.color}</span>
          <span>{variant.material}</span>
        </div>
        <div
          className={styles.variants}
          role="group"
          aria-label="Choose colour and material"
        >
          {product.variants.map((option) => (
            <button
              className={styles.variant}
              key={option.id}
              type="button"
              aria-pressed={option.id === variant.id}
              onClick={() => {
                updateSearch('variant', option.id);
                setRequested(1);
                setFeedback('');
              }}
            >
              <span
                className={styles.swatch}
                style={{ background: option.hex }}
              />
              <span>
                {option.color}
                <small>
                  {option.material}
                  {option.stock === 0 ? ' · Unavailable' : ''}
                </small>
              </span>
            </button>
          ))}
        </div>
        <p className={styles.availability}>
          {variant.stock === 0
            ? 'Currently unavailable in this demonstration.'
            : remaining === 0
              ? `All ${variant.stock} available pieces are in your bag.`
              : `${remaining} available in this demonstration.`}
        </p>
        <div className={styles.quantityRow}>
          <span>Quantity</span>
          <QuantityControl
            value={quantity}
            max={Math.max(remaining, 1)}
            onChange={setRequested}
            label={`${product.name} selected`}
            disabled={!ready || remaining <= 0}
          />
        </div>
        <div className={styles.purchase}>
          <button
            type="button"
            className={`button ${styles.add}`}
            disabled={!ready || remaining <= 0}
            onClick={() => {
              const result = add(selection, quantity);
              setFeedback(
                result.ok
                  ? `${quantity} ${product.name} in ${variant.color} added to your bag.`
                  : 'This quantity is not available. Please check your bag.',
              );
            }}
          >
            {variant.stock === 0
              ? 'Currently unavailable'
              : remaining === 0
                ? 'All available pieces in bag'
                : 'Add to bag'}
            <Icon name="arrow" />
          </button>
          <button
            type="button"
            className={styles.save}
            disabled={!ready}
            aria-label={`${saved ? 'Unsave' : 'Save'} ${product.name} in ${variant.color}`}
            aria-pressed={saved}
            onClick={() => toggleSaved(selection)}
          >
            <Icon name="heart" filled={saved} />
          </button>
        </div>
        <p className={styles.feedback} role="status">
          {feedback}
        </p>
        <p className={styles.note}>
          Original fictional product. Illustrative price and stock.
          <br />
          No real purchase is made in this demonstration.
        </p>
        <div className={styles.specs}>
          <dl>
            <dt>Body dimensions</dt>
            <dd>
              {product.widthCm} × {product.heightCm} × {product.depthCm} cm
              <br />
              <span className="muted">
                Width × height × depth; excludes handles
              </span>
            </dd>
            <dt>Material</dt>
            <dd>{variant.material}</dd>
            <dt>Hardware</dt>
            <dd>Silver-tone fittings</dd>
          </dl>
          <ul>
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <Link
            className={`text-link ${styles.sizeLink}`}
            href={`/size-guide/?first=${product.id}`}
          >
            Compare the proportions <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </div>
  );
}
