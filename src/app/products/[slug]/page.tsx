import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalog, getProduct } from '@/domain/catalog';
import { absoluteUrl } from '@/domain/paths';
import { ProductDetails } from '@/features/product/ProductDetails';
import { ProductCard } from '@/components/ProductCard';
import { Icon } from '@/components/ui/Icon';
import styles from '@/features/product/Product.module.css';
export const dynamicParams = false;
export function generateStaticParams() {
  return catalog.map((product) => ({ slug: product.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: 'Piece not found' };
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: absoluteUrl(`products/${product.id}/`) },
    openGraph: {
      images: [
        {
          url: absoluteUrl(`images/${product.variants[0]!.image}`),
          width: 1200,
          height: 1500,
          alt: product.name,
        },
      ],
    },
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return (
    <div className="wrap">
      <Link className={styles.breadcrumb} href="/collection/">
        <span aria-hidden="true">←</span> All pieces
      </Link>
      <ProductDetails key={product.id} product={product} />
      <section className={styles.related} aria-labelledby="related-title">
        <div className={styles.relatedHeading}>
          <h2 id="related-title">Another point of view.</h2>
          <Link className={`text-link ${styles.sizeLink}`} href="/collection/">
            All pieces <Icon name="arrow" />
          </Link>
        </div>
        <div className={styles.relatedGrid}>
          {catalog
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
        </div>
      </section>
    </div>
  );
}
