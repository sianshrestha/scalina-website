/* The two teams, as the homepage split and the About page both need them.

   The figures are taken from the client's own portfolio deck (creator roster
   pages) and the brand file (shipped software). They are sums of stated
   numbers, not estimates: the brand rule is that a figure has to be traceable
   to something, and each of these is. */

export type Pill = {
  id: string;
  label: string;
  /* One line, shown in the shared readout when this pill is active. Short on
     purpose: the panel is meant to stay quiet until you point at it. */
  readout: string;
};

export type TeamPanel = {
  key: 'media' | 'systems';
  number: string;
  name: string;
  /* The word that goes big. */
  display: string;
  statement: string;
  pills: Pill[];
  stats: { value: number; suffix?: string; decimals?: number; label: string }[];
  /* Where the figures come from, in the visitor's words.
     ------------------------------------------------------------------------
     The numbers were always traceable — the comment at the top of this file
     records exactly what they are summed from — but that traceability lived
     only in the source. A page that prints "14M combined likes" and shows no
     provenance is asking to be taken on faith, on a site whose own principle
     03 is "real numbers only". Now the page says where it got them. */
  source: string;
  href: string;
};

export const TEAM_PANELS: TeamPanel[] = [
  {
    key: 'media',
    number: '01',
    name: 'Scalina Media',
    display: 'Media',
    statement: 'Get seen. Then get remembered.',
    pills: [
      { id: 'content', label: 'Content & UGC', readout: 'Short-form video and creator-style content, made in batches.' },
      { id: 'design', label: 'Creative & design', readout: 'One system, so the tenth asset looks like the first.' },
      { id: 'production', label: 'Production', readout: 'Concept, shoot and edit. One team on the day and in post.' },
      { id: 'social', label: 'Social', readout: 'Channels run to a calendar, with the numbers reviewed.' },
      { id: 'paid', label: 'Paid', readout: 'Budget goes behind creative that already works.' },
    ],
    stats: [
      { value: 7, label: 'Creators in the network' },
      { value: 140, suffix: 'K', label: 'Combined following' },
      { value: 14, suffix: 'M', label: 'Combined likes' },
    ],
    source: 'Summed from our own creator roster',
    href: '/services?view=media',
  },
  {
    key: 'systems',
    number: '02',
    name: 'Scalina Systems',
    display: 'Systems',
    statement: 'The system underneath it all.',
    pills: [
      { id: 'websites', label: 'Websites', readout: 'Sites built to be run, not admired.' },
      { id: 'software', label: 'Custom software', readout: 'CRM, ERP, WMS and portals. The tool that does your job.' },
      { id: 'automation', label: 'Automation & AI', readout: 'The work nobody should still be doing by hand.' },
      { id: 'funnels', label: 'Funnels', readout: 'Every enquiry lands somewhere actionable.' },
      { id: 'seo', label: 'SEO', readout: 'Search infrastructure, not keyword theatre.' },
    ],
    stats: [
      { value: 5, label: 'Production builds shipped' },
      { value: 3, label: 'Businesses running on our software' },
      { value: 1, label: 'Agency running on it too' },
    ],
    source: 'Counted from builds running in production',
    href: '/services?view=systems',
  },
];
