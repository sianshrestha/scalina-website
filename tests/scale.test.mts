/* Scale conformance — the check DESIGN.md asks for and never had.
   ---------------------------------------------------------------------------
   There is a `test:contrast`, and colour has not drifted since. There was no
   equivalent for spacing, type or motion, and all three drifted: the label
   band reached seventeen distinct sizes where §2 specifies one eyebrow, and
   nineteen ad-hoc transition durations accumulated against no scale at all.

   WHAT THIS ENFORCES, AND WHY IT IS NOT §5's TEN-STEP LIST
   ---------------------------------------------------------------------------
   DESIGN.md §5 prints a ten-value spacing scale (4·8·12·16·24·32·48·64·96·128)
   and says "if a gap wants a number that is not on this list, the layout is
   wrong". Measured against the build, 234 of 346 spacing endpoints are off
   that list — but 100% of them are multiples of 2 and 86% are multiples of 4.

   That is not a site that ignored its scale. It is a site built on a finer
   one, using 10, 14, 20, 22, 26, 28, 36, 40, 44, 56, 72, 80 and so on. Snapping
   those 234 values onto the ten-step list would move some of them by up to
   112px, which is not conformance, it is rebuilding every section's rhythm.

   So this enforces the grid the site is actually on — a 2px base, warning at
   anything off the 4px grid — and leaves the question of whether §5 should be
   rewritten to the humans. The three checks below are the ones where drift is
   unambiguous rather than a disagreement about the scale's resolution. */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['app', 'components'];
/* Unimported, and its values are upstream's. */
const IGNORE = ['BubblePills'];

/* Held at their pre-audit values on request.
   ---------------------------------------------------------------------------
   The header and the menu are the site's most-used interaction and their
   timings were tuned by hand around Skiper UI's TextRoll. They were reverted
   to exactly those values — 240ms / 520ms / 400ms on the overlay, its items
   and its foot — which the motion scale's buckets do not contain.

   They are exempt from the motion and label checks rather than quietly
   failing them, or quietly being rounded back onto the scale. Spacing is still
   enforced. If the scale ever grows to cover these, delete the exemption. */
const PRESERVED = ['SiteHeader.module.css', 'NavOverlay.module.css'];

function cssFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...cssFiles(full));
    else if (entry.endsWith('.css') && !IGNORE.some((i) => entry.includes(i))) out.push(full);
  }
  return out;
}

const files = ROOTS.flatMap(cssFiles);
const errors: string[] = [];
const warnings: string[] = [];

const SPACING = /\b(padding|margin|gap|row-gap|column-gap)[a-z-]*:\s*([^;]+);/g;
const LENGTH = /(?<![\w.-])(\d+(?:\.\d+)?)(px|rem)\b/g;
/* Raw ms outside a var(). 0.001ms is the reduced-motion kill switch. */
const RAW_MS = /(?<![\d.])(\d+)ms\b/g;
const RAW_BEZIER = /cubic-bezier\(/g;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const isGlobals = file.endsWith('globals.css');

  /* 1 — spacing sits on the 2px grid. */
  for (const match of src.matchAll(SPACING)) {
    for (const len of match[2].matchAll(LENGTH)) {
      const px = Number(len[1]) * (len[2] === 'rem' ? 16 : 1);
      if (px === 0 || px === 1) continue; // hairlines and zero
      if (px % 2 !== 0) errors.push(`${file}: ${len[0]} in \`${match[1]}\` is off the 2px grid`);
      else if (px % 4 !== 0) warnings.push(`${file}: ${len[0]} in \`${match[1]}\` is off the 4px grid`);
    }
  }

  const preserved = PRESERVED.some((name) => file.endsWith(name));

  /* 2 — durations come from the motion scale, never written inline. */
  if (!isGlobals && !preserved) {
    for (const ms of src.matchAll(RAW_MS)) {
      errors.push(`${file}: raw duration ${ms[0]} — use a --d-* token`);
    }
    for (const _ of src.matchAll(RAW_BEZIER)) {
      void _;
      errors.push(`${file}: raw cubic-bezier() — use an --ease-* token`);
    }
  }

  /* 3 — the label band is three tokens, not seventeen sizes. */
  for (const block of preserved ? [] : src.matchAll(/\{[^{}]*\}/g)) {
    const tracking = /letter-spacing:\s*(0\.\d+)em/.exec(block[0]);
    if (!tracking || Number(tracking[1]) < 0.12) continue;
    const size = /font-size:\s*([^;]+);/.exec(block[0]);
    if (!size) continue;
    const value = size[1].trim();
    if (value.startsWith('var(--t-') || value.startsWith('clamp(') || value === 'inherit') continue;
    errors.push(`${file}: tracked label at ${value} — use --t-eyebrow / --t-label-sm / --t-label-lg`);
  }
}

const show = (list: string[], cap = 12) => {
  for (const line of list.slice(0, cap)) console.log(`  ${line}`);
  if (list.length > cap) console.log(`  … and ${list.length - cap} more`);
};

console.log(`Scanned ${files.length} stylesheets.\n`);
if (warnings.length) {
  console.log(`${warnings.length} off the 4px grid (allowed, the site uses a 2px base):`);
  show(warnings, 6);
  console.log('');
}
if (errors.length) {
  console.log(`${errors.length} violation${errors.length === 1 ? '' : 's'}:`);
  show(errors);
  console.log('\nRESULT: FAIL');
  process.exit(1);
}
console.log('RESULT: PASS (spacing on the 2px grid, durations and easings tokenised, label band on three sizes)');
