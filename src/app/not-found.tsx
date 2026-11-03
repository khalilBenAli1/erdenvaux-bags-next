import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
export default function NotFound() {
  return (
    <section className="wrap page-heading" style={{ paddingBlock: '70px' }}>
      <p className="eyebrow">404 / A different direction</p>
      <h1>This piece isn’t here.</h1>
      <p>
        The page you’re looking for has slipped out of the edit.
        <br />
        There are other silhouettes to explore.
      </p>
      <Link
        className="text-link"
        href="/collection/"
        style={{ marginTop: '25px' }}
      >
        Return to the collection <Icon name="arrow" />
      </Link>
    </section>
  );
}
