# Scalina — Design System

The brand system as decided, written so it can be applied to this codebase without
re-deriving anything. Read `HANDOFF.md` for *why the code is shaped the way it is*;
this file is *what it should look like*.

Direction: **Voltage** — electric cobalt, one acid accent, condensed caps set very
large. Boards: <https://claude.ai/code/artifact/7dbbf97e-ff32-43bc-8b7d-64c13b590bf3>

Two things actually change in the build: **the two brand colour tokens**, and
**the footer wordmark's face**. Everything else below already matches, and is
written down so it stays that way.

---

## 1. Colour

### Tokens

Brand constants live in `app/globals.css` `:root` and never tween.

| Token | Value | Was | Role |
|---|---|---|---|
| `--brand-blue` | `#1E45FB` | `#004AAD` | Primary. The brand is blue before it is anything else. |
| `--brand-accent` | `#CDF22B` | `--brand-yellow: #F6C700` | The one accent. Points at the next action. |

Ground tokens are written to `<html>` by `lib/useGroundRhythm.ts` from
`lib/grounds.ts` and tween at section boundaries. **There are three grounds.**

| Token | Dark | Light | **Cobalt** |
|---|---|---|---|
| `--bg` | `#08080A` | `#F5F2F3` | `#1E45FB` |
| `--text` | `#F4F2ED` | `#0B0D12` | `#F4F2ED` |
| `--muted` | `#8E8E96` | `#4A4D55` | `#D9E0FF` |
| `--line` | `rgba(244,242,237,0.10)` | `rgba(11,13,18,0.10)` | `rgba(244,242,237,0.24)` |
| `--panel` | `#131318` | `#E7E3E1` | `#1736C9` |
| `--link-hover` | `#FFFFFF` | `#1E45FB` | `#CDF22B` |
| `--scrim` | `rgba(255,255,255,0.06)` | `rgba(11,13,18,0.05)` | `rgba(255,255,255,0.10)` |
| `--focus` | `#CDF22B` | `#1E45FB` | `#CDF22B` |
| `--accent-fg` | `#CDF22B` | `#1E45FB` | `#CDF22B` |
| `--accent-bg` | `#1E45FB` | `#CDF22B` | `#CDF22B` |
| `--accent-bg-fg` | `#F4F2ED` | `#0B0D12` | `#0B0D12` |

**And a fourth: lime.** `--bg: #CDF22B`, and because lime is a very light colour it
is an **ink** ground, not a bone one — `#0B0D12` on lime is 15.5:1. The accent role
inverts: on every other ground the accent is the bright thing, on this one it is
cobalt (4.9:1), the only brand colour that can be.

| Token | Lime |
|---|---|
| `--bg` | `#CDF22B` |
| `--text` | `#0B0D12` |
| `--muted` | `#3F4A16` |
| `--accent-fg` · `--accent-bg` | `#1E45FB` |
| `--accent-bg-fg` | `#F4F2ED` |
| `--focus` | `#0B0D12` |

Four grounds is **twelve** ordered crossings. `npm run test:contrast` sweeps all of
them; worst across the whole set is **3.66:1**.

### Cobalt is a ground, not a panel colour

The brand blue is a **surface**, used full-bleed on whole sections. It exists
because "put lime here" is unanswerable on the light ground — lime on `#F5F2F3` is
1.2:1 — and the brief is a vibrant site, not a darker one. On cobalt every brand
colour works at once:

| Pair | Ratio |
|---|---|
| Bone `#F4F2ED` on cobalt | **5.7:1** |
| Lime `#CDF22B` on cobalt | **4.9:1** — AA for body copy, not only for display |
| `--muted` `#D9E0FF` on cobalt | **4.9:1** |

`--muted` is a pale periwinkle, not a grey: any mid grey against this background
lands near 3:1, and the rhythm's muted lift would then spend the whole crossing
dragging it back to full text colour.

Three grounds means **six** crossings, not two. `npm run test:contrast` sweeps every
ordered pair; the one that actually bites is `light → cobalt`, worst **3.66:1**.

`lib/useGroundRhythm.ts` needed no change — it was already generic over `GROUNDS`.

### The up wipe IS the section transition

Ground changes are rare and every one of them is the same move: the **up wipe**,
pinned and scrubbed, after icreon.com. There is no fade left on the homepage and no
second kind of transition competing with it.

`ColorWipe` takes **`children`**, not a headline. That is the whole point: the thing
being wiped is a real section's opening, not a slogan parked in front of one. On the
homepage, "What we do" — its heading and its one-line summary — lives inside the
wipe, and `WhatWeDo` below it starts straight at the pillars, so nothing is repeated.

Two constraints come with the mechanism and cannot be designed around:

- **The content must fit one screen.** The stage is pinned at 100vh. A wipe cannot
  wrap a tall section; it wraps that section's opening.
- **The content must be static.** It is rendered twice and the second copy is
  `inert` + `aria-hidden`, so the tab order and a screen reader only meet one of
  them. Links and buttons do not belong inside a wipe.

`direction` supports `up` / `down` / `left` / `right` / `circle`; `up` is the one in
use. The others exist for a boundary that earns a different axis, not as variety for
its own sake.

### A wipe must declare the ground it lands on

`ColorWipe` takes a required **`ground`** prop — the ground the page is on *after*
it. Without it the change happens twice: the wipe paints its own two layers, the
rhythm never hears about it, and the next section — already the colour the wipe just
arrived at — still cross-fades to that same colour a screen later.

Declaring it is safe because the stage is pinned and opaque: the rhythm's fade runs
**behind** a full-viewport panel and is never seen. Measured across the homepage's
first wipe: `--bg` is `#08080A` before it, mid-crossing at `rgb(192,189,190)` while
the panel covers the screen, then `#F5F2F3` — and it stays exactly that as What We Do
arrives. No second transition.

**The corollary is the rule the site now follows:** if the next section is the same
colour, there is no transition at all. Colour changes only where a wipe puts one.

### Ground changes are rare on purpose

A page that keeps changing colour reads as restless rather than vibrant. The
budget is now:

| Page | Grounds | Changes |
|---|---|---|
| Home | dark ×3 · light ×5 · dark ×2 | **2**, both up wipes |
| About | light · **cobalt ×3** · light ×2 · dark ×2 | 3 — one circle wipe, one up wipe |
| Work | light ×3 · dark | 1 |
| Start | light ×2 · **lime** · dark | 2 |

Every wipe on the site:

| Where | Direction | Carries |
|---|---|---|
| Home, dark → light | `up` | the tagline, *Go Digital, or Go Invisible.* |
| Home, light → dark | `up` | the manifesto line — the section performs its own crossing |
| About, light → cobalt | `circle` | *Two specialist teams, one roof* and its lede |

**No lime ground anywhere, and no cobalt on the homepage.** Lime survives as a fill —
the Teams panel, the primary button, the first stage card — which is what §1 rations
it to. Cobalt as a *ground* is down to a single block on `/about`.

### The accent fill — `--accent-bg` / `--accent-bg-fg`

Deliberately **not** the same choice as `--accent-fg`. Accent *text* on a light
ground is cobalt; an accent *block* on a light ground is lime carrying dark ink. So
a filled hover state, a primary button or a selected chip reads `--accent-bg` with
`--accent-bg-fg` on it, and inverts to a cobalt block with bone ink on dark. Both
step rather than tween — a block lerping lime→cobalt passes through the same mud a
foreground would, and its ink would be wrong on one side of the midpoint anyway.

> `--link-hover` on the light ground is currently `#004AAD`. It is a brand blue by
> another name and moves to `#1E45FB` with the rest.

### Ratio

Roughly **60 cobalt / 25 ground / 10 ink / 5 accent**. Cobalt is the resting state,
not the highlight. Accent is rationed: **one lime element per screen** — the thing
you want clicked.

### Contrast — measured, not assumed

| Pair | Ratio | Verdict |
|---|---|---|
| `#1E45FB` on `#F5F2F3` | 5.7:1 | AA — body text fine |
| `#F4F2ED` on `#1E45FB` | 5.7:1 | AA |
| `#CDF22B` on `#08080A` | 15.6:1 | AAA |
| `#CDF22B` on `#1E45FB` | 4.9:1 | AA, **not** AAA — no small type |
| `#CDF22B` on `#F5F2F3` | **1.2:1** | **Unusable** |
| `#1E45FB` on `#08080A` | 3.1:1 | Non-text / large only |

**The one that bites.** `app/globals.css` paints the focus ring with the accent on
both grounds:

```css
:focus-visible { outline: 2px solid var(--brand-yellow); outline-offset: 3px; }
```

At 1.2:1 that ring is invisible on every light section.

**The ring is a ground token, not a CSS selector.** An earlier draft of this file
prescribed `:root[data-ground='light'] { --focus: … }`. That cannot work: sections
carry `data-ground`, but `useGroundRhythm` only ever writes *custom properties* to
`<html>` — it never puts the attribute there, so the selector matches nothing.

`--focus` is therefore a real member of `GroundTokens` in `lib/grounds.ts`, listed in
`FOREGROUND_KEYS` so it **steps** rather than interpolating — same treatment as
`--text`, and for the same reason: a ring that lerps between lime and cobalt passes
through a mid-tone that matches the background it is drawn on.

```ts
// lib/grounds.ts
dark:  { …, '--focus': '#CDF22B' },
light: { …, '--focus': '#1E45FB' },
export const FOREGROUND_KEYS = ['--text', '--link-hover', '--focus'];
```

```css
/* app/globals.css */
@property --focus { syntax: '<color>'; inherits: true; initial-value: #CDF22B; }
:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; }
```

Measured across a full scroll of the homepage: 15.6:1 on the dark ground, 5.7:1 on the
light one, never below 3:1 at any point in the cross-fade.

Every local `outline: 2px solid var(--brand-yellow)` moves to `var(--focus)`. See §8.

`::selection` keeps the accent: `#CDF22B` behind `#0C0C0F` is 15.5:1.

### Rules

- Lime never carries the logo.
- Lime never sets type on a light ground. On light sections the accent job falls to
  cobalt.
- **One lime *fill* per screen, and it is the primary action.** A filled block that
  appears once per card is not an accent, it is a pattern — repeated down a grid it
  has stopped pointing at anything. This rations the lime **button/fill** only; lime
  as *text* is a separate thing, below.
- **Cobalt as type is a light-ground move.** `#1E45FB` on `#08080A` is 3.1:1: enough
  for a rule, a fill, a border or an icon, not for words. Accent text on a dark
  section is lime instead — see `--accent-fg` below.
- No gradients in brand elements. Gradients belong to the LiquidEther field only.
- Panel colours in `Teams.tsx` stay fixed brand colours, not ground tokens — it is
  the one place both brand colours are on screen at once, so it is where the brand
  states itself: **Media on lime, Systems on cobalt**, each panel's selected chip
  inverting into the other's colour. Fixed hexes, because panels that moved with the
  rhythm would stop being a comparison.

### Brand colour as text — `--accent-fg`

The brand is blue and lime, and both are meant to carry type, not just fills. Neither
does it on both grounds: cobalt dies on dark (3.1:1), lime dies on light (1.2:1). The
resolution is that **"the brand accent colour" is a ground token, not a fixed hex**:

| Token | Dark ground | Light ground |
|---|---|---|
| `--accent-fg` | `#CDF22B` — **15.6:1** | `#1E45FB` — **5.7:1** |

Every accent-coloured piece of text on the site reads `var(--accent-fg)`. It is in
`FOREGROUND_KEYS` in `lib/grounds.ts`, so it **steps** at a boundary exactly like
`--text` and `--focus` — a lime-to-cobalt tween would pass through a mud that matches
the background it is drawn on.

This is what "use blue and lime for text across the site" has to mean if the text is
going to stay readable: **on light sections the accent text is cobalt, on dark
sections it is lime**, and no section has to be argued about individually. Both ends
beat AA for body text, and lime on dark beats AAA.

What takes it: eyebrows and labels, tags, stage and index numerals, link hovers, the
active state of a control, a heading that is deliberately the accent. What does not:
body copy, and anything whose meaning depends on colour alone.

**The label row of the site is brand-coloured by default.** `.eyebrow` itself reads
`--accent-fg`, and so do eyebrows, form labels, stat notes, client names, discipline
lists, the progress rail and the index numerals — 23 rules that were `--muted`. On a
light section they are cobalt, on a dark one lime.

`.eyebrowMuted` is the opt-out, for a label that has to stay quiet. `.eyebrowBrand`
still exists and is now the same declaration as the default; it reads as intent at the
call site.

**Controls keep a muted rest state**, because their hover *is* the move to brand
colour: the header nav, the work filter chips, the disclosure trigger, the team
switch, the About service rows, the enquiry Back button. Painting those accent at rest
removes the only signal that they do anything.

---

## 2. Typography

Three faces, already loaded in `app/layout.tsx`. No new font is added.

| Face | Variable | Role |
|---|---|---|
| **Oswald 700** | `--font-oswald` | **Accent only (Sep 2026).** Hero wordmark, header and footer wordmarks, the nav overlay menu, and the two marquee textures (homepage Teams bands, About vocabulary). Nothing else. Always uppercase. |
| **Inter Tight** | `--font-inter-tight` | Body, UI, **and every heading** — 500 weight, sentence case, tight tracking (−0.035 to −0.055em). |
| **IBM Plex Mono** | `--font-plex-mono` | Eyebrows, stage numbers, tracked-out labels. Never body copy. |

> **Changed 22 Sep 2026, by request:** Oswald on every heading "made it too loud". It
> is now used subtly — the brand marks, the menu, the marquees above, and (23 Sep, by
> request) four display headings: "Latest work", the About intro heading, "Two
> specialist teams, one roof" and the services option wheel — and every
> section, card and case-study heading is Inter Tight 500 in sentence case. The table
> below keeps the old rows for reference; where they say Oswald for a heading, read
> Inter Tight 500. `.sectionHeading` is `clamp(2rem, 4.4vw, 3.9rem)`, −0.04em.

Oswald 700 uppercase is the heading treatment on vanmorrison.com — verified against
the live site, which serves Oswald 700 for nav and section headings (its *body* is
Inria Serif, which we do not use).

### Scale

| Role | Face | Size | Leading | Tracking |
|---|---|---|---|---|
| Hero wordmark | Oswald 700 | `clamp(3.25rem, 21vw, 20rem)` | 0.94 | −0.02em |
| Section heading | Oswald 700 | `clamp(2.25rem, 6.4vw, 5.6rem)` | 0.96 | −0.015em |
| Card / panel title | Oswald 700 | `clamp(2rem, 4.4vw, 3.6rem)` | 1.0 | −0.02em |
| Statement | Inter Tight 300 | `clamp(1.75rem, 3.4vw, 2.25rem)` | 1.25 | −0.02em |
| Body | Inter Tight 400 | 17px | 1.5 | 0 |
| Small | Inter Tight 400 | 13px | 1.5 | 0 |
| Eyebrow | IBM Plex Mono 400 | 11px | 1 | +0.2em, uppercase |

`.eyebrow` in `app/globals.css` is the house label and carries the row above. There is
one variant: **`.eyebrowBrand`**, identical but painted `--accent-fg` — cobalt on a
light section, lime on a dark one. It is the main way brand colour gets into a section
header without touching body copy, and it is safe on either ground.

`.sectionHeading` in `app/globals.css` is the house section title and already carries
this. Put new section titles on it rather than restyling locally. It is sized so the
longest heading on the site holds one line at shell width — **if a new heading wraps,
shorten the heading, not the type.**

### The rule that keeps it readable

**Condensed caps are for two or three words.** Anything that is a full sentence stays
Inter Tight 300: the services hero headline, the Scalina System statement, the founder
quote. A whole sentence in condensed uppercase is a wall.

### Numerals

Split by scale, not by role — this was ambiguous in the first draft and produced a
wrong call during the audit:

- **Display numerals** — the pillar numbers in What We Do, running at 100px+ as a
  ghosted graphic element — are display type. **Oswald**, `--brand-blue` at ~30%
  opacity.
- **Label numerals** — the System stage numbers, the `01 / 03` on a social slide, any
  number set at eyebrow size with tracking — are labels. **IBM Plex Mono**.

If it is big enough to read as a shape rather than as a word, it is Oswald.

---

## 3. Logo

### The mark

Three bars scaling in perspective — a growth signal and a media wedge at once. It is
now **real vector paths**, not the bitmap that was embedded in the old SVG:

```html
<svg viewBox="0 0 556 565" fill="currentColor" role="img" aria-label="Scalina">
  <path d="M0 18h114v514H0z"/>
  <path d="M184 18h147v514H184z"/>
  <path d="M381 121 556 0v565L381 433z"/>
</svg>
```

`fill="currentColor"` so it inherits the ground. Do not hardcode a fill.

### The wordmark

**SCALINA**, Oswald 700, `text-transform: uppercase`, `letter-spacing: -0.02em`.
It is type, not a drawing — there is no wordmark asset to ship.

### Colour

| Ground | Logo |
|---|---|
| Light (`#F5F2F3`) | Cobalt `#1E45FB` |
| Dark (`#08080A`) | Bone `#F4F2ED` |
| Cobalt | Bone `#F4F2ED` |

**Never lime.** Lime is the accent that points at the next action; a logo that changes
colour to do that job stops being a logo.

### Lockups

- **Horizontal** (primary) — mark, then wordmark. Gap = width of bar one. Nav bars,
  letterhead, email footers.
- **Stacked** — mark above wordmark, both flush left with the S. Vertical video
  end-cards, profile headers, apparel.
- **Mark only** — avatars, favicon, app icon. Mark at ~54% of the tile height,
  optically centred.

Clear space on every side equals the width of bar one. Nothing enters it, including
the tagline.

### Sub-brands

`MARK · SCALINA │ MEDIA` and `MARK · SCALINA │ SYSTEMS`. The divider is a 1px rule at
cap height, never a slash inside the word. Team label in IBM Plex Mono, accent
coloured. Media locks up on dark; Systems on cobalt or light. Same weight — neither is
the junior brand.

### Size floor

Below ~16px the **word** goes first, not the mark: condensed caps close up before three
bars do. Anything smaller than the site header uses the mark alone.

### Never

- A lime mark.
- Title case. The wordmark is SCALINA, always.
- Default Oswald tracking. It is always −0.02em.
- Stretching, rotating or rounding the mark.
- The mark on a photo without a solid block behind it.
- A gradient anywhere in the logo.
- A tagline locked inside the lockup. It sits beside it.

---

## 4. Ground and the two teams

**Ground is the tell.** A viewer should know which team made something before they
read a word of it.

| | Ground | Texture | Grid |
|---|---|---|---|
| **Scalina Media** | Dark `#08080A` | Halftone, full-bleed imagery, vertical video | May break it |
| **Scalina Systems** | Light `#F5F2F3` or cobalt | Visible grid, 1px rules, mono annotation | Never breaks it |

Halftone: `radial-gradient(circle, <accent at 0.3-0.45> 1px, transparent 1.3px)` at
`background-size: 7px 7px`.
Systems grid: 1px `linear-gradient` rules at `background-size: 28px 28px`.

Both textures are live on `/about` (`AboutTeams.module.css`), drawn in cobalt on the
light ground. That section is where the two teams sit side by side without either one
getting its own ground, so the texture carries the tell instead — the halftone reads
as Media, the ruled grid as Systems, and neither team is demoted to a caption.

The page's dark/light alternation is **timed, not scrubbed**, and driven entirely by
`lib/grounds.ts` + `lib/useGroundRhythm.ts`. Sections never set their own background
or text colour — they read the tokens. Read the comments in `lib/grounds.ts` before
changing any of it, and **run `npm run test:contrast` after.**

Current ground order is deliberate and was asked for section by section (see
`HANDOFF.md` → *Ground balance*). Do not "fix" it for consistency.

---

## 5. Grid and spacing

- **12 columns**, `--shell: 1440px`, `--gutter: clamp(20px, 3vw, 40px)`.
- Tablet drops to 8 columns, phone to 4.
- Full-bleed colour blocks ignore the gutter. Type never does.
- **Spacing is a 2px grid, 4px preferred.** Section padding is 96 desktop / 56
  phone. Common steps: 4 · 8 · 10 · 12 · 14 · 16 · 20 · 24 · 28 · 32 · 40 · 48 ·
  56 · 64 · 80 · 96 · 128. Enforced by `npm run test:scale`, which fails the
  build on anything off the 2px grid and warns on anything off the 4px one.
- Minimum touch target 44px. The small button is 46px and never smaller. Also
  enforced, by measurement rather than by rule — see §10.

> **This used to print a ten-value scale — 4·8·12·16·24·32·48·64·96·128 — and
> say "if a gap wants a number that is not on this list, the layout is wrong."
> It was audited on 2026-09-21 and the build disagreed: 234 of 346 spacing
> endpoints sat off that list, but **100% of them were multiples of 2 and 86%
> multiples of 4**.
>
> That is not a site that ignored its scale. It is a site built on a finer one,
> using 10, 14, 20, 22, 26, 28, 36, 44, 56, 72 and 80 throughout. Snapping those
> 234 values onto the ten-step list would have moved some by **up to 112px**,
> which is not conformance — it is re-proportioning every section on the site.
>
> So the doc was wrong, not the build, and the scale above is what was actually
> designed. The same call was made once before in §6, about pill corners: the
> reverted change is recorded there for the same reason. **If a coarser scale is
> ever genuinely wanted, that is a deliberate redesign, not a conformance fix.**

---

## 6. Components

### Buttons

| Variant | Fill | Text | Height |
|---|---|---|---|
| Primary | `--brand-accent` | `#0B0D12` | 52px |
| Primary (on accent-heavy screens) | `--brand-blue` | `--bg` light value | 52px |
| Secondary | transparent, 2px `currentColor` border | inherit | 46px |
| Text link | none | `--brand-blue`, 2px underline | — |

**Pill corners** (`border-radius: 9999px`) on buttons and controls; the wide enquiry
chips are `18px`. One primary per screen. The header's "Start a project" stays a plain
nav link — **do not reintroduce a filled CTA in the bar** (asked for explicitly).

> **This section used to say "square corners", and the code was briefly changed to
> match. That was reverted on request — the pill is the house shape.** The doc was
> wrong, not the build: every control had shipped rounded since the beginning, and
> squaring them changed the character of the whole site. If a square-cornered control
> is ever wanted again, it is a deliberate redesign, not a conformance fix.

Media and cards keep their own radii and were never part of that change: the work and
project panels, the Teams panels, and the Scalina System stage cards at 40px.

### Tags and chips

Outline (1.5px, cobalt) for capabilities; solid ink with accent text for status
("Shipped"). Eyebrow type. Square corners.

**Team badges** (`/work` cards) are a capability, not a status: **Systems is solid
cobalt, Media is cobalt outline.** Media was a lime fill, which put a lime element on
every Media card in the grid — the §1 ration says lime points at one thing per screen,
and a badge that repeats down a list points at nothing.

### Section header

Number, rule, one sentence, then the list:

```
[eyebrow]  02 — GROWTH
[4px rule in --brand-blue]
[Oswald caps]  GROWTH
[body]  Growth turns attention into pipeline.
```

Every service section uses this and nothing else.

### The Scalina System cards

Four pinned stage cards. Their backgrounds move off the old orange ramp onto the brand:

| Stage | Background | Foreground |
|---|---|---|
| 01 Attract | `#CDF22B` | `#0B0D12` |
| 02 Amplify | `#1E45FB` | `#F4F2ED` |
| 03 Convert | `#0B1F8F` | `#F4F2ED` |
| 04 Operate | `#08080A` | `#F4F2ED` |

Light → dark as the loop progresses. Values live in `STAGES` in
`components/sections/ScalinaSystem.tsx`.

---

## 7. Copy

- **Nothing on the homepage runs past two lines.**
- The public site browses by what a client is buying: **01 Content · 02 Growth ·
  03 Technology**. Media/Systems is *who does the work*. Never show both cuts on the
  same screen.
- Each pillar has one sentence and it is already written. Do not rewrite per page.
  - Content brings them in.
  - Growth turns attention into pipeline.
  - Technology runs what happens next.
- Tagline: **Go Digital, or Go Invisible.**
- Manifesto line closes the homepage and appears nowhere else: **Both halves. That's
  the whole job.**
- **Never invent metrics, testimonials, client names or dates.** Every figure must be
  traceable. `lib/services.ts` currently contains fabricated testimonials mixed with
  real client names — flagged in that file and in `README.md`, and they must be
  replaced with real, signed-off quotes before launch.

---

## 8. Migration checklist

**Applied in full on 2026-09-14.** Boxes are ticked; the notes record what the
migration actually found, which differed from the plan in two places (§1 and §8.3).
Line numbers drift; search by token name.

### 8.1 — Tokens (`app/globals.css`)

- [x] `--brand-blue: #004AAD` → `#1E45FB`
- [x] `--brand-yellow: #F6C700` → rename to `--brand-accent: #CDF22B`
      (rename it — nothing should read "yellow" while painting lime)
- [x] `lib/grounds.ts` → light `--link-hover: '#004AAD'` → `'#1E45FB'`
- [x] Add the ground-aware `--focus` token and switch `:focus-visible` to it

### 8.2 — Accent rename, 8 files

Replace `var(--brand-yellow)` with `var(--brand-accent)`, and with `var(--focus)`
wherever it is painting a focus ring:

- [x] `app/globals.css` — `::selection` (accent), `:focus-visible` (focus)
- [x] `components/NavOverlay.module.css` — `.footLink:hover` (accent)
- [x] `components/sections/StartProject.module.css` — `.cta` background (accent)
- [x] `components/sections/Teams.module.css` — `.pill:focus-visible` (focus)
- [x] `components/services/ServiceCta.module.css` — background (accent)
- [x] `components/services/ServiceExplorer.module.css` — `.step:focus-visible` (focus)
- [x] `components/start/EnquiryFlow.module.css` — two outlines (focus)
- [x] `components/start/StartView.module.css` — `.directLink:hover` (accent)
- [x] `components/work/WorkIndex.module.css` — two outlines (focus), `.badgeMedia`
      background (accent)

### 8.3 — Logo

- [x] `components/SiteHeader.module.css` `.brandName` — already Oswald 700 uppercase;
      change `letter-spacing: 0.01em` → `-0.02em`
- [x] `components/SiteFooter.module.css` `.wordmark` — **the one real face change.**
      Fraunces 350 title case → Oswald 700, uppercase, `-0.02em`. **The size moves
      down, not up: `32cqi` → `24cqi`.** Measured at a 1440px container, Fraunces
      "Scalina" renders 1162px; Oswald "SCALINA" renders 1541px at the same size —
      caps are wider and there is no lowercase to pull the average down. `line-height`
      `0.78` → `0.86` so the caps clear the wrap's `overflow: hidden`.
- [x] The mark: there was never a bitmap *in the repo* — `SiteHeader.tsx` already had
      a hand-drawn vector approximation with two **equal** 15-wide bars. Replaced with
      the measured geometry (bars 114 and 147 wide, wedge taller than both) in a
      `0 0 556 565` box. The unequal bars are the whole point: equal ones flatten the
      mark into a plain play icon.

### 8.4 — Stage cards

- [x] `components/sections/ScalinaSystem.tsx` — `STAGES[].bg` / `.fg` to the table in §6

### 8.5 — Verify

- [x] `npm run test:contrast` — the sweep asserts contrast never drops below 3:1
      across a ground boundary. Changing a brand colour is exactly what it exists to
      catch.
- [x] `npx tsc --noEmit` and `npm run lint`
- [x] Check `:focus-visible` by tabbing through a **light** section — that is the
      regression this change is most likely to introduce.

---

## 9. Resolved — Fraunces is gone

Fraunces was the fourth face. It survived on three things: the closing CTA
(`StartProject.module.css .heading`), the four stage card titles
(`ScalinaSystem.module.css .cardTitle`), and the manifesto line (`Manifesto.tsx`,
inline). All three are now **Oswald 700 uppercase, `-0.02em`, `line-height: 0.96`**,
and the font is removed from `app/layout.tsx` and the `<html>` className.

Why: a whole variable-font download for three pieces of text, in a system that has no
serif anywhere else in it — not in the logo, not on the boards, not in any other
heading. Keeping one serif for three headings reads as drift, not as an exception.

**This overrides an earlier instruction, deliberately.** `HANDOFF.md` records that the
closing CTA and the stage titles were put *back* to Fraunces after an earlier pass
"took Oswald too far". That complaint was about **sentences in condensed caps**, and
it was right — which is why the rule in §2 exists and why the services hero and the
System statement are still Inter Tight 300. But the three headings above are not that
case: `ATTRACT` / `AMPLIFY` / `CONVERT` / `OPERATE` are single words, and
`BOTH HALVES. THAT'S THE WHOLE JOB.` is six. They are exactly what condensed caps are
for.

**To revert**, restore the four backed-up files and re-add the `Fraunces` import,
the `fraunces` loader and its `.variable` to the `<html>` className.

---

## 10. Conformance — audited 2026-09-14

Every heading 26px and over on `/`, `/services`, `/work`, `/about` and `/start` was
checked against §2 by reading computed styles in the browser, not by eye. Result:
**all on Oswald 700 uppercase, with one deliberate exception.** `/work`, `/about` and
`/start` were already clean.

Four violations were found and fixed:

| Where | Was | Now |
|---|---|---|
| `ServiceDisclosure.module.css` `.name` — the What We Do pillars | 108px Inter Tight 400, title case | Oswald 700 caps, `-0.02em` |
| `ServiceDisclosure.module.css` `.number` | 104px Inter Tight 300, muted grey | Oswald 700, `--brand-blue` at 30% |
| `Shipped.module.css` `.featuredLabel` | 27px Inter Tight 400 | Oswald 700 caps |
| `ServiceExplorer` — the OptionWheel options | 32px Inter Tight 200/500 | Oswald 700 caps |

The OptionWheel is vendored and kept verbatim, so its type is set from
`ServiceExplorer.module.css` through the global `.option-wheel__item` class it emits,
rather than by forking the component. Only face, case and tracking are overridden —
`--ow-font-size` stays the component's own.

**The deliberate exception:** `ServicesHero` renders at 95px in Inter Tight 300. That
is correct and must stay — it is a full sentence ("We build the software your business
actually runs on."), and §2 keeps sentences off the condensed face. `HANDOFF.md`
records it was tuned down from a 128px reference for exactly this reason. An audit
that "fixes" it has misread the rule.

To re-run the audit, paste this in the browser console on each route — it returns only
the offenders:

```js
[...document.querySelectorAll('h1,h2,h3,h4,p,span,div,a')]
  .filter(el => !el.children.length && el.innerText.trim() && el.innerText.length < 60)
  .filter(el => parseFloat(getComputedStyle(el).fontSize) >= 26)
  .filter(el => !getComputedStyle(el).fontFamily.startsWith('Oswald'))
  .map(el => `${Math.round(parseFloat(getComputedStyle(el).fontSize))}px ` +
             `${getComputedStyle(el).fontFamily.split(',')[0]} "${el.innerText.slice(0,40)}"`);
```

### Second pass — colour and labels, same day

The first pass checked **face**. It did not check **colour**, and it only looked at
type 26px and over, so the label row underneath was never sampled. Both gaps showed up
immediately:

| Where | Was | Now |
|---|---|---|
| `globals.css` `.eyebrow` — the house label utility | Inter Tight 12.8px / 0.14em, i.e. not the label face at all | IBM Plex Mono, 11px, `+0.2em` |
| `WorkIndex.module.css` `.badgeMedia` | lime fill, once per Media card | cobalt outline (§6) |
| `AboutIntro` `.heading` | `--text` | `--brand-blue` (light ground, 5.7:1) |
| `ScalinaSystem` eyebrow | muted, Inter Tight | `.eyebrowBrand` — cobalt, Plex Mono |
| `EnquiryFlow` `.chip:hover` | `--text` border | `--brand-blue` border |
| `StartProject` `.heading` | `clamp(2.5rem, 6.4vw, 5.6rem)` — wrapped to three lines | `clamp(2rem, 4.2vw, 3.75rem)` |

Four local `.eyebrow` copies (`AboutIntro`, `StartIntro`, `ServicesHero`,
`ServiceExplorer`) already had the right face and were left alone — they differ only
in margin and tracking, which is layout, not system drift.

Running the label check below then turned up six more, all the same fault — a
tracked-out uppercase label set in the body face:

| Where | Was |
|---|---|
| `Founder.module.css` `.attribution` — "SUHAN SHANKER, FOUNDER" | Inter Tight 0.12em |
| `Shipped.module.css` `.clientLabel` — "CLIENT" | Inter Tight 0.16em |
| `Shipped.module.css` `.panelTitle` — the software tags | Inter Tight 0.14em |
| `SelectedWork.module.css` `.subtitle` — the discipline tags | Inter Tight 0.14em |
| FlowingMenu `.menu__item-link` — the What We Do service rows | Inter Tight 0.14em |
| FlowingMenu `.marquee span` — the hover marquee mirroring those rows | Inter Tight |

All are now Plex Mono at `0.18–0.2em`. The two FlowingMenu rules are styled from
`ServiceMenu.module.css` through the global class names the vendored component emits
— the same route as the OptionWheel override above, and for the same reason.

The founder *quote* stays Inter Tight. It is speech, not a label, and §2 says so.

**After both passes, `/`, `/about`, `/work`, `/start` and `/services` return zero
offenders on both checks.**

**The label row is the audit's blind spot.** The §10 snippet filters to `>= 26px`, so
it can never see an eyebrow. When re-running it, check the label face separately:

```js
[...document.querySelectorAll('*')]
  .filter(el => !el.children.length && el.innerText?.trim())
  .filter(el => parseFloat(getComputedStyle(el).letterSpacing) > 1.4)
  .filter(el => !getComputedStyle(el).fontFamily.includes('Plex'))
  .map(el => `${getComputedStyle(el).fontFamily.split(',')[0]} "${el.innerText.slice(0,30)}"`);
```

### Motion components — Skiper UI, vendored

Three Skiper UI components were asked for by name. All three are **ported**, not
installed: `npx shadcn add` wants a `components.json` and Tailwind, and this project
has neither on purpose. Same route every React Bits and unlumen component took — see
`README.md` → *Vendored components*. They import `motion/react` rather than
`framer-motion`, which is the same API under the package already installed, so only
`swiper` was actually added.

| Component | From | Where it is used |
|---|---|---|
| `vendor/TextRoll.tsx` | `skiper58` | Header nav. Each item rolls to `--accent-fg` on hover — lime over the dark hero, cobalt over light sections. |
| `vendor/LinePath.tsx` | `skiper19` | `/about` → *How we work*. A stroke down the numeral column, drawn by scroll progress. |
| `vendor/Carousel.tsx` | `skiper48` · `skiper49` · `skiper51` | `/work` → *Flick through it*. One component, `effect` prop: `cards` (48), `coverflow` (49), `creative` (51). |

**Skiper UI's licence requires attribution on the free tier.** Each vendored file
carries its upstream block; do not strip it.

Upstream ships 48/49/51 as three near-identical files differing by ~6 lines of Swiper
config, so they are one component with an `effect` prop rather than three copies.

Two of the three needed a change beyond styling, both recorded in their file headers:
`LinePath`'s scroll `offset` (upstream's default is built for a 350vh demo and leaves
the line ~80% drawn on arrival — measured 0.80 → 0.93 across a normal section), and
`Carousel` taking `slides: ReactNode[]` instead of `images: {src, alt}[]`, because
there is still no case-study photography and nothing was going to be invented to fill
it. It draws the same `tone` gradients the rest of the site uses as placeholders.

### Revised after review

- **Corners went back to pills.** See §6 — the doc was wrong, the build was right.
- **`/services` lost its work carousel.** Second time a work showcase has been
  removed from that page; it is recorded in `HANDOFF.md` as a don't-reintroduce.
  The work lives on `/work`, which now opens with a card deck above the filterable
  index.
- **The Scalina System aside is levelled against the statement.** The column
  stretches to the statement's height and distributes, so the eyebrow lines up with
  the first line and the stage list with the last. It was finishing ~36px short.
- **The `/about` thread crosses the section** rather than running down the numeral
  gutter — one pass per principle, behind the copy.

### `/about`'s opening

**Light** ground, **cobalt** heading, **cobalt** caption. The caption was lime for one
pass — 1.2:1 on that ground — and went back to cobalt on request. **There is now no
text anywhere on the site below AA.**

### Cobalt and lime sections

Both brand colours are grounds now, spread so no page runs the same crossing twice:

| Page | Order |
|---|---|
| Home | dark hero · dark teams · **dark shipped** · **cobalt** what-we-do · light system · **lime** selected work · light founder · dark manifesto · dark close |
| About | **light** intro · light teams · **cobalt** principles · **lime** proof · light founder · dark manifesto · dark close |
| Work | **cobalt** intro · **lime** showcase · light index · dark close |
| Start | **cobalt** intro · light flow · **lime** faq · dark direct · dark close |

**Featured work (`Shipped`) stays dark** — it was briefly cobalt and its project
panels, which paint dark navy placeholder gradients, disappeared into it.

`ScalinaSystem` cannot be lime: its first stage card *is* `#CDF22B`, so the card
would vanish into the ground. It stays light.

Everything else followed from the tokens rather than needing a decision:

- Stat figures (`ServiceProof`) are `--accent-fg` at full opacity — lime on Media's
  dark proof band, cobalt on Systems' light one. They were muted grey at 50%, which
  read as placeholder rather than as the result.
- The services hero lede is `--accent-fg`: cobalt on Media, lime on Systems.
- The manifesto's closing line is `--accent-fg` — lime, on dark.
- The explorer's deliverable chips fill with `--accent-bg` on hover: a lime block on
  light, a cobalt block on dark.
- `/start`'s Continue button is the accent fill — the one primary action on screen.
- The nav overlay runs Skiper's `TextRoll`. The outline treatment survives it: the
  resting layer keeps the hollow letterform, and the copy rolling up from below is
  solid lime. That overlay paints its own `#08080A` and does **not** follow the
  ground rhythm, so it uses the fixed `--brand-accent`, not `--accent-fg`.

### Ground order — `/about` is light until the manifesto

Changed on request. The page now runs **light intro · light teams · light principles ·
light proof · light founder · dark manifesto · dark close** — one boundary, at the
manifesto, instead of the three it had. `AboutTeams` and `AboutPrinciples` were dark.

This supersedes the `/about` row of `HANDOFF.md` → *Ground balance*, which is updated
to match. The homepage order is untouched: `Manifesto` is shared between the two pages
and stays dark on both.

---

## 11. How to use these documents

There are four files in the repo root and they answer different questions. Read them
in this order when picking the project up cold:

| File | Answers | Who maintains it |
|---|---|---|
| `README.md` | How the app is built — architecture, routes, data model | You / your dev |
| `HANDOFF.md` | **Why the code is shaped the way it is** — decisions, bugs already fixed, things not to reintroduce | Appended each session |
| `DESIGN.md` (this file) | **What it should look like** — tokens, type, logo, components | Updated *before* a visual change, not after |
| `AGENTS.md` / `CLAUDE.md` | Auto-generated by Next 16 as the agent entry point. `CLAUDE.md` is just `@AGENTS.md` | Next — don't hand-edit |

`HANDOFF.md` lives at **`/Users/sian/Desktop/Scalina Media/HANDOFF.md`**, beside this
file. It is the single most valuable document here: it records the reasoning behind
things that look arbitrary (why the hero waits on the WebGL field, why `Reveal` must
not use `once: true`, why the ground rhythm is derived from scroll position rather
than tween progress). Most of those entries exist because the bug was hit once
already.

### Working with an agent

Point at the document rather than re-describing the system:

> Read `DESIGN.md`, then restyle the `/about` proof section to match. Follow §2 for
> type and §6 for components. Do not change anything in §9.

> I want the Selected Work cards to use the accent. Check `DESIGN.md` §1 for the
> contrast rules before you pick a colour, and run `npm run test:contrast` after.

Two habits make this work:

1. **Change the doc first, then the code.** If you decide the accent should move, edit
   §1, *then* ask for the migration. A doc written after the fact describes whatever
   the code happens to do, including its mistakes.
2. **Give the agent the verification loop, not just the task.** Every visual change
   ends with `npx tsc --noEmit`, `npm run lint`, `npm run build`, and
   `npm run test:contrast` if it touched colour or `lib/grounds.ts`.

### Working without one

`DESIGN.md` is a spec, not a stylesheet — nothing imports it. The values that actually
ship live in `app/globals.css` (`:root`) and `lib/grounds.ts`. Change them there, then
update §1 to match. If the two ever disagree, **the code is what the visitor sees and
the doc is wrong.**

### When something new gets designed

Add it to the relevant section here in the same sitting. The three rules most likely
to be broken by a new section, in order:

1. A full sentence set in condensed caps (§2).
2. The accent used as type on a light ground (§1).
3. A spacing value that is not on the scale (§5).

### The checks, and what each one catches

```bash
npm run dev            # localhost:3000
npx tsc --noEmit       # types
npm run lint           # eslint
npm run build          # the real gate — catches what dev mode forgives
npm run test:contrast  # text never drops below 3:1 across a ground boundary
```

`npm run test:contrast` is the one that is easy to skip and expensive to skip. It
sweeps 400 steps across both ground transitions and reports the worst contrast in each
direction. Run it after **any** change to a brand colour, a ground token, or
`lib/grounds.ts`.

### Still outstanding, unrelated to this system

- ~~`lib/services.ts` contains **fabricated testimonials**~~ — **resolved 2026-09-21.**
  All twelve were removed, not four: two were attributed to companies that do not
  exist, two to names that are not clients, and **eight were put in the mouths of
  real clients**, which is precisely what About principle 03 promises the studio
  does not do. `ServiceProof` now derives its client list from `lib/work.ts` — a
  name cannot appear unless a real project sits behind it — and states that quotes
  are outstanding. Add a `quote` to a client in `lib/services.ts` when one is
  signed off.
- ~~`app/api/enquiry/route.ts` ... **is not wired to a destination**~~ — **resolved
  2026-09-21.** Delivery lives in `lib/deliverEnquiry.ts` and goes to the Scalina
  CRM and to email, in parallel, configured from `.env.local`. **It is not
  configured yet, and an unconfigured deployment returns 502 on every
  submission** — deliberately, so the confirmation's "a reply from a person within
  one business day" is never shown over a send that went nowhere. See
  `README.md` → Enquiry delivery for the variables.
- Client logos in the hero marquee are text wordmarks standing in for real logo files.
- The homepage can be scrolled sideways by **19.5px** (programmatic only — `body`
  clips, so no scrollbar appears and nothing visibly moves). The overflow comes
  from inside the teams marquee. Do **not** fix it with `overflow-x: clip` on
  `html`: that was tried on 2026-09-21 and it breaks `position: sticky` site-wide,
  which every pinned section depends on.
