'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Confirmation } from '@/domain/order';
import { formatMoney } from '@/domain/catalog';
import { Photo } from '@/components/ui/Photo';
import { Icon } from '@/components/ui/Icon';
import { PriceBreakdown } from './PriceBreakdown';
import styles from './Checkout.module.css';
export function OrderConfirmation({ order }: { order: Confirmation }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <section
      className={styles.confirmed}
      aria-labelledby="confirmation-heading"
    >
      <div className={styles.confirmedTop}>
        <p className="eyebrow">Demo confirmed</p>
        <h1 id="confirmation-heading" tabIndex={-1} ref={heading}>
          Your edit is confirmed.
        </h1>
        <p>
          Thank you, {order.customer.fullName}. Your demo checkout is complete.
          No order was placed and nothing was charged.
        </p>
      </div>
      <div className={styles.confirmedGrid}>
        <div className={styles.confirmedDetails}>
          <p className={styles.reference}>{order.reference}</p>
          <div>
            <h2>Delivery</h2>
            <p>
              {order.delivery.label}
              <br />
              {order.delivery.description}
            </p>
          </div>
          <div>
            <h2>Sample details</h2>
            <p>{order.customer.fullName}</p>
            <p>{order.customer.email}</p>
            <p>{order.customer.address}</p>
            <p>
              {order.customer.postalCode} {order.customer.city}
            </p>
            <p>{order.customer.country}</p>
          </div>
          <p className={styles.date}>
            {new Intl.DateTimeFormat('en-GB', {
              dateStyle: 'long',
              timeZone: 'UTC',
            }).format(new Date(order.createdAt))}{' '}
            / Demo preview
          </p>
        </div>
        <div className={styles.summary} aria-label="Confirmed selection">
          <h2>The final edit</h2>
          <div className={styles.summaryLines}>
            {order.lines.map((line) => (
              <div
                className={styles.summaryLine}
                key={`${line.productId}:${line.variantId}`}
              >
                <Photo
                  image={line.image}
                  alt={`${line.name} in ${line.color}`}
                  sizes="65px"
                />
                <div>
                  <h3>{line.name}</h3>
                  <p>
                    {line.color} / {line.material}
                    <br />
                    Quantity {line.quantity}
                  </p>
                </div>
                <span>{formatMoney(line.lineTotalCents)}</span>
              </div>
            ))}
          </div>
          <PriceBreakdown totals={order.totals} />
          <p className={styles.summaryNote}>
            This preview clears when you leave or reload the page.
          </p>
        </div>
      </div>
      <div className={styles.confirmedActions}>
        <Link className="text-link" href="/collection/">
          Explore another silhouette <Icon name="arrow" />
        </Link>
        <Link className="text-link" href="/">
          Back to ErdenVaux <Icon name="arrow" />
        </Link>
      </div>
    </section>
  );
}
