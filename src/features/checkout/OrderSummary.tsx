import type { BagLine } from '@/domain/types';
import type { calculateTotals } from '@/domain/pricing';
import { resolveLines, formatMoney } from '@/domain/catalog';
import { Photo } from '@/components/ui/Photo';
import { PriceBreakdown } from './PriceBreakdown';
import styles from './Checkout.module.css';
export function OrderSummary({
  cart,
  totals,
}: {
  cart: readonly BagLine[];
  totals: ReturnType<typeof calculateTotals>;
}) {
  return (
    <aside className={styles.summary} aria-label="Selection summary">
      <h2>Your selection</h2>
      <div className={styles.summaryLines}>
        {resolveLines(cart).map((line) => (
          <div className={styles.summaryLine} key={line.key}>
            <Photo
              image={line.variant.image}
              alt={`${line.product.name} in ${line.variant.color}`}
              sizes="65px"
            />
            <div>
              <h3>{line.product.name}</h3>
              <p>
                {line.variant.color} / {line.variant.material}
                <br />
                Quantity {line.quantity}
              </p>
            </div>
            <span>{formatMoney(line.lineTotalCents)}</span>
          </div>
        ))}
      </div>
      <PriceBreakdown totals={totals} />
      <p className={styles.summaryNote}>Illustrative collection prices.</p>
    </aside>
  );
}
