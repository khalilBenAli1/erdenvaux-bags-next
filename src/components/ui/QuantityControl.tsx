'use client';
import { Icon } from './Icon';
import styles from './QuantityControl.module.css';
export function QuantityControl({
  value,
  max,
  onChange,
  label,
  disabled = false,
}: {
  value: number;
  max: number;
  onChange: (quantity: number) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div className={styles.quantity} role="group" aria-label={label}>
      <button
        type="button"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        aria-label={`Decrease ${label}`}
      >
        <Icon name="minus" />
      </button>
      <output aria-label={`${label} quantity`}>{value}</output>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        aria-label={`Increase ${label}`}
      >
        <Icon name="plus" />
      </button>
    </div>
  );
}
