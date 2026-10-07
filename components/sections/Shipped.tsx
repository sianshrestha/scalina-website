'use client';

import Image from 'next/image';
import Link from 'next/link';
import Magnetic from '@/components/Magnetic';
import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import styles from './Shipped.module.css';

/* Software Scalina has actually shipped — real screens, real clients. Each
   panel is the running interface photographed against sample data (never the
   client's own records) and opens that client's case study. */
const PROJECTS = [
  {
    name: 'Warehouse Management System',
    client: 'OZI Hygiene & Packaging',
    initials: 'OZ',
    href: '/work/ozi-hp',
    shot: { src: '/work/ozi-hp/wms-dashboard.webp', w: 1800, h: 1250 },
    glow: 'radial-gradient(70% 70% at 70% 20%, rgba(30,69,251,0.55) 0%, rgba(30,69,251,0) 70%)',
  },
  {
    name: 'Customer Portal',
    client: 'OZI Hygiene & Packaging',
    initials: 'OZ',
    href: '/work/ozi-hp',
    shot: { src: '/work/ozi-hp/portal-order.webp', w: 1800, h: 1125 },
    glow: 'radial-gradient(70% 70% at 30% 30%, rgba(30,69,251,0.5) 0%, rgba(30,69,251,0) 70%)',
  },
  {
    name: 'Website',
    client: 'OZI Hygiene & Packaging',
    initials: 'OZ',
    href: '/work/ozi-hp',
    shot: { src: '/work/ozi-hp/site-hero.webp', w: 1800, h: 1125 },
    glow: 'radial-gradient(70% 70% at 55% 70%, rgba(205,242,43,0.28) 0%, rgba(205,242,43,0) 70%)',
  },
  {
    name: 'Invoicing Software',
    client: 'Gurkha Jewellery',
    initials: 'GJ',
    href: '/work/gurkha-jewellery',
    shot: { src: '/work/gurkha-jewellery/invoice.webp', w: 1800, h: 1033 },
    glow: 'radial-gradient(70% 70% at 35% 60%, rgba(30,69,251,0.5) 0%, rgba(30,69,251,0) 70%)',
  },
  {
    name: 'CRM & ERP',
    client: 'Scalina (our own)',
    initials: 'SC',
    href: '/work/scalina-crm',
    shot: { src: '/work/scalina-crm/projects.webp', w: 1800, h: 1125 },
    glow: 'radial-gradient(70% 70% at 60% 30%, rgba(30,69,251,0.5) 0%, rgba(30,69,251,0) 70%)',
  },
];

export default function Shipped() {
  const scope = useRef<HTMLElement | null>(null);
  const leadRef = useRef<HTMLParagraphElement | null>(null);
  const panelRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // The lead statement drifts in from the left as it enters.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (leadRef.current) {
          gsap.fromTo(
            leadRef.current,
            { xPercent: 14, opacity: 0.15 },
            {
              xPercent: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: leadRef.current,
                start: 'top 95%',
                end: 'top 25%',
                scrub: true,
              },
            }
          );
        }
      });

      /* Swap the sticky label to whichever panel owns the viewport centre.
         Setting on both enter directions means the slot holds the last value
         in the gaps between panels rather than going blank. */
      panelRefs.current.forEach((panel, index) => {
        if (!panel) return;
        gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            /* The name used to change as soon as a panel's top crossed 60% of
               the viewport, which is while the *previous* panel is still the
               one you are looking at. Switching at the point the incoming
               panel reaches the middle of the screen matches what is actually
               centred beside the label. */
            start: 'top 45%',
            end: 'bottom 45%',
            onEnter: () => setActive(index),
            onEnterBack: () => setActive(index),
          },
        });
      });

      // gsap.matchMedia() owns its own context; revert it or its
      // ScrollTriggers outlive this run.
      return () => mm.revert();
    },
    { scope, dependencies: [] }
  );

  const current = PROJECTS[active];

  return (
    <section id="shipped" ref={scope} className={styles.section} data-ground="dark" aria-label="Shipped software">
      <div className={styles.shell}>
        <div className={styles.lead}>
          <div />
          <p ref={leadRef} className={`statement ${styles.leadText}`}>
            Software we&rsquo;ve actually shipped. Not a services list. Things that are
            running right now.
          </p>
        </div>

        <div className={styles.columns}>
          <div className={styles.sticky}>
            <div className={styles.stickyBody}>
              <p className={styles.featuredLabel}>Featured work</p>
              <h3 key={`name-${active}`} className={`${styles.projectName} ${styles.swapIn}`}>
                {current.name}
              </h3>
            </div>
            <div className={styles.clientRow}>
              <span aria-hidden="true" className={styles.clientChip}>
                {current.initials}
              </span>
              <span className={styles.clientMeta}>
                <span className={styles.clientLabel}>Client</span>
                <span key={`client-${active}`} className={`${styles.clientName} ${styles.swapIn}`}>
                  {current.client}
                </span>
              </span>
            </div>
          </div>

          <div className={styles.panels}>
            {PROJECTS.map((project, index) => (
              <a
                key={project.name}
                href={project.href}
                className={styles.panel}
                ref={(el) => {
                  panelRefs.current[index] = el;
                }}
              >
                <span className={styles.panelGlow} style={{ background: project.glow }} />
                <span className={styles.panelShot}>
                  <Image
                    src={project.shot.src}
                    alt={`${project.name}, ${project.client}`}
                    width={project.shot.w}
                    height={project.shot.h}
                    sizes="(max-width: 900px) 90vw, 55vw"
                  />
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.footerCta}>
          <Magnetic>
            <Link href="/work" className="ghostBtn">
              <span>See all work</span>
              <span aria-hidden="true">→</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
