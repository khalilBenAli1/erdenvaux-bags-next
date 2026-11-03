import type { BagLine } from './types';
import { resolveLines } from './catalog';
export const deliveryOptions = [
  {
    id: 'standard',
    label: 'Standard delivery',
    description: '3–5 business days',
    priceCents: 800,
  },
  {
    id: 'express',
    label: 'Express delivery',
    description: '1–2 business days',
    priceCents: 1800,
  },
] as const;
export type DeliveryId = (typeof deliveryOptions)[number]['id'];
export const getDelivery = (id: DeliveryId) =>
  deliveryOptions.find((option) => option.id === id)!;
export function calculateTotals(
  cart: readonly BagLine[],
  deliveryId: DeliveryId,
) {
  const lines = resolveLines(cart);
  const subtotalCents = lines.reduce(
    (sum, line) => sum + line.lineTotalCents,
    0,
  );
  const deliveryCents = cart.length ? getDelivery(deliveryId).priceCents : 0;
  return {
    subtotalCents,
    deliveryCents,
    totalCents: subtotalCents + deliveryCents,
    itemCount: cart.reduce((sum, line) => sum + line.quantity, 0),
  };
}
