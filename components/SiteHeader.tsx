'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import NavOverlay, { type NavItem } from '@/components/NavOverlay';
import TextRoll from '@/components/vendor/TextRoll';
import styles from './SiteHeader.module.css';

/* "Start a project" is a nav link like the rest — it used to be a filled
   yellow pill, which made it the loudest thing on every screen of the site. */
const NAV: NavItem[] = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Start a project', href: '/start' },
];

/* The collapsed button names the page you are on, so the header still tells
   you where you are once the nav has folded away. Anything not listed falls
   back to its first path segment. */
function pageName(pathname: string, nav: NavItem[]): string {
  if (pathname === '/') return 'Home';
  const match = nav.find((item) => item.href === pathname);
  if (match) return match.label;
  const segment = pathname.split('/').filter(Boolean)[0] ?? 'Menu';
  return segment.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

/* Below this the full nav is always shown, whichever way you are moving. */
const REVEAL_ZONE = 0.8; // of one viewport
/* Ignore sub-pixel and rubber-band jitter. */
const DELTA = 6;

export default function SiteHeader() {
  /* Condensed = the nav has handed over to the single menu button.
     The nav collapses on the way down and comes back on the way up, so
     scrolling back toward the top restores the whole bar before you get
     there — it does not wait for the top of the page. */
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const evaluate = () => {
      frame = 0;
      const y = window.scrollY;
      const zone = window.innerHeight * REVEAL_ZONE;

      if (y <= zone) {
        setCondensed(false);
      } else if (y > last + DELTA) {
        setCondensed(true);
      } else if (y < last - DELTA) {
        setCondensed(false);
      }
      last = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(evaluate);
    };

    evaluate();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Lock the page behind the overlay while it is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {/* While the menu is open the header sits on the overlay's own ground —
          always dark — rather than on the page's current one. */}
      {/* `data-site-chrome` opts the bar into the hero's intro timeline — on a
          page with a hero it starts hidden and is brought up during the
          reveal. See Hero.tsx and the rule in globals.css. */}

      <header
        className={styles.header}
        data-site-chrome=""
        data-menu-open={menuOpen ? 'true' : undefined}
      >
        {/* Home, not `#top`: on any page but the homepage an in-page anchor
            just scrolled you to the top of the page you were already on. */}
        {/* Mark and wordmark are separate links because they sit in different
            places: the mark holds the left edge, the wordmark is centred on the
            page. Both go home — an in-page `#top` only worked on the homepage. */}
        <Link href="/" aria-label="Scalina home" className={styles.mark} onClick={closeMenu}>
          {/* Measured off the master artwork rather than approximated: the two
              bars are deliberately UNEQUAL (114 and 147 wide) and the wedge is
              taller than both. That progression is what makes the mark read as
              scaling up — equal bars flatten it into a plain play icon. */}
          <svg width="26" height="26" viewBox="0 0 556 565" aria-hidden="true" className={styles.brandMark}>
            <path d="M0 18h114v514H0z" fill="currentColor" />
            <path d="M184 18h147v514H184z" fill="currentColor" />
            <path d="M381 121 556 0v565L381 433z" fill="currentColor" />
          </svg>
        </Link>

        <Link href="/" className={styles.brand} onClick={closeMenu}>
          <span className={styles.brandName}>Scalina</span>
        </Link>

        <nav
          className={`${styles.nav} ${condensed || menuOpen ? styles.navHidden : ''}`}
          aria-label="Primary"
          {...(condensed || menuOpen ? { inert: true } : {})}
        >
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {/* Skiper UI's TextRoll (skiper58). Its own demo is a nav list,
                  which is exactly this. The incoming copy is --accent-fg, so a
                  nav item rolls up into brand colour — lime over the dark hero,
                  cobalt over the light sections, decided by the ground token. */}
              <TextRoll center>{item.label}</TextRoll>
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className={`${styles.pill} ${condensed || menuOpen ? styles.pillVisible : ''}`}
        >
          <span>{menuOpen ? 'Close' : pageName(pathname, NAV)}</span>
        </button>
      </header>

      <NavOverlay open={menuOpen} items={NAV} onClose={closeMenu} />
    </>
  );
}
