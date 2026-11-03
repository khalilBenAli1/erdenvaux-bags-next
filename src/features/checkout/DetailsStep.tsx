'use client';
import type { RefObject } from 'react';
import {
  countries,
  customerLimits,
  type Customer,
  type CustomerErrors,
  type CustomerKey,
} from '@/domain/customer';
import { Icon } from '@/components/ui/Icon';
import styles from './Checkout.module.css';
const fields = [
  {
    key: 'fullName',
    label: 'Full name',
    placeholder: 'Alex Morgan',
    type: 'text',
  },
  {
    key: 'email',
    label: 'Email address',
    placeholder: 'alex@example.com',
    type: 'email',
  },
  {
    key: 'address',
    label: 'Street and number',
    placeholder: '18 Example Street',
    type: 'text',
  },
  { key: 'city', label: 'City', placeholder: 'Milan', type: 'text' },
  {
    key: 'postalCode',
    label: 'Postal code',
    placeholder: '20121',
    type: 'text',
  },
] as const;
export function DetailsStep({
  customer,
  errors,
  onChange,
  onReview,
  onBack,
  heading,
}: {
  customer: Customer;
  errors: CustomerErrors;
  onChange: (key: CustomerKey, value: string) => void;
  onReview: () => void;
  onBack: () => void;
  heading: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <section aria-labelledby="details-heading">
      <h2
        id="details-heading"
        tabIndex={-1}
        ref={heading}
        className={styles.stepHeading}
      >
        A few final details.
      </h2>
      <p className={styles.intro}>
        Use sample details for this local demonstration. No message, purchase or
        payment will be sent.
      </p>
      <form
        noValidate
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          onReview();
        }}
      >
        <p className={styles.errorSummary} role="alert">
          {Object.keys(errors).length
            ? 'Please check the highlighted details.'
            : ''}
        </p>
        <div className={styles.formGrid}>
          {fields.map((field) => (
            <div
              className={`field ${field.key === 'address' ? styles.full : ''}`}
              key={field.key}
            >
              <label htmlFor={`checkout-${field.key}`}>
                {field.label} <span>(required)</span>
              </label>
              <input
                id={`checkout-${field.key}`}
                name={field.key}
                type={field.type}
                required
                maxLength={customerLimits[field.key]}
                value={customer[field.key]}
                onChange={(event) =>
                  onChange(field.key, event.currentTarget.value)
                }
                placeholder={field.placeholder}
                aria-invalid={errors[field.key] ? 'true' : undefined}
                aria-describedby={`checkout-${field.key}-error`}
              />
              <p id={`checkout-${field.key}-error`} className="field-error">
                {errors[field.key] ?? ''}
              </p>
            </div>
          ))}
          <div className="field">
            <label htmlFor="checkout-country">
              Country <span>(required)</span>
            </label>
            <select
              id="checkout-country"
              name="country"
              value={customer.country}
              onChange={(event) =>
                onChange('country', event.currentTarget.value)
              }
              required
              aria-invalid={errors.country ? 'true' : undefined}
              aria-describedby="checkout-country-error"
            >
              <option value="">Choose a sample country</option>
              {countries.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
            <p id="checkout-country-error" className="field-error">
              {errors.country ?? ''}
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.back} onClick={onBack}>
            Back to delivery
          </button>
          <button type="submit" className="button">
            Review your selection <Icon name="arrow" />
          </button>
        </div>
      </form>
    </section>
  );
}
