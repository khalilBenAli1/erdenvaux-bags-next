import { catalog, slug } from './catalog';
import type { Product } from './types';
export interface CatalogFilters {
  silhouette: string;
  material: string;
  color: string;
  price: number | null;
  sort: 'featured' | 'price-asc' | 'price-desc' | 'name';
}
export const filterOptions = {
  silhouettes: [...new Set(catalog.map((p) => p.category))],
  materials: [
    ...new Set(catalog.flatMap((p) => p.variants.map((v) => v.material))),
  ],
  colors: [...new Set(catalog.flatMap((p) => p.variants.map((v) => v.color)))],
};
export function parseFilters(search: string): CatalogFilters {
  const p = new URLSearchParams(search);
  const allowed = (key: string, values: readonly string[]) => {
    const value = p.get(key) ?? 'all';
    return value === 'all' || values.some((v) => slug(v) === value)
      ? value
      : 'all';
  };
  const price = p.get('price');
  const sort = p.get('sort');
  return {
    silhouette: allowed('silhouette', filterOptions.silhouettes),
    material: allowed('material', filterOptions.materials),
    color: allowed('color', filterOptions.colors),
    price: ['500', '700', '1000'].includes(price ?? '') ? Number(price) : null,
    sort:
      sort === 'price-asc' || sort === 'price-desc' || sort === 'name'
        ? sort
        : 'featured',
  };
}
export function filterProducts(filters: CatalogFilters): readonly Product[] {
  const selected = catalog.filter(
    (p) =>
      (filters.silhouette === 'all' ||
        slug(p.category) === filters.silhouette) &&
      (filters.price === null || p.priceCents <= filters.price * 100) &&
      p.variants.some(
        (v) =>
          (filters.material === 'all' ||
            slug(v.material) === filters.material) &&
          (filters.color === 'all' || slug(v.color) === filters.color),
      ),
  );
  if (filters.sort === 'price-asc')
    selected.sort((a, b) => a.priceCents - b.priceCents);
  if (filters.sort === 'price-desc')
    selected.sort((a, b) => b.priceCents - a.priceCents);
  if (filters.sort === 'name')
    selected.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  return selected;
}
