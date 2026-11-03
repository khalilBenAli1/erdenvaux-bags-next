'use client';
import type { RefObject } from 'react';
import type { Customer } from '@/domain/customer';
import { getDelivery, type DeliveryId } from '@/domain/pricing';
import { formatMoney } from '@/domain/catalog';
import { Icon } from '@/components/ui/Icon';
import styles from './Checkout.module.css';
export function ReviewStep({
  customer,
  delivery,
  onEditDetails,
  onEditDelivery,
  onConfirm,
  heading,
}: {
  customer: Customer;
  delivery: DeliveryId;
  onEditDetails: () => void;
  onEditDelivery: () => void;
  onConfirm: () => void;
  heading: RefObject<HTMLHeadingElement | null>;
}) {
  const option = getDelivery(delivery);
  return (
    <section aria-labelledby="review-heading">
      <h2
        id="review-heading"
        tabIndex={-1}
        ref={heading}
        className={styles.stepHeading}
      >
        One last look.
      </h2>
      <p className={styles.intro}>
        Review the sample details and the complete illustrative total before
        confirming this local demonstration.
      </p>
      <div className={styles.reviewHeading}>
        <h3>Delivery</h3>
        <button type="button" className={styles.edit} onClick={onEditDelivery}>
          Edit delivery
        </button>
      </div>
      <div className={styles.customer}>
        <p>
          {option.label} / {formatMoney(option.priceCents)}
        </p>
        <p className="muted">{option.description}</p>
      </div>
      <div className={styles.reviewHeading}>
        <h3>Your sample details</h3>
        <button type="button" className={styles.edit} onClick={onEditDetails}>
          Edit details
        </button>
      </div>
      <div className={styles.customer}>
        <p>{customer.fullName.trim()}</p>
        <p>{customer.email.trim()}</p>
        <p>{customer.address.trim()}</p>
        <p>
          {customer.postalCode.trim()} {customer.city.trim()}
        </p>
        <p>{customer.country}</p>
      </div>
      <p className={styles.confirmationNote}>
        Confirming clears the bag and creates a local preview on this page.
        Nothing is charged, transmitted or shipped.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.back} onClick={onEditDetails}>
          Back to details
        </button>
        <button type="button" className="button" onClick={onConfirm}>
          Confirm demonstration <Icon name="arrow" />
        </button>
      </div>
    </section>
  );
}
