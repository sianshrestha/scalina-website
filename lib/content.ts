/* Shared content that more than one section needs.

   Clients are the ones with a case study in lib/work.ts. Every one is named
   with permission (confirmed by the studio, Sep 2026).
   `node`-style wordmarks stand in until real logo files are supplied — swap
   `name` for an `src` in the LogoLoop items when they arrive. */
export const CLIENTS = [
  { name: 'OZI Hygiene & Packaging', href: '/work/ozi-hp' },
  { name: 'Maya Lounge', href: '/work/maya-lounge' },
  { name: 'Gurung Shuttles and Tours', href: '/work/gurung-shuttles' },
  { name: 'Sydney Easter Show', href: '/work/sydney-easter-show' },
  { name: 'Gurkha Jewellery', href: '/work/gurkha-jewellery' },
  { name: 'ANFA Australia', href: '/work/anfa-australia' },
  { name: 'Runaway Entertainment', href: '/work/runaway-entertainment' },
] as const;

/* One destination, many framings. Pick the phrasing that fits the moment —
   they all lead to /start. */
export const CTA = {
  start: 'Start a project',
  quote: 'Get a quote',
  contact: 'Contact us',
  scale: 'Get scaled',
} as const;
