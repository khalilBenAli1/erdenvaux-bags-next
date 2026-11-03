'use client';
import Link from 'next/link';
import { useCommerce } from '@/state/CommerceProvider';
import { calculateTotals } from '@/domain/pricing';
import { formatMoney } from '@/domain/catalog';
import { Icon } from '@/components/ui/Icon';
import { BagLines } from './BagLines';
import styles from './BagPage.module.css';
export function BagPage() {
  const cart = useCommerce((s) => s.cart);
  const status = useCommerce((s) => s.status);
  const totals = calculateTotals(cart, 'standard');
  if (status === 'loading')
    return (
      <p className="loading" role="status">
        Preparing your bag…
      </p>
    );
  if (!cart.length)
    return (
      <div className={styles.empty}>
        <h2>A form will find you.</h2>
        <p>
          Your bag is empty. Explore the silhouettes and find a piece with a
          line of its own.
        </p>
        <Link className="text-link" href="/collection/">
          Explore the collection <Icon name="arrow" />
        </Link>
      </div>
    );
  return (
    <div className={styles.layout}>
      <BagLines />
      <aside className={styles.summary} aria-label="Bag summary">
        <h2>A little closer.</h2>
        <div className={styles.row}>
          <span>
            {totals.itemCount} {totals.itemCount === 1 ? 'piece' : 'pieces'}
          </span>
          <span>{formatMoney(totals.subtotalCents)}</span>
        </div>
        <p className={styles.note}>
          Choose your sample delivery option in the next step. These are
          illustrative prices; no payment or purchase will be made.
        </p>
        <Link className="button" href="/checkout/">
          Continue to demo checkout <Icon name="arrow" />
        </Link>
        <Link className={`text-link ${styles.wishLink}`} href="/collection/">
          Keep exploring <Icon name="arrow" />
        </Link>
      </aside>
    </div>
  );
}
