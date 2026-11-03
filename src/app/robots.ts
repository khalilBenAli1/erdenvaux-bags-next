import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/domain/paths';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [],
      disallow: [
        '/erdenvaux-bags-next/checkout/',
        '/erdenvaux-bags-next/bag/',
        '/erdenvaux-bags-next/wishlist/',
      ],
    },
    sitemap: absoluteUrl('sitemap.xml'),
  };
}
