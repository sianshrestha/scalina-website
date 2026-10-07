import { gsap } from 'gsap';

/* The two grounds the homepage alternates between.

   Every value a section paints with lives here. A section that hard-codes a
   colour instead of reading one of these tokens will not move during a
   boundary crossfade — and while it is still on screen mid-transition that
   reads as a contrast bug. */

export type GroundName = 'dark' | 'light' | 'cobalt' | 'lime';

export type GroundTokens = {
  '--bg': string;
  '--text': string;
  '--muted': string;
  '--line': string;
  '--panel': string;
  '--link-hover': string;
  '--scrim': string;
  /* The focus ring. A foreground: it must win against the background, so it
     steps with --text rather than interpolating through it. */
  '--focus': string;
  /* Brand colour when it is carrying TEXT. Neither brand colour is readable on
     both grounds — cobalt is 3.1:1 on the dark one, lime is 1.2:1 on the light
     one — so "the accent" has to be a ground token rather than a fixed hex.
     Lime on dark (15.6:1), cobalt on light (5.7:1). See DESIGN.md §1. */
  '--accent-fg': string;
  /* An accent FILL and the ink that sits on it. Deliberately not the same
     choice as --accent-fg: on a light ground the readable accent *text* is
     cobalt, but the accent *block* is lime carrying dark ink. Inverts on dark,
     where the block is cobalt carrying bone. */
  '--accent-bg': string;
  '--accent-bg-fg': string;
};

export const GROUNDS: Record<GroundName, GroundTokens> = {
  dark: {
    '--bg': '#08080A',
    '--text': '#F4F2ED',
    '--muted': '#8E8E96',
    '--line': 'rgba(244,242,237,0.10)',
    '--panel': '#131318',
    '--link-hover': '#FFFFFF',
    '--scrim': 'rgba(255,255,255,0.06)',
    '--focus': '#CDF22B',
    '--accent-fg': '#CDF22B',
    '--accent-bg': '#1E45FB',
    '--accent-bg-fg': '#F4F2ED',
  },
  light: {
    '--bg': '#F5F2F3',
    '--text': '#0B0D12',
    '--muted': '#4A4D55',
    '--line': 'rgba(11,13,18,0.10)',
    '--panel': '#E7E3E1',
    '--link-hover': '#1E45FB',
    '--scrim': 'rgba(11,13,18,0.05)',
    '--focus': '#1E45FB',
    '--accent-fg': '#1E45FB',
    '--accent-bg': '#CDF22B',
    '--accent-bg-fg': '#0B0D12',
  },

  /* The third ground: the brand blue itself, used as a surface.
     ----------------------------------------------------------------------
     Added because "put lime text here" is unanswerable on the light ground —
     lime on #F5F2F3 is 1.2:1 — and the brief is a vibrant site, not a darker
     one. On cobalt every brand colour works at once: bone text 5.7:1, lime
     accent 4.9:1 (AA for body, not just for display), lime focus ring well
     over the 3:1 a non-text indicator needs.

     --muted is #D9E0FF rather than a grey: any mid grey against this
     background lands near 3:1, and the ground rhythm's muted lift then spends
     the whole crossing dragging it back to full text colour. */
  cobalt: {
    '--bg': '#1E45FB',
    '--text': '#F4F2ED',
    '--muted': '#D9E0FF',
    '--line': 'rgba(244,242,237,0.24)',
    '--panel': '#1736C9',
    '--link-hover': '#CDF22B',
    '--scrim': 'rgba(255,255,255,0.10)',
    '--focus': '#CDF22B',
    '--accent-fg': '#CDF22B',
    '--accent-bg': '#CDF22B',
    '--accent-bg-fg': '#0B0D12',
  },

  /* The fourth ground: the accent as a surface.
     ----------------------------------------------------------------------
     Lime is a very light colour, so this is an INK ground, not a bone one —
     #0B0D12 on #CDF22B is 15.5:1. The accent role inverts here: on every other
     ground the accent is the bright thing, on this one it is cobalt, which is
     4.9:1 against lime and is the only brand colour that can be. */
  lime: {
    '--bg': '#CDF22B',
    '--text': '#0B0D12',
    '--muted': '#3F4A16',
    '--line': 'rgba(11,13,18,0.22)',
    '--panel': '#BCDE24',
    '--link-hover': '#1E45FB',
    '--scrim': 'rgba(11,13,18,0.07)',
    '--focus': '#0B0D12',
    '--accent-fg': '#1E45FB',
    '--accent-bg': '#1E45FB',
    '--accent-bg-fg': '#F4F2ED',
  },
};

export const GROUND_KEYS = Object.keys(GROUNDS.dark) as (keyof GroundTokens)[];

/* Surfaces scrub; foregrounds do not.
   ------------------------------------------------------------------------
   Interpolating both on the same curve sends them through the same mid-grey
   at the halfway point — background rgb(127,125,127) under text
   rgb(128,128,128) — and the text disappears. That is the same contrast
   failure that ruled out mix-blend-mode: difference for this job, reached a
   different way. Narrowing the foreground tween does not fix it either: any
   continuous interpolation still passes through a value equal to the
   background, it just spends less time there.

   So the foreground STEPS. Rather than stepping at a hard-coded progress, it
   steps wherever the incoming ground's text actually wins on contrast against
   the background as it stands. That is self-correcting: it lands at the
   optimum in both directions (a fixed pivot does not, because the surface
   lerp is linear in sRGB, not in luminance), and it stays correct if the
   ground colours are ever changed. */

export const SURFACE_KEYS: (keyof GroundTokens)[] = ['--bg', '--panel', '--scrim'];
export const FOREGROUND_KEYS: (keyof GroundTokens)[] = [
  '--text',
  '--link-hover',
  '--focus',
  '--accent-fg',
  /* Fills step too. A block lerping from lime to cobalt passes through the
     same mud a foreground would, and the ink on it would be wrong either side
     of the midpoint regardless. */
  '--accent-bg',
  '--accent-bg-fg',
];

/* Contrast we would like secondary text to keep. */
const MUTED_TARGET = 4.5;

/* Same, for brand-coloured text. See the --accent-fg block in resolveGround. */
const ACCENT_TARGET = 4.5;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (v: number) => v * v * (3 - 2 * v);

function channels(color: string): [number, number, number] {
  const v = color.trim();
  if (v.startsWith('#')) {
    const h = v.length === 4
      ? v.slice(1).split('').map((c) => c + c).join('')
      : v.slice(1);
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }
  const parts = v.match(/-?[\d.]+/g) ?? ['0', '0', '0'];
  return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
}

/* WCAG relative luminance. */
export function luminance(color: string): number {
  const [r, g, b] = channels(color).map((x) => {
    const c = x / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/* Pure resolution of the whole token set at progress p through a boundary.
   Kept free of the DOM so it can be reasoned about and tested directly. */
export function resolveGround(from: GroundName, to: GroundName, p: number): GroundTokens {
  const a = GROUNDS[from];
  const b = GROUNDS[to];

  const out = {} as GroundTokens;

  // gsap.utils.interpolate parses hex and rgba(), so this blends colours
  // properly rather than doing string interpolation on the raw values.
  for (const key of SURFACE_KEYS) {
    out[key] = gsap.utils.interpolate(a[key], b[key], p) as string;
  }

  // Whichever ground's text is more legible on the background right now wins.
  const bg = out['--bg'];
  const fg = contrastRatio(a['--text'], bg) >= contrastRatio(b['--text'], bg) ? a : b;

  for (const key of FOREGROUND_KEYS) {
    out[key] = fg[key];
  }
  out['--line'] = fg['--line'];

  /* --accent-fg needs the --muted treatment, not a step of its own.
     ------------------------------------------------------------------------
     Two wrong turns are worth recording, because both look right on paper:

     1. Letting it step on its own contrast math. Around p≈0.38 the background
        passes a mid-tone where cobalt reads 2.22:1 and lime 2.23:1 — lime wins
        by a hair, so the token jumps to the light-coloured brand colour at the
        exact progress where the readable side is still the dark one. 2.43:1.

     2. Lifting it toward fg['--text'] while it had its own side. When the two
        disagreed, the lerp ran from a light colour to a dark one straight
        through the mid-grey the background was sitting on: 1.00:1, the token
        rendered exactly invisible. That is the trap in this file's header,
        reached from a new direction.

     So it rides the text's side (already applied in the FOREGROUND_KEYS loop)
     and is lifted toward that same side's text when brand colour alone is not
     carrying. Same ground for both ends, so the interpolation can never cross
     the background; and the side is the one that is genuinely legible, because
     it is the one --text picked. tests/contrast.test.mts asserts the result. */
  const accentContrast = contrastRatio(fg['--accent-fg'], bg);
  const accentLift = smoothstep(clamp01((ACCENT_TARGET - accentContrast) / (ACCENT_TARGET - 1)));
  out['--accent-fg'] = gsap.utils.interpolate(
    fg['--accent-fg'],
    fg['--text'],
    accentLift
  ) as string;

  /* Secondary text is the harder case. #8E8E96 and #4A4D55 are both mid-tones,
     so whichever way they step they sit right where the background is passing.
     Lift them toward the full text colour only as far as the shortfall against
     MUTED_TARGET requires, then release. Secondary copy briefly reads at full
     strength, which is a far better artefact than briefly reading as nothing. */
  const mutedContrast = contrastRatio(fg['--muted'], bg);
  const lift = smoothstep(clamp01((MUTED_TARGET - mutedContrast) / (MUTED_TARGET - 1)));
  out['--muted'] = gsap.utils.interpolate(fg['--muted'], fg['--text'], lift) as string;

  return out;
}
