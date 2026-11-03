'use client';
import Link from 'next/link';
import { useCommerce } from '@/state/CommerceProvider';
import { calculateTotals } from '@/domain/pricing';
import { formatMoney } from '@/domain/catalog';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import { BagLines } from './BagLines';
import styles from './BagLines.module.css';
export function BagDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const cart = useCommerce((state) => state.cart);
  const status = useCommerce((state) => state.status);
  const totals = calculateTotals(cart, 'standard');
  return (
    <Dialog
      open={open}
      onRequestClose={onClose}
      labelId="bag-title"
      kind="drawer"
    >
      <div className={styles.header}>
        <h2 className={styles.drawerTitle} id="bag-title">
          Your bag <span>({totals.itemCount})</span>
        </h2>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close bag"
        >
          <Icon name="close" />
        </button>
      </div>
      <div className={styles.body}>
        {status === 'loading' ? (
          <p className="loading" role="status">
            Preparing your bag…
          </p>
        ) : cart.length ? (
          <BagLines />
        ) : (
          <div className={styles.empty}>
            <h3>
              A little room
              <br />
              for something good.
            </h3>
            <p>Your bag is waiting for its first piece.</p>
            <Link className="text-link" href="/collection/" onClick={onClose}>
              Explore the collection <Icon name="arrow" />
            </Link>
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <div className={styles.summary}>
          <div className={styles.subtotal}>
            <span>Subtotal</span>
            <span>{formatMoney(totals.subtotalCents)}</span>
          </div>
          <p>
            Choose a sample delivery option at checkout.
            <br />
            This is a local demonstration. No purchase is made.
          </p>
          <div className={styles.buttons}>
            <Link className="button" href="/checkout/" onClick={onClose}>
              Continue to demo checkout <Icon name="arrow" />
            </Link>
            <Link
              className="button button-outline"
              href="/bag/"
              onClick={onClose}
            >
              View your bag
            </Link>
          </div>
        </div>
      )}
    </Dialog>
  );
}
