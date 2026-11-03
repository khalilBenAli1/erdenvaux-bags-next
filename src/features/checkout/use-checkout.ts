'use client';
import { useEffect, useRef, useState } from 'react';
import { useCommerce } from '@/state/CommerceProvider';
import {
  emptyCustomer,
  customerKeys,
  validateCustomer,
  type CustomerKey,
  type CustomerErrors,
} from '@/domain/customer';
import { calculateTotals, type DeliveryId } from '@/domain/pricing';
import { createConfirmation, type Confirmation } from '@/domain/order';
export type CheckoutStep = 'delivery' | 'details' | 'review';
export function useCheckout() {
  const cart = useCommerce((s) => s.cart);
  const status = useCommerce((s) => s.status);
  const clearBag = useCommerce((s) => s.clearBag);
  const [step, setStep] = useState<CheckoutStep>('delivery');
  const [delivery, setDelivery] = useState<DeliveryId>('standard');
  const [customer, setCustomer] = useState(emptyCustomer);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const totals = calculateTotals(cart, delivery);
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  const changeCustomer = (key: CustomerKey, value: string) =>
    setCustomer((previous) => ({ ...previous, [key]: value }));
  const review = () => {
    const next = validateCustomer(customer);
    setErrors(next);
    const first = customerKeys.find((key) => next[key]);
    if (first) {
      document.getElementById(`checkout-${first}`)?.focus();
      return;
    }
    setStep('review');
  };
  const confirm = () => {
    const snapshot = createConfirmation(cart, customer, delivery, {
      reference: `EV-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    });
    setConfirmation(snapshot);
    clearBag();
    setCustomer(emptyCustomer());
    setErrors({});
  };
  return {
    cart,
    status,
    step,
    setStep,
    delivery,
    setDelivery,
    customer,
    changeCustomer,
    errors,
    review,
    confirm,
    confirmation,
    heading,
    totals,
  };
}
