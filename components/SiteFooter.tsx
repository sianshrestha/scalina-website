'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import styles from './SiteFooter.module.css';

const STUDIO = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
];

const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Preferences', href: '/cookies' },
];

/* Two invented phone numbers used to sit above the email. A fake number in a
   footer is the cheapest possible way to look unfinished, and there is no
   version of "+61 3 9000 0000" that is better than no number at all. Add the
   real ones here when they exist.

   "Start a project" rather than "Request a proposal": the site had three
   names for one destination. */
const CONTACT = [
  { label: 'info@scalinamedia.com', href: 'mailto:info@scalinamedia.com' },
  /* PLACEHOLDER. 0491 570 156 is from the range ACMA reserves for fiction, so
     it can never ring a real person. Swap for the real business number. */
  { label: '0491 570 156', href: 'tel:+61491570156' },
  { label: 'Start a project', href: '/start' },
];

const SOCIAL = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'Facebook', href: '#' },
];

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className={styles.column}>
      <span className={styles.columnTitle}>{title}</span>
      {links.map((link) => (
        <a key={link.label} href={link.href} className={styles.columnLink}>
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default function SiteFooter() {
  const scope = useRef<HTMLElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const wordmark = wordmarkRef.current;
        if (!wordmark) return;
        gsap.fromTo(
          wordmark,
          { xPercent: 8, opacity: 0.25 },
          {
            xPercent: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: wordmark,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: true,
            },
          }
        );
      });

      // gsap.matchMedia() owns its own context; revert it or its
      // ScrollTriggers outlive this run.
      return () => mm.revert();
    },
    { scope, dependencies: [] }
  );

  return (
    <footer ref={scope} className={styles.footer} data-ground="dark">
      <div className={styles.inner}>
        <div className={styles.columns}>
          <p className={styles.blurb}>
            Scalina builds the content, the campaigns and the system your business runs on. One team
            for the work that brings people in and the work that keeps them.
          </p>
          <Column title="Studio" links={STUDIO} />
          <Column title="Legal" links={LEGAL} />
          <Column title="Business Enquiries" links={CONTACT} />
        </div>

        <div className={styles.social}>
          <div className={styles.socialList}>
            {SOCIAL.map((item) => (
              <a key={item.label} href={item.href} className={styles.columnLink}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.wordmarkWrap}>
        <div ref={wordmarkRef} className={styles.wordmark} aria-hidden="true">
          Scalina
        </div>
        <div className={styles.copyright}>Scalina © 2026</div>
      </div>
    </footer>
  );
}
