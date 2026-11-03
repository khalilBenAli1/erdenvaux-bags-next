import type { calculateTotals } from '@/domain/pricing';
import { formatMoney } from '@/domain/catalog';
import styles from './Checkout.module.css';
export function PriceBreakdown({
  totals,
}: {
  totals: ReturnType<typeof calculateTotals>;
}) {
  return (
    <dl className={styles.breakdown}>
      <div>
        <dt>Pieces subtotal</dt>
        <dd>{formatMoney(totals.subtotalCents)}</dd>
      </div>
      <div>
        <dt>Sample delivery</dt>
        <dd>{formatMoney(totals.deliveryCents)}</dd>
      </div>
      <div className={styles.total}>
        <dt>Demo total</dt>
        <dd data-demo-total>{formatMoney(totals.totalCents)}</dd>
      </div>
    </dl>
  );
}
