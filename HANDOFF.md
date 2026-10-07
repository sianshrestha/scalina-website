# Scalina — Session Handoff

Written when the previous chat hit its context limit, so a new session can pick up
without re-deriving everything. Read this first, then `README.md` for the
architectural detail (it's kept up to date and is the deeper source of truth).

## What this project is

A Next.js 16 (App Router, TypeScript) rebuild of a Claude Design homepage handoff
(`Scalina Home.dc.html`) for **Scalina**, an Australian creative/growth/tech agency
with two internal teams — **Scalina Media** (content, light ground) and
**Scalina Systems** (software, dark ground) — under one brand.

- Working directory: `/Users/sian/Desktop/Scalina Media`
- **No git repo has been initialized here.** `git status` from this directory
  resolves to the *home directory* repo (`/Users/sian`), not a project repo. All
  work so far is uncommitted, untracked local files only. If the user wants version
  control, `git init` inside this exact folder first — do not run git commands
  assuming they're scoped to this project, they aren't.
- Dev server: `npm run dev` (or the `scalina-web` launch.json entry via the
  Claude_Browser preview tools). Build: `npm run build`. Also `npm run lint`,
  `npx tsc --noEmit`, `npm run test:contrast` (see below).
- Brand source doc the user supplied early on: `scalina-brand-positioning-v4.md`
  (in Downloads, not copied into the repo) — defines colors, type roles, copy
  rules ("never invent metrics/testimonials"), the two-team structure, and the
  Attract/Amplify/Convert/Operate loop.

---

# READ THIS FIRST — 7 Oct 2026: now a git repo

- **The project is a git repository** (`main`), pushed to the private GitHub repo
  `sianshrestha/scalina-website`. Every "no git repo" note below is superseded.
  Commits carry the owner's name only: no Claude attribution or co-author lines.
- README rewritten with screenshots (`docs/screenshots/`, captured from a
  production build with reduced motion so entrances are settled). The old
  technical README is `docs/ARCHITECTURE.md`.
- ANFA Australia now has its finished video (`public/work/anfa-australia/`).
- Founder photo is `public/founder-portrait.jpg` (1254px).
- **Fixed a homepage crash:** vendored `FlowingMenu` measured a closed panel as
  0px wide and called `Array(Infinity)` ("Invalid array length"), killing the
  page under reduced motion. Guarded in place (LOCAL PATCH comment).
- Missing `favicon.ico` still 404s; add one to `app/`.

---

# READ THIS FIRST — follow-up 3, 23 Sep 2026

- **Caption scope clarified by the owner:** removed = bento tile source lines,
  case-study picture captions/figcaptions (incl. drawn-media captions like
  "Weekly delivery, counted off the client folder") and the page-level sample
  data note. KEPT = section headings and their intro lines ("Counted, not
  estimated…", "Every number here…", "Quotes are being collected…").
- **WordRise bug fixed:** `inView` headings never appeared because the observer
  sat on the words, which start clipped by their mask. It now observes the
  heading (`useInView` on the Tag). Note the preview pane often never delivers
  IntersectionObserver callbacks; a real scroll event wakes it.
- **Reverted by request:** What We Do numerals back to Inter Tight; services
  option wheel back to Inter Tight (selected item still brand colour).
- Services hero eyebrow is plain `--text`. About intro supporting paragraph has
  no entrance. About team cards have no CSS transform transition (GSAP scrubs
  them; the transition caused the fade glitch). "Rather just talk?" on /start
  lists the placeholder phone too.
- Founder photo is `public/founder-suhan.jpg` (renamed so the image cache could
  not keep serving the old `founder.jpg`). Source is 678px square; a larger
  original would look sharper in the 4:5 frame.

---

# READ THIS FIRST — follow-up 2, 23 Sep 2026

- **Captions removed by request:** no "Real interface · sample data" on Shipped or
  case media, and no source line on bento tiles or case results. Sources still
  live in `lib/proof.ts` / `lib/work.ts` as the record; a single page-level note
  on software cases still says screens use sample data.
- **Figures:** OZI HP saving = **$350+ a month** (was $400-500 on the old system,
  now $50; owner-supplied — "a month" is assumed, confirm). Only savings are
  shown, never what the client pays Scalina. The SaaS tile is no longer pending.
- **Colour/type tweaks:** services hero headline is brand colour (lede muted);
  only the selected option-wheel item is brand colour; What We Do pillar
  numerals are Oswald; /start Continue is fixed brand blue with light ink;
  Scalina System aside is just the eyebrow (stage list removed).
- **Page intros:** `components/WordRise.tsx` (word-mask rise, on load or
  `inView`) on the /work, /about, /services (replays on team switch) and /start
  headings, plus the About/Services proof headings. It replaces fades that were
  already there; no new motion after colour wipes, homepage hero untouched.
  No-JS fallback: `[data-word-rise]` rule in the layout noscript.
- **Founder photo replaced** (`public/founder.jpg`; old one in scratchpad only).
- **Placeholder phone** in the footer: 0491 570 156 (ACMA fiction range). Swap
  in `CONTACT` in `components/SiteFooter.tsx`.

---

# READ THIS FIRST — follow-up of 23 Sep 2026 (owner feedback round)

- **Naming/permissions settled:** it is **Gurkha** Jewellery (slug `gurkha-jewellery`,
  media in `public/work/gurkha-jewellery/`). Every client is named with permission.
  New client **Sydney Easter Show** (`/work/sydney-easter-show`, 3 creator-led food
  videos shot at the Show).
- **Finished videos** come from `~/Desktop/Scalina Clients /<client>/Deliverables*`
  (note the trailing space in the folder name). Each is encoded twice into
  `public/work/<slug>/`: `<name>.mp4` (9s muted loop, 540w) + `<name>.webp` poster,
  and `<name>-full.mp4` (full edit, 720w, AAC). Media type `video` has `full`;
  phones show "Watch with sound" and open `components/work/VideoLightbox.tsx`
  (portal, Esc/backdrop close, Lenis paused, focus returned). Raw Maya clips retired.
  ~138MB total; full edits only load on tap.
- **No em dashes in visible copy** (owner: they read as AI). Ranges use a hyphen:
  "3-4", "$1k-$5k". Comments may still use them. Scanner script idea: strip
  comments, grep `—|–|&mdash;` in app/components/lib.
- **Oswald is back on specific headings by request:** "Latest work", About intro
  ("Most agencies pick a side."), About "Two specialist teams, one roof" (heading +
  probe), and the services option wheel. Everything else stays Inter Tight.
- **Cost per lead = $1.9 AUD** (owner-supplied) — Media bento tile, no longer pending.
- **Fixes:** Teams band detail no longer stays visible after closing (was
  `.band:focus-within`); `.inlineLink` underline is a background gradient because
  `::after` is used as a 44px hit area on several links (it rendered black boxes);
  /start Continue uses fixed brand lime (ground tokens cross-faded late); Shipped
  panels are 16:10 with the screen filling them; Scalina System statement is 4
  lines (22% aside column, vw-sized type); case title word-masks no longer crop
  descenders; `ParallaxColumns` rewritten (centred over-tall columns, measured
  travel, alternating directions: no gaps, no frozen column), wall shows one video
  per column; About team cards now use the Scalina System card language (lime /
  ink, 40px radius, pill services), still without 01/02 numerals.

---

# READ THIS FIRST — session of 22–23 Sep 2026 (case studies, proof, motion)

Newest delta. Everything below still applies except where marked superseded.

## /work is case studies, one per client
- `lib/work.ts` is rewritten: `CASES` (7 — Gurung Shuttles, OZI HP, Maya Lounge,
  Gorkha Jewellery, Scalina CRM, ANFA Australia, Runaway Entertainment), each with
  brief, chapters, media, results (every result has a `source`), `tint`, optional
  `logo`/`reel`. `WORK`/`DISCIPLINES` are kept as a derived compatibility shape;
  `TOTALS` sums the video/week counts for the proof grids.
- `/work` (`components/work/WorkView` + `CaseIndex`) is minimal by request: intro,
  a quiet All/Media/Systems filter (motion `layoutId` pill), one row per client,
  cursor-following cover preview on hover (motion springs), thumbnails on touch.
  `WorkIndex`/`WorkShowcase` were removed.
- `/work/[slug]` (`app/work/[slug]/page.tsx`, SSG, `dynamicParams = false`) renders
  `CaseView`: word-mask title, meta, scrubbed cover reveal, results grid with
  counters, brief, numbered chapters (layouts wide/pair/phones/posters), a
  marquee of real delivered titles, next-case link.
- `CaseMedia` frames media as browser / phone / poster / bare; videos only play
  while visible. `Designed.tsx` draws what a screenshot can't — DM lead flow,
  voice-agent call, weekly cadence, UGC cover — always captioned illustrative.

## Where the media came from (all in `public/work/<slug>/`)
- **Maya Lounge**: poster/menu series and four raw UGC clips from the Scalina Media
  shared drive (Clients → SMML01 Maya Lounge). The Drive connector only downloads
  files ≤10MB, so the finished videos (20–360MB) are NOT on the site yet — the four
  loops are short raw clips. To add finished edits: download them, then
  `ffmpeg -i in.mp4 -an -vf scale=720:-2 -crf 26 -movflags +faststart out.mp4`.
- **Gurung**: only the logo (a low-res screenshot). No footage ≤10MB existed.
- **ANFA / Runaway**: nothing in Drive → drawn UGC covers, no results row.
- **OZI HP / Scalina CRM**: the real frontends from GitHub run locally with the
  API stubbed by Playwright — real UI, SAMPLE data (captioned). **Gorkha**: the
  real JavaFX screen rendered to PNG. Scripts + instructions:
  `scripts/media-capture/README.md` (swap Gorkha's screen when the new app ships).
- Figures are counted, not estimated: 38 Gurung videos / 13 weeks, 55+ Maya
  videos (duplicates and raw uploads excluded) / 20 weeks, 156 endpoints / 46
  screens / 9 migrations in the WMS.

## Proof bentos
- `components/Bento.tsx` + `lib/proof.ts` (`ABOUT_PROOF`, `MEDIA_PROOF`,
  `SYSTEMS_PROOF`). 2×2 headline tile with real footage/screens, pointer
  spotlight, counters, source line on every tile, links to cases. The two
  figures still owed by clients (CPL, SaaS spend replaced) remain `pending`.
- `AboutProof` and `ServiceProof` use it; `Team.stats` was removed from
  `lib/services.ts`. ServiceProof's client names now link to case studies.

## About → How we work is a scroll story
- `AboutPrinciples`: 400svh track, CSS-sticky stage (works under Lenis, no pin
  spacer), scrubbed GSAP timeline hands the four principles over one at a time,
  counter + rail + a loop ring that draws a quarter per principle. The ring is a
  progress device — its centre never names a stage for a principle. Without JS /
  reduced motion it's a plain list (`data-story` is only set by the timeline).

## Motion stack — Lenis is IN now (supersedes "Do not add Lenis")
- `components/SmoothScroll.tsx` (mounted in `app/layout.tsx`, with
  `lenis/dist/lenis.css`). Lenis runs off `gsap.ticker`, calls
  `ScrollTrigger.update` on scroll, lag smoothing off; wheel only (touch native);
  no instance under reduced motion. `lib/lenis.ts` holds the instance.
  `NavOverlay` stops/starts it; `useSmoothAnchors` uses `lenis.scrollTo`.
  Opt a scroller out with `data-lenis-prevent`.
- motion.dev (`motion/react`) for micro-interactions: `components/Magnetic.tsx`
  on primary CTAs, filter pill, index preview, poster tilt, designed-media
  entrances, bento entrance. `components/StatValue.tsx` counts "55+" and prints
  "24/7" / "3–4" as-is.
- Global: ghost-button arrow nudge + press, inline-link underline sweep.

## Typography — Oswald is an accent now
Only: hero wordmark, header brand, footer wordmark, nav overlay, Teams marquee
words, About vocabulary words. Every other heading (38 selectors across 21
stylesheets) moved to Inter Tight 500, sentence case, ~20% smaller. DESIGN.md §2
updated. **Supersedes** "Typography — the display face" further down.

## Homepage
`SelectedWork` wall shows the 12 real Maya pieces; `Shipped` panels show real
screens (+ Scalina CRM) and link to case studies. `lib/content.ts` CLIENTS now
lists the six case-study clients.

## Open questions for the owner
- Gorkha vs **Gurkha**: the app itself says "GURKHA JEWELLERY"; the site says Gorkha.
- Runaway Entertainment (was "Entertainments") — spelling taken from the latest brief.
- ANFA Australia and Gorkha Jewellery were not on the brand file's
  named-with-permission list — confirm before launch.
- Finished Maya/Gurung videos need downloading (see above) to replace raw loops.

---

# READ THIS FIRST — session of 20–22 Sep 2026

Everything below this block predates that session and is still broadly true, but
three of its section descriptions are now stale and are corrected in place. This
block is the delta.

## The two sections that were rebuilt

**`components/sections/Teams.tsx` — "Counterweight".** The two-panel split is
gone. It is now a full-viewport (`100svh`) section of two full-bleed bands, each
running its own service vocabulary as a marquee in the **opposite direction** to
the other. Media is the light band on top, Systems the dark band beneath, with a
lime hairline seam.

- **Click, not hover.** A band-sized `<button aria-expanded>` sits under the copy
  layer; `.inner` is `pointer-events: none` so clicks fall through to it, and
  only its link takes them back. The user asked for this explicitly — hover on a
  half-viewport target opened and shut on its own while scrolling.
- Opening a band takes 72% of the viewport, **slows** its own marquee (54s) and
  speeds the other (19s). One `--seam` custom property drives both bands'
  `flex-basis` and the badge's `top`, so the boundary cannot drift from the thing
  pinned to it.
- **There is no entrance animation**, deliberately. The hero hands straight over
  on the same ground.
- **The page ground never changes inside this section** (`data-ground="dark"`
  throughout). Making it change was a bug the user caught: it put a white
  background under `Shipped`. The header still has to invert over the light
  band, so the section writes `data-chrome="light"` on `<html>` and **only the
  header's tokens** follow it — see the `html[data-chrome='light']` block in
  `globals.css`.

**`components/about/AboutTeams.tsx` — "Interlock".** The old `ColorWipe` +
separate section is gone; the wipe and the section it becomes are now **one
pinned stage** (360vh track, sticky 100svh stage).

- Sequence: circle wipe opens on the heading → brief hold → the cobalt's clip
  closes onto a band while the heading scales **down** into it → the section is
  revealed behind.
- **Why one component and not `ColorWipe` + a reveal:** a sticky stage always has
  one viewport of track left after it unpins, so a wipe followed by a pinned
  section shows *both* at once — two copies of the same heading scrolling past
  each other. One stage has no such gap. Do not split them again.
- **The heading is laid out at the DISPLAY size and scaled down** (`transform-
  origin: 0 0`, out of flow). Never the other way round: type magnified by a
  transform is rasterised at its layout size first and arrives visibly soft. The
  factor is measured off `.probe`, which carries the size it settles at.
- Two zero-size `[data-ground]` markers inside the track drive the page's
  cobalt→light steps through the pin.

## New: `data-ground-line`, and why the ground rhythm needed it

`lib/useGroundRhythm.ts` gained a per-section trigger line. A section can set
`data-ground-line="<fraction of viewport height>"`, negative meaning "not until
my top is this far *above* the window".

This fixed a real bug: a `ColorWipe` declares the ground the page is on *after*
it, but the default trigger fires when the section's top reaches 0.55vh — while
the top 55% of the screen is still the **previous** section, which therefore
repainted in the colour it was about to leave. `ColorWipe` now derives its line
from its direction (`GROUND_STEP_AT` in that file).

**A section that declares a line also gets an instant step instead of a
crossfade** — you only move your own line because something opaque is covering
the change, and the 1000ms fade otherwise outlived the stage and ran in full
view on the section below.

`resolve()` no longer breaks early; it scans every section and keeps the last
match, because lines are no longer uniform.

## New: the scales, and `npm run test:scale`

`app/globals.css` now carries two token blocks:

- **Motion** — `--d-tap` 120 · `--d-state` 200 · `--d-move` 320 · `--d-open` 480
  · `--d-reveal` 620 · `--d-stage` 900. Anchored **on** the values the site had
  already converged on (200ms had 27 uses, 320ms had 19), not near them. 106
  durations across 23 stylesheets read these. Marquee/field loops in seconds are
  deliberately **not** on this scale.
- **Label band** — `--t-label-sm` 0.62rem · `--t-eyebrow` 0.72rem ·
  `--t-label-lg` 0.8rem. Collapsed from **17** distinct sizes; largest move ~1px.

`tests/scale.test.mts` fails the build on spacing off the 2px grid, raw `ms` or
`cubic-bezier()` outside `globals.css`, and tracked labels not on a `--t-*`
token. **`SiteHeader.module.css` and `NavOverlay.module.css` are exempt** via
`PRESERVED` — see below.

**DESIGN.md §5 was rewritten** against the build: it used to print a ten-step
spacing scale and say anything off it was wrong. Measured, 234 of 346 endpoints
were off that list, but **100% were multiples of 2 and 86% of 4**. The site is on
a finer grid, not an arbitrary one; snapping to the ten-step list would have
moved values by up to 112px. §5 now documents the 2px grid and records why.

## New: enquiry delivery

`lib/deliverEnquiry.ts` sends each validated enquiry to **both** the Scalina CRM
and SMTP email, in parallel, configured entirely from `.env.local`. See
`README.md` → Enquiry delivery for the variables.

**It is not configured yet, and an unconfigured deployment returns 502 on every
submission** — deliberately, because `/start`'s confirmation promises a reply
from a person within one business day and that must not be shown over a send
that went nowhere. The enquiry is logged *before* delivery is attempted, so a
submission is never lost to a failed integration alone. `nodemailer` was added
for this.

## Traps found the expensive way this session — do not rediscover

1. **CSS Modules localises `animation-name`.** A module referencing a keyframes
   declared in `globals.css` compiles to a hashed name matching nothing, and the
   animation silently never runs. The Teams marquee was dead for this reason.
   **Declare keyframes inside the module that uses them.**
2. **`overflow-x: clip` on `html` breaks `position: sticky` site-wide.** Tried as
   a fix for the homepage's 19.5px horizontal overflow; the About stage stopped
   pinning entirely. Reverted. Every pinned section depends on sticky resolving
   against the viewport.
3. **Positional CSS selectors are fragile here.** `.band:last-child` matched
   nothing in Teams because the seam badge is the stack's last child — it
   silently killed the seam rule *and* the second band's flex-basis. Use explicit
   `data-*` attributes.
4. **Appending a rule can silently override a positioned element.** A
   `.brand { position: relative }` appended for a hit-area pseudo-element beat
   the earlier `position: absolute` on the same selector and displaced the
   centred header wordmark. Same specificity, later wins.
5. **A `Reveal` wrapper's GSAP ends by writing `opacity: 1` inline**, which
   silently overrides a CSS `opacity` on the same element. Removing the reveal
   from `ServiceDisclosure` exposed `.number { opacity: 0.3 }` that had never
   been visible, and read as a colour change.
6. **The preview pane starves `requestAnimationFrame`.** This invalidated
   measurements at least six times: the ground crossfade read as "stuck two units
   short", contrast read as 1.0:1, `IntersectionObserver` never delivered, and
   the hero intro appeared frozen. **None were real.** Force frames with real
   `computer` scroll/screenshot calls before trusting any rAF-driven reading, and
   take screenshots as their own call — one batched with a scroll returns the
   pre-scroll frame.
7. **`.next/dev/static/chunks/*.css` holds the previously-compiled CSS.** With no
   git repo, this is the only way to recover exact pre-change values — it is how
   the nav's original 240/520/400ms timings were restored rather than guessed.

## Decisions the user made — do not re-litigate

- **No fade intro animations on a section that follows a colour wipe** onto the
  same ground. Removed from `WhatWeDo`, `ServiceDisclosure`, `StartProject` and
  `AboutPrinciples`. The rule as stated: a transition is only wanted when the
  previous section is a *different* background.
- **The header is fully transparent.** Both a blurred plate and a ground-coloured
  veil were built and both were rejected. The wordmark can therefore print on
  body copy on some routes; this is accepted and should not be raised again.
- **The hero is not to be touched.** Its one-word first viewport is intentional.
- **`WhatWeDo`'s pillar numerals are full-strength brand blue**, not the 30%
  ghost DESIGN.md §2 describes.
- **The About team cards carry no `01`/`02` numerals.**
- **The four unimported vendor files stay** (`Threads.tsx` — the only `ogl`
  importer — `ParticleText.tsx`, `OrbitImages.css`, `BubblePills.jsx`). They are
  tree-shaken and cost nothing; with no git, deleting them is unrecoverable.
- **The nav bar and menu were reverted to their pre-audit state** after the audit
  work displaced the wordmark. `SiteHeader.module.css` and
  `NavOverlay.module.css` hold literal durations (overlay 240ms, items 520ms,
  foot 400ms) and are exempt from `test:scale`. Skiper UI's `TextRoll`
  (skiper58) drives both the header links and the menu items and was never
  modified.

---

## Current state — what's built

**Homepage (`app/page.tsx`)**, sections in order:
1. `Hero` — vanmorrison.com's hero, sequence and all: full-bleed field, two
   black 50%-wide panels over it, wordmark twice (outline + solid) above both.
   The panels slide out while the solid copy's clip-path opens from the centre
   on the same duration and ease, so the field appears and the letters fill in
   together — **nothing clips the field**. Gated on the field actually being
   up (canvas mounted and painted, capped at 1800ms) before anything starts.
   Timings are read off their bundle and reproduced exactly; the table is in
   README.md. Always dark ground; the Media/Systems switch that used to live
   here is gone.

   **The fill's clip must be a `fromTo` with both ends written out in full**
   (`inset(0% 50% 0% 50%)` → `inset(0% 0% 0% 0%)`). A plain `.to()` reads the
   start off the computed style, where the browser has normalised it to
   `inset(0% 50%)` — two numbers against the target's four. GSAP interpolates
   complex strings number-for-number, so the mismatch pinned the *left* inset
   at its end value from the first animated frame: measured at 25% progress,
   `.to()` gives `inset(0% 28.125% 0% 0%)` where `fromTo` gives
   `inset(0% 28.125%)`. The left of the word was solid white before the
   curtains had moved.

   **The client marquee is uncovered by the curtains, not faded in.** It sits
   at z1, below the panels at z2, and has no animation of its own — giving it
   one would read as a second entrance competing with the wipe. Only the fixed
   header still fades, because it is outside the section and cannot be wiped by
   these panels.

   Three more things here were got wrong once and are worth not repeating: the
   curtain is **0.9s power3.inOut**, not a quarter-second; the wordmark
   **rises 200px and fades up over 0.75s first**, with a 0.35s hold before the
   reveal; and the whole thing **waits for the field**. Also: `.field` carries
   a brand-blue gradient because LiquidEther's canvas is transparent and starts
   empty — without it the curtains part onto the same black they are made of
   and the effect reads as nothing happening.
2. `Teams` — **replaced Sep 2026 by the "Counterweight" full-viewport band
   pair. See the READ THIS FIRST block above; the two-panel split described
   here is gone.** Still true of the replacement: the bands paint fixed
   colours rather than ground tokens, because this is the one place both
   grounds are on screen at once.
3. `Shipped` — featured work; sticky "Featured work" panel matched to
   vividmotion.co's layout
4. `WhatWeDo` — three pillars (Content/Growth/Technology); `ServiceDisclosure`
   now renders the pillar head *and* the disclosure trigger on one line (number
   / name / "View n … services" right-aligned), with the FlowingMenu rows
   (`ServiceMenu.tsx`) in the panel below
5. `ScalinaSystem` — Attract/Amplify/Convert/Operate pinned card stack. The
   "four stages, one loop" list is centred against the statement and set in
   brand blue; the "See how it works" link is gone with the page it pointed at
6. `SelectedWork` — weichie.com-style irregular 5-column grid with ragged card
   heights + scroll parallax. Both floating margin callouts are brand blue
8. `Founder`, `Manifesto`
9. `StartProject` — single CTA (multi-button version removed per user), "Have a
   project in mind? Let's build it properly."
10. `ClosingBlock` wraps `StartProject` render is NOT here — actually wraps
   `SiteFooter` + closing CTA area with one continuous LiquidEther field (see
   ClosingBlock.tsx) so the fluid background runs from the CTA through the footer,
   not just inside `<footer>`.

**Services page (`app/services/page.tsx`)**, route `/services?view=media|systems`:
- URL is the single source of truth for which team is showing (derived, not
  mirrored into state — this was a lint-driven fix, see Known Issues Fixed below)
- `ServicesHero` — big Inter Tight headline per team (had to tune from the
  vividmotion.co reference's 128px down to ~95px because Scalina's sentences are
  longer and wrapped to 4 lines at 128px)
- `ServiceExplorer` — React Bits `OptionWheel` drives a service picker; selecting
  an option swaps headline/body/deliverables. **Per-option background glow/tint
  was removed** — background is now static, same ground-token background as the
  rest of the site (user explicitly asked for this)
- `ServiceProof` — stats block (real facts only, clearly marked "Awaiting figure"
  for anything needing client data) + testimonials via ported unlumen UI
  `VerticalMarquee`. **The proof-of-work wall (OrbitalImageWheel) was built then
  REMOVED** at user's explicit request in the most recent turns — do not re-add
  unless asked again.
- `ServiceCta` — per-team CTA wording ("Nobody sees you yet." vs "It doesn't run
  yet."), shares `ClosingBlock` treatment with the footer

**Content model:** `lib/services.ts` holds all copy for both teams (`TEAMS.media`,
`TEAMS.systems`). **Testimonials in there are fabricated demo content** written at
the user's explicit request to fill the layout — including client names that are
real (Ozi Packing, Maya Lounge, Gurung Shuttles, Runaway Entertainments) mixed with
invented ones (Northbridge Dental, Harper & Co, Verity Logistics, Atlas Freight).
The brand doc bans invented testimonials for production. This is flagged loudly in
a comment block in the file and in `README.md` — **must be replaced with real,
signed-off quotes before anything ships publicly.**

## Architecture decisions worth knowing before touching anything

- **Ground rhythm system** (`lib/grounds.ts` + `lib/useGroundRhythm.ts`): the
  site's dark/light alternation is driven by CSS custom properties written to
  `<html>`, not per-section backgrounds. This took several iterations to get
  right — read `lib/grounds.ts`'s comments before changing it. Key facts:
  - **It is timed, not scrubbed** (changed to match mude.com.au, which uses
    `transition-colors duration-1000` on its sections). Scroll position decides
    *which* ground; a 1000ms `cubic-bezier(0.4, 0, 0.2, 1)` cross-fade decides
    how it gets there. The trigger is a section top crossing 55% of the
    viewport. An interrupted crossing resumes from the colour on screen; a
    mid-fade reversal flips both ends and the mix, which is exact because the
    surface interpolation is linear.
  - Surfaces (`--bg`, `--panel`) interpolate; foregrounds step.
  - Foregrounds (`--text`, `--link-hover`) **step** rather than tween — any
    continuous interpolation between two ground colors passes through a value
    equal to the background and the text vanishes. The step point is derived
    from live contrast math (`resolveGround()`), not a hardcoded percentage,
    so it's correct in both directions and if colors ever change.
  - `--muted` gets a special "lift toward full text color" treatment during the
    transition window because it's a mid-tone that would otherwise wash out.
  - The ground is **derived from scroll position on every scroll event**, not
    from animation/tween progress. An earlier version tracked tween progress per
    boundary and had a real, hard-to-reproduce bug: switching the hero's team
    (which moves the first boundary) could leave a stale ScrollTrigger's `apply()`
    call as the last writer, stranding the whole page on the wrong ground. Fixed
    by computing directly from `window.scrollY` + measured element positions —
    no animation state involved, nothing to go stale. There's a `npm run
    test:contrast` script (`tests/contrast.test.mts`) that asserts contrast never
    drops below 3:1 across a full boundary sweep — **run this after any change to
    `lib/grounds.ts`.**
  - The hook re-running on a page whose ground has changed (the services page,
    when the team switches) fades rather than cuts: it reads the applied `--bg`,
    matches it to a ground, and starts a cross-fade from there. `.groundBlending`
    and the `@property` CSS transition it drove are no longer used by the
    homepage hero, which no longer switches teams.
- **Header/nav** (`SiteHeader.tsx`): "Start a project" is a plain nav link, not
  a yellow pill (the user asked for that explicitly — don't reintroduce a filled
  CTA in the bar). The bar collapses to a single **Menu** button on the way down
  and comes straight back on the way *up*, without waiting for the top of the
  page — the handler compares each scroll against the last position rather than
  against a single threshold.
- **The collapsed header button is named for the current page** ("Home",
  "Services", …) via `usePathname()`, and has no hamburger glyph — both asked
  for explicitly. It still reads "Close" while the menu is open.
- **The menu is `NavOverlay.tsx`**, not BubblePills. The user disliked the
  rotated-pill overlay. It is now a full-screen panel of condensed uppercase
  links that are outlined at rest and fill in on hover — deliberately the same
  type treatment as the hero wordmark. `BubblePills.jsx` is still in
  `components/vendor/` but nothing imports it.
- **Header chrome opens on the hero's clock.** The header carries
  `data-site-chrome` and is hidden by a `body:has([data-hero])` rule in
  `globals.css`; the hero's timeline brings it up during the reveal. Pages
  without a hero have nothing to run that timeline, which is what the `:has()`
  guard is for. The hero queries it with `document.querySelectorAll` and passes
  **elements** to GSAP — `useGSAP`'s `scope` confines selector *strings* to the
  hero and silently dropped the header, leaving it hidden for the session.
- **Oswald is a display-only face**, added for the hero wordmark and the menu.
  It is not for body copy. *(Superseded: Oswald is now the face for section
  headings too — see "Typography — the display face" below.)*
- **The ground rhythm is timed, not scrubbed** — see below.
- **React Bits components** are vendored (not npm-installed) into
  `components/vendor/*` because there's no Tailwind in this project and React
  Bits' own MCP server ships components with Tailwind-only styling. Sourcing
  pattern used repeatedly: fetch raw source from
  `https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-default/...`,
  strip Tailwind classes, port to a CSS Module pointed at our `--bg`/`--text`/etc
  tokens so it inverts with ground rhythm. Vendored so far: `BubblePills.jsx`,
  `LiquidEther.jsx` (from the original design handoff), `ParticleText`,
  `LogoLoop`, `FlowingMenu`, `OptionWheel`, `Threads` — all from React Bits;
  `VerticalMarquee` — ported from **unlumen UI** (`@unlumen-ui` registry,
  `https://ui.unlumen.com/r/{name}.json`, registered in `package.json`
  `"registries"`). Unlumen's version is Twitter/tweet-card specific
  (`tweetIds` → `react-tweet`); ours takes a generic `items: ReactNode[]` prop
  instead — the scroll/measure/ease engine is unlumen's unchanged, only the card
  renderer swapped.
- **The React Bits MCP tool** (`mcp__react-bits__*`) exists in this session but
  its bundled index is stale/incomplete — it's missing components that exist
  upstream (LogoLoop, ParticleText, OptionWheel weren't in its list). Don't trust
  "not found" from that tool as proof a component doesn't exist; check the GitHub
  repo directly (`api.github.com/repos/DavidHDev/react-bits/contents/src/ts-default/...`).
- **shadcn MCP** is configured but the official `@shadcn` registry has no
  marquee/carousel-style component — that's why unlumen was used instead for the
  vertical marquee ask.
- CSS Modules throughout, no Tailwind, no CSS-in-JS. Shared tokens/utilities live
  in `app/globals.css` (`.ghostBtn`, `.statement`, `.eyebrow`, `.split3070`,
  `.inlineLink` etc. — check there before writing a new one-off style).
- GSAP + `@gsap/react`'s `useGSAP` is the one motion library in play (plus
  `motion` package, pulled in only for the unlumen marquee's port). Reveals go
  through the shared `Reveal.tsx` component (`kind="fade|line|number|card|clip"`).
- **`gsap.matchMedia()` gotcha**: instances created inside `useGSAP()` are NOT
  auto-reverted by `useGSAP`'s own cleanup — you must manually `return () =>
  mm.revert()` from the effect or its ScrollTriggers/tweens outlive the
  component re-run. This bit us at least twice (ground rhythm, hero switch).
  Every `gsap.matchMedia()` call in the codebase now has an explicit revert;
  keep that pattern for any new one.

## Recently fixed bugs (don't reintroduce)

- **A `ColorWipe` must declare `ground` — the ground it lands on.** Without it
  the colour change happens twice: the wipe paints its own layers, the rhythm
  never hears about it, and the next section (already that colour) cross-fades
  to it again a screen later. The prop is required for exactly this reason.

- **Every wipe refreshes ScrollTrigger after its own tween exists.** Each pinned
  stage shifts the triggers created before it, so on a page with two wipes the
  second was non-linear on a cold load — measured 94% / 63.8% / 59.1% / 1.6%
  across an even scroll, with a visible stall, where a forced refresh gave
  100 / 66.7 / 33.4 / 0.06. A deferred `requestAnimationFrame` refresh inside
  `ColorWipe` fixes it for all of them.

- **`Teams`' halves arrive from opposite edges and merge**, on `xPercent`. It
  was a clip opening outward from the seam, which is the same gesture played
  backwards and read as the pair splitting apart. `.section` needs
  `overflow: hidden` or the off-screen travel adds a horizontal scrollbar.

- **Do not add ground changes back.** The homepage has exactly two, both up
  wipes; every other page has one to three. A page that keeps changing colour
  reads as restless, and that was the complaint. No lime ground anywhere, no
  cobalt on the homepage — lime is a fill only (Teams panel, primary button,
  stage card 01).

- **`Teams` is dark on purpose, matching the hero above it**, so there is no
  transition between the two. It briefly painted its own bone field; that added
  a ground change nobody asked for.

- **A `ColorWipe` wraps a section's OPENING, never a whole section.** The stage
  is pinned at 100vh so the content has to fit one screen, and the second layer
  is `inert` + `aria-hidden` so the content has to be static. Interactive
  content inside a wipe would be duplicated into the tab order.

- **Refresh ScrollTrigger AFTER a late-sizing section commits, not inside the
  setter that sizes it.** `ParallaxColumns` is 175vh and derives its column
  transforms from a measured viewport height, so everything below it settles one
  React commit late. Calling `ScrollTrigger.refresh()` inside the resize handler
  runs before that layout exists; triggers below stay positioned against the old
  page. Measured on the tagline wipe: its start fired **430px late**, so the
  circle reached 39% of its 75% by the end of its own track. Refreshing in an
  effect that depends on `height`, deferred a frame, gives 0 / 24.96 / 49.96 /
  74.96%. `lib/gsap.ts` also refreshes once on `load` and on `fonts.ready` —
  the display webfont reflows every heading when it swaps in.

- **Do not give a `ColorWipe` the same `aria-label` as another section.** Its
  default is the eyebrow, and an eyebrow of "Scalina" collided with the hero's
  own label — two landmarks with one accessible name.

- ~~**Do not add Lenis.**~~ **Superseded 22 Sep 2026 — Lenis is in, by request; see the top block.** Both `skiper28` and `skiper30` ship with it. This project
  removed `scroll-behavior: smooth` globally because it fights ScrollTrigger's
  pin-position restoration and caused a runaway auto-scroll, and there are two
  pinned stages on the homepage now. Neither effect needs it — `useScroll`
  drives both.

- **Do not rebuild the ground wipe as a full-viewport panel.** It was attempted
  four times and each fix exposed the next fault: it painted over the outgoing
  section; it flattened the screen to one colour when surfaces stepped; it
  needed two sets of foregrounds to hold one sharp edge; and once all of that
  was correct it still **did not read as an animation**, because an edge that
  moves at the same rate as the content it crosses looks exactly like no
  transition. Making it move faster, without a pin, IS the first bug again.

  **A pin is not optional for this effect.** icreon.com pins its stage so the
  colour travels across stationary type. A document-level token system cannot
  pin arbitrary sections without owning their layout, so the ground rhythm is
  the timed cross-fade for every pair, and the pinned wipe is a component:
  `components/ColorWipe.tsx`.

- **React Bits' ScrollReveal defaults leave readable text unreadable.**
  `baseOpacity: 0.1` plus a 4px blur running until the element's BOTTOM reaches
  the viewport bottom means a multi-line statement sits at 12% opacity behind a
  blur while fully on screen — measured still 0.12/blur(4px) with the section's
  top at the viewport foot, and not solid for another ~700px of scroll. The
  vendored copy floors opacity at 0.55, turns the blur off, and finishes the
  scrub at `center 65%`.

- **Surfaces must NOT step during a wipe.** `body` paints `--bg`, and that fills
  everything ABOVE the wipe edge — the part still belonging to the outgoing
  section. Stepping it hands the whole viewport the incoming colour, the panel
  becomes the same colour as what is behind it, and the wipe vanishes. It did
  exactly that: `--bg` and the panel both read lime and /work was one flat lime
  screen with no visible edge.

- **The wipe edge must be the incoming section's own top edge, in px.** Driving
  it from an abstract 0..1 window that opened when the section reached the
  viewport *foot* meant a full-viewport mask painted over whichever section was
  still on screen — on /work, whose first section is ~375px tall, a lime circle
  opened across the first section before you had left it. The iris was removed
  for the same reason: a centred circle has no section edge to sit on.

- **A wipe needs two sets of foregrounds, scoped.** One token set on `<html>`
  cannot serve both sides of a sharp edge — stepping early puts ink on cobalt,
  stepping late puts bone on lime. `<html>` holds the outgoing ground and the
  incoming `<section>` gets the incoming foregrounds as inline custom
  properties, which inherit to its subtree only.

- **A settled scrub must collapse to one ground, not be handed to
  `retarget()`.** Scrubbed crossings leave `from`/`to` straddling a boundary
  with `mix` wherever the scroll stopped. Letting the timed path pick that up
  when the boundary left its window meant scrolling back up past the *start* of
  a light -> cobalt wipe found `mix` at 0 with `next === from`, took the
  reversal branch, and began a full cobalt -> light wipe down the screen — an
  animation away from a ground the page had never reached. `resolve()` now
  settles it explicitly on whichever side it left by.

- **Section crossings are scroll-linked, not played.** Every transition except
  dark <-> light reads `mix` off the incoming section's position. Do not
  "restore" a timed tween to them; the fade is the deliberate exception.

- **React Bits' `ScrollReveal` cleanup kills every ScrollTrigger on the page.**
  Upstream ends with `ScrollTrigger.getAll().forEach(t => t.kill())`. In this
  project that is the hero's opening timeline, the pinned Scalina System card
  stack, every `Reveal`, and the ground rhythm's own triggers — one of these
  unmounting would take the page's whole motion system with it. The vendored
  copy uses `useGSAP`'s scoped revert instead. **Check this in any React Bits
  component that registers ScrollTrigger before wiring it in.**

- **`Shipped` (Featured work) stays dark.** It was cobalt for one pass and its
  project panels, which paint dark navy placeholder gradients, blended straight
  into the blue. Reverted on request.

- **`ScalinaSystem` cannot take the lime ground** — stage card 01 is `#CDF22B`,
  so the card disappears into the background.

- **`.rhythm` must not paint a background.** `body` paints `--bg`; `.rhythm` is
  transparent on purpose. The ground rhythm inserts a fixed wipe panel
  (`[data-ground-wipe]`) at z-index 0, between the body background and `main`
  (z-index 1). Painting on `.rhythm` puts an opaque surface over that panel and
  every wipe transition silently stops working.

- **Do not square the corners.** Buttons, chips, tags and badges are pills
  (`border-radius: 9999px`); the wide enquiry chips are `18px`. DESIGN.md §6 said
  "square corners" for a while, the code was changed to match, and it was
  **reverted on request** — the doc was wrong, not the build. §6 now says pill and
  carries a note. A conformance sweep that flags rounded controls is reading a
  stale rule.

- **The services page does not get a proof-of-work section. This is the second
  removal.** An OrbitalImageWheel wall was built there and removed at the user's
  request; later a Skiper coverflow (`ServiceWork`) was added in the same slot and
  removed again. Both files are deleted. `/services` runs hero → explorer → proof
  → CTA, and the work lives on `/work`. **Do not put a work showcase on
  `/services` again without being asked for it explicitly** — "showcase the work"
  means `/work`.

- **`--accent-fg` must ride `--text`'s step, and lift toward its OWN side.** The
  brand colour used for text is a ground token (lime on dark, cobalt on light —
  neither is readable on both). Two plausible implementations are both wrong and
  both were tried:
  1. Giving it its own step point, computed from its own contrast. Around
     p≈0.38 of a crossing, cobalt reads 2.22:1 and lime 2.23:1 — lime wins by a
     hair, so the token jumps to the *light* brand colour at the exact progress
     where the readable side is still the dark one. Worst case 2.43:1.
  2. Keeping that independent side and lifting toward `fg['--text']`. When the
     two disagreed, the lerp ran light-to-dark straight through the mid-grey the
     background was sitting on: **1.00:1 — the token exactly invisible.** That is
     the trap in `lib/grounds.ts`'s own header, reached from a new direction.

  What works: it steps with `--text` (it is in `FOREGROUND_KEYS`) and is then
  lifted toward that same ground's `--text` when brand colour alone is not
  carrying — the `--muted` treatment. Both ends come from one ground, so the
  interpolation can never cross the background. **`npm run test:contrast` now
  asserts this token too, and it is what caught all three states.** Worst case
  3.72:1.


- **Skiper UI components are ported, not `shadcn add`-ed.** `npx shadcn add
  @skiper-ui/<name>` wants a `components.json` and Tailwind; this project has
  neither deliberately, and the CLI would install Tailwind into it. Fetch
  `https://skiper-ui.com/r/<name>.json`, strip the Tailwind classes and the
  `cn()` helper, port to a CSS Module reading our tokens — the same route every
  React Bits and unlumen component took. They import `framer-motion` upstream;
  use `motion/react`, which is the same API under the package already installed.
  **Their free tier requires attribution — keep the licence block in each file.**
- **`LinePath`'s scroll `offset` is not optional.** Upstream leaves `useScroll`
  at its default range, which is measured for their 350vh demo page. On a
  normal-height section that range is mostly spent off-screen and the stroke
  arrives ~80% drawn — measured 0.80 → 0.93 across the whole section, which
  reads as a static squiggle rather than something tracking your scroll.
- CSS `scroll-behavior: smooth` was removed globally — it fights
  ScrollTrigger's pin-position restoration and caused a runaway auto-scroll.
  Smooth in-page anchors now go through `lib/useSmoothAnchors.ts`
  (GSAP `ScrollToPlugin`, which stays ScrollTrigger-aware).
- `OptionWheel`'s `fontSize` prop is in **rem, not px** (easy to get bitten
  again — passing `34` renders one 544px giant letter, not a 34px option list).
- Data-URI SVG placeholders (used briefly for the now-removed proof wall) needed
  parens percent-encoded manually — `encodeURIComponent` leaves `(`/`)` alone and
  they terminate an unquoted CSS `url()` early. Not currently relevant since that
  feature was removed, but worth remembering if placeholder SVGs come back.
- **`Reveal` must not use `once: true`.** `once` kills a ScrollTrigger the
  moment it fires. On a page that loads already scrolled — a `#hash` link, or a
  plain reload with scroll restoration — every reveal above the fold fires and
  kills itself in the same commit in which the reveals below it are still being
  created, and ScrollTrigger's `refresh()` walks the live `_triggers` array
  backwards by index (ScrollTrigger.js:1366, which does *not* guard for a
  missing entry, unlike the identical loop at :1406). The vanished entry makes
  it read `.end` off `undefined` and throw, inside `gsap.fromTo`, *after* the
  `from` state has been applied — so that section is stuck at opacity 0 for the
  rest of the session. **Confirmed in a production build, not just Strict
  Mode.** Default toggleActions play the reveal exactly once anyway.
- `.split3070` was `grid-template-columns: 30% 70%` **with a gap**, which
  overflows its container by exactly the gap. Nothing showed it while the 70%
  column only held wrapping text; putting a right-aligned control in that column
  pushed it off the screen. Both it and `WhatWeDo`'s `.svcInner` are now
  `30% minmax(0, 1fr)`.
- Services page derives the active team from `useSearchParams()` directly rather
  than mirroring it into `useState` + a `useEffect` — the mirrored version
  triggered a "setState synchronously within an effect" lint/render-safety error.

## Section headings — one house style

`.sectionHeading` in `globals.css` is the Selected Work treatment, which the
client picked as the reference ("same as latest work"): centred, condensed
uppercase, `clamp(3rem, 10vw, 9rem)`. It is used by The Scalina System, both
Service Proof titles, all three About section headings, and the closing "Would
rather just talk?". Put new section titles on it rather than restyling them
locally.

> **Superseded — do not act on the paragraph below.** It records a revert to
> Fraunces that has since been undone: **Fraunces is gone from the project**
> (removed from `app/layout.tsx` and the `<html>` className). The closing CTA,
> the four stage titles and the manifesto line are all Oswald 700 uppercase now.
> DESIGN.md §9 explains why it deliberately overrode this entry. Kept because
> the *reason* it was written still binds — see the note after it.

~~**Two headings are deliberately NOT on the display face** — both reverted by
request after the first pass took Oswald too far: the closing CTA
("Have a project in mind?") and the four stage card titles
(Attract / Amplify / Convert / Operate) are **Fraunces**.~~

**What still binds is the complaint underneath it**, which was about *sentences
set in condensed caps* — that rule is alive and lives in DESIGN.md §2. The
services hero headline, the Scalina System statement and the founder quote stay
Inter Tight 300 for exactly that reason. `ATTRACT` and
`BOTH HALVES. THAT'S THE WHOLE JOB.` are one word and six; they were never the
case the complaint was about.

## Typography — the display face

**Oswald 700, uppercase, is now the heading face across the site**, replacing
Fraunces in every heading, card title and section title. This was a direct
request: match vanmorrison.com's heading treatment.

**Fraunces has since been removed from the project entirely** — it is not
loaded in `app/layout.tsx` and is on nothing, logotype included: the header
brand mark and the footer wordmark are Oswald too. The only occurrence left in
the repo is `components/vendor/BubblePills.jsx`, which nothing imports and
which is kept verbatim from upstream. DESIGN.md §9 has the reasoning and the
revert instructions.

Two things are deliberately *not* on the display face, and should stay off it:

- **Long sentences.** The services hero headline and the Scalina System
  statement are full sentences and stay in light Inter Tight. Condensed
  uppercase works because the reference keeps headings to two or three words;
  a whole sentence in it is a wall. "Where appropriate" means short.
- **The founder quote**, which is Inter Tight by request. It is speech, not a
  heading.

## Ground balance

Light-led overall, but the dark blocks are all deliberate and were each asked
for. Current state, and none of it should be "fixed" for consistency:

**Three grounds now, not two** — `cobalt` (`#1E45FB`) is a full-bleed surface, not
a panel colour. See DESIGN.md §1. The table below is post-change.

| Page | Grounds, in order |
|---|---|
| Home | dark hero · dark teams · **cobalt shipped** · light × 4 · dark manifesto · dark close |
| About | **cobalt intro** · light teams · light principles · light proof · light founder · **dark manifesto · dark close** |
| Services (Media) | light hero · light explorer · **dark proof** · dark close |
| Services (Systems) | **dark** hero · dark explorer · **light proof** · dark close |

**Service Proof inverts against its team** — Media's numbers on dark, Systems'
on light — so each services page changes ground in the middle rather than
running one colour end to end. That inversion is in `ServiceProof.tsx`, not in
the team data, and it is intentional that it contradicts `team.ground`.

**About was flattened to one boundary on 2026-09-14, by request.** It used to
flip three times; it now runs light until the manifesto and dark from there to
the foot. `AboutTeams` and `AboutPrinciples` carried the two dark bands that
went. `Manifesto` is shared with the homepage and stays dark on both, so the
homepage order is unchanged. Because the two teams no longer get a ground each
on that page, the §4 textures carry the distinction instead — halftone for
Media, ruled grid for Systems, both cobalt. See DESIGN.md §10 → *Ground order*.

## Headings that are NOT the display face

*Superseded, same as the block above: the closing CTA and the four stage card
titles were reverted to Fraunces once, and have since gone back to Oswald with
Fraunces removed from the project. The surviving rule is §2's — a full sentence
never goes in condensed caps, however short the heading beside it is.*

**The Scalina System has no section heading at all** — it went eyebrow →
giant condensed → serif → back to the small `.eyebrow` utility over two
rounds. The statement below it is the `<h2>`. Leave it alone.

`.sectionHeading` is sized so the longest heading on the site ("Two specialist
teams, one roof") holds one line at the shell width. If a new heading wraps,
shorten the heading rather than the type.

## Ground balance — details

The page is **mostly light now**, with dark as punctuation rather than the
resting state: the hero, one band mid-page (Shipped), and the close. On the
homepage that is dark → light → dark → light × 5 → dark. Teams, What We Do,
the About intro and the Start intro were all flipped, and Systems' services
page ground went light too (the brand file allows "light or blue" for Systems).

## The hero field

The blue radial behind the wordmark is gone — it read as a halo around the
letters. `.field` is neutral graphite now and the hero runs its own
`ETHER_HERO` tuning, the same simulation drained of hue. The closing block
keeps brand blue, where it reads as a glow rather than a halo.

## `/work`

> **Superseded 22 Sep 2026** — /work is now per-client case studies; see the top block.

`lib/work.ts` is the index; every entry is a real client project from the
brand file's named-with-permission list or its shipped-software list. Nothing
aspirational goes in there.

**The grid is two-up and quiet at rest**, modelled on vividmotion.co: the card
shows the client and the discipline tag, and the *project name* is revealed by
a block opening underneath on hover. The summary line is gone from the index
entirely — on a list, three lines of description arrive before the reader has
decided whether they care about the project. `summary` is still in the data for
the case-study pages. The reveal animates `grid-template-rows: 0fr → 1fr` so it
opens to the measured height of whatever the title turns out to be, with no JS.
On touch there is no hover, so the name is simply always shown.

Two filters answering two different questions. **Team** (Everything / Media /
Systems) is the loud one — three large controls with counts — because who does
the work is the distinction the whole site is built on. **Discipline** is a
quiet chip row underneath, and its counts are computed against the *team*
selection so a chip never advertises a count the next click would contradict;
zero-count chips disable rather than disappear. Cards carry a team badge, and a
project delivered by both teams carries both.

## `/start` — the enquiry page

Modelled on mude.com.au/contact, but restructured around the thing the user
asked for: answers that are worth something in aggregate.

- **`lib/enquiry.ts` is the whole content model.** Every question, every option
  and every option *id* lives there; the component has no opinions to update
  when a question changes. The point is a **closed vocabulary** — free text
  cannot be counted, `sector: "logistics"` across two hundred submissions can.
  Add a question there and it appears in the flow, in the review summary, and
  in the API's whitelist, with no other edits.
- **Almost nothing is typed.** Five chip screens then one contact screen; the
  only required text is name and email. Chips are real `<input type="radio">` /
  `<input type="checkbox">` inside their labels, visually hidden — native
  inputs bring keyboard, grouping and pressed-state semantics that a
  roving-tabindex button group has to reimplement and usually gets wrong.
- **It branches on intent.** `stepsFor(intent)` decides which steps exist, so a
  careers enquiry never sees a budget question and the progress count is
  honest. Changing intent prunes answers belonging to steps the new intent does
  not show — done in the click handler, not an effect watching `intent`.
- **What is collected, and why:** needs (mirrors the public taxonomy, so it is
  directly comparable to what the site advertises) · goal · blockers · sector ·
  headcount · what they already have · timeline · budget band · attribution
  (`source` chips plus referrer and any `utm_*`/`gclid` off the landing URL,
  read once on mount).
- **`app/api/enquiry/route.ts` is NOT wired to a destination.** It validates
  and logs. The whitelist is built from `lib/enquiry.ts` rather than a schema
  written out twice, so anything outside the vocabulary is dropped — verified
  with a forged payload. **Before launch, send it somewhere durable at the
  marked integration point** (the CRM is the obvious home; the payload is
  already in the shape a CRM wants). Until then a submission is acknowledged to
  the visitor but survives only in the process log.

## `/about`

Content is taken from the brand doc only — no invented history, dates,
headcount, metrics or quotes. `AboutIntro` → `AboutTeams` → `AboutPrinciples` →
`AboutProof` (shipped software and the four clients named with permission) →
the existing `Founder` and `Manifesto` sections.

**Changed Sep 2026:** `AboutTeams` is now the single pinned "Interlock" stage
(wipe and section in one component — see READ THIS FIRST), the team cards no
longer carry `01`/`02` numerals, and **`AboutPrinciples` is now `data-ground="light"`**,
so the page runs light from the reveal down to the Manifesto wipe.

`Founder` gained a `showLink` prop, default true: on /about its "Read the full
story" link would point at the page you are already on.

## Header layout

Three separate pieces: the **mark holds the left edge**, the **wordmark is
absolutely centred on the page**, and the **nav sits right**. The wordmark is
centred with `left: 50%` rather than by a grid column so it lands on the page's
centre line and not on the centre of the space the nav leaves. Mark and
wordmark are two separate links, both to `/` — an in-page `#top` only did
anything on the homepage.

## Page metadata

`/about` and `/start` are **server shells that export `metadata` and render a
client view** (`components/about/AboutView.tsx`, `components/start/StartView.tsx`),
because the ground rhythm and the enquiry flow both need `'use client'`. `/` and
`/services` are still client components with no metadata of their own and
therefore still inherit the global title — worth giving them the same treatment.

## Numbers, and where they come from

The Media figures on the services page and in the homepage team panels are
**sums of the per-creator numbers in the client's portfolio deck** (7 creator
accounts: 14M combined likes, 140K combined following, 582.6K views on the
managed YouTube channel). The Systems figures are the brand file's counts of
shipped builds. Both are traceable; neither is estimated.

**The two figures the user specifically asked for do not exist yet** and are
rendered as visibly pending rather than invented:

- **"Annual SaaS spend replaced"** — the headline Systems number. It needs the
  clients' actual licence costs before and after. There is nothing in the
  portfolio or the brand file to derive it from.
- **Hours returned per month**, and Media's cost per lead.

`Stat` now stores `value` as a number with separate `prefix`/`suffix` so
`components/Counter.tsx` can animate it. Counters render the final figure
server-side and only overwrite it once their ScrollTrigger fires —
`immediateRender: false` plus an `onStart` guard, because without them the
tween renders at its start state on creation and pins every figure at 0 until
it is scrolled to.

## Outstanding / explicitly deferred by the user

- **`/the-scalina-system` was dropped** — the user decided not to build that
  page. Its nav entries (header + footer) and the in-section link are gone. The
  homepage `ScalinaSystem` section stays; it is the explanation now.
- ~~**Real testimonials**~~ — **done Sep 2026.** All **twelve** invented quotes
  were deleted, not the four an audit flagged: two were attributed to companies
  that do not exist (Atlas Freight, Verity Logistics), two to names that are not
  clients (Northbridge Dental, Harper & Co), and **eight were put in the mouths
  of real clients** — the exact thing About principle 03 promises the studio does
  not do. `ServiceProof` now derives its client list from `lib/work.ts`, so a
  name cannot appear without a real project behind it, and says plainly that
  quotes are outstanding. **To add a real one:** put a `quote` on that client in
  `lib/services.ts` once it is signed off. Stats placeholders still stand.
- **Client "logos"** in the hero's `LogoLoop` are text wordmarks, not image
  files — swap `name` for `src` in `lib/content.ts`'s `CLIENTS` array when real
  logo assets exist.
- **Proof-of-work section for services was removed** — user may ask for a
  different treatment later; don't assume OrbitalImageWheel is wanted again
  without being told.
- The per-project `/work/*` case-study pages are **not built**, as are the
  footer's `/privacy`, `/terms` and `/cookies`. `/`, `/services`, `/about`,
  `/start` and `/work` exist.
  **Sep 2026:** thirteen links pointed at those non-existent `/work/<slug>`
  pages and all were 404s. `Shipped` now deep-links to `/work#<slug>` and the
  `WorkIndex` cards are `<article id={slug}>` rather than `<a>`, because a card
  that looks clickable and is not is worse than one that does not. **When the
  detail pages land, restoring the links is one line in each file.**
- **Two figures are marked pending on the services page** and must be filled in
  before launch — see "Numbers, and where they come from" above.
- Contact email is **info@scalinamedia.com** throughout (from the portfolio
  deck). The two placeholder phone numbers were **removed** Sep 2026 from both
  the footer and `/start` — add the real ones to `CONTACT` in `SiteFooter.tsx`
  when they exist. Footer copy is now "Business **Enquiries**" (AU) and `/start`
  has one name everywhere, "Start a project".
- ~~**The enquiry endpoint has no destination**~~ — **wired Sep 2026** to the
  Scalina CRM and SMTP, both, from `.env.local`. **Still unconfigured, so it
  returns 502 on every submission until the env vars are set** — see README →
  Enquiry delivery. That is deliberate, not a bug.
- **Known, deliberately not fixed:** the homepage can be scrolled sideways by
  **19.5px** (programmatic only — `body` clips, so no scrollbar appears and
  nothing visibly moves). It comes from inside the Teams marquee. Do **not** fix
  it with `overflow-x: clip` on `html`; that breaks `position: sticky`
  site-wide.
- **An Impeccable design critique from 21 Sep 2026 is archived at**
  `.impeccable/critique/2026-09-21T18-48-03Z__app.md` (scored 24/40). Its P0 and
  several P1s were then fixed; what remains open is the **evidence gap** (about
  half the homepage is still placeholder — `Shipped`, `SelectedWork` and the
  `/work` cards have no real imagery), the `/start` flow reporting "01 / 02"
  then jumping to "02 / 06" with 21 controls on one step, and the 19.5px above.
  The user deferred these deliberately.
- No git repository has been initialized — flag this to the user if they ask
  about commits/deploys/PRs.

## Where the data lives — start here to add or change content

Content is deliberately kept out of components. To change what the site *says*,
edit `lib/`; you should rarely need to open a `.tsx` to add data.

| File | Exports | Rendered by |
|---|---|---|
| `lib/content.ts` | `CLIENTS`, `CTA` | `Hero` (the client marquee), `StartProject`, `AboutProof` |
| `lib/teams.ts` | `TEAM_PANELS` | `sections/Teams.tsx` — the homepage band pair |
| `lib/work.ts` | `CASES`, `getCase`, `TOTALS` (+ derived `WORK`, `DISCIPLINES`) | `work/CaseIndex`, `work/CaseView`, `SelectedWork`, `services/ServiceProof` |
| `lib/proof.ts` | `ABOUT_PROOF`, `MEDIA_PROOF`, `SYSTEMS_PROOF` | `Bento` via `about/AboutProof` and `services/ServiceProof` |
| `lib/services.ts` | `TEAMS`, `TEAM_KEYS` | every `/services` component |
| `lib/enquiry.ts` | `STEPS`, `SOURCE_QUESTION` | `start/EnquiryFlow` |
| `lib/grounds.ts` | `GROUNDS` + key lists | `lib/useGroundRhythm.ts` — the ground tokens |
| `lib/ether.ts` | `ETHER` | both `LiquidEther` mounts (hero, closing block) |

Things worth knowing before editing these:

- **`lib/work.ts` is the single source of truth for who the clients are.**
  `ServiceProof` derives its named-client list from it by `team`, excluding
  `Scalina` as internal. Adding a project there adds the client to `/services`
  automatically — and a name cannot appear anywhere without a real project.
- **`lib/teams.ts` figures carry a `source` string** that renders under them.
  Any new figure needs one; DESIGN.md's "real numbers only" is enforced by
  convention here, not by code.
- **`lib/enquiry.ts` is a closed vocabulary on purpose.** The API route
  whitelists every answer against it, so an option that is not declared there is
  silently dropped. Add the option first, then the copy.
- **`Shipped`'s featured list is still inline** in `components/sections/Shipped.tsx`
  rather than in `lib/` — the one content island left. Worth moving to `lib/work.ts`
  if you are touching it anyway.
- Two components hold their own copy because it is prose, not data:
  `about/AboutTeams.tsx` (the character lines and service lists) and
  `about/AboutPrinciples.tsx` (the four principles).

## How to verify changes before reporting done

Standard loop used throughout this project — run all of these:
```bash
npm run build          # production build must succeed
npm run lint           # eslint must be clean (vendored files under
                        # components/vendor/*.tsx are exempted via
                        # /* eslint-disable */ + // @ts-nocheck at the top —
                        # this is intentional, they're kept verbatim from
                        # upstream, don't "fix" their lint errors)
npx tsc --noEmit        # typecheck
npm run test:contrast   # only strictly required after touching lib/grounds.ts
                        # or lib/useGroundRhythm.ts, but cheap to run always
npm run test:scale      # added Sep 2026 — fails on spacing off the 2px grid,
                        # raw ms / cubic-bezier() outside globals.css, and
                        # tracked labels not on a --t-* token
```
For visual verification, use the Claude_Browser preview tools
(`preview_start` with `{name: "scalina-web"}` per `.claude/launch.json`, then
`navigate`/`javascript_tool`/`computer` screenshot). **Known pane quirk**: this
preview pane frequently reports `document.hidden = true` even when it's the
active tab, which silently pauses any WebGL/canvas work gated on page
visibility (Threads, LiquidEther, ParticleText all check `document.hidden`).
To force them to render for a screenshot:
```js
Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
document.dispatchEvent(new Event('visibilitychange'));
```
Also: this pane throttles `requestAnimationFrame` heavily, so a single
`javascript_exec` call often reads a GSAP tween mid-transition rather than
settled — sample across *separate* tool calls with a `sleep` between them
instead of trying to read final state in one shot, or you'll misdiagnose a
working animation as broken (this happened at least three times in this
session and each was a false alarm, not a real bug).

## Reference sites the user pointed to for specific sections

- `vividmotion.co` — the Shipped/Featured-work sticky layout, and the
  `/services` hero's big-Inter-Tight-headline treatment
- `weichie.com` — the Selected Work irregular grid pattern (their `.latest-work`
  section)
- `ui.unlumen.com/components/vertical-marquee` — testimonials layout/sizing
  reference (narrow ~290px cards, tweet-card anatomy)

If more design matching is asked for, the pattern that worked well: open the
reference in the Browser pane, `javascript_exec` to walk the DOM and read
`getComputedStyle` values directly (grid-template-columns, font sizes, gaps)
rather than eyeballing screenshots — measurements were consistently more
reliable than visual comparison in this session.
