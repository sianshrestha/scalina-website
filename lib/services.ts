/* Content for the Services page, split by team.

   The two teams share every component on this page — only the content differs.

   NOTE ON NUMBERS AND QUOTES: the figures are not here — they live in
   lib/proof.ts, each with its source, derived from the case studies. The
   invented testimonials that used to sit below are gone entirely; see the
   note above TEAMS. */

export type TeamKey = 'media' | 'systems';

export type Service = {
  /** Label shown on the wheel. */
  name: string;
  headline: string;
  body: string;
  deliverables: string[];
};

export type Team = {
  key: TeamKey;
  name: string;
  eyebrow: string;
  ground: 'light' | 'dark';
  /** Big Inter Tight hero line. */
  headline: string;
  lede: string;
  services: Service[];
  cta: { heading: string; body: string; label: string };
  other: TeamKey;
};

/* ---------------------------------------------------------------------------
   THE TESTIMONIALS ARE GONE, AND THEY ARE NOT COMING BACK AS PLACEHOLDERS.

   Twelve invented quotes used to live here. Two were attributed to companies
   that do not exist (Atlas Freight, Verity Logistics) and two more to names
   that are not clients (Northbridge Dental, Harper & Co) — but the worse half
   were the eight put into the mouths of REAL clients, which is the specific
   thing /about principle 03 promises the studio does not do.

   `ServiceProof` now names the clients and says plainly that the quotes are
   outstanding. When a signed-off quote arrives, add a `quote` to that client
   in this file; until then the section tells the truth about its own state.
--------------------------------------------------------------------------- */

export const TEAMS: Record<TeamKey, Team> = {
  media: {
    key: 'media',
    name: 'Scalina Media',
    eyebrow: '01 / Scalina Media',
    ground: 'light',
    headline: 'We make the content that gets you found, followed and remembered.',
    lede: 'Expressive, tactile, culturally fluent. Media works in vertical video and print texture, at the volume the feed actually demands, without burning the brand out.',
    services: [
      {
        name: 'Content & UGC',
        headline: 'Content that looks like the feed, not like an ad.',
        body: 'Short-form video and creator-style content made at volume. We shoot, edit and version so one idea becomes a month of posts instead of a single upload.',
        deliverables: ['Short-form video', 'Creator-style UGC', 'Batch shoot days', 'Platform versioning'],
      },
      {
        name: 'Creative & Design',
        headline: 'Design that holds up at thumbnail size.',
        body: 'Brand-consistent graphic design across social, print and campaign. Built as a system so the tenth asset looks like the first, not like a different company.',
        deliverables: ['Social templates', 'Campaign key art', 'Print & packaging', 'Brand systems'],
      },
      {
        name: 'Creative Production',
        headline: 'The shoot, run properly.',
        body: 'Full production from concept to delivery: location, direction, lighting, sound and post. One team on the day, one team in the edit.',
        deliverables: ['Concept & direction', 'Location & studio', 'Photography & video', 'Post-production'],
      },
      {
        name: 'Social Media',
        headline: 'Showing up every day, on purpose.',
        body: 'Channel management, calendars, community and reporting. Consistent posting against a plan, with the numbers reviewed rather than admired.',
        deliverables: ['Content calendars', 'Channel management', 'Community replies', 'Monthly reporting'],
      },
      {
        name: 'Paid Advertising',
        headline: 'Budget goes behind what already works.',
        body: 'Paid spend on proven creative. Cost per lead watched daily, placements that stop earning get cut, and the creative that wins gets more of the budget.',
        deliverables: ['Meta & TikTok ads', 'Google & YouTube', 'Creative testing', 'Daily CPL review'],
      },
    ],
    cta: {
      heading: 'Nobody sees you yet.',
      body: 'We make the content, run the channels and put budget behind what works, so the right people find you and keep finding you.',
      label: 'Start a project',
    },
    other: 'systems',
  },

  systems: {
    key: 'systems',
    name: 'Scalina Systems',
    eyebrow: '02 / Scalina Systems',
    ground: 'dark',
    headline: 'We build the software your business actually runs on.',
    lede: 'Precise, engineered, structural. Systems works in interface and grid: the websites, tools and automation that carry the volume the front of the business creates.',
    services: [
      {
        name: 'Website Development',
        headline: 'Sites built to be run, not admired.',
        body: 'Fast, accessible, search-ready builds on a stack your team can maintain. Every page measured, every form landing somewhere you can act on.',
        deliverables: ['Design & build', 'CMS integration', 'Performance & a11y', 'Analytics wiring'],
      },
      {
        name: 'Custom Software',
        headline: 'The tool that does exactly your job.',
        body: 'CRM, ERP, warehouse management and customer portals. Shipped for real clients, not a services list. Built when off-the-shelf costs more than it saves.',
        deliverables: ['CRM & ERP', 'Warehouse management', 'Customer portals', 'Internal tooling'],
      },
      {
        name: 'Automation & AI',
        headline: 'The work nobody should be doing by hand.',
        body: 'Workflow automation and AI where it genuinely removes effort: quoting, routing, follow-up, reporting. Measured against hours returned, not novelty.',
        deliverables: ['Workflow automation', 'AI-assisted ops', 'Integrations', 'Reporting pipelines'],
      },
      {
        name: 'Funnels & Lead Gen',
        headline: 'Every enquiry lands somewhere actionable.',
        body: 'Funnels, landing pages and lead capture that turn attention into booked work, with the follow-up already written and the routing already decided.',
        deliverables: ['Landing pages', 'Lead capture', 'CRM routing', 'Follow-up sequences'],
      },
      {
        name: 'SEO & Search',
        headline: 'Search infrastructure, not keyword theatre.',
        body: 'Technical SEO, structure and content architecture so the site is legible to search engines and to the people they send. Built in, not bolted on.',
        deliverables: ['Technical SEO', 'Information architecture', 'Schema & indexing', 'Search reporting'],
      },
    ],
    cta: {
      heading: "It doesn't run yet.",
      body: 'We build the websites, software and automation underneath the business, so the volume your marketing creates has somewhere to land.',
      label: 'Get a quote',
    },
    other: 'media',
  },
};

export const TEAM_KEYS: TeamKey[] = ['media', 'systems'];
