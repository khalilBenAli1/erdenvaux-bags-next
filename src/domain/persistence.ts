import type { SavedSelections, Selection, BagLine } from './types';
import { getVariant, selectionKey } from './catalog';
export const STORAGE_KEY = 'erdenvaux-selections-v1';
export const emptySelections = (): SavedSelections => ({
  cart: [],
  wishlist: [],
});
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const onlyKeys = (value: Record<string, unknown>, keys: readonly string[]) =>
  Object.keys(value).length === keys.length &&
  Object.keys(value).every((key) => keys.includes(key));
function selection(value: unknown): value is Selection {
  return (
    record(value) &&
    typeof value.productId === 'string' &&
    typeof value.variantId === 'string' &&
    getVariant(value.productId, value.variantId) !== undefined
  );
}
function validWish(value: unknown): value is Selection {
  return (
    selection(value) &&
    record(value) &&
    onlyKeys(value, ['productId', 'variantId'])
  );
}
function validLine(value: unknown): value is BagLine {
  if (
    !selection(value) ||
    !record(value) ||
    !onlyKeys(value, ['productId', 'variantId', 'quantity'])
  )
    return false;
  const variant = getVariant(value.productId, value.variantId);
  return (
    typeof value.quantity === 'number' &&
    Number.isSafeInteger(value.quantity) &&
    value.quantity >= 1 &&
    value.quantity <= (variant?.stock ?? 0)
  );
}
export function decodeSaved(raw: string): SavedSelections | null {
  if (raw.length > 20_000) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (
    !record(value) ||
    !onlyKeys(value, ['version', 'cart', 'wishlist']) ||
    value.version !== 1 ||
    !Array.isArray(value.cart) ||
    !Array.isArray(value.wishlist) ||
    value.cart.length > 10 ||
    value.wishlist.length > 10
  )
    return null;
  const cart: unknown[] = value.cart;
  const wishlist: unknown[] = value.wishlist;
  if (!cart.every(validLine) || !wishlist.every(validWish)) return null;
  if (
    new Set(cart.map(selectionKey)).size !== cart.length ||
    new Set(wishlist.map(selectionKey)).size !== wishlist.length
  )
    return null;
  return {
    cart: cart.map((line) => ({ ...line })),
    wishlist: wishlist.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
    })),
  };
}
export const encodeSaved = (data: SavedSelections) =>
  JSON.stringify({
    version: 1,
    cart: data.cart.map(({ productId, variantId, quantity }) => ({
      productId,
      variantId,
      quantity,
    })),
    wishlist: data.wishlist.map(({ productId, variantId }) => ({
      productId,
      variantId,
    })),
  });
