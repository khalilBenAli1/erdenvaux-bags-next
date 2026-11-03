'use client';
import { useState } from 'react';
import type { Product, Variant } from '@/domain/types';
import { Photo } from '@/components/ui/Photo';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import styles from './Product.module.css';
export function ProductGallery({
  product,
  variant,
}: {
  product: Product;
  variant: Variant;
}) {
  const [open, setOpen] = useState(false);
  const [frame, setFrame] = useState(0);
  const move = (delta: number) =>
    setFrame((current) => (current + delta + 2) % 2);
  const caption =
    frame === 0
      ? `${product.name} / ${variant.color} — Studio portrait`
      : `${variant.material} detail — crop of the same studio photograph`;
  const alt = `${product.name} in ${variant.color.toLowerCase()} ${variant.material.toLowerCase()} with silver-tone fittings`;
  return (
    <>
      <div>
        <button
          className={`${styles.galleryImage} ${frame === 1 ? styles.detail : ''}`}
          type="button"
          onClick={(event) => {
            event.currentTarget.focus();
            setOpen(true);
          }}
          aria-label={`Enlarge ${product.name} in ${variant.color}`}
        >
          <Photo
            image={variant.image}
            alt={alt}
            eager
            sizes="(max-width:700px) 100vw, 55vw"
          />
          <span className={styles.enlarge}>
            <Icon name="plus" />
          </span>
        </button>
        <div className={styles.imageControls}>
          <button
            type="button"
            aria-pressed={frame === 0}
            onClick={() => setFrame(0)}
          >
            01 / Studio portrait
          </button>
          <button
            type="button"
            aria-pressed={frame === 1}
            onClick={() => setFrame(1)}
          >
            02 / Material detail
          </button>
        </div>
        <p className={styles.imageNote}>
          Original concept image. Material details are crops of the same
          photograph.
        </p>
      </div>
      <Dialog
        open={open}
        onRequestClose={() => setOpen(false)}
        labelId="product-gallery-title"
        kind="gallery"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            move(1);
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        <div className={styles.galleryHeader}>
          <h2 id="product-gallery-title">
            {product.name} / {variant.color}
          </h2>
          <button
            className={styles.close}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close image gallery"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className={styles.galleryStage}>
          <Photo
            className={`${styles.galleryPhoto} ${frame === 1 ? styles.detail : ''}`}
            image={variant.image}
            alt={caption}
            eager
            sizes="100vw"
          />
        </div>
        <div className={styles.galleryFooter}>
          <p>{caption}</p>
          <div className={styles.arrows}>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => move(-1)}
            >
              <Icon name="arrow" />
            </button>
            <span aria-live="polite">{frame + 1} / 2</span>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => move(1)}
            >
              <Icon name="arrow" />
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
