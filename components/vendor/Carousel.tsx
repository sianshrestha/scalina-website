'use client';

/* Carousel — ported from Skiper UI `skiper48`, `skiper49` and `skiper51`.
   https://skiper-ui.com/r/skiper49.json (and 48, 51)

   Upstream ships these as three near-identical files (`Carousel_002`,
   `Carousel_003`, `Carousel_005`) differing only in which Swiper effect module
   they load and the per-effect config. Kept as one component with an `effect`
   prop rather than three copies — the parts that differ are ~6 lines each.

   Ported on the same terms as the other vendored components here. Four things
   had to change to make it usable in this project:

   1. **It took `images: {src, alt}[]` and rendered `<img>`.** Scalina has no
      case-study photography yet — `lib/work.ts` carries a `tone` gradient as the
      placeholder, and the rest of the site draws those. So this takes
      `slides: ReactNode[]` and renders whatever it is handed, the same swap the
      unlumen `VerticalMarquee` port made for the same reason. Nothing invented
      to fill it.
   2. **Tailwind + `cn()` from `@/lib/utils`** — neither exists here. CSS module.
   3. **`lucide-react`** for two chevrons, which is a dependency for two glyphs.
      The site sets its arrows in type ("→"), so these do too.
   4. **`framer-motion`** -> `motion/react`, already installed.

   Upstream injected its sizing through an inline `<style>` tag containing a
   `.Carousal_003` block with `!important`. That is kept as a CSS module instead,
   so it does not leak to every other Swiper on the page and does not need the
   `!important` to win.

   What is upstream's, unchanged: the Swiper configuration — the coverflow
   effect and its rotate/depth/modifier values, `slidesPerView="auto"` with
   `centeredSlides`, the loop and autoplay wiring, and the mount fade.

   ---------------------------------------------------------------------------
   Skiper 49 Carousel_003 — React + Swiper
   Built with Swiper.js — https://swiperjs.com/
   License & Usage:
   - Free to use and modify in both personal and commercial projects.
   - Attribution to Skiper UI is required when using the free version.
   - No attribution required with Skiper UI Pro.
   Author: @gurvinder-singh02 · https://gxuri.me · https://x.com/Gur__vi
   --------------------------------------------------------------------------- */

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import {
  Autoplay,
  EffectCards,
  EffectCoverflow,
  EffectCreative,
  Navigation,
  Pagination,
} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './Carousel.module.css';

export type CarouselEffect = 'coverflow' | 'cards' | 'creative';

type CarouselProps = {
  slides: ReactNode[];
  /* coverflow = skiper49, cards = skiper48, creative = skiper51. */
  effect?: CarouselEffect;
  className?: string;
  label?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
};

export default function Carousel({
  slides,
  effect = 'coverflow',
  className,
  label = 'Work',
  showPagination = true,
  showNavigation = true,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
}: CarouselProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={[styles.wrap, className].filter(Boolean).join(' ')}
    >
      <Swiper
        spaceBetween={spaceBetween}
        /* Autoplay is opt-in and off by default. An auto-advancing carousel is
           a WCAG 2.2.2 problem unless it can be stopped, and upstream's
           `disableOnInteraction: true` only stops it once you touch it. */
        autoplay={autoplay && !reduced ? { delay: 4000, disableOnInteraction: true } : false}
        effect={effect}
        grabCursor
        /* The cards effect stacks one slide at a time and sizes itself off the
           container, so "auto" + centred is a coverflow/creative arrangement
           only — upstream's skiper48 leaves both at their defaults. */
        slidesPerView={effect === 'cards' ? 1 : 'auto'}
        centeredSlides={effect !== 'cards'}
        loop={loop}
        a11y={{ containerMessage: label }}
        coverflowEffect={{ rotate: 40, stretch: 0, depth: 100, modifier: 1, slideShadows: true }}
        creativeEffect={{
          prev: { shadow: true, translate: [0, 0, -400] },
          next: { translate: ['100%', 0, 0] },
        }}
        pagination={showPagination ? { clickable: true } : false}
        navigation={
          showNavigation ? { nextEl: `.${styles.next}`, prevEl: `.${styles.prev}` } : false
        }
        className={`${styles.swiper} ${effect === 'cards' ? styles.swiperCards : ''}`}
        modules={[EffectCoverflow, EffectCards, EffectCreative, Autoplay, Pagination, Navigation]}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className={effect === 'cards' ? styles.slideCard : styles.slide}>
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>

      {showNavigation && (
        <div className={styles.controls}>
          <button type="button" className={styles.prev} aria-label="Previous">
            <span aria-hidden="true">&larr;</span>
          </button>
          <button type="button" className={styles.next} aria-label="Next">
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}

export { Carousel };
