/* Who gets the full motion, and who gets the calm site.

   Phones and tablets get the calm version: no scroll-scrubbed colour wipes, no
   pinned stages, no fade/rise entrances, no parallax, no counters, and the page
   ground steps between colours instead of cross-fading. Asked for by the owner
   (13 Oct 2026) after seeing those glitch on a phone. Desktop is unchanged.
   The homepage hero intro and the WebGL fluid are deliberately NOT part of
   this: they run everywhere, by request.

   "Phone or tablet" = narrower than 1024px, or a device whose primary pointer
   cannot hover (touch). The same definition has to be used by every GSAP
   matchMedia, every motion/react check and every stylesheet, or a component's
   JS and its CSS disagree at some width (a static layout with a pin expected,
   or the reverse). The stylesheet spelling, which cannot import this file, is:

     @media (prefers-reduced-motion: reduce), (max-width: 1023px), (hover: none)

   and the global entrance override lives in app/globals.css under that query. */

/* Full motion: GSAP matchMedia condition for anything scroll-driven. */
export const FULL_MOTION = '(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (hover: hover)';

/* The calm side: reduced motion, or a phone/tablet. */
export const CALM_MOTION = '(prefers-reduced-motion: reduce), (max-width: 1023px), (hover: none)';

/* For code that reads it once at run time (not during render). */
export const prefersCalm = () =>
  typeof window !== 'undefined' && window.matchMedia(CALM_MOTION).matches;
