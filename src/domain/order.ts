import type { BagLine } from './types';
import type { Customer } from './customer';
import { validateCustomer, normalizeCustomer } from './customer';
import { resolveLines } from './catalog';
import { calculateTotals, getDelivery, type DeliveryId } from './pricing';
export function createConfirmation(
  cart: readonly BagLine[],
  customer: Customer,
  deliveryId: DeliveryId,
  metadata: { reference: string; createdAt: string },
) {
  if (!cart.length) throw new Error('A confirmation requires a nonempty bag');
  if (Object.keys(validateCustomer(customer)).length)
    throw new Error('A confirmation requires valid customer details');
  if (
    !/^EV-DEMO-[A-Z0-9]{8}$/.test(metadata.reference) ||
    Number.isNaN(Date.parse(metadata.createdAt))
  )
    throw new Error('Invalid confirmation metadata');
  const lines = Object.freeze(
    resolveLines(cart).map((line) =>
      Object.freeze({
        productId: line.product.id,
        variantId: line.variant.id,
        name: line.product.name,
        color: line.variant.color,
        material: line.variant.material,
        image: line.variant.image,
        quantity: line.quantity,
        unitPriceCents: line.product.priceCents,
        lineTotalCents: line.lineTotalCents,
      }),
    ),
  );
  return Object.freeze({
    reference: metadata.reference,
    createdAt: metadata.createdAt,
    customer: Object.freeze(normalizeCustomer(customer)),
    delivery: Object.freeze({ ...getDelivery(deliveryId) }),
    totals: Object.freeze(calculateTotals(cart, deliveryId)),
    lines,
  });
}
export type Confirmation = ReturnType<typeof createConfirmation>;
