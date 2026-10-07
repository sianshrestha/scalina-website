import type Lenis from 'lenis';

/* One Lenis instance for the whole app, owned by `components/SmoothScroll`.

   Held module-side rather than in React context because the callers that need
   it — the menu pausing the page, in-page anchors — are event handlers, not
   render paths, and `null` is a legitimate answer: reduced motion never
   creates an instance, and everything that asks must still work without one. */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}
