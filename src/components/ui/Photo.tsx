import Image from 'next/image';
import { asset } from '@/domain/paths';
interface Props {
  image: string;
  alt: string;
  campaign?: boolean;
  eager?: boolean;
  sizes?: string;
  className?: string;
}
export function Photo({
  image,
  alt,
  campaign = false,
  eager = false,
  sizes = '(max-width:700px) 100vw, 50vw',
  className,
}: Props) {
  const src = asset(`images/${image}`);
  const small = asset(`images/${image.replace('.webp', '-small.webp')}`);
  return (
    <picture className={className}>
      <source srcSet={`${small} 640w, ${src} 1200w`} sizes={sizes} />
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={campaign ? 1800 : 1500}
        unoptimized
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
      />
    </picture>
  );
}
