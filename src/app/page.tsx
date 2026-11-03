import type { Metadata } from 'next';
import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';
import { Icon } from '@/components/ui/Icon';
import { ProductCard } from '@/components/ProductCard';
import { catalog } from '@/domain/catalog';
import { absoluteUrl } from '@/domain/paths';
import styles from './Home.module.css';
export const metadata: Metadata = { alternates: { canonical: absoluteUrl() } };
export default function Home() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="campaign-title">
        <div className={styles.intro}>
          <p className="eyebrow">Collection 01 / Leather objects</p>
          <p>
            Familiar forms.
            <br />A new perspective.
          </p>
        </div>
        <div className={styles.pair}>
          <div>
            <Link
              className={styles.fashion}
              href="/products/pleat-01/"
              aria-label="Discover Pleat 01 in Ink"
            >
              <Photo
                image="campaign-fashion.webp"
                alt="An adult model in an ivory coat carrying the sculptural Ink Pleat 01 bag with silver-tone handle fittings"
                campaign
                eager
                sizes="(max-width:700px) 54vw, 530px"
              />
            </Link>
            <div className={styles.fashionCaption}>
              <span>Pleat 01 / Ink</span>
              <span>Collection 01 · 2026</span>
            </div>
          </div>
          <div className={styles.secondary}>
            <h1 id="campaign-title">
              Form,
              <br />
              in motion.
            </h1>
            <Link
              href="/products/pleat-01/?variant=oxblood-grain"
              aria-label="Explore Pleat 01 in Oxblood"
            >
              <Photo
                image="campaign-object.webp"
                alt="The folded Oxblood Pleat 01 bag on a dark architectural surface"
                campaign
                eager
                sizes="(max-width:700px) 42vw, 420px"
              />
            </Link>
            <p>
              Sculptural lines. Tactile surfaces.
              <br />A collection made for your everyday.
            </p>
            <Link
              href="/collection/"
              className={`text-link ${styles.textLink}`}
            >
              Explore the collection <Icon name="arrow" />
            </Link>
          </div>
        </div>
        <div className={styles.bridge}>
          <p>
            Considered objects.
            <br />
            Room for your own rhythm.
          </p>
          <p>
            Eight silhouettes.
            <br />
            One distinctive point of view.
          </p>
        </div>
      </section>
      <section className={`wrap ${styles.edit}`} aria-labelledby="edit-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className="eyebrow">The considered edit</p>
            <h2 id="edit-title">Forms for the everyday.</h2>
          </div>
          <Link className={`text-link ${styles.textLink}`} href="/collection/">
            View all pieces <Icon name="arrow" />
          </Link>
        </div>
        <div className={styles.products}>
          {catalog
            .filter((p) =>
              ['pleat-01', 'meridian-02', 'vessel-04', 'fold-05'].includes(
                p.id,
              ),
            )
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
      <section className={styles.materials} aria-labelledby="materials-title">
        <p className="eyebrow">A material point of view</p>
        <div>
          <h2 id="materials-title">
            Texture is part
            <br />
            of the story.
          </h2>
          <p>
            From the soft structure of grain leather to a smooth, architectural
            line. Three tactile surfaces give these imagined objects their own
            character.
          </p>
          <ul>
            <li>
              <Link href="/collection/?material=grain-leather">
                <span>01 / Grain leather</span>
                <span>Texture &amp; quiet structure ↗</span>
              </Link>
            </li>
            <li>
              <Link href="/collection/?material=smooth-leather">
                <span>02 / Smooth leather</span>
                <span>Clean lines &amp; subtle sheen ↗</span>
              </Link>
            </li>
            <li>
              <Link href="/collection/?material=suede">
                <span>03 / Suede</span>
                <span>A softer perspective ↗</span>
              </Link>
            </li>
          </ul>
          <Link className="text-link" href="/approach/">
            Our approach <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </>
  );
}
