'use client';

import { useEffect, type RefObject } from 'react';
import {
  GROUNDS,
  GROUND_KEYS,
  resolveGround,
  type GroundName,
  type GroundTokens,
} from './grounds';

/* The page's dark/light rhythm.

   Sections declare their ground with `data-ground="dark|light"`. This walks
   them in DOM order and, on every scroll, works out which ground the page
   should be on right now. When that answer changes, the tokens are cross-faded
   to the new ground over a fixed duration.

   WHY TIMED AND NOT SCRUBBED
   --------------------------
   This used to scrub: the tokens were a pure function of how far the scroll
   position had travelled through a boundary window, so the ground moved only
   while the wheel moved, and stopping mid-boundary left the page parked on a
   half-mixed grey. mude.com.au — the reference for this — does the opposite:
   its sections carry `transition-colors duration-1000`, so crossing a boundary
   swaps the target and the browser eases background and text to it over one
   second on its own curve, whatever the scroll does next. That is the feel
   asked for, so this now works the same way: the scroll position decides
   *which* ground, and time decides *how it gets there*.

   The target is still derived from live measurement on every scroll rather
   than from animation state — the pattern that fixed a class of stale-writer
   bugs here (a boundary's tween reporting progress from a layout that had
   since moved, and landing after the current one). The only animation state
   kept is the in-flight cross-fade, which is single, cancellable, and always
   restarted from where it currently is.

   Tokens are written to the document element rather than to the wrapper so the
   fixed header, which sits outside the wrapper, inverts with the page.

   How each token resolves — surfaces ease, foregrounds step at the point where
   the incoming text wins on contrast — is in lib/grounds.ts. Run
   `npm run test:contrast` after touching either file. */

/* A section governs once its top has risen past this line. At 0.55 the ground
   changes when the incoming section holds a little under half the screen,
   which is about where the eye has already accepted it as "the section I am
   in". */
const TRIGGER_FRACTION = 0.55;

/* `data-ground-line` moves that line for one section, as a fraction of the
   viewport height. Negative means "not until the section's top is this far
   ABOVE the window", which is the only way a pinned section can say "my ground
   starts partway through my own pin".

   This exists because of a real, visible bug. A ColorWipe declares the ground
   the page is on AFTER it, on a track that is two viewports tall. At the
   default line that ground landed when the track's top reached 0.55vh — while
   the top 55% of the screen was still the PREVIOUS section, which therefore
   flipped from light to dark (or back) in place, a good half-screen of scroll
   before the wipe's own stage had covered it. The wipe looked correct; the
   section above it changed colour underneath the reader.

   A wipe now asks for a negative line, so its ground cannot land before its
   pinned stage owns the whole viewport (line 0), and in practice lands at the
   point in the pin where the incoming colour has reached the top of the screen
   — see GROUND_STEP_AT in components/ColorWipe.tsx, which is where the fixed
   header is and so the only thing left that still reads these tokens. */
const groundLineFor = (section: HTMLElement, vh: number) => {
  const declared = Number(section.dataset.groundLine);
  return Number.isFinite(declared) && section.dataset.groundLine !== ''
    ? declared * vh
    : vh * TRIGGER_FRACTION;
};

/* Matches the reference's `duration-1000`. The default, not the only one. */
const CROSSFADE_MS = 1000;

/* Per-crossing transitions.
   ------------------------------------------------------------------------
   A single cross-fade for every pair made four grounds read as one effect
   repeated. Each ordered pair now names its own move, so the page announces
   *which* ground it is entering, not just that it changed.

   `wipe*` is the icreon.com move: a panel in the incoming colour sweeps across
   the viewport and the ground is simply behind it when it lands. `iris` opens
   it from the centre. `fade` is the original mude.com.au cross-fade and is
   still what dark<->light does, because that pair is the site's resting rhythm
   and a wipe on it would be loud.

   A wipe does NOT interpolate the tokens: the overlay is doing the visual work,
   so the tokens hold the outgoing ground and step once near the end (see
   STEP_AT). That is the one place this differs from icreon, which splits its
   type at the wipe's edge — black above the line, white below — by rendering
   the page twice and clipping each copy. Doing that here would mean
   duplicating the whole section tree, so the type flips when the wipe has all
   but covered it instead of at the moving boundary. */
type TransitionKind = 'fade';

type Transition = { kind: TransitionKind; ms: number };

const DEFAULT_TRANSITION: Transition = { kind: 'fade', ms: CROSSFADE_MS };

/* Every pair is the cross-fade. The full-viewport wipe panel that used to live
   here was tried across four rounds and produced a new glitch each time: it
   painted over the outgoing section; it flattened the screen to one colour once
   surfaces stepped; it needed two sets of foregrounds to hold one sharp edge;
   and with all of that fixed it still did not read as an animation.

   That last point is why it is gone rather than fixed again. icreon.com PINS
   its section, so the colour travels across stationary content. Without a pin
   the edge and the content move at the same rate, which looks exactly like no
   transition — and a panel moving faster than the content without a pin is, by
   definition, painting over the section you are still reading. Pinning arbitrary
   sections is not something a document-level token system can do without owning
   their layout, so the pinned wipe lives in `components/ColorWipe.tsx` instead,
   where it owns a stage and pins it properly. */
const transitionFor = (): Transition => DEFAULT_TRANSITION;


/* Tailwind's default transition timing function, which is what the mude.com.au
   reference eases its `duration-1000` colour change on. Only the fade uses it —
   a scrubbed wipe is deliberately linear, because any easing between the scroll
   and the edge is exactly what makes a scrub stop feeling connected. */
const easeStandard = (t: number) => cubicBezier(0.4, 0, 0.2, 1, t);

function cubicBezier(x1: number, y1: number, x2: number, y2: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  // Newton first, bisection as the fallback for the flat-slope regions.
  let t = x;
  for (let i = 0; i < 8; i += 1) {
    const dx = sampleX(t) - x;
    if (Math.abs(dx) < 1e-6) break;
    const d = slopeX(t);
    if (Math.abs(d) < 1e-6) break;
    t -= dx / d;
  }
  if (t < 0 || t > 1) {
    let lo = 0;
    let hi = 1;
    t = x;
    for (let i = 0; i < 20; i += 1) {
      t = (lo + hi) / 2;
      if (sampleX(t) > x) hi = t;
      else lo = t;
    }
  }
  return ((ay * t + by) * t + cy) * t;
}

function writeTokens(el: HTMLElement, tokens: GroundTokens) {
  for (const key of GROUND_KEYS) el.style.setProperty(key, tokens[key]);
}

export function useGroundRhythm(
  scope: RefObject<HTMLElement | null>,
  /* Re-runs when these change, for pages whose section grounds are dynamic. */
  dependencies: unknown[] = []
) {
  useEffect(
    () => {
      const wrapper = scope.current;
      if (!wrapper) return;

      const root = document.documentElement;
      const sections = Array.from(wrapper.querySelectorAll<HTMLElement>('[data-ground]'));
      if (!sections.length) return;

      const entry = (sections[0].dataset.ground as GroundName) ?? 'dark';
      const groundOf = (el: HTMLElement) => (el.dataset.ground as GroundName) ?? entry;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* Where the page currently sits: `mix` is the value handed to
         resolveGround, so it is the actual colour on screen, not a clock. */
      let from: GroundName = entry;
      let to: GroundName = entry;
      let mix = 1;
      let mixStart = 1;
      let duration = CROSSFADE_MS;
      let startedAt = 0;
      let frame = 0;

      const paint = () => {
        writeTokens(root, from === to ? GROUNDS[to] : resolveGround(from, to, mix));
      };

      const tick = (now: number) => {
        frame = 0;
        const t = duration <= 0 ? 1 : Math.min(1, (now - startedAt) / duration);
        mix = mixStart + (1 - mixStart) * easeStandard(t);
        if (t >= 1) {
          mix = 1;
          from = to;
        }
        paint();
        if (t < 1) frame = requestAnimationFrame(tick);
      };

      /* The easing is applied to what is left of the fade, and the time left
         is scaled to match, so an interrupted crossing finishes at the same
         rate a fresh one would rather than snapping through the remainder. */
      const beginFade = () => {
        const transition = transitionFor();
        mixStart = mix;
        duration = transition.ms * (1 - mix);
        startedAt = performance.now();
        if (!frame) frame = requestAnimationFrame(tick);
      };

      /* `snap` steps the tokens instead of fading them.
         ------------------------------------------------------------------
         A section that moved its own trigger line did so because something
         opaque is covering the change — a wipe's pinned stage. The crossfade
         is then not just pointless but wrong: it outlives the stage, so the
         section BELOW the wipe spends the first second of its life fading
         from the old ground to the new one, in full view, which is the fade
         the wipe existed to replace. Behind an opaque stage there is nothing
         to ease. */
      const retarget = (next: GroundName, snap = false) => {
        if (next === to) return;

        if (reduced || snap) {
          from = next;
          to = next;
          mix = 1;
          if (frame) cancelAnimationFrame(frame);
          frame = 0;
          paint();
          return;
        }

        if (mix < 1 && next === from) {
          /* Reversing mid-fade. Surfaces interpolate linearly, so
             resolveGround(a, b, m) and resolveGround(b, a, 1 - m) are the same
             colour — flipping the ends and the mix together carries straight
             on from what is on screen instead of jumping back to the start. */
          const previous = from;
          from = to;
          to = previous;
          mix = 1 - mix;
        } else {
          from = to;
          to = next;
          mix = 0;
        }

        beginFade();
      };

      /* Scroll position drives the crossing itself, not just its start.
         ------------------------------------------------------------------
         The timed path is still here and still owns dark <-> light, which is
         the mude.com.au cross-fade this was built on. Everything else — the
         wipes and the iris — is SCRUBBED: `mix` is read straight off where the
         incoming section's top sits in the window above, so the panel tracks
         the wheel, stops when you stop, and runs backwards when you scroll
         back. Nothing is played on a clock, so there is no animation state to
         go stale and nothing to interrupt. */
      const resolve = () => {
        const vh = window.innerHeight;
        let target: GroundName = entry;
        /* Every section, not "until the first one that has not arrived yet".
           The early `break` assumed one shared line, so the list was sorted by
           the same test it was being filtered on. It is not any more: a pinned
           section can declare a line a viewport or two above the window, and a
           marker inside one pin can declare a later line than the marker above
           it. Reading them all and keeping the last match is the same answer
           whenever the lines agree, and the right one when they do not. The
           cost is a handful of extra rect reads per scroll, batched with the
           ones this already did. */
        let snap = false;
        for (const section of sections) {
          if (section.getBoundingClientRect().top <= groundLineFor(section, vh)) {
            target = groundOf(section);
            const declared = section.dataset.groundLine;
            snap = declared !== undefined && declared !== '';
          }
        }
        retarget(target, snap);
      };

      /* A re-run can find the page already painted on the other ground — the
         services page rebuilds this when the team (and so the ground the page
         opens on) changes. Fade rather than cut in that case. */
      const applied = root.style.getPropertyValue('--bg').trim().toLowerCase();
      const previous = (Object.keys(GROUNDS) as GroundName[]).find(
        (name) => GROUNDS[name]['--bg'].toLowerCase() === applied
      );

      if (previous && previous !== entry && !reduced) {
        from = previous;
        to = entry;
        mix = 0;
        paint();
        beginFade();
      } else {
        paint();
      }

      resolve();

      window.addEventListener('scroll', resolve, { passive: true });
      window.addEventListener('resize', resolve);

      return () => {
        window.removeEventListener('scroll', resolve);
        window.removeEventListener('resize', resolve);
        if (frame) cancelAnimationFrame(frame);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies
  );
}
