import { resolveGround, type GroundName } from '../lib/grounds.ts';

const parse = (v: string): number[] => {
  v = v.trim();
  if (v.startsWith('#')) {
    const h = v.slice(1);
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  return v.match(/-?[\d.]+/g)!.slice(0, 3).map(Number);
};
const lum = (c: number[]) => {
  const f = c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
  return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
};
const contrast = (a: string, b: string) => {
  const L1 = lum(parse(a)), L2 = lum(parse(b));
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};

let failed = false;
/* Every ordered pair of grounds, not just dark<->light: a third ground means
   three more crossings, and the one that actually bit was light->cobalt. */
const NAMES: GroundName[] = ['dark', 'light', 'cobalt', 'lime'];
const PAIRS: [GroundName, GroundName][] = NAMES.flatMap((a) =>
  NAMES.filter((b) => b !== a).map((b) => [a, b] as [GroundName, GroundName])
);

for (const [from, to] of PAIRS) {
  let worstText = Infinity, worstMuted = Infinity, atT = 0, atM = 0;
  /* --accent-fg carries brand-coloured text site-wide (DESIGN.md §1). It steps
     like --text, so it is subject to exactly the same boundary invariant and
     is asserted here rather than trusted. */
  let worstAccent = Infinity, atA = 0;
  const rows: string[] = [];
  for (let i = 0; i <= 400; i++) {
    const p = i / 400;
    const t = resolveGround(from, to, p);
    const ct = contrast(t['--text'], t['--bg']);
    const cm = contrast(t['--muted'], t['--bg']);
    const ca = contrast(t['--accent-fg'], t['--bg']);
    if (ct < worstText) { worstText = ct; atT = p; }
    if (cm < worstMuted) { worstMuted = cm; atM = p; }
    if (ca < worstAccent) { worstAccent = ca; atA = p; }
    if (i % 50 === 0) {
      rows.push(`  p=${p.toFixed(2)}  text=${ct.toFixed(2)}  muted=${cm.toFixed(2)}  accent=${ca.toFixed(2)}`);
    }
  }
  console.log(`\n=== ${from} -> ${to} ===`);
  console.log(rows.join('\n'));
  console.log(`  WORST text : ${worstText.toFixed(2)}:1 at p=${atT.toFixed(3)}`);
  console.log(`  WORST muted: ${worstMuted.toFixed(2)}:1 at p=${atM.toFixed(3)}`);
  console.log(`  WORST accent: ${worstAccent.toFixed(2)}:1 at p=${atA.toFixed(3)}`);
  if (worstText < 3) { console.log('  !! text drops below 3:1'); failed = true; }
  if (worstMuted < 3) { console.log('  !! muted drops below 3:1'); failed = true; }
  if (worstAccent < 3) { console.log('  !! accent-fg drops below 3:1'); failed = true; }
}
console.log(failed ? '\nRESULT: FAIL' : '\nRESULT: PASS (never below 3:1)');
