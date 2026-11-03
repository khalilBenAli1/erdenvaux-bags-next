'use client';
import { useState, useId } from 'react';
import Link from 'next/link';
import { catalog, getProduct, productHref } from '@/domain/catalog';
import { useUrlSearch } from '@/hooks/use-url-state';
import { Icon } from '@/components/ui/Icon';
import { BagDrawing } from './BagDrawing';
import styles from './SizeComparison.module.css';
export function SizeComparison() {
  const query = new URLSearchParams(useUrlSearch());
  const initial = getProduct(query.get('first') ?? '')?.id ?? 'pleat-01';
  const [first, setFirst] = useState<string | null>(null);
  const [second, setSecond] = useState('passage-06');
  const a = getProduct(first ?? initial) ?? catalog[0]!;
  const b = getProduct(second) ?? catalog[5]!;
  const id = useId();
  return (
    <div className={styles.layout}>
      <div className={styles.selectors}>
        <div className={styles.selector}>
          <label htmlFor="compare-first">First silhouette</label>
          <select
            id="compare-first"
            value={a.id}
            onChange={(event) => setFirst(event.currentTarget.value)}
          >
            {catalog.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} / {product.category}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.selector}>
          <label htmlFor="compare-second">Second silhouette</label>
          <select
            id="compare-second"
            value={b.id}
            onChange={(event) => setSecond(event.currentTarget.value)}
          >
            {catalog.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} / {product.category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <figure className={styles.figure}>
        <svg
          viewBox="0 0 620 310"
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
        >
          <title
            id={`${id}-title`}
          >{`${a.name} and ${b.name} at a shared centimeter scale`}</title>
          <desc
            id={`${id}-desc`}
          >{`${a.name} body: ${a.widthCm} centimeters wide and ${a.heightCm} centimeters high. ${b.name} body: ${b.widthCm} centimeters wide and ${b.heightCm} centimeters high. Body height excludes handles.`}</desc>
          <path d="M30 230H600" stroke="var(--line)" strokeWidth="1" />
          <BagDrawing product={a} x={65} />
          <BagDrawing product={b} x={365} />
          <path
            d="M280 286v7h50v-7"
            fill="none"
            stroke="var(--muted)"
            strokeWidth=".8"
          />
          <text
            x="305"
            y="308"
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="10"
          >
            10 cm
          </text>
        </svg>
        <figcaption className={styles.legend}>
          Shared scale using sample body dimensions; handles excluded.
        </figcaption>
      </figure>
      <div className={styles.details}>
        {[a, b].map((product, index) => (
          <article className={styles.detail} key={`${product.id}-${index}`}>
            <p className="eyebrow">
              {index === 0 ? 'First' : 'Second'} silhouette
            </p>
            <h2>{product.name}</h2>
            <p>
              {product.widthCm} × {product.heightCm} × {product.depthCm} cm
              <br />
              Width × height × depth
            </p>
            <p>{product.silhouette}</p>
            <Link className="text-link" href={productHref(product.id)}>
              Explore {product.name} <Icon name="arrow" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
