'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import LogoLoop from '@/components/vendor/LogoLoop';
import { CLIENTS } from '@/lib/content';
import { ETHER } from '@/lib/ether';
import styles from './Hero.module.css';

/* LiquidEther boots a WebGL fluid sim, so it is client-only and lazy — it must
   never block first paint or run during SSR. Same field as the closing block,
   so the page opens and closes on the same material. */
const LiquidEther = dynamic(() => import('@/components/vendor/LiquidEther'), { ssr: false });

/* The hero, and its opening, taken from vanmorrison.com — timings and
   construction read off their own timeline rather than eyeballed.

   THE STRUCTURE
   -------------
   The field is full-bleed and always painted. Over it sit two black panels,
   each 50% wide, pinned to the left and right edges, which is what makes the
   page look black on arrival. Above both sits the wordmark, twice: an outline
   copy and a solid copy clipped to nothing at the centre.

   The reveal slides the two panels out to their own sides while the solid
   copy's clip-path opens from the centre on the same duration and the same
   ease. So the field appears and the letters fill in together — but nothing
   is actually clipping the field. Getting that wrong (clipping the field and
   the fill as one layer) looks similar in a still and wrong in motion.

   THE ORDER
   ---------
   Nothing starts until the field is genuinely up. Their timeline waits on the
   hero video's `loadeddata`, capped at 1800ms; ours waits for LiquidEther's
   canvas to mount and paint, capped the same. Skipping that gate was the bug
   in the first attempt at this: the curtain opened on a blind timer, well
   before the WebGL chunk had loaded, so it drew apart to reveal more black.

   Then: the wordmark rises 200px and fades up over 0.75s; a 0.35s hold; the
   0.9s power3.inOut reveal; the outline fades out over its last stretch; the
   header and the client marquee come up during it, not after.

   The opening state is declared in CSS, not set from JS, so the server-
   rendered first paint is already correct — black, no chrome — and GSAP only
   ever animates away from it. The no-JS fallback that resolves it all is in
   layout.tsx. */

/* Matches their `setTimeout(resolve, 1800)` — the intro runs whether or not
   the field ever reports itself ready. */
const FIELD_READY_TIMEOUT = 1800;

export default function Hero() {
  const scope = useRef<HTMLElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const text = root.querySelector<HTMLElement>('[data-hero-text]');
      const fill = root.querySelector<HTMLElement>('[data-hero-fill]');
      const outline = root.querySelector<HTMLElement>('[data-hero-outline]');
      const curtains = gsap.utils.toArray<HTMLElement>('[data-hero-curtain]', root);
      /* The header lives outside this component but opens on the same clock,
         so it is addressed by attribute rather than passed down. Queried off
         the document and passed as elements, not as selector text: useGSAP's
         `scope` confines selector strings to this section, which would silently
         drop the header and leave it hidden for the whole session. */
      const chrome = Array.from(document.querySelectorAll<HTMLElement>('[data-site-chrome]'));
      if (!text || !fill || !outline || curtains.length !== 2) return;

      const settle = () => {
        gsap.set(text, { y: 0, autoAlpha: 1 });
        gsap.set(fill, { clipPath: 'inset(0% 0% 0% 0%)' });
        gsap.set(outline, { opacity: 0 });
        gsap.set(curtains, { display: 'none' });
        gsap.set(chrome, { autoAlpha: 1 });
      };

      const mm = gsap.matchMedia();
      let cancelled = false;

      mm.add(
        {
          animated: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          if (ctx.conditions?.reduced) {
            settle();
            return;
          }

          const play = () => {
            if (cancelled) return;
            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
            tl.to(text, { y: 0, autoAlpha: 1, duration: 0.75, ease: 'power3.out' });
            tl.to({}, { duration: 0.35 });
            tl.add('reveal');
            tl.to(curtains[0], { xPercent: -100, duration: 0.9, ease: 'power3.inOut' }, 'reveal');
            tl.to(curtains[1], { xPercent: 100, duration: 0.9, ease: 'power3.inOut' }, 'reveal');
            /* fromTo, with the start written out in full, is not optional.
               A plain .to() reads the start off the computed style, and the
               browser normalises `inset(0% 50% 0% 50%)` down to `inset(0%
               50%)` — two numbers against the target's four. GSAP interpolates
               complex strings number-for-number, so the mismatch left the
               fill's left inset sitting at its end value from the first frame:
               the left of the word was solid white before the curtains had
               moved at all. Both ends must be written the same shape. */
            tl.fromTo(
              fill,
              { clipPath: 'inset(0% 50% 0% 50%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.inOut' },
              'reveal'
            );
            tl.to(outline, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 'reveal+=0.7');
            tl.to(chrome, { autoAlpha: 1, duration: 0.5 }, 'reveal+=0.5');
          };

          /* Wait for the field's canvas to exist and to have had a frame to
             paint into, then go. */
          let frame = 0;
          const deadline = performance.now() + FIELD_READY_TIMEOUT;
          const poll = () => {
            frame = 0;
            if (cancelled) return;
            const canvas = fieldRef.current?.querySelector('canvas');
            if ((canvas && canvas.width > 0) || performance.now() >= deadline) {
              frame = requestAnimationFrame(() => {
                frame = requestAnimationFrame(play);
              });
              return;
            }
            frame = requestAnimationFrame(poll);
          };
          poll();

          return () => {
            if (frame) cancelAnimationFrame(frame);
          };
        }
      );

      // gsap.matchMedia() owns its own context; revert it or its tweens
      // outlive this run.
      return () => {
        cancelled = true;
        mm.revert();
      };
    },
    { scope }
  );

  return (
    <section ref={scope} className={styles.hero} data-ground="dark" data-hero="" aria-label="Scalina">
      {/* Full-bleed and always painted — the curtains are what hide it. */}
      <div ref={fieldRef} className={styles.field} aria-hidden="true">
        <LiquidEther {...ETHER} />
      </div>
      <div className={styles.vignette} aria-hidden="true" />

      <div className={`${styles.curtain} ${styles.curtainLeft}`} data-hero-curtain="" aria-hidden="true" />
      <div className={`${styles.curtain} ${styles.curtainRight}`} data-hero-curtain="" aria-hidden="true" />

      <div className={styles.textWrap} data-hero-text="">
        <h1 className={styles.mark}>
          <span className={styles.markFill} data-hero-fill="">
            Scalina
          </span>
          <span className={styles.markOutline} data-hero-outline="" aria-hidden="true">
            Scalina
          </span>
        </h1>
      </div>

      {/* Sits *under* the curtains, so the wipe uncovers it rather than it
          fading in on its own. Nothing to animate — see Hero.module.css. */}
      <div className={styles.clients}>
        <span className={styles.clientsLabel}>Trusted by</span>
        <LogoLoop
          logos={CLIENTS.map((client) => ({
            node: <span className={styles.clientMark}>{client.name}</span>,
            href: client.href,
            title: client.name,
            ariaLabel: client.name,
          }))}
          speed={64}
          direction="left"
          logoHeight={34}
          gap={72}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="var(--bg)"
          ariaLabel="Scalina clients"
        />
      </div>
    </section>
  );
}
