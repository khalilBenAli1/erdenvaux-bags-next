import { describe, expect, it } from 'vitest';
import {
  addToBag,
  changeQuantity,
  removeFromBag,
  toggleSaved,
} from '../src/domain/bag';
import { calculateTotals } from '../src/domain/pricing';
import { createCommerceStore } from '../src/state/commerce-store';
const ink = { productId: 'pleat-01', variantId: 'ink-grain' };
const oxblood = { productId: 'pleat-01', variantId: 'oxblood-grain' };
describe('variant-aware bag rules', () => {
  it('merges identical selections while preserving distinct variants without mutating input', () => {
    const first = addToBag([], ink, 1);
    expect(first.ok).toBe(true);
    if (!first.ok) throw new Error('Expected valid fixture');
    const input = Object.freeze(first.cart.map((line) => Object.freeze(line)));
    const merged = addToBag(input, ink, 1);
    if (!merged.ok) throw new Error('Expected merge');
    expect(merged.cart).toEqual([{ ...ink, quantity: 2 }]);
    expect(input).toEqual([{ ...ink, quantity: 1 }]);
    const separate = addToBag(merged.cart, oxblood, 1);
    if (!separate.ok) throw new Error('Expected distinct variant');
    expect(separate.cart).toHaveLength(2);
    expect(calculateTotals(separate.cart, 'express')).toEqual({
      subtotalCents: 207000,
      deliveryCents: 1800,
      totalCents: 208800,
      itemCount: 3,
    });
  });
  it.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER])(
    'rejects invalid or overstock quantity %s',
    (quantity) => expect(addToBag([], ink, quantity).ok).toBe(false),
  );
  it('enforces stock across repeated additions and quantity updates', () => {
    const cart = [{ ...ink, quantity: 4 }];
    expect(addToBag(cart, ink, 1)).toEqual({ ok: false, reason: 'stock' });
    expect(changeQuantity(cart, ink, 5)).toEqual({
      ok: false,
      reason: 'stock',
    });
    expect(changeQuantity(cart, ink, 2)).toEqual({
      ok: true,
      cart: [{ ...ink, quantity: 2 }],
    });
    expect(removeFromBag(cart, ink)).toEqual([]);
  });
  it('rejects unknown selections and an unavailable variant', () => {
    expect(addToBag([], { ...ink, productId: 'not-a-bag' }, 1).ok).toBe(false);
    expect(addToBag([], { ...ink, variantId: 'missing' }, 1).ok).toBe(false);
    expect(
      addToBag(
        [],
        { productId: 'meridian-02', variantId: 'espresso-suede' },
        1,
      ),
    ).toEqual({ ok: false, reason: 'unavailable' });
  });
  it('keeps an unavailable variant saveable without adding it to the bag', () => {
    const selection = { productId: 'meridian-02', variantId: 'espresso-suede' };
    expect(toggleSaved([], selection)).toEqual([selection]);
    expect(toggleSaved([selection], selection)).toEqual([]);
  });
  it('derives totals for delivery options and does not charge delivery on an empty bag', () => {
    const cart = [
      { ...ink, quantity: 2 },
      { productId: 'meridian-02', variantId: 'oxblood-smooth', quantity: 1 },
    ];
    expect(calculateTotals(cart, 'standard').totalCents).toBe(192800);
    expect(calculateTotals(cart, 'express').totalCents).toBe(193800);
    expect(calculateTotals([], 'express')).toEqual({
      subtotalCents: 0,
      deliveryCents: 0,
      totalCents: 0,
      itemCount: 0,
    });
  });
  it('isolates independently created stores and preserves wishlist when clearing the bag', () => {
    const a = createCommerceStore();
    const b = createCommerceStore();
    a.getState().add(ink, 2);
    a.getState().toggleWishlist(oxblood);
    expect(b.getState().cart).toEqual([]);
    expect(b.getState().wishlist).toEqual([]);
    a.getState().clearBag();
    expect(a.getState().cart).toEqual([]);
    expect(a.getState().wishlist).toEqual([oxblood]);
    a.getState().reset();
    expect(a.getState().wishlist).toEqual([]);
  });
});
