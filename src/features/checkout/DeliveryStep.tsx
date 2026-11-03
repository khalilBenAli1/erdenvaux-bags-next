'use client';
import type { RefObject } from 'react';
import { deliveryOptions, type DeliveryId } from '@/domain/pricing';
import { formatMoney } from '@/domain/catalog';
import { Icon } from '@/components/ui/Icon';
import styles from './Checkout.module.css';
export function DeliveryStep({
  selected,
  onSelect,
  onNext,
  heading,
}: {
  selected: DeliveryId;
  onSelect: (id: DeliveryId) => void;
  onNext: () => void;
  heading: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <section aria-labelledby="delivery-heading">
      <h2
        id="delivery-heading"
        tabIndex={-1}
        ref={heading}
        className={styles.stepHeading}
      >
        At your own pace.
      </h2>
      <p className={styles.intro}>
        Choose a sample delivery option. Nothing will be shipped or charged.
      </p>
      <fieldset className={styles.delivery}>
        <legend className="eyebrow">Delivery options</legend>
        {deliveryOptions.map((option) => (
          <label key={option.id}>
            <input
              type="radio"
              name="delivery"
              value={option.id}
              checked={selected === option.id}
              onChange={() => onSelect(option.id)}
            />
            <span className={styles.deliveryLabel}>
              {option.label}
              <small>{option.description}</small>
            </span>
            <span className={styles.deliveryPrice}>
              {formatMoney(option.priceCents)}
            </span>
          </label>
        ))}
      </fieldset>
      <div className={styles.actions}>
        <span className="demo-note">All prices are illustrative.</span>
        <button className="button" type="button" onClick={onNext}>
          Continue to details <Icon name="arrow" />
        </button>
      </div>
    </section>
  );
}
