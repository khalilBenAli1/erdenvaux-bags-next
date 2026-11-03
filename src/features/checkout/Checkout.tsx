'use client';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { useCheckout, type CheckoutStep } from './use-checkout';
import { DeliveryStep } from './DeliveryStep';
import { DetailsStep } from './DetailsStep';
import { ReviewStep } from './ReviewStep';
import { OrderSummary } from './OrderSummary';
import { OrderConfirmation } from './OrderConfirmation';
import styles from './Checkout.module.css';
const steps = [
  { id: 'delivery', label: '01 / Delivery' },
  { id: 'details', label: '02 / Details' },
  { id: 'review', label: '03 / Review' },
] as const;
export function Checkout() {
  const flow = useCheckout();
  if (flow.status === 'loading')
    return (
      <section className={styles.empty}>
        <p className="eyebrow">Demo checkout</p>
        <h1>Demo checkout.</h1>
        <p role="status">Preparing your selection…</p>
        <noscript>
          <p>
            The shopping tools in this demo require JavaScript. You can still
            browse the collection and product details.
          </p>
        </noscript>
      </section>
    );
  if (flow.confirmation) return <OrderConfirmation order={flow.confirmation} />;
  if (!flow.cart.length)
    return (
      <section className={styles.empty}>
        <p className="eyebrow">Your next silhouette</p>
        <h1>
          A little room
          <br />
          in your bag.
        </h1>
        <p>Choose a piece before starting the demo checkout.</p>
        <Link className="text-link" href="/collection/">
          Explore the collection <Icon name="arrow" />
        </Link>
      </section>
    );
  const go = (step: CheckoutStep) => {
    if (step === 'review') flow.review();
    else flow.setStep(step);
  };
  return (
    <>
      <section className={styles.top}>
        <p className="eyebrow">Demo checkout / No payment</p>
        <h1>The final details.</h1>
        <p>
          Choose a delivery option, then use sample contact details.
          <br />
        </p>
      </section>
      <div className={styles.layout}>
        <div className={styles.main}>
          <nav className={styles.steps} aria-label="Checkout steps">
            {steps.map((step) => (
              <button
                key={step.id}
                type="button"
                aria-current={flow.step === step.id ? 'step' : undefined}
                disabled={step.id === 'review' && flow.step !== 'review'}
                onClick={() => go(step.id)}
              >
                {step.label}
              </button>
            ))}
          </nav>
          {flow.step === 'delivery' ? (
            <DeliveryStep
              selected={flow.delivery}
              onSelect={flow.setDelivery}
              onNext={() => flow.setStep('details')}
              heading={flow.heading}
            />
          ) : flow.step === 'details' ? (
            <DetailsStep
              customer={flow.customer}
              errors={flow.errors}
              onChange={flow.changeCustomer}
              onReview={flow.review}
              onBack={() => flow.setStep('delivery')}
              heading={flow.heading}
            />
          ) : (
            <ReviewStep
              customer={flow.customer}
              delivery={flow.delivery}
              onEditDetails={() => flow.setStep('details')}
              onEditDelivery={() => flow.setStep('delivery')}
              onConfirm={flow.confirm}
              heading={flow.heading}
            />
          )}
        </div>
        <OrderSummary cart={flow.cart} totals={flow.totals} />
      </div>
    </>
  );
}
