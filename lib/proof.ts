/* The proof grids — About's and each services team's.

   Every tile carries its `source`. It is no longer printed (the owner found the
   caption row read as placeholder text) but it stays here as the record of
   where each number came from. The rule is the
   brand file's: a number that cannot be pointed at does not go on the site.
   Cost per lead ($1.9 AUD) and OZI HP's saving (was $400-500 on the old
   system, now $50: $350+ saved) were supplied by the studio in Sep 2026.

   Totals are derived from lib/work.ts so the grid and the case studies cannot
   disagree. */
import { TOTALS } from './work';

export type TileMedia =
  | { kind: 'video'; src: string; poster: string }
  | { kind: 'image'; src: string; w: number; h: number; alt: string };

export type ProofTile = {
  value: string;
  label: string;
  source: string;
  /** Grid footprint. `big` is 2×2, `wide` 2×1, `tall` 1×2. */
  span?: 'big' | 'wide' | 'tall';
  tone?: 'accent' | 'ink' | 'panel';
  media?: TileMedia;
  /** A short list shown under the label (client names, build names). */
  list?: string[];
  href?: string;
  pending?: boolean;
};

const MAYA_VIDEO: TileMedia = { kind: 'video', src: '/work/maya-lounge/maya-fest.mp4', poster: '/work/maya-lounge/maya-fest.webp' };
const GS_VIDEO: TileMedia = { kind: 'video', src: '/work/gurung-shuttles/promo.mp4', poster: '/work/gurung-shuttles/promo.webp' };
const WMS_SHOT: TileMedia = {
  kind: 'image',
  src: '/work/ozi-hp/wms-dashboard.webp',
  w: 1800,
  h: 1250,
  alt: 'OZI HP warehouse dashboard (sample data)',
};

const VIDEOS: ProofTile = {
  value: `${TOTALS.videosDelivered}+`,
  label: 'Short-form videos delivered since April',
  source: 'Counted in the client deliverables folders',
  span: 'big',
  tone: 'ink',
  media: MAYA_VIDEO,
  href: '/work/maya-lounge',
};
const WEEKS: ProofTile = {
  value: String(TOTALS.weeksOfContent),
  label: 'Weeks of weekly content across two retainers',
  source: '20 weeks Maya Lounge · 13 weeks Gurung Shuttles',
};
const CADENCE: ProofTile = {
  value: '3-4',
  label: 'Videos a week, every week, per retainer client',
  source: 'Retainer cadence',
};
const LIKES: ProofTile = {
  value: '14M',
  label: 'Likes across the creator network',
  source: 'Sum of seven creator accounts, portfolio deck',
  tone: 'accent',
};
const DMS: ProofTile = {
  value: '24/7',
  label: 'Every DM answered. Ads bring the lead, automated replies hold it until it books',
  source: 'Gurung Shuttles lead flow',
  href: '/work/gurung-shuttles',
};
const ENDPOINTS: ProofTile = {
  value: '156',
  label: 'API endpoints behind OZI HP’s warehouse system, portal and driver app',
  source: 'Counted in the backend controllers',
  span: 'wide',
  media: WMS_SHOT,
  href: '/work/ozi-hp',
};
const BUILDS: ProofTile = {
  value: '5',
  label: 'Client software builds shipped',
  source: 'OZI HP ×4 · Gurkha Jewellery ×1',
  list: ['Warehouse system', 'Customer portal', 'Website', 'Voice agent', 'Jewellery invoicing'],
};
const CLIENTS: ProofTile = {
  value: String(TOTALS.clientBusinesses),
  label: 'Client businesses, each with a case study',
  source: 'See every case on /work',
  list: ['Gurung Shuttles', 'OZI HP', 'Maya Lounge', 'Sydney Easter Show', 'Gurkha Jewellery', 'ANFA Australia', 'Runaway Entertainment'],
  tone: 'panel',
  href: '/work',
};

export const ABOUT_PROOF: ProofTile[] = [VIDEOS, WEEKS, LIKES, CADENCE, DMS, ENDPOINTS, BUILDS, CLIENTS];

export const MEDIA_PROOF: ProofTile[] = [
  { ...LIKES, span: 'big', tone: 'ink', media: GS_VIDEO },
  { value: '140K', label: 'Combined following', source: 'Same seven creator accounts' },
  { value: '7', label: 'Creators in the network', source: 'Portfolio deck' },
  { ...VIDEOS, span: 'wide', tone: 'accent', media: undefined },
  WEEKS,
  CADENCE,
  { value: '11', label: 'Menu & promo designs for Maya Lounge', source: 'Poster series in the deliverables folder', href: '/work/maya-lounge' },
  { value: '$1.9', label: 'Average cost per lead, in AUD', source: 'Paid campaigns, reported by the studio' },
];

export const SYSTEMS_PROOF: ProofTile[] = [
  { ...BUILDS, span: 'big', tone: 'ink', media: WMS_SHOT, href: '/work/ozi-hp' },
  { value: '3', label: 'Businesses running on our software daily', source: 'OZI HP · Gurkha Jewellery · Scalina', tone: 'accent' },
  { value: '4', label: 'Apps from one codebase: admin, warehouse, driver, customer', source: 'OZI HP route guards' },
  { ...ENDPOINTS, span: 'wide', media: undefined, tone: 'panel' },
  { value: '46', label: 'Screens in the OZI HP system', source: 'Counted in the router' },
  { value: '8', label: 'Modules in the CRM our own studio runs on', source: 'Scalina CRM', href: '/work/scalina-crm' },
  { value: '$350+', label: 'Saved every month on OZI HP’s software, against the old system it replaced', source: 'OZI HP’s previous software costs, reported by the studio', span: 'wide', tone: 'accent' },
];
