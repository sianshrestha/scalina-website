# Scalina, architecture notes

> Moved from the root README in Oct 2026. Parts of this predate the case-study, Lenis and motion.dev work; HANDOFF.md (top blocks) is the current record.

Next.js implementation of the `Scalina Home.dc.html` Claude Design handoff.
Brand source of truth: `scalina-brand-positioning-v4.md`.

```bash
npm run dev            # http://localhost:3000
npm run build
npm run test:contrast  # guards the section-transition contrast invariant
```

## Stack

- Next.js 16 (App Router) + TypeScript
- GSAP + ScrollTrigger for **all** motion — reveals, parallax, the pinned card
  stack and the section crossfade. Deliberately one animation library, not two.
- CSS Modules. The design is built on exact `clamp()` values; modules preserve
  them losslessly where a utility framework would be a lossy translation.
- `three` for the footer's LiquidEther background.

## Layout

```
app/
  layout.tsx            fonts (Inter Tight / Oswald / IBM Plex Mono)
  page.tsx              homepage composition + ground rhythm wrapper
  services/page.tsx     services, per team, driven by ?view=media|systems
  globals.css           ground tokens, resets, shared utilities
components/
  SiteHeader.tsx        direction-aware nav ↔ menu-button collapse
  NavOverlay.tsx        full-screen menu (condensed outline type)
  ClosingBlock.tsx      one LiquidEther field behind the CTA + footer together
  SiteFooter.tsx        footer columns, scrubbed wordmark
  Reveal.tsx            scroll reveals (replaces the prototype's data-reveal)
  ServiceMenu.tsx       wraps React Bits FlowingMenu for the service rows
  sections/             one component per homepage section
  services/             services hero, OptionWheel explorer, proof, CTA
  vendor/               React Bits components — see below
lib/
  grounds.ts            ground token sets + how a boundary resolves (pure).
                        Includes --accent-fg, the brand colour used for TEXT:
                        lime on dark, cobalt on light, because neither brand
                        colour is readable on both grounds.
  useGroundRhythm.ts    timed dark/light crossfade at each section boundary
  ether.ts              the one LiquidEther config (hero + closing block)
  useSmoothAnchors.ts   GSAP-driven in-page anchor scrolling
  gsap.ts               single plugin registration point
tests/
  contrast.test.mts     asserts the crossfade never drops below 3:1
```

## Vendored components

`components/vendor/` holds React Bits components, kept verbatim so they can be
diffed against upstream. Do not reformat them.

| Component | Where | Source |
|---|---|---|
| `LiquidEther.jsx` | hero + CTA/footer background, brand blue | handoff bundle |
| `LogoLoop.tsx` | client marquee in the hero | `ts-default/Animations/LogoLoop` |
| `FlowingMenu.tsx` | What We Do service rows | `ts-default/Components/FlowingMenu` |
| `BubblePills.jsx` | **unused** — was the nav overlay | handoff bundle |
| `ParticleText.tsx` | **unused** — was the Systems hero wordmark | `ts-default/TextAnimations/ParticleText` |
| `Threads.tsx` | **unused** — was the Media hero background | `ts-default/Backgrounds/Threads` |
| `OptionWheel.tsx` | services picker | `ts-default/Components/OptionWheel` |
| `VerticalMarquee.tsx` | services testimonials | unlumen UI `vertical-marquee` |
| `TextRoll.tsx` | header nav hover | Skiper UI `skiper58` |
| `LinePath.tsx` | /about "How we work" thread | Skiper UI `skiper19` |
| `ParallaxColumns.tsx` | Latest work wall | Skiper UI `skiper30` |
| `PerspectiveScroll.tsx` | the manifesto line | Skiper UI `skiper28` |
| `Carousel.tsx` | /work card deck (`effect` prop: cards/coverflow/creative) | Skiper UI `skiper48` / `49` / `51` |

The three Skiper UI components are **ported, not installed**: `npx shadcn add` needs a
`components.json` and Tailwind, and this project has neither by design. They import
`motion/react` instead of `framer-motion` — same API, and `motion` was already a
dependency — so the only package added for them is `swiper`. **Skiper's free tier
requires attribution**; each file keeps its upstream licence block.

The three marked unused were left in place rather than deleted: they are
verbatim upstream copies, nothing imports them so nothing ships, and the hero
and menu they belonged to may want them again.

The two from the handoff had only their module boundary changed — globals
(`React`, `window.THREE`) became real imports and each is a default export.

The React Bits MCP (`reactbits-dev-mcp-server`, configured in `.mcp.json`) was
used to pull FlowingMenu, but its bundled index is stale: it lists 135
components with no LogoLoop, no ParticleText and no OptionWheel, and it serves the **Tailwind**
variant of Threads, whose utility classes are inert here and collapse the canvas
to zero height. Those three come from the React Bits repo's `ts-default` tree
instead — the same source the MCP wraps, in the plain-CSS variant this project
can actually use.

`support.js` from the handoff was **not** ported. It is the Claude Design
preview runtime (the parser for `x-if`, `x-for`, `x-import`, `data-reveal`);
each behaviour it provided is reimplemented natively here.

## The hero and its opening

`components/sections/Hero.tsx`, taken from vanmorrison.com — the timings and
the construction are read off their own timeline (`app-DbbLE3AI.js`), not
eyeballed from a recording. An earlier attempt here was guessed and was wrong
in every measurement; if this ever needs revisiting, go and read their bundle
again rather than watching it.

**Structure.** The field is full-bleed and always painted. Over it sit two
black panels, each 50% wide, pinned to the left and right edges — that is what
makes the page look black on arrival. Above both sits the wordmark, twice: an
outline copy, and a solid copy clipped to nothing at the centre.

The reveal slides the two panels out to their own sides while the solid copy's
clip-path opens from the centre on the same duration and the same ease. The
field appears and the letters fill in together, but **nothing clips the
field**. Clipping the field and the fill as one layer looks similar in a still
and wrong in motion; that was the first mistake here.

**Order.** Nothing starts until the field is genuinely up. Their timeline waits
on the hero video's `loadeddata`, capped at 1800ms; ours waits for
LiquidEther's canvas to mount and paint, capped the same. Skipping that gate
was the second mistake: the curtain ran on a blind timer, well before the WebGL
chunk had loaded, and drew apart to reveal more black.

Then, matching their timeline exactly:

| t | what |
|---|---|
| 0.00 → 0.75 | wordmark rises 200px and fades up, `power3.out` |
| 0.75 → 1.10 | hold |
| 1.10 → 2.00 | curtains out to ±100%, fill clip `inset(0 50%)` → `inset(0)`, both `power3.inOut` |
| 1.80 → 2.10 | outline fades out, `power2.in` |
| 1.60 → 2.10 | header fades up — during the reveal, not after |

The client marquee is not on that list: it sits *below* the curtains and is
uncovered by the wipe itself, the same way the field is. Only the header fades,
because it lives outside the section and the panels cannot wipe it.

**The field is painted, not just a canvas.** LiquidEther's canvas is
transparent (`alpha: true`, clear alpha 0) and starts with no fluid in it, so
the curtains would part onto the same black they are made of. `.field` carries
a brand-blue gradient underneath for the fluid to move over — it is what makes
the reveal legible at all, not decoration.

**Opening states live in CSS, not JS.** The server-rendered first paint has to
already be black with no chrome, and an effect that sets it runs a frame too
late. GSAP only ever animates away from those states. The header opts in with
`data-site-chrome` and is hidden by a `body:has([data-hero])` rule in
`globals.css`, so pages without a hero — which have nothing to run the
timeline — are unaffected. `layout.tsx`'s `<noscript>` block resolves every one
of those states if scripts never run.

Two traps worth keeping. The fill's clip is a `fromTo` with **both ends
written out in full**; a plain `.to()` reads the start off the computed style,
which the browser has normalised from `inset(0% 50% 0% 50%)` to `inset(0%
50%)`, and GSAP interpolates complex strings number-for-number — four against
two pinned the left inset at its end value from the first frame, so the left of
the word was already solid before the curtains moved.

And the header is queried with
`document.querySelectorAll` and passed to GSAP **as elements**. `useGSAP`'s
`scope` confines selector *strings* to the hero, which silently dropped the
header and left it hidden for the whole session.

The face is **Oswald 700**, display-only — this wordmark and the menu.

## Section transitions

The homepage alternates dark and light as a structural rhythm. Sections declare
`data-ground="dark|light"`; `useGroundRhythm` walks them in DOM order and, on
every scroll, works out which ground the page should be on right now. When that
answer changes, the shared tokens cross-fade to the new ground over a fixed
1000ms. In the current section order that is two boundaries: Selected Work and
Start a Project.

Tokens are written to `<html>`, not to the wrapper, so the fixed header inverts
with the page instead of disappearing over the light sections.

Reduced motion cuts at the seam instead of fading.

### Timed, not scrubbed — and why

This used to scrub: the tokens were a pure function of how far the scroll had
travelled through a boundary window, so the ground moved only while the wheel
moved, and stopping mid-boundary parked the page on a half-mixed grey.

`mude.com.au`, the reference for this, does the opposite — its sections carry
`transition-colors duration-1000`, so crossing a boundary swaps the target and
the browser eases background and text to it over one second on its own curve,
whatever the scroll does next. That is the behaviour here now: **scroll position
decides which ground, time decides how it gets there**, on Tailwind's default
`cubic-bezier(0.4, 0, 0.2, 1)` to match.

The trigger is a section's top crossing 55% of the viewport.

### Deriving the target from scroll, not from animation state

An earlier version scrubbed one GSAP tween per boundary and read its progress.
That has no authoritative source of truth: triggers built while the layout was
still settling could report a boundary far down the page as already complete,
and a stale trigger surviving a rebuild could land the last write. The symptom
was the page staying light after switching to the dark hero — intermittently,
which is what made it look like an animation-lifecycle bug rather than a
missing source of truth.

The *target* is still measured directly from `window.scrollY` and element
positions on every scroll, so there is nothing to go stale. The only animation
state kept is the single in-flight cross-fade, which is cancellable and always
restarted from the colour currently on screen — including a mid-fade reversal,
which flips the two ends and the mix together. Surfaces interpolate linearly,
so `resolveGround(a, b, m)` and `resolveGround(b, a, 1 - m)` are the same
colour and the reversal is exact rather than a jump.

### Why foregrounds step instead of tweening

Tweening background *and* text on the same curve sends both through the same
mid-grey halfway through the boundary — background `rgb(127,125,127)` under text
`rgb(128,128,128)` — and the text vanishes. That is the same contrast failure
that ruled out `mix-blend-mode: difference`, reached a different way. Narrowing
the tween does not fix it; any continuous interpolation still passes through a
value equal to the background.

So surfaces scrub and foregrounds **step**, at whichever point the incoming
ground's text actually wins on contrast against the background as it stands.
Secondary text is a further problem — `#8E8E96` and `#4A4D55` are both mid-tones
and sit right where the background passes — so the muted tokens are lifted
toward full text colour only as far as the shortfall requires, then released.

Worst case across either direction: **4.18:1 body, 3.89:1 secondary**, and only
while actively scrolling the seam. `npm run test:contrast` asserts this.

That is the ceiling for one shared background moving between these two grounds.
Holding full AA throughout would mean not sharing a background at all —
overlapping two opaque grounds — which is a different mechanic from the one
specified.

## Services page

`/services?view=media|systems`. The URL is the only source of truth for which
team is showing — the toggle just rewrites it — so a shared link, the back
button and the homepage's `?view=` links all agree.

Both teams share every component; only `lib/services.ts` differs. The React Bits
OptionWheel drives the service picker, and the whole panel behind it (accent
wash, headline, body, deliverables) swaps with the selection. Note that
OptionWheel's `fontSize` prop is in **rem**, not px.

### unlumen components are ported, not copied

Both unlumen components are Tailwind-only and reference shadcn theme tokens
(`text-foreground`, `border-foreground`) this project does not define, so their
utility classes are ported to CSS modules pointing at our ground tokens — which
also means they invert with the page. Their behaviour is upstream's, unchanged.

`vertical-marquee` additionally renders X/Twitter cards upstream: it takes
`tweetIds` and fetches through `react-tweet`. Scalina's testimonials are written
client quotes, so the card renderer is replaced with an `items` array of nodes.
The scroll engine — measure, ease toward target speed, wrap — is upstream's.

### Numbers and quotes still need replacing

The stats block only states facts the brand file itself carries (service counts,
named clients, shipped builds). Anything needing a client-supplied figure renders
greyed with an "Awaiting figure" tag.

**(Historical — these were removed Sep 2026; see HANDOFF.md.)** The testimonials in `lib/services.ts` were invented, written at the client's
request to fill the layout — including two companies that are not clients at all.
The brand file requires real, signed-off quotes, so these must be replaced
wholesale before launch. The block is commented accordingly.

## Enquiry delivery

`/start` posts to `app/api/enquiry/route.ts`, which validates against the closed
vocabulary in `lib/enquiry.ts` and hands off to `lib/deliverEnquiry.ts`. That
sends to **both** the Scalina CRM and an email to the team, in parallel — the CRM
is the durable structured record, the email is what makes someone reply today.

Everything is configured from `.env.local` (gitignored). **Nothing is configured
by default, and an unconfigured deployment returns 502 on every submission** —
deliberately, because `/start`'s confirmation promises a reply from a real person
within one business day and that promise must not be shown over a send that went
nowhere. The form is visibly broken until a destination exists.

```bash
# .env.local — at least one of these two groups is required

# Scalina CRM
SCALINA_CRM_ENDPOINT=https://crm.example/api/enquiries
SCALINA_CRM_TOKEN=…                 # optional; sent as Authorization: Bearer

# Email
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=465                       # defaults: 465 secure, 587 when SMTP_SECURE=false
SMTP_SECURE=true
SMTP_USER=…
SMTP_PASS=…
ENQUIRY_TO=info@scalinamedia.com    # default
ENQUIRY_FROM=…                      # defaults to ENQUIRY_TO
```

Behaviour, verified end to end:

| State | Visitor sees | Server |
|---|---|---|
| Neither configured | 502, "please email us" | enquiry logged, loud config error naming the vars |
| One or both reachable | `{ ok: true, reference }` | delivered; the CRM gets the enquiry plus its reference |
| Configured but failing | 502, "please email us" | enquiry logged first, then the failure with its reason |

The enquiry is written to the server log **before** any delivery is attempted, so
a submission is never lost to a failed integration alone. The CRM receives the
enquiry verbatim; if it wants a different shape, map it in `toCrmBody` — that is
the only place that should need to change.

## Known gaps

- Links point at `/work`, `/services`, `/about`, `/start`, `/the-scalina-system`
  and per-project pages. Only `/` is built, so those 404 for now.
- `/services?view=media|systems` anchors assume the Services page ships as one
  page with a Media/Systems toggle. If it becomes two pages instead, those hrefs
  need updating.
- Shipped ("Featured work") follows the vividmotion.co layout: sticky left
  column pinned at `top: 0` over the full viewport height, label at 40vh, client
  block at the foot, media column at ~61% with 13:10 panels. Their titles are
  single words at 96px; ours are full project names, so the type is a step down
  to keep them to two lines.
- Shipped and Selected Work still use the prototype's placeholder panels;
  they're waiting on real screenshots.
- Client "logos" are wordmarks. Swap `name` for `src` in the LogoLoop items in
  `lib/content.ts` when real logo files land.
- FlowingMenu's hover marquee shows a brand-blue chip where an image would go;
  give each service an image path when artwork exists.


## Case studies, proof and motion (Sep 2026)

- `/work` lists one case study per client (`lib/work.ts` → `CASES`); each renders at
  `/work/<slug>`. Media lives in `public/work/<slug>/`; how the software screenshots
  were produced is in `scripts/media-capture/README.md`.
- About and Services proof grids are bentos fed by `lib/proof.ts` — every figure
  carries its source.
- Smooth scrolling is Lenis on GSAP's ticker (`components/SmoothScroll.tsx`);
  micro-interactions use motion.dev (`motion/react`). Full notes in HANDOFF.md.
