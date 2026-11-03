import type { MetadataRoute } from 'next';
import { catalog } from '@/domain/catalog';
import { absoluteUrl } from '@/domain/paths';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '',
    'collection/',
    'approach/',
    'size-guide/',
    ...catalog.map((product) => `products/${product.id}/`),
  ].map((path) => ({ url: absoluteUrl(path) }));
}
