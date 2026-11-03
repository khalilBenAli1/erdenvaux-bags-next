'use client';
import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useCommerce } from '@/state/CommerceProvider';
import { Dialog } from './ui/Dialog';
import { Icon } from './ui/Icon';
import { BagDrawer } from '@/features/bag/BagDrawer';
import styles from './SiteShell.module.css';
export function SiteShell({ children }: { children: ReactNode }) {
  const [bagOpen, setBagOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cart = useCommerce((state) => state.cart);
  const wishlist = useCommerce((state) => state.wishlist);
  const status = useCommerce((state) => state.status);
  const reset = useCommerce((state) => state.reset);
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={styles.header}>
        <Link className={styles.logo} href="/" aria-label="Erden Vaux home">
          ERDEN VAUX
        </Link>
        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/collection/">Collection</Link>
          <Link href="/approach/">Our approach</Link>
          <Link href="/size-guide/">Size guide</Link>
        </nav>
        <div className={styles.actions}>
          <Link className={styles.savedLink} href="/wishlist/">
            Saved ({wishlist.length})
          </Link>
          <button
            className={styles.bagButton}
            type="button"
            onClick={(event) => {
              event.currentTarget.focus();
              setBagOpen(true);
            }}
            aria-label={`Open bag, ${count} pieces`}
          >
            <Icon name="bag" />
            Bag ({count})
          </button>
          <button
            className={styles.mobileMenu}
            type="button"
            aria-label="Open menu"
            onClick={(event) => {
              event.currentTarget.focus();
              setMenuOpen(true);
            }}
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>
      {status === 'recovered' && (
        <p className={styles.notice} role="status">
          Your saved selection could not be read. A fresh bag is ready.
        </p>
      )}
      {status === 'unavailable' && (
        <p className={styles.notice} role="status">
          Your selections are available for this visit. Saving on this device is
          unavailable.
        </p>
      )}
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div>
            <Link className={styles.footerLogo} href="/">
              Erden Vaux
            </Link>
            <p className={styles.footerTag}>
              Considered forms.
              <br />
              Objects worth carrying.
            </p>
          </div>
          <nav className={styles.footerNav} aria-label="Footer navigation">
            <Link href="/collection/">The collection</Link>
            <Link href="/approach/">Our approach</Link>
            <Link href="/size-guide/">Compare sizes</Link>
            <Link href="/wishlist/">Saved pieces ({wishlist.length})</Link>
            <Link href="/bag/">Your bag ({count})</Link>
            <Link href="/checkout/">Demo checkout</Link>
          </nav>
        </div>
        <div className={styles.footerBottom}>
          <p>
            © 2026 ErdenVaux. An original fictional brand.
            <br />
            Illustrative products and prices. No real purchase is made.
          </p>
          <button className={styles.reset} type="button" onClick={reset}>
            Reset demo selections
          </button>
          <p>Collection 01 / Leather objects</p>
        </div>
      </footer>
      <BagDrawer open={bagOpen} onClose={() => setBagOpen(false)} />
      <Dialog
        open={menuOpen}
        onRequestClose={() => setMenuOpen(false)}
        labelId="menu-title"
        kind="drawer"
      >
        <div className={styles.dialogHeader}>
          <h2 id="menu-title" className={styles.menuHeading}>
            Erden Vaux
          </h2>
          <button
            className={styles.close}
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>
        <nav className={styles.mobileLinks} aria-label="Mobile navigation">
          {[
            ['/collection/', 'Collection'],
            ['/approach/', 'Our approach'],
            ['/size-guide/', 'Size guide'],
            ['/wishlist/', 'Saved pieces'],
          ].map(([href, label]) => (
            <Link key={href} href={href!} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
        <p className={styles.mobileNote}>
          Objects worth carrying.
          <br />
          Collection 01 / 2026
        </p>
      </Dialog>
    </>
  );
}
