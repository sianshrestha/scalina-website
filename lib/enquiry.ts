/* The enquiry flow's content and shape.

   Everything the /start page asks is declared here rather than in the
   component, for two reasons. The component then has no opinions to update
   when a question changes, and — the point of the exercise — the answer set is
   a fixed, closed vocabulary. Free text cannot be counted; `sector: "hospitality"`
   across two hundred submissions can. Every question below was chosen because
   the answer is worth something after the fact: what the market is actually
   asking for, which sectors it comes from, what people say is in their way,
   what they expect to spend, and where they heard about us.

   Which is also why almost nothing here is typed. The visitor taps; we get
   structured data anyway. Only name and email are required text. */

export type Intent = 'project' | 'quote' | 'exploring' | 'careers' | 'other';

export type Option = {
  id: string;
  label: string;
  /* Shown under the label on the wider chips. Keep to a few words. */
  hint?: string;
};

export type Question = {
  id: string;
  prompt: string;
  help?: string;
  kind: 'single' | 'multi';
  optional?: boolean;
  /* Renders the options under sub-headings instead of one flat row. */
  groups?: { label: string; options: Option[] }[];
  options?: Option[];
};

export type Step = {
  id: string;
  /* Mono label above the question — "01 / What you need". */
  title: string;
  questions: Question[];
  /* Absent means every intent sees it. A careers enquiry has no budget. */
  intents?: Intent[];
};

const INTENTS: Option[] = [
  { id: 'project', label: 'Start a project', hint: 'You know roughly what you want built' },
  { id: 'quote', label: 'Get a quote', hint: 'You have a defined scope already' },
  { id: 'exploring', label: 'Work out what we need', hint: 'Something is not working and you want a read on it' },
  { id: 'careers', label: 'Work with us', hint: 'Roles, freelance and internships' },
  { id: 'other', label: 'Something else', hint: 'Partnership, press, or a question' },
];

/* Mirrors the public taxonomy exactly — Content / Growth / Technology — so a
   count of these answers is directly comparable to what the site advertises,
   and to the pillars on the services page. */
const NEEDS: NonNullable<Question['groups']> = [
  {
    label: 'Content',
    options: [
      { id: 'content-ugc', label: 'Content & UGC' },
      { id: 'creative-design', label: 'Creative & design' },
      { id: 'creative-production', label: 'Photo & video production' },
      { id: 'social-media', label: 'Social media management' },
    ],
  },
  {
    label: 'Growth',
    options: [
      { id: 'paid-advertising', label: 'Paid advertising' },
      { id: 'funnels', label: 'Funnels & lead capture' },
      { id: 'seo', label: 'SEO & search' },
    ],
  },
  {
    label: 'Technology',
    options: [
      { id: 'website', label: 'A website' },
      { id: 'custom-software', label: 'Custom software' },
      { id: 'automation-ai', label: 'Automation & AI' },
    ],
  },
];

export const STEPS: Step[] = [
  {
    id: 'intent',
    title: 'Why you are here',
    questions: [
      {
        id: 'intent',
        prompt: 'What brings you to us?',
        kind: 'single',
        options: INTENTS,
      },
    ],
  },
  {
    id: 'needs',
    title: 'What you need',
    intents: ['project', 'quote', 'exploring'],
    questions: [
      {
        id: 'needs',
        prompt: 'What do you need help with?',
        help: 'Pick as many as apply. If you are not sure, pick the closest.',
        kind: 'multi',
        groups: NEEDS,
      },
    ],
  },
  {
    id: 'situation',
    title: 'Where you are now',
    intents: ['project', 'quote', 'exploring'],
    questions: [
      {
        id: 'goal',
        prompt: 'What would make this worth doing?',
        kind: 'single',
        options: [
          { id: 'more-enquiries', label: 'More enquiries' },
          { id: 'launch', label: 'Launching something new' },
          { id: 'look-the-part', label: 'Looking the part' },
          { id: 'less-manual', label: 'Less manual work' },
          { id: 'keep-up', label: 'Systems keeping up with demand' },
          { id: 'unsure', label: 'Still working that out' },
        ],
      },
      {
        id: 'blockers',
        prompt: 'What is in the way right now?',
        help: 'Optional, and the most useful thing you can tell us.',
        kind: 'multi',
        optional: true,
        options: [
          { id: 'no-time', label: 'No time to do it in-house' },
          { id: 'no-one-owns-it', label: 'Nobody owns it' },
          { id: 'tried-didnt-work', label: 'Tried it, it did not work' },
          { id: 'outgrown-setup', label: 'Outgrown the current setup' },
          { id: 'manual-process', label: 'Too much done by hand' },
          { id: 'inconsistent', label: 'Nothing looks consistent' },
          { id: 'no-visibility', label: 'No idea what is working' },
          { id: 'previous-agency', label: 'Bad experience with an agency' },
        ],
      },
    ],
  },
  {
    id: 'business',
    title: 'The business',
    intents: ['project', 'quote', 'exploring'],
    questions: [
      {
        id: 'sector',
        prompt: 'What sort of business is it?',
        kind: 'single',
        options: [
          { id: 'hospitality', label: 'Hospitality & food' },
          { id: 'trades', label: 'Trades & construction' },
          { id: 'retail', label: 'Retail & e-commerce' },
          { id: 'logistics', label: 'Logistics & warehousing' },
          { id: 'professional', label: 'Professional services' },
          { id: 'health', label: 'Health & wellbeing' },
          { id: 'events', label: 'Events & entertainment' },
          { id: 'property', label: 'Property & real estate' },
          { id: 'education', label: 'Education & training' },
          { id: 'other', label: 'Something else' },
        ],
      },
      {
        id: 'size',
        prompt: 'How many people work there?',
        kind: 'single',
        options: [
          { id: 'solo', label: 'Just me' },
          { id: '2-10', label: '2-10' },
          { id: '11-50', label: '11-50' },
          { id: '51-200', label: '51-200' },
          { id: '200+', label: '200+' },
        ],
      },
      {
        id: 'existing',
        prompt: 'What is already in place?',
        help: 'Optional.',
        kind: 'multi',
        optional: true,
        options: [
          { id: 'website', label: 'A website' },
          { id: 'social', label: 'Active social accounts' },
          { id: 'ads', label: 'Ads running' },
          { id: 'crm', label: 'A CRM or internal system' },
          { id: 'brand', label: 'Brand guidelines' },
          { id: 'nothing', label: 'None of it yet' },
        ],
      },
    ],
  },
  {
    id: 'shape',
    title: 'Timing & budget',
    intents: ['project', 'quote', 'exploring'],
    questions: [
      {
        id: 'timeline',
        prompt: 'When would you want to start?',
        kind: 'single',
        options: [
          { id: 'now', label: 'As soon as possible' },
          { id: '1-3-months', label: 'In the next month or two' },
          { id: 'this-quarter', label: 'This quarter' },
          { id: 'planning', label: 'Planning ahead' },
        ],
      },
      {
        id: 'budget',
        prompt: 'Do you have a budget in mind?',
        help: 'A range is enough. It tells us what to propose, not whether to reply.',
        kind: 'single',
        optional: true,
        options: [
          { id: 'under-1k', label: 'Under $1k' },
          { id: '1-5k', label: '$1k-$5k' },
          { id: '5-10k', label: '$5k-$10k' },
          { id: '10k-plus', label: '$10k+' },
          { id: 'retainer', label: 'Monthly retainer' },
          { id: 'unsure', label: 'No idea yet' },
        ],
      },
    ],
  },
  {
    id: 'careers',
    title: 'What you do',
    intents: ['careers'],
    questions: [
      {
        id: 'discipline',
        prompt: 'What do you do?',
        kind: 'multi',
        options: [
          { id: 'video', label: 'Video & editing' },
          { id: 'design', label: 'Design' },
          { id: 'photography', label: 'Photography' },
          { id: 'social', label: 'Social & community' },
          { id: 'paid', label: 'Paid media' },
          { id: 'engineering', label: 'Engineering' },
          { id: 'other', label: 'Something else' },
        ],
      },
      {
        id: 'arrangement',
        prompt: 'What sort of arrangement?',
        kind: 'single',
        options: [
          { id: 'full-time', label: 'Full time' },
          { id: 'part-time', label: 'Part time' },
          { id: 'freelance', label: 'Freelance' },
          { id: 'internship', label: 'Internship' },
        ],
      },
    ],
  },
];

/* Asked on the contact screen rather than as a step of its own: the visitor is
   already there, and one more screen to answer an optional question is a screen
   most people would rather skip. Attribution is worth having, not worth a
   step. */
export const SOURCE_QUESTION: Question = {
  id: 'source',
  prompt: 'How did you hear about us?',
  help: 'Optional.',
  kind: 'single',
  optional: true,
  options: [
    { id: 'referral', label: 'Someone referred us' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'google', label: 'Google' },
    { id: 'ai', label: 'ChatGPT or similar' },
    { id: 'existing-client', label: 'Already a client' },
    { id: 'event', label: 'Met you somewhere' },
    { id: 'other', label: 'Somewhere else' },
  ],
};

/* The steps a given intent actually sees. The first step is always the intent
   itself, so this is safe to call before one has been picked. */
export function stepsFor(intent: Intent | undefined): Step[] {
  return STEPS.filter((step) => !step.intents || (intent && step.intents.includes(intent)));
}

export type Answers = Record<string, string | string[] | undefined>;

export type Contact = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  location?: string;
  note?: string;
};

export type EnquiryPayload = {
  intent: Intent;
  answers: Answers;
  contact: Contact;
  /* Campaign attribution, read off the landing URL. Marketing spend is one of
     the things this form exists to inform, and it cannot be reconstructed
     later. */
  attribution: {
    referrer?: string;
    utm?: Record<string, string>;
    landedAt: string;
  };
};

/* Human-readable label for an option id, for the review summary and for
   whatever eventually receives the payload. */
export function labelFor(questionId: string, optionId: string): string {
  for (const question of [...STEPS.flatMap((step) => step.questions), SOURCE_QUESTION]) {
    {
      if (question.id !== questionId) continue;
      const all = [...(question.options ?? []), ...(question.groups ?? []).flatMap((g) => g.options)];
      const hit = all.find((o) => o.id === optionId);
      if (hit) return hit.label;
    }
  }
  return optionId;
}
