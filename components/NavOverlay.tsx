'use client';

import { useEffect, useRef } from 'react';
import TextRoll from '@/components/vendor/TextRoll';
import { getLenis } from '@/lib/lenis';
import styles from './NavOverlay.module.css';

/* The full-screen menu.

   Replaces the BubblePills overlay, which was a set of rotated pills — a
   different visual language from everything else on the site. This one is
   built from the hero's wordmark: condensed uppercase, outline at rest,
   filling in on hover, so opening the menu reads as the same object as the
   hero rather than a component borrowed from somewhere else.

   Mount is kept while closing so the exit transition can run. */

export type NavItem = { label: string; href: string };

export default function NavOverlay({
  open,
  items,
  onClose,
}: {
  open: boolean;
  items: NavItem[];
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Escape closes; focus moves into the panel so tabbing starts inside it.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
    // The page underneath holds still while the menu is up.
    const lenis = getLenis();
    lenis?.stop();
    return () => {
      window.removeEventListener('keydown', onKey);
      lenis?.start();
    };
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      className={`${styles.overlay} ${open ? styles.open : ''}`}
      /* Closed, it is out of the tab order and the a11y tree entirely — an
         open-looking menu you can tab into invisibly is worse than no menu. */
      {...(open ? {} : { inert: true })}
      aria-hidden={open ? undefined : true}
    >
      <nav className={styles.list} aria-label="Menu">
        {items.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            className={styles.item}
            style={{ transitionDelay: open ? `${120 + index * 55}ms` : '0ms' }}
            onClick={onClose}
          >
            {/* Skiper UI's skiper58 layout: a centred stack of solid uppercase
                items, each one a centre-staggered TextRoll. The index numbers
                and the outlined letterforms are gone with it — its demo is a
                plain list of words and the outline was fighting the roll for
                the same gesture. */}
            <TextRoll center className={styles.itemLabel}>
              {item.label}
            </TextRoll>
          </a>
        ))}
      </nav>

      <div className={styles.foot}>
        <a href="mailto:info@scalinamedia.com" className={styles.footLink}>
          info@scalinamedia.com
        </a>
        <span className={styles.footNote}>Australia. Media and Systems under one roof</span>
      </div>
    </div>
  );
}
