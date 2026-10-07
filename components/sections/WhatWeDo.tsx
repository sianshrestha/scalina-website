import ServiceDisclosure from '@/components/ServiceDisclosure';
import styles from './WhatWeDo.module.css';

/* The public taxonomy — Content / Growth / Technology.

   Note the deliberate cross-over against the internal teams: Paid Advertising
   sits under Growth though Media delivers it, and Funnels/SEO sit under Growth
   though Systems delivers them. Media/Systems is who does the work;
   Content/Growth/Technology is what a client is buying. */
const PILLARS = [
  {
    number: '01',
    name: 'Content',
    services: [
      { label: 'Content creation & UGC', href: '/services?view=media#content-creation' },
      { label: 'Creative & graphic design', href: '/services?view=media#creative-design' },
      { label: 'Creative production', href: '/services?view=media#creative-production' },
      { label: 'Social media management', href: '/services?view=media#social-media' },
    ],
  },
  {
    number: '02',
    name: 'Growth',
    services: [
      { label: 'Paid advertising & campaigns', href: '/services?view=media#paid-advertising' },
      { label: 'Funnels & lead generation', href: '/services?view=systems#funnels' },
      { label: 'SEO & search infrastructure', href: '/services?view=systems#seo' },
    ],
  },
  {
    number: '03',
    name: 'Technology',
    services: [
      { label: 'Website development', href: '/services?view=systems#website-development' },
      { label: 'Custom software', href: '/services?view=systems#custom-software' },
      { label: 'Automation & AI workflows', href: '/services?view=systems#automation-ai' },
    ],
  },
];

export default function WhatWeDo() {
  return (
    <section className={styles.section} data-ground="light" aria-labelledby="what-we-do">
      <div className={`split3070 ${styles.head}`}>
        <h2 id="what-we-do" className={styles.heading}>
          What we do
        </h2>
        <div>
          <p className="statement">
            Content brings them in. Growth turns attention into pipeline. Technology runs what
            happens next.
          </p>
        </div>
      </div>

      <div className={styles.pillars}>
        {PILLARS.map((pillar, index) => (
          <ServiceDisclosure
            key={pillar.number}
            number={pillar.number}
            pillar={pillar.name}
            items={pillar.services}
            spaced={index > 0}
          />
        ))}
      </div>

      <div className={styles.footerCta}>
        <a href="/services" className="ghostBtn">
          <span>See all services</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
