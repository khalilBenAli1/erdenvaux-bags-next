export type Silhouette =
  | 'Top handle'
  | 'Shoulder'
  | 'Satchel'
  | 'Bucket'
  | 'Clutch'
  | 'Weekender'
  | 'Crossbody'
  | 'Tote';
export interface Variant {
  readonly id: string;
  readonly color: string;
  readonly hex: string;
  readonly material: string;
  readonly image: string;
  readonly stock: number;
}
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly silhouette: string;
  readonly category: Silhouette;
  readonly widthCm: number;
  readonly heightCm: number;
  readonly depthCm: number;
  readonly priceCents: number;
  readonly description: string;
  readonly details: readonly string[];
  readonly variants: readonly Variant[];
}
export interface Selection {
  readonly productId: string;
  readonly variantId: string;
}
export interface BagLine extends Selection {
  readonly quantity: number;
}
export interface SavedSelections {
  readonly cart: readonly BagLine[];
  readonly wishlist: readonly Selection[];
}
export type PersistenceStatus =
  'loading' | 'ready' | 'restored' | 'recovered' | 'unavailable';
export interface ResolvedLine {
  readonly key: string;
  readonly product: Product;
  readonly variant: Variant;
  readonly quantity: number;
  readonly lineTotalCents: number;
}
