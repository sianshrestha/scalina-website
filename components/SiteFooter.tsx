'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { EMAIL, PHONE, SOCIAL_LINKS } from '@/lib/content';
import styles from './SiteFooter.module.css';
import { FULL_MOTION } from '@/lib/motion';

const STUDIO = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
];

const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
];

/* Two invented phone numbers used to sit above the email. A fake number in a
   footer is the cheapest possible way to look unfinished, and there is no
   version of "+61 3 9000 0000" that is better than no number at all. The real
   number lives in lib/content.ts (PHONE).

   "Start a project" rather than "Request a proposal": the site had three
   names for one destination. */
const CONTACT = [
  { label: EMAIL, href: `mailto:${EMAIL}` },
  { label: PHONE.display, href: `tel:${PHONE.tel}` },
  { label: 'Start a project', href: '/start' },
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
      mm.add(FULL_MOTION, () => {
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
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={styles.columnLink}
                target="_blank"
                rel="noopener noreferrer"
              >
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
