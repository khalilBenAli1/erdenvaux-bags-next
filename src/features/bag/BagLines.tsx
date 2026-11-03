'use client';
import Link from 'next/link';
import { useCommerce } from '@/state/CommerceProvider';
import { resolveLines, formatMoney, productHref } from '@/domain/catalog';
import { Photo } from '@/components/ui/Photo';
import { QuantityControl } from '@/components/ui/QuantityControl';
import styles from './BagLines.module.css';
export function BagLines() {
  const cart = useCommerce((state) => state.cart);
  const change = useCommerce((state) => state.setQuantity);
  const remove = useCommerce((state) => state.remove);
  return (
    <div>
      {resolveLines(cart).map((line) => (
        <article className={styles.line} key={line.key}>
          <Link
            className={styles.photo}
            href={productHref(line.product.id, line.variant.id)}
            aria-label={`View ${line.product.name} in ${line.variant.color}`}
          >
            <Photo
              image={line.variant.image}
              alt={`${line.product.name} in ${line.variant.color}`}
              sizes="100px"
            />
          </Link>
          <div className={styles.info}>
            <div className={styles.top}>
              <h3>
                <Link href={productHref(line.product.id, line.variant.id)}>
                  {line.product.name}
                </Link>
              </h3>
              <p>{formatMoney(line.lineTotalCents)}</p>
            </div>
            <p className={styles.detail}>
              {line.variant.color} / {line.variant.material}
              <br />
              {formatMoney(line.product.priceCents)} each
            </p>
            <div className={styles.bottom}>
              <QuantityControl
                value={line.quantity}
                max={line.variant.stock}
                onChange={(quantity) =>
                  change(
                    { productId: line.product.id, variantId: line.variant.id },
                    quantity,
                  )
                }
                label={`${line.product.name} ${line.variant.color}`}
              />
              <button
                type="button"
                className={styles.remove}
                onClick={() =>
                  remove({
                    productId: line.product.id,
                    variantId: line.variant.id,
                  })
                }
                aria-label={`Remove ${line.product.name} in ${line.variant.color}`}
              >
                Remove
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
