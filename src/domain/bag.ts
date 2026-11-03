import type { BagLine, Selection } from './types';
import { getVariant, sameSelection } from './catalog';
export type BagResult =
  | { readonly ok: true; readonly cart: readonly BagLine[] }
  | {
      readonly ok: false;
      readonly reason:
        'unknown' | 'unavailable' | 'quantity' | 'stock' | 'missing';
    };
export function addToBag(
  cart: readonly BagLine[],
  selection: Selection,
  quantity: number,
): BagResult {
  const variant = getVariant(selection.productId, selection.variantId);
  if (!variant) return { ok: false, reason: 'unknown' };
  if (variant.stock === 0) return { ok: false, reason: 'unavailable' };
  if (!Number.isSafeInteger(quantity) || quantity < 1)
    return { ok: false, reason: 'quantity' };
  const existing = cart.find((line) => sameSelection(line, selection));
  const next = (existing?.quantity ?? 0) + quantity;
  if (next > variant.stock) return { ok: false, reason: 'stock' };
  return {
    ok: true,
    cart: existing
      ? cart.map((line) =>
          sameSelection(line, selection) ? { ...line, quantity: next } : line,
        )
      : [...cart, { ...selection, quantity }],
  };
}
export function changeQuantity(
  cart: readonly BagLine[],
  selection: Selection,
  quantity: number,
): BagResult {
  if (!cart.some((line) => sameSelection(line, selection)))
    return { ok: false, reason: 'missing' };
  const variant = getVariant(selection.productId, selection.variantId);
  if (!variant) return { ok: false, reason: 'unknown' };
  if (!Number.isSafeInteger(quantity) || quantity < 1)
    return { ok: false, reason: 'quantity' };
  if (quantity > variant.stock) return { ok: false, reason: 'stock' };
  return {
    ok: true,
    cart: cart.map((line) =>
      sameSelection(line, selection) ? { ...line, quantity } : line,
    ),
  };
}
export const removeFromBag = (cart: readonly BagLine[], selection: Selection) =>
  cart.filter((line) => !sameSelection(line, selection));
export function toggleSaved(
  wishlist: readonly Selection[],
  selection: Selection,
): readonly Selection[] {
  if (!getVariant(selection.productId, selection.variantId)) return wishlist;
  return wishlist.some((item) => sameSelection(item, selection))
    ? wishlist.filter((item) => !sameSelection(item, selection))
    : [...wishlist, { ...selection }];
}
