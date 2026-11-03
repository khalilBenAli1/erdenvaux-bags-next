import { products } from '../data/products';
import type {
  Product,
  Variant,
  Selection,
  ResolvedLine,
  BagLine,
} from './types';
export const catalog: readonly Product[] = products;
export const getProduct = (id: string): Product | undefined =>
  catalog.find((product) => product.id === id);
export const getVariant = (
  productId: string,
  variantId: string,
): Variant | undefined =>
  getProduct(productId)?.variants.find((variant) => variant.id === variantId);
export const selectionKey = (selection: Selection) =>
  `${selection.productId}:${selection.variantId}`;
export const sameSelection = (a: Selection, b: Selection) =>
  a.productId === b.productId && a.variantId === b.variantId;
export const productHref = (productId: string, variantId?: string) =>
  `/products/${productId}/${variantId ? `?variant=${encodeURIComponent(variantId)}` : ''}`;
export function resolveLines(
  lines: readonly BagLine[],
): readonly ResolvedLine[] {
  return lines.map((line) => {
    const product = getProduct(line.productId);
    const variant = getVariant(line.productId, line.variantId);
    if (!product || !variant) throw new Error('Unknown selection in bag');
    if (
      !Number.isSafeInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > variant.stock
    )
      throw new Error('Invalid quantity in bag');
    return {
      key: selectionKey(line),
      product,
      variant,
      quantity: line.quantity,
      lineTotalCents: product.priceCents * line.quantity,
    };
  });
}
export const formatMoney = (cents: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
export const slug = (value: string) => value.toLowerCase().replaceAll(' ', '-');
