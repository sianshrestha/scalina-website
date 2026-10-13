/* The facts the legal pages are built on. Everything the privacy policy, terms
   and cookie policy say about who runs the site lives here, so a change of
   business name, ABN or contact is one edit, not three.

   `entity` and `abn` are deliberately empty until the owner supplies the
   registered details: an invented ABN on a legal page is worse than none. The
   pages print them when they exist and leave them out when they do not. */
export const LEGAL = {
  /* What the site calls itself in legal copy: "Scalina" ("we", "us"). */
  brand: 'Scalina',
  /* The registered business or company name, if different from the brand. */
  entity: '',
  /* Australian Business Number, as printed: "12 345 678 901". */
  abn: '',
  location: 'Sydney, New South Wales, Australia',
  jurisdiction: 'New South Wales',
  email: 'info@scalinamedia.com',
  /* Shown on all three pages. Update it whenever any of them changes. */
  updated: '13 October 2026',
} as const;

/* "Scalina (Registered Name Pty Ltd, ABN 12 345 678 901)" or just "Scalina". */
export function operatorName(): string {
  const details = [LEGAL.entity, LEGAL.abn && `ABN ${LEGAL.abn}`].filter(Boolean);
  return details.length ? `${LEGAL.brand} (${details.join(', ')})` : LEGAL.brand;
}
