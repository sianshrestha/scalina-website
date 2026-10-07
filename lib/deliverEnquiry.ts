import 'server-only';
import nodemailer from 'nodemailer';

/* Delivery for a validated enquiry: the Scalina CRM, and an email to the team.

   BOTH, NOT EITHER
   ---------------------------------------------------------------------------
   The CRM is the durable record — the whole answer vocabulary in lib/enquiry.ts
   was designed closed so it lands there as structured data rather than prose.
   The email is the thing that actually makes someone reply today. Neither
   replaces the other, so both run, and they run in parallel because a slow CRM
   should not delay the mail.

   WHAT HAPPENS WHEN ONE FAILS
   ---------------------------------------------------------------------------
   `deliver` reports which channels succeeded rather than throwing. The caller
   decides what to tell the visitor, and the rule it applies is the important
   part: the confirmation screen promises a reply from a person within one
   business day, so it may only be shown if the enquiry reached somewhere a
   person will look. One channel succeeding is enough for that promise. Zero is
   not, and the visitor is told plainly rather than thanked for something that
   went nowhere.

   Whatever happens, the full enquiry is written to the server log before
   anything is attempted, so a submission is never lost to a failed integration
   alone.

   CONFIGURATION — all optional, all from the environment
   ---------------------------------------------------------------------------
   Put these in `.env.local`, which is gitignored. Nothing here has a default
   that reaches the network, so an unconfigured deployment degrades to the
   logging behaviour this replaced rather than throwing on every submission.

     SCALINA_CRM_ENDPOINT   https URL that accepts a POST of the enquiry JSON
     SCALINA_CRM_TOKEN      optional; sent as `Authorization: Bearer …`

     SMTP_HOST              e.g. smtp.yourprovider.com
     SMTP_PORT              defaults to 465 when SMTP_SECURE is not "false"
     SMTP_SECURE            "false" for STARTTLS on 587
     SMTP_USER / SMTP_PASS  credentials
     ENQUIRY_TO             defaults to info@scalinamedia.com
     ENQUIRY_FROM           defaults to ENQUIRY_TO

   The CRM's expected body is not known here, so it receives the enquiry
   verbatim with its reference. If it wants a different shape, map it in
   `toCrmBody` below — that is the one place that should need to change. */

export type DeliveryResult = {
  crm: 'sent' | 'skipped' | 'failed';
  email: 'sent' | 'skipped' | 'failed';
  errors: string[];
};

/* Anything that reached a person counts. */
export const reached = (result: DeliveryResult) =>
  result.crm === 'sent' || result.email === 'sent';

type Enquiry = Record<string, unknown>;

function toCrmBody(enquiry: Enquiry, reference: string) {
  return { reference, source: 'scalina.site/start', ...enquiry };
}

async function toCrm(enquiry: Enquiry, reference: string): Promise<'sent' | 'skipped'> {
  const endpoint = process.env.SCALINA_CRM_ENDPOINT;
  if (!endpoint) return 'skipped';

  const token = process.env.SCALINA_CRM_TOKEN;
  /* A hung CRM must not hold the visitor's browser open. */
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(toCrmBody(enquiry, reference)),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`CRM responded ${response.status}`);
  return 'sent';
}

/* Plain text, not HTML. This is an internal notification read on a phone, and
   the answers are a closed vocabulary — there is nothing here that markup
   would make clearer, and nothing that should be rendered as anything but
   what the visitor actually chose. */
function asText(enquiry: Enquiry, reference: string): string {
  const lines: string[] = [`Reference: ${reference}`, ''];
  const walk = (value: unknown, indent = '') => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const [key, inner] of Object.entries(value as Record<string, unknown>)) {
        if (inner === undefined || inner === null) continue;
        if (typeof inner === 'object') {
          lines.push(`${indent}${key}:`);
          walk(inner, `${indent}  `);
        } else {
          lines.push(`${indent}${key}: ${String(inner)}`);
        }
      }
    } else if (Array.isArray(value)) {
      lines.push(`${indent}${value.join(', ')}`);
    }
  };
  walk(enquiry);
  return lines.join('\n');
}

async function toEmail(enquiry: Enquiry, reference: string): Promise<'sent' | 'skipped'> {
  const host = process.env.SMTP_HOST;
  if (!host) return 'skipped';

  const secure = process.env.SMTP_SECURE !== 'false';
  const to = process.env.ENQUIRY_TO ?? 'info@scalinamedia.com';
  const transport = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? (secure ? 465 : 587)),
    secure,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });

  const contact = (enquiry.contact ?? {}) as Record<string, string | undefined>;
  await transport.sendMail({
    from: process.env.ENQUIRY_FROM ?? to,
    to,
    /* The visitor's address, so hitting reply in the client answers them. */
    replyTo: contact.email,
    subject: `Enquiry ${reference}: ${contact.name ?? 'unknown'}${
      contact.company ? ` (${contact.company})` : ''
    }`,
    text: asText(enquiry, reference),
  });
  return 'sent';
}

export async function deliver(enquiry: Enquiry, reference: string): Promise<DeliveryResult> {
  /* Logged FIRST, and always. If both integrations are down, the enquiry is
     still recoverable from the process log — which is exactly the state this
     module replaced, so the floor never drops below where it started. */
  console.info('[enquiry]', reference, JSON.stringify(enquiry));

  const [crm, email] = await Promise.allSettled([
    toCrm(enquiry, reference),
    toEmail(enquiry, reference),
  ]);

  const errors: string[] = [];
  const read = (outcome: PromiseSettledResult<'sent' | 'skipped'>, label: string) => {
    if (outcome.status === 'fulfilled') return outcome.value;
    const message = outcome.reason instanceof Error ? outcome.reason.message : String(outcome.reason);
    errors.push(`${label}: ${message}`);
    console.error(`[enquiry] ${reference} ${label} delivery failed —`, message);
    return 'failed' as const;
  };

  const result = { crm: read(crm, 'crm'), email: read(email, 'email'), errors };

  /* Neither destination is configured. That is a deployment error, not a
     runtime one, and it is deliberately loud: the route turns this into a 502
     so the visitor is told to email instead, rather than being thanked and
     promised a reply from a person who will never see it. The form staying
     visibly broken until it is configured is the point — DESIGN.md's own note
     said not to advertise it until delivery existed. */
  if (result.crm === 'skipped' && result.email === 'skipped') {
    console.error(
      '[enquiry] NO DESTINATION CONFIGURED — set SCALINA_CRM_ENDPOINT and/or SMTP_HOST in .env.local. ' +
        `Enquiry ${reference} exists only in this log.`
    );
  }

  return result;
}
