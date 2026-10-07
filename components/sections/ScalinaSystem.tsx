'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import Reveal from '@/components/Reveal';
import styles from './ScalinaSystem.module.css';

/* Attract · Amplify · Convert · Operate.

   The colour sequence performs the argument: the loop moves through every
   register the brand owns, alternating light and dark. */
const STAGES = [
  {
    number: '01',
    title: 'Attract',
    copy: 'Content and creative that gets you found. Short-form video, UGC, design and social, at enough volume to stay in front of the people you want without burning the brand out.',
    href: '/services?view=media',
    tags: ['Content & UGC', 'Creative & design', 'Social media'],
    bg: '#CDF22B',
    fg: '#0B0D12',
    shadow: '0 24px 60px rgba(11,13,18,0.10)',
  },
  {
    number: '02',
    title: 'Amplify',
    copy: 'Budget goes behind what already works. We put paid spend on proven creative, watch cost per lead daily, and cut the placements that stop earning.',
    href: '/services?view=media#paid-advertising',
    tags: ['Paid advertising', 'Campaign management', 'Reporting'],
    bg: '#1E45FB',
    fg: '#F4F2ED',
    shadow: '0 24px 60px rgba(11,13,18,0.14)',
  },
  {
    number: '03',
    title: 'Convert',
    copy: 'Funnels, landing pages and lead capture that turn attention into booked work. Every enquiry lands somewhere you can act on, with the follow-up already written.',
    href: '/services?view=systems#funnels',
    tags: ['Funnels', 'Landing pages', 'Lead capture'],
    bg: '#0B1F8F',
    fg: '#F4F2ED',
    shadow: '0 24px 60px rgba(11,13,18,0.14)',
  },
  {
    number: '04',
    title: 'Operate',
    copy: 'The software underneath it all: websites, internal tools and automation that carry the volume the first three stages create, instead of buckling under it.',
    href: '/services?view=systems#custom-software',
    tags: ['Websites', 'Custom software', 'Automation & AI'],
    /* Not black: four cards ending on the page's own dark ground made the last
       one read as a hole rather than the end of the sequence. A deep teal-ink
       keeps the light-to-dark march without leaving the brand. */
    bg: '#08080A',
    fg: '#F4F2ED',
    shadow: '0 24px 60px rgba(11,13,18,0.18)',
  },
];

/* Covered cards shrink only slightly — enough to read as depth, not so much
   that their headings become unreadable. */
const SCALE_STEP = 0.018;

/* Air below a card's heading when it is covered by the next one. */
const HEADING_AIR = 18;
const MIN_STACK_TOP = 88;
const MIN_REVEAL = 30;

export default function ScalinaSystem() {
  const scope = useRef<HTMLElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* Pinned card stack. Each stage pins at the same offset and the next one
         scrolls over it, scaling the covered card back so the stack reads as
         depth rather than as a pile. Below 900px, and under reduced motion,
         the cards are just a normal stacked column. */
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);
        const stack = stackRef.current;
        if (!cards.length || !stack) return;

        /* How far apart the cards sit when stacked. Ideally that is far enough
           to leave every covered card's heading on show; on a short viewport it
           falls back to whatever still fits, rather than pushing the last card
           off the bottom of the screen. */
        const layout = () => {
          const viewport = window.innerHeight;
          const cardHeight = cards[cards.length - 1].offsetHeight;
          const gaps = cards.length - 1;

          const head = cards[0].querySelector<HTMLElement>(`.${styles.cardHead}`);
          const ideal = head
            ? head.getBoundingClientRect().bottom - cards[0].getBoundingClientRect().top + HEADING_AIR
            : 110;

          let reveal = ideal;
          let top = viewport - cardHeight - reveal * gaps - 24;
          if (top < MIN_STACK_TOP) {
            top = MIN_STACK_TOP;
            reveal = Math.max(MIN_REVEAL, (viewport - cardHeight - top - 24) / gaps);
          }
          return { top, reveal };
        };

        cards.forEach((card, index) => {
          const offset = () => {
            const { top, reveal } = layout();
            return top + reveal * index;
          };

          /* Every card releases together, when the stack's own bottom reaches
             the bottom of the viewport. That is also the moment the next
             section starts entering, so the pinned cards can never sit on top
             of it. */
          ScrollTrigger.create({
            trigger: card,
            start: () => `top ${offset()}`,
            endTrigger: stack,
            end: 'bottom bottom',
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          });

          gsap.to(card, {
            scale: 1 - (cards.length - 1 - index) * SCALE_STEP,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: () => `top ${offset()}`,
              endTrigger: stack,
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
      });

      // gsap.matchMedia() owns its own context; revert it or its
      // ScrollTriggers outlive this run.
      return () => mm.revert();
    },
    { scope, dependencies: [] }
  );

  return (
    <section ref={scope} className={styles.section} data-ground="light" aria-labelledby="scalina-system">
      <div className={styles.intro}>
        <div className={styles.introAside}>
          <Reveal kind="fade" as="p" className="eyebrow eyebrowBrand" style={{ margin: 0 }}>
            The Scalina System
          </Reveal>
        </div>

        {/* The statement is the heading here: a section title above it made
            three competing pieces of type in one column. It is plain text — the
            word-by-word scroll reveal that used to run on it was removed, both
            because it left readable copy sitting at low opacity while on screen
            and because a staggered intro on every statement reads as cheap. */}
        <h2 id="scalina-system" className={`statement ${styles.body}`}>
          Each stage feeds the next. Content brings people in, campaigns amplify what works,
          funnels convert them, and the systems underneath handle what happens after. Most
          agencies own one stage. We own the loop.
        </h2>
      </div>

      <div ref={stackRef} className={styles.stack}>
        {STAGES.map((stage) => (
          <article
            key={stage.number}
            className={styles.card}
            style={
              { background: stage.bg, color: stage.fg, boxShadow: stage.shadow, '--card-bg': stage.bg } as React.CSSProperties
            }
          >
            <div className={styles.cardHead}>
              <span className={styles.cardNumber}>{stage.number}</span>
              <h3 className={styles.cardTitle}>{stage.title}</h3>
            </div>
            <div className={styles.cardBody}>
              <div>
                <p className={styles.cardCopy}>{stage.copy}</p>
                <a href={stage.href} className={styles.cardLink}>
                  <span>Explore {stage.title}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className={styles.tags}>
                {stage.tags.map((tag) => (
                  <a key={tag} href={stage.href} className={styles.tag}>
                    <span>{tag}</span>
                    <span aria-hidden="true" className={styles.tagArrow}>
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
