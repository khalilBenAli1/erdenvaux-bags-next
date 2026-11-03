import type { Metadata } from 'next';
import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';
import { Icon } from '@/components/ui/Icon';
import { absoluteUrl } from '@/domain/paths';
import styles from './Approach.module.css';
export const metadata: Metadata = {
  title: 'Our approach',
  description:
    'The original ErdenVaux design study: leather, folds, silver-tone details and a precise sense of proportion.',
  alternates: { canonical: absoluteUrl('approach/') },
};
export default function ApproachPage() {
  return (
    <>
      <section className={styles.intro}>
        <div>
          <p className="eyebrow">ErdenVaux / A point of view</p>
          <h1>
            Leather, folds
            <br />
            and clean lines.
          </h1>
          <p>
            A bag changes the way a day is carried. The gesture of a handle, the
            space inside, the line against a coat.
          </p>
          <p>
            ErdenVaux is an imagined leather-goods collection exploring these
            small relationships. Eight fictional forms, developed around
            proportion and texture rather than decoration.
          </p>
          <Link className="text-link" href="/collection/">
            Meet the silhouettes <Icon name="arrow" />
          </Link>
        </div>
        <Photo
          image="campaign-object.webp"
          alt="Pleat 01 in Oxblood, the folded grain-leather concept bag on a dark architectural surface"
          campaign
          eager
          sizes="(max-width:700px) 100vw, 420px"
        />
      </section>
      <section className={styles.principles} aria-label="Design principles">
        {[
          {
            number: '01',
            title: 'Start with the shape.',
            copy: 'A fold, a circle, a vertical line. Each silhouette begins with a clear body proportion, with dimensions that can be compared at the same scale.',
          },
          {
            number: '02',
            title: 'Follow the surface.',
            copy: 'Grain leather, smooth leather and suede create three distinct material directions. Colours and textures follow the actual concept imagery for each selected variant.',
          },
          {
            number: '03',
            title: 'Keep a clear line.',
            copy: 'Silver-tone hardware and a restrained palette give the collection a shared language. The forms do the talking.',
          },
        ].map((item) => (
          <article key={item.number}>
            <span>{item.number}</span>
            <h2>{item.title}</h2>
            <p>{item.copy}</p>
          </article>
        ))}
        <p className={styles.note}>
          ErdenVaux is an original fictional portfolio application created in
          November 2026. Its products, imagery, dimensions, availability and
          prices are illustrative. It does not represent a real workshop,
          manufacturer or trading business.
        </p>
      </section>
    </>
  );
}
