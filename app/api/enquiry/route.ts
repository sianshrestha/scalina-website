import { NextResponse } from 'next/server';
import { SOURCE_QUESTION, STEPS, type EnquiryPayload, type Intent } from '@/lib/enquiry';
import { deliver, reached } from '@/lib/deliverEnquiry';
import { verifyTurnstile } from '@/lib/turnstile';
import { EMAIL as CONTACT_EMAIL } from '@/lib/content';

/* Receives an enquiry from /start.

   Delivery is in lib/deliverEnquiry.ts — the Scalina CRM and an email to the
   team, both, in parallel. It is configured entirely from the environment, so
   this route needs no change when a destination moves.

   The response is honest about delivery. If nothing reached a person, the
   visitor is told the submission did not go through, because /start's
   confirmation screen promises a reply from a real person within one business
   day and that promise cannot be shown over a failed send. A 502 here is the
   difference between a visitor who emails instead and one who waits for a
   reply that was never coming.

   Validation is a whitelist built from lib/enquiry.ts rather than a schema
   written out twice. Anything not in the declared vocabulary is dropped, which
   both keeps the analytics clean and means a forged payload cannot smuggle
   arbitrary strings into whatever ends up consuming this.

   SPAM
   ---------------------------------------------------------------------------
   Two checks run before anything is delivered, because every delivered
   enquiry is an email out of Resend's daily allowance:
   1. A honeypot (`website`), an input people never see. A bot that fills it
      is told the enquiry went through, so it learns nothing, and nothing is
      sent.
   2. Cloudflare Turnstile, verified server-side when TURNSTILE_SECRET_KEY is
      set (see lib/turnstile.ts). Unset, the check is skipped, which is what
      local development without keys wants. */

const VALID_INTENTS: Intent[] = ['project', 'quote', 'exploring', 'careers', 'other'];

const VOCABULARY = new Map<string, Set<string>>();
for (const question of [...STEPS.flatMap((step) => step.questions), SOURCE_QUESTION]) {
  {
    const ids = [
      ...(question.options ?? []),
      ...(question.groups ?? []).flatMap((group) => group.options),
    ].map((option) => option.id);
    VOCABULARY.set(question.id, new Set(ids));
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEXT = 2000;

function clean(value: unknown, max = 200): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length ? trimmed : undefined;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  const input = body as Partial<EnquiryPayload> & { website?: unknown; turnstileToken?: unknown };

  /* A short, sayable reference so a caller can quote it back on the phone. */
  const reference = `SC-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  if (typeof input.website === 'string' && input.website.trim()) {
    console.warn('[enquiry] honeypot filled, dropped', reference);
    return NextResponse.json({ ok: true, reference });
  }

  const human = await verifyTurnstile(
    typeof input.turnstileToken === 'string' ? input.turnstileToken : undefined,
    request.headers.get('cf-connecting-ip')
  );
  if (!human) {
    return NextResponse.json(
      {
        error:
          `We could not confirm you are not a bot. Please refresh and try again, or email ${CONTACT_EMAIL}.`,
      },
      { status: 403 }
    );
  }

  const intent = VALID_INTENTS.includes(input.intent as Intent)
    ? (input.intent as Intent)
    : null;
  if (!intent) {
    return NextResponse.json({ error: 'Unknown intent.' }, { status: 400 });
  }

  const name = clean(input.contact?.name, 120);
  const email = clean(input.contact?.email, 200);
  if (!name || !email || !EMAIL.test(email)) {
    return NextResponse.json({ error: 'A name and a valid email are required.' }, { status: 400 });
  }

  // Keep only answers that exist in the declared vocabulary.
  const answers: Record<string, string | string[]> = {};
  for (const [questionId, value] of Object.entries(input.answers ?? {})) {
    const allowed = VOCABULARY.get(questionId);
    if (!allowed) continue;
    if (Array.isArray(value)) {
      const kept = value.filter((v): v is string => typeof v === 'string' && allowed.has(v));
      if (kept.length) answers[questionId] = kept;
    } else if (typeof value === 'string' && allowed.has(value)) {
      answers[questionId] = value;
    }
  }

  const enquiry = {
    receivedAt: new Date().toISOString(),
    intent,
    answers,
    contact: {
      name,
      email,
      company: clean(input.contact?.company, 160),
      phone: clean(input.contact?.phone, 40),
      note: clean(input.contact?.note, MAX_TEXT),
    },
    attribution: {
      referrer: clean(input.attribution?.referrer, 500),
      utm: input.attribution?.utm && typeof input.attribution.utm === 'object'
        ? Object.fromEntries(
            Object.entries(input.attribution.utm)
              .slice(0, 10)
              .map(([k, v]) => [k.slice(0, 40), String(v).slice(0, 200)])
          )
        : undefined,
      landedAt: clean(input.attribution?.landedAt, 40),
    },
  };

  const delivery = await deliver(enquiry, reference);

  if (!reached(delivery)) {
    return NextResponse.json(
      {
        error:
          `We could not record your enquiry just now. Please email ${CONTACT_EMAIL} and we will pick it up from there.`,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, reference });
}
