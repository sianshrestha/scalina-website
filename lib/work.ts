/* The case studies — one per client, not one per deliverable.

   Each client usually bought more than one thing (Gurung Shuttles took ads,
   content, a social setup and a DM automation; OZI HP took a warehouse system,
   a customer portal, a website and a voice agent), and listing those as
   separate "projects" hid the point: the work was one engagement, and the
   parts only mattered together.

   EVERY FIGURE HERE IS TRACEABLE. `source` says where it came from:
   - video counts and weeks are counted off the client folders in the Scalina
     Media shared drive (Clients → SMML01 Maya Lounge, SMML02 Gurung Shuttle),
     September 2026;
   - software figures are counted off the client repositories (routes,
     controllers, endpoints);
   - cadence ("3–4 videos a week") and what each client bought come from the
     studio itself.
   Nothing is estimated. If a number cannot be pointed at, it is not here —
   which is why Runaway Entertainment and ANFA Australia have no results row.

   Finished videos come from the client deliverables (Desktop/Scalina Clients),
   encoded twice: a 9-second muted loop and the full edit with sound.

   Screenshots of the software show the real interface running against SAMPLE
   data (`sample: true`), never the client's own records. */

export type WorkTeam = 'media' | 'systems';

type Frame = 'browser' | 'phone' | 'poster' | 'bare';

export type CaseMedia =
  | {
      kind: 'image';
      src: string;
      w: number;
      h: number;
      alt: string;
      frame?: Frame;
      /** Browser chrome address, when framed as a browser. */
      url?: string;
      caption?: string;
      /** Real interface, sample records. */
      sample?: boolean;
    }
  | {
      kind: 'video';
      src: string;
      /** The full edit with sound, played on tap. */
      full?: string;
      poster: string;
      w: number;
      h: number;
      alt: string;
      frame?: Frame;
      caption?: string;
    }
  | {
      /* A diagram or interface drawn for the page — used where the work is a
         flow (ads → DMs → bookings) or a phone call, which a screenshot can't
         show. Always captioned as illustrative. */
      kind: 'designed';
      design: 'dm-flow' | 'voice-call' | 'ugc-cover' | 'cadence';
      caption?: string;
      label?: string;
      /** For `cadence`: the real week and video counts. */
      weeks?: number;
      total?: number;
    };

export type CaseResult = {
  value: string;
  label: string;
  source: string;
};

export type CaseChapter = {
  title: string;
  body: string;
  media?: CaseMedia[];
  /** How the media row is laid out. */
  layout?: 'wide' | 'pair' | 'phones' | 'posters';
};

export type CaseStudy = {
  slug: string;
  client: string;
  /** Short name for tight spaces. */
  short: string;
  sector: string;
  location: string;
  teams: WorkTeam[];
  /** What the client bought, in the services page's vocabulary. */
  services: string[];
  year: string;
  status: 'Ongoing' | 'Delivered' | 'In progress';
  /** One line, the whole case in a sentence. */
  headline: string;
  summary: string;
  /** The situation before. */
  brief: string;
  chapters: CaseChapter[];
  results: CaseResult[];
  /** Hero / index media. */
  cover: CaseMedia;
  /** Accent tint used behind media on the index hover and the case hero. */
  tint: string;
  /** Index thumbnail, when the cover is drawn rather than photographed. */
  thumb?: string;
  /** The client's own mark, where we have one. */
  logo?: { src: string; w: number; h: number };
  /** Titles of real delivered pieces, where a list says more than a picture. */
  reel?: string[];
  note?: string;
};

const MAYA = '/work/maya-lounge';
const GS = '/work/gurung-shuttles';
const EASTER = '/work/sydney-easter-show';
const RUN = '/work/runaway-entertainment';
const OZI = '/work/ozi-hp';
const CRM = '/work/scalina-crm';
const GJ = '/work/gurkha-jewellery';
const ANFA = '/work/anfa-australia';

/* A finished vertical video: a short muted loop for the page, the full edit
   with sound behind a tap. Both are encoded from the client's delivered file. */
function reel(dir: string, name: string, alt: string): CaseMedia {
  return {
    kind: 'video',
    src: `${dir}/${name}.mp4`,
    full: `${dir}/${name}-full.mp4`,
    poster: `${dir}/${name}.webp`,
    w: 720,
    h: 1280,
    alt,
    frame: 'phone',
  };
}

export const CASES: CaseStudy[] = [
  {
    slug: 'gurung-shuttles',
    client: 'Gurung Shuttles and Tours',
    short: 'Gurung Shuttles',
    sector: 'Transport & tours',
    location: 'Sydney',
    teams: ['media', 'systems'],
    services: ['Paid advertising', 'Content & UGC', 'Social media', 'Automation & AI'],
    year: '2026',
    status: 'Ongoing',
    headline: 'Ads bring the lead in. The DMs book it, even while the owner sleeps.',
    summary:
      'We built Gurung Shuttles a full front end: ad campaigns, weekly UGC, a social presence set up from scratch, and an automated DM flow that answers every enquiry while the owner is asleep.',
    brief:
      'An owner-operated shuttle and tours business where every booking came through the owner’s own phone. Enquiries that arrived after hours waited until morning, and someone booking a shuttle does not wait.',
    chapters: [
      {
        title: 'Social, set up properly',
        body:
          'We set up the social channels from scratch, so an ad had somewhere credible to send people and a clear way to book once they got there.',
      },
      {
        title: 'Ads that start conversations',
        body:
          'Campaigns built to open a DM rather than send people to a form. A message is lower effort than a form for someone booking an airport run, and it lands in the one place the business already answers.',
      },
      {
        title: 'Automated replies that capture the lead',
        body:
          'An automated chat flow picks up every DM instantly. It asks the questions the owner would ask (pickup, drop-off, date, passengers) and holds the lead until a person confirms. The customer is answered in the middle of the night, and the owner wakes up to a booking, not a missed message.',
      },
      {
        title: 'Three to four videos, every week',
        body:
          'Weekly short-form UGC: skits, offers, cruise transfers and the realities of airport runs, made for the feed rather than a brochure. It keeps the account alive between campaigns and gives the ads fresh creative to run.',
        media: [{ kind: 'designed', design: 'cadence', weeks: 13, total: 38, caption: 'Weekly delivery, counted off the client folder.' }],
        layout: 'wide',
      },
      {
        title: 'Straight from the feed',
        body: 'Six of the thirty-eight. Tap any of them to watch it with sound.',
        media: [
          reel(GS, 'promo', 'Gurung Shuttles promo'),
          reel(GS, 'fuel-prices', 'Skit about fuel prices'),
          reel(GS, 'designated-driver', 'Designated driver skit'),
          reel(GS, 'whats-stopping-you', 'What’s stopping you, travel video'),
          reel(GS, 'cruise-transfer', 'Cruise transfer video'),
          reel(GS, 'booked', 'Booked Gurung Shuttles video'),
        ],
        layout: 'phones',
      },
    ],
    results: [
      { value: '38', label: 'Videos delivered', source: 'Counted in the client deliverables folder' },
      { value: '13', label: 'Consecutive weeks of content', source: 'Weekly folders, Wk 01 to Wk 13' },
      { value: '24/7', label: 'Every DM answered', source: 'Automated reply flow' },
      { value: '3-4', label: 'Videos a week', source: 'Retainer cadence' },
    ],
    reel: ['Fuel prices', 'Uber cancel', 'A free trip??', 'Cruise transfer', 'Designated driver', 'What’s stopping you', 'Sathi driver', 'Wedding drunk drive'],
    cover: { kind: 'designed', design: 'dm-flow', caption: 'The lead flow, as built. Messages are illustrative.' },
    thumb: `${GS}/promo.webp`,
    logo: { src: `${GS}/logo.webp`, w: 800, h: 242 },
    tint: '#1D3F7A',
  },
  {
    slug: 'ozi-hp',
    client: 'OZI Hygiene & Packaging',
    short: 'OZI HP',
    sector: 'Wholesale packaging',
    location: 'Auburn, Sydney',
    teams: ['systems'],
    services: ['Custom software', 'Website', 'Automation & AI'],
    year: '2026',
    status: 'Delivered',
    headline: 'The warehouse, the customers and the drivers on one system. And the phone answered.',
    summary:
      'A warehouse management system, a customer ordering portal, a new website and an AI voice agent for a Sydney packaging wholesaler. The warehouse, the portal and the drivers share one codebase and one database.',
    brief:
      'Orders arrived by phone and email and the warehouse ran on spreadsheets. The office, the floor, the drivers and the accounts each had a different version of the day.',
    chapters: [
      {
        title: 'A warehouse system built around their day',
        body:
          'Orders, stock, suppliers, customers, credit terms, statements and commissions, with a dashboard that says what needs attention before anyone asks. Invoices sync to Xero instead of being retyped.',
        media: [
          { kind: 'image', src: `${OZI}/wms-dashboard.webp`, w: 1800, h: 1250, alt: 'OZI HP warehouse dashboard with revenue, open orders and stock alerts', frame: 'browser', url: 'wms.ozihp.com.au', sample: true },
          { kind: 'image', src: `${OZI}/wms-orders.webp`, w: 1800, h: 1125, alt: 'Order list with status, payment and delivery columns', frame: 'browser', url: 'wms.ozihp.com.au/orders', sample: true },
        ],
        layout: 'wide',
      },
      {
        title: 'Customers order themselves',
        body:
          'Account customers get their own portal: their usual list, their agreed pricing, reorder from history and their own invoices to download. At 6am if they like, without phoning through a list.',
        media: [
          { kind: 'image', src: `${OZI}/portal-order.webp`, w: 1800, h: 1125, alt: 'Customer portal order builder with the customer’s usual products', frame: 'browser', url: 'portal.ozihp.com.au', sample: true },
        ],
        layout: 'wide',
      },
      {
        title: 'Drivers get the run on their phone',
        body:
          'Today’s stops in order, with addresses, delivery windows and the customer’s own notes. Barcode scanning at the receiving dock keeps the stock count honest.',
        media: [
          { kind: 'image', src: `${OZI}/wms-driver.webp`, w: 860, h: 1864, alt: 'Driver’s delivery run on a phone', frame: 'phone', sample: true },
          { kind: 'image', src: `${OZI}/site-mobile.webp`, w: 780, h: 1688, alt: 'OZI HP website on a phone', frame: 'phone' },
        ],
        layout: 'phones',
      },
      {
        title: 'A website that sells the account',
        body:
          'The public site does one job: turn a kitchen buying packaging on the side into an account customer. Ranges, how ordering works, and the portal front and centre.',
        media: [
          { kind: 'image', src: `${OZI}/site-hero.webp`, w: 1800, h: 1125, alt: 'OZI Hygiene & Packaging website homepage', frame: 'browser', url: 'ozihp.com.au' },
          { kind: 'image', src: `${OZI}/site-portal.webp`, w: 1800, h: 1125, alt: 'Website section explaining the customer portal', frame: 'browser', url: 'ozihp.com.au' },
        ],
        layout: 'pair',
      },
      {
        title: 'A voice agent on the phone line',
        body:
          'An AI voice agent on the business line, so calls are picked up and the details taken without pulling someone off the warehouse floor.',
        media: [{ kind: 'designed', design: 'voice-call', caption: 'Illustrative. The call UI is drawn for this page.' }],
        layout: 'wide',
      },
    ],
    results: [
      { value: '4', label: 'Apps from one codebase: admin, warehouse, driver, customer', source: 'Route guards in the WMS frontend' },
      { value: '156', label: 'API endpoints behind it', source: 'Counted in the backend controllers' },
      { value: '46', label: 'Screens', source: 'Counted in the router' },
      { value: 'Xero', label: 'Invoices sync, not retyped', source: 'Xero integration in the WMS' },
    ],
    cover: { kind: 'image', src: `${OZI}/wms-dashboard.webp`, w: 1800, h: 1250, alt: 'OZI HP warehouse dashboard', frame: 'browser', url: 'wms.ozihp.com.au', sample: true },
    tint: '#0F5132',
    note: 'Software screenshots show the real interface with sample data.',
  },
  {
    slug: 'maya-lounge',
    client: 'Maya Lounge',
    short: 'Maya Lounge',
    sector: 'Hospitality, bar & kitchen',
    location: 'Pitt St, Sydney',
    teams: ['media'],
    services: ['Content & UGC', 'Creative & Design', 'Creative Production', 'Social media'],
    year: '2026',
    status: 'Ongoing',
    headline: 'Twenty weeks of a basement bar showing up in the feed, every week.',
    summary:
      'Weekly UGC, interviews and shoots, plus the graphic system for Maya’s menus and promotions. Three to four videos a week since April.',
    brief:
      'A basement bar on Pitt Street is invisible from the street. If people are going to find it, they find it on their phone first, which means being in the feed consistently, not once a month.',
    chapters: [
      {
        title: 'UGC that looks like the feed',
        body:
          'Skits, nights at the bar and the bar’s own milestones, shot on the format people actually watch. Made at volume and posted on a schedule, so the account never goes quiet. Tap any of them to watch it with sound.',
        media: [
          reel(MAYA, 'two-years', '2 years of Maya'),
          reel(MAYA, 'happy-hours', 'Happy hours got more happier'),
          reel(MAYA, 'bollywood', 'Bollywood night at Maya'),
        ],
        layout: 'phones',
      },
      {
        title: 'Interviews, shoots and the big nights',
        body:
          'Sit-down interviews with the people behind the bar, and full coverage of Maya Fest and Teej. Each one cut down for the feed on the week it happened.',
        media: [
          reel(MAYA, 'interview', 'Interview at Maya Lounge'),
          reel(MAYA, 'maya-fest', 'Maya Fest'),
          reel(MAYA, 'teej', 'Teej special'),
        ],
        layout: 'phones',
      },
      {
        title: 'A cocktail menu with a personality each',
        body:
          'One poster system, six drinks, six moods. Consistent enough to be one bar, different enough that each drink gets its own post.',
        media: [
          { kind: 'image', src: `${MAYA}/cocktails-icons.webp`, w: 900, h: 1125, alt: 'Meet the icons, five Maya cocktails', frame: 'poster' },
          { kind: 'image', src: `${MAYA}/cocktail-kandy.webp`, w: 900, h: 1125, alt: 'Kandy Crush cocktail poster', frame: 'poster' },
          { kind: 'image', src: `${MAYA}/cocktail-titaura.webp`, w: 900, h: 1125, alt: 'Titaura Martini poster', frame: 'poster' },
          { kind: 'image', src: `${MAYA}/cocktail-aloha.webp`, w: 900, h: 1125, alt: 'Aloha’s Cocktail poster', frame: 'poster' },
          { kind: 'image', src: `${MAYA}/cocktail-minting.webp`, w: 900, h: 1125, alt: 'Minting cocktail poster', frame: 'poster' },
          { kind: 'image', src: `${MAYA}/cocktail-maya.webp`, w: 900, h: 1125, alt: 'Maya’s Cocktail poster', frame: 'poster' },
        ],
        layout: 'posters',
      },
      {
        title: 'A lunch offer, sold in one glance',
        body:
          'The $15 lunch campaign: a repeating type lock-up, the dish in the middle, the times at the top. Readable at thumbnail size, which is the only size that matters.',
        media: [
          { kind: 'image', src: `${MAYA}/lunch-15-green.webp`, w: 900, h: 1125, alt: '$15 lunch poster, green', frame: 'poster' },
          { kind: 'image', src: `${MAYA}/lunch-15-red.webp`, w: 900, h: 1125, alt: '$15 lunch poster, red', frame: 'poster' },
          { kind: 'image', src: `${MAYA}/lunch-deal.webp`, w: 900, h: 1125, alt: 'Student lunch deal poster', frame: 'poster' },
        ],
        layout: 'posters',
      },
    ],
    results: [
      { value: '55+', label: 'Videos delivered', source: 'Counted in the client deliverables folder, duplicates and raw uploads excluded' },
      { value: '20', label: 'Consecutive weeks of content', source: 'Weekly folders, Wk 01 to Wk 20' },
      { value: '3-4', label: 'Videos a week', source: 'Retainer cadence' },
      { value: '11', label: 'Menu & promo designs', source: 'Poster series in the deliverables folder' },
    ],
    reel: ['Bollywood Night', 'Maya Fest', '2 years of Maya', 'Teej special', 'Party host', 'Happy hours got more happier', 'Interview series', 'This is a bar'],
    cover: reel(MAYA, 'maya-fest', 'Maya Fest'),
    tint: '#6B0F1A',
  },
  {
    slug: 'sydney-easter-show',
    client: 'Sydney Easter Show',
    short: 'Sydney Easter Show',
    sector: 'Events & food',
    location: 'Sydney Olympic Park',
    teams: ['media'],
    services: ['Content & UGC'],
    year: '2026',
    status: 'Delivered',
    headline: 'Three stalls, three videos, shot on the Show floor.',
    summary:
      'Creator-led short-form from the Easter Show: corn, strawberries and donuts, each scripted ahead, shot on the day in the crowd and cut for the feed.',
    brief:
      'The Show is loud, packed and over in a couple of weeks. Content has to be shot in the middle of it and posted while people can still go.',
    chapters: [
      {
        title: 'Scripted first, shot in the crowd',
        body:
          'Each video was scripted before the day, so the shoot was about getting the moment rather than finding the idea. One creator, one stall, one story each. Tap any of them to watch it with sound.',
        media: [
          reel(EASTER, 'strawberry', 'Strawberry stall at the Easter Show'),
          reel(EASTER, 'donut', 'Donut stall at the Easter Show'),
          reel(EASTER, 'corn', 'Corn stall at the Easter Show'),
        ],
        layout: 'phones',
      },
    ],
    results: [
      { value: '3', label: 'Videos, scripted, shot and delivered', source: 'Client deliverables folder' },
    ],
    cover: reel(EASTER, 'strawberry', 'Strawberry stall at the Easter Show'),
    tint: '#7A2E0E',
  },
  {
    slug: 'gurkha-jewellery',
    client: 'Gurkha Jewellery',
    short: 'Gurkha Jewellery',
    sector: 'Jewellery retail',
    location: 'Sydney',
    teams: ['systems'],
    services: ['Custom software'],
    year: '2026',
    status: 'In progress',
    headline: 'Invoicing that prices gold the way the counter does.',
    summary:
      'A desktop invoicing system built around how a traditional jeweller actually prices a piece: live gold and silver rates, Lal and Tola, wastage, stones, wages and old-gold exchange, printing a finished invoice.',
    brief:
      'Off-the-shelf invoicing assumes a price per item. A jewellery counter prices by weight, at today’s rate, in traditional units, then adds making charges and takes old gold in part-exchange. Nothing off the shelf does that maths.',
    chapters: [
      {
        title: 'The counter’s maths, built in',
        body:
          'Enter today’s 22K, 24K and silver rates once. Each line takes a weight in Lal or Tola, a wastage allowance, stone cost and wages, and prices itself. Old gold comes off the total as its own line.',
        media: [
          { kind: 'image', src: `${GJ}/invoice.webp`, w: 1800, h: 1033, alt: 'Gurkha Jewellery invoicing screen with gold rates and line items', frame: 'browser', url: 'Gurkha Jewellery · Invoice', sample: true },
        ],
        layout: 'wide',
      },
      {
        title: 'Works on the shop computer, offline',
        body:
          'A desktop app with its own local database. No subscription and no internet dependency at the counter. It prints a finished PDF invoice and keeps the sales history.',
      },
    ],
    results: [
      { value: '3', label: 'Metals priced live: 22K, 24K, silver', source: 'Invoice screen' },
      { value: '2', label: 'Traditional units: Lal and Tola', source: 'Unit conversion in the line model' },
      { value: '0', label: 'Monthly subscriptions', source: 'Local desktop app' },
    ],
    cover: { kind: 'image', src: `${GJ}/invoice.webp`, w: 1800, h: 1033, alt: 'Gurkha Jewellery invoicing screen', frame: 'browser', url: 'Gurkha Jewellery · Invoice', sample: true },
    tint: '#6B1010',
    note: 'A new version is in build. Screens show the current release with sample data.',
  },
  {
    slug: 'scalina-crm',
    client: 'Scalina',
    short: 'Scalina CRM',
    sector: 'Our own studio',
    location: 'Sydney',
    teams: ['systems'],
    services: ['Custom software', 'Automation & AI'],
    year: '2026',
    status: 'Ongoing',
    headline: 'The system the Media team’s weekly output runs on.',
    summary:
      'Our own CRM and ERP: leads to clients, every weekly content project broken into script, shoot and edit per video, a resource calendar, invoicing and expenses. If it were not good enough for us, we would not sell it.',
    brief:
      'Three to four videos a week, for more than one client, is a production line. A production line has to know which video is at which stage, and who is shooting on Thursday.',
    chapters: [
      {
        title: 'Every video, every stage',
        body:
          'A weekly project per client, broken into script, shoot and edit for each video, with a deadline and an owner. The week’s state is one screen, not a stand-up.',
        media: [
          { kind: 'image', src: `${CRM}/projects.webp`, w: 1800, h: 1125, alt: 'Project management with weekly projects per client', frame: 'browser', url: 'crm.scalina', sample: true },
          { kind: 'image', src: `${CRM}/calendar.webp`, w: 1800, h: 1125, alt: 'Resource calendar with script, shoot and edit tasks', frame: 'browser', url: 'crm.scalina', sample: true },
        ],
        layout: 'wide',
      },
      {
        title: 'Leads to invoices in one place',
        body:
          'Pipeline, clients, invoicing with GST, expenses with receipts, marketer commissions and the team. The whole agency, not just the sales half.',
        media: [
          { kind: 'image', src: `${CRM}/dashboard.webp`, w: 1800, h: 1125, alt: 'Agency overview dashboard', frame: 'browser', url: 'crm.scalina', sample: true },
          { kind: 'image', src: `${CRM}/leads.webp`, w: 1800, h: 1125, alt: 'Leads and clients kanban board', frame: 'browser', url: 'crm.scalina', sample: true },
        ],
        layout: 'pair',
      },
    ],
    results: [
      { value: '8', label: 'Modules, from first lead to expenses', source: 'App navigation' },
      { value: '3', label: 'Stages tracked per video: script, shoot, edit', source: 'Task model' },
    ],
    cover: { kind: 'image', src: `${CRM}/projects.webp`, w: 1800, h: 1125, alt: 'Scalina CRM project management', frame: 'browser', url: 'crm.scalina', sample: true },
    tint: '#1E45FB',
    note: 'Screens show the real interface with sample data.',
  },
  {
    slug: 'runaway-entertainment',
    client: 'Runaway Entertainment',
    short: 'Runaway',
    sector: 'Entertainment',
    location: 'Sydney',
    teams: ['media'],
    services: ['Content & UGC'],
    year: '2026',
    status: 'Delivered',
    headline: 'Skits that feel like the audience made them.',
    summary: 'Creator-style UGC, scripted and produced in-house.',
    brief: 'Runaway Entertainment wanted video that felt like the people in its audience made it.',
    chapters: [
      {
        title: 'Made to look like the feed',
        body:
          'Relatable skits and talking-to-camera pieces, shot on the format people watch and cut for the first two seconds. Tap either to watch it with sound.',
        media: [
          reel(RUN, 'ugc-1', 'Skit about friends with different taste in music'),
          reel(RUN, 'ugc-2', 'Talking-to-camera skit'),
        ],
        layout: 'phones',
      },
    ],
    results: [],
    cover: reel(RUN, 'ugc-1', 'Skit about friends with different taste in music'),
    tint: '#3A1D4F',
  },
  {
    slug: 'anfa-australia',
    client: 'ANFA Australia',
    short: 'ANFA Australia',
    sector: 'UGC campaign',
    location: 'Australia',
    teams: ['media'],
    services: ['Content & UGC'],
    year: '2026',
    status: 'Delivered',
    headline: 'UGC, turned around in days.',
    summary: 'A short-turnaround UGC brief: scripted, shot, edited and delivered inside a trial week.',
    brief: 'ANFA Australia needed creator-style video fast. The brief was the deadline.',
    chapters: [
      {
        title: 'Script, shoot and edit in one week',
        body:
          'Because scripting, shooting and editing sit in one team, there is no hand-off to wait on. The same people who wrote it shot it and cut it. Tap it to watch with sound.',
        media: [reel(ANFA, 'ugc', 'Creator with a football in a park, ANFA Australia UGC')],
        layout: 'phones',
      },
    ],
    results: [],
    cover: reel(ANFA, 'ugc', 'Creator with a football in a park, ANFA Australia UGC'),
    tint: '#2B2F3A',
  },
];

export function getCase(slug: string) {
  return CASES.find((c) => c.slug === slug) ?? null;
}

/* ---- compatibility --------------------------------------------------------
   Older consumers read a flat project list. They now read one row per client,
   which is what every one of them was actually listing. */
export type WorkItem = {
  slug: string;
  client: string;
  title: string;
  teams: WorkTeam[];
  disciplines: string[];
  summary: string;
  tone: string;
};

export const WORK: WorkItem[] = CASES.map((c) => ({
  slug: c.slug,
  client: c.client,
  title: c.headline,
  teams: c.teams,
  disciplines: c.services,
  summary: c.summary,
  tone: `linear-gradient(140deg, ${c.tint} 0%, #0B0D12 72%)`,
}));

export const DISCIPLINES = Array.from(new Set(CASES.flatMap((c) => c.services))).sort();

/* Totals across the studio, for the proof grids. Kept next to the cases they
   are summed from so they cannot drift apart. */
export const TOTALS = {
  videosDelivered: 38 + 55 + 3 + 2 + 1,
  weeksOfContent: 13 + 20,
  clientBusinesses: CASES.filter((c) => c.client !== 'Scalina').length,
};
