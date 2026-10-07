'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SOURCE_QUESTION,
  labelFor,
  stepsFor,
  type Answers,
  type Contact,
  type Intent,
  type Question,
} from '@/lib/enquiry';
import styles from './EnquiryFlow.module.css';

/* The enquiry flow.

   Chips are real <input type="radio"> / <input type="checkbox"> inside their
   labels, visually hidden. That is deliberate: roving-tabindex button groups
   have to reimplement arrow keys, grouping, and the pressed state for
   assistive tech, and usually get some of it wrong. Native inputs come with
   all of it, and the chip is just the label's appearance.

   The step list is derived from the chosen intent (`stepsFor`), so a careers
   enquiry never sees a budget question and the progress count is honest about
   how many steps are actually left. */

function isAnswered(question: Question, answers: Answers): boolean {
  if (question.optional) return true;
  const value = answers[question.id];
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EnquiryFlow() {
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<Contact>({ name: '', email: '' });
  const [index, setIndex] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [reference, setReference] = useState<string | null>(null);

  const headingRef = useRef<HTMLParagraphElement | null>(null);
  const firstRender = useRef(true);

  /* Read once, on mount: where this visit came from. Kept out of state
     updates so a re-render can never lose it. */
  const attribution = useRef<{ referrer?: string; utm?: Record<string, string>; landedAt: string }>({
    landedAt: new Date().toISOString(),
  });
  useEffect(() => {
    const utm: Record<string, string> = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (key.startsWith('utm_') || key === 'gclid' || key === 'ref') utm[key] = value;
    });
    attribution.current = {
      referrer: document.referrer || undefined,
      utm: Object.keys(utm).length ? utm : undefined,
      landedAt: attribution.current.landedAt,
    };
  }, []);

  const intent = answers.intent as Intent | undefined;
  const steps = useMemo(() => stepsFor(intent), [intent]);
  /* The contact step is appended rather than declared, because it is the only
     one that is not a set of chips. */
  const total = steps.length + 1;
  const current = index < steps.length ? steps[index] : null;
  const onContact = current === null;

  // Move focus to the new question so the flow is followable without a mouse.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [index]);

  const setSingle = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: optionId };
      /* Changing intent changes which steps exist, so answers belonging to
         steps the new intent does not show are dropped here — at the event
         that invalidates them. Doing it in an effect that watches `intent`
         works too, but it is a cascading render for something we already know
         at the moment of the click. */
      if (questionId !== 'intent' || prev.intent === optionId) return next;
      const allowed = new Set(
        stepsFor(optionId as Intent).flatMap((step) =>
          step.questions.map((question) => question.id)
        )
      );
      return Object.fromEntries(
        Object.entries(next).filter(([key]) => allowed.has(key))
      ) as Answers;
    });
  }, []);

  const toggleMulti = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const list = Array.isArray(prev[questionId]) ? (prev[questionId] as string[]) : [];
      return {
        ...prev,
        [questionId]: list.includes(optionId)
          ? list.filter((id) => id !== optionId)
          : [...list, optionId],
      };
    });
  }, []);

  const stepComplete = current ? current.questions.every((q) => isAnswered(q, answers)) : true;
  const contactComplete = contact.name.trim().length > 1 && EMAIL.test(contact.email.trim());

  const next = () => {
    if (!stepComplete) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setIndex((i) => Math.min(i + 1, steps.length));
  };

  const back = () => {
    setShowErrors(false);
    setIndex((i) => Math.max(0, i - 1));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!contactComplete) {
      setShowErrors(true);
      return;
    }
    setStatus('sending');
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: intent ?? 'other',
          answers,
          contact,
          attribution: attribution.current,
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      const data = (await response.json()) as { reference?: string };
      setReference(data.reference ?? null);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className={styles.done} role="status">
        <p className={styles.doneEyebrow}>Sent</p>
        <h2 className={styles.doneHeading}>
          Thanks{contact.name ? `, ${contact.name.split(' ')[0]}` : ''}. We&rsquo;ll be in touch.
        </h2>
        <p className={styles.doneBody}>
          You&rsquo;ll hear from one of us within one business day, from a person who has read what
          you sent, not an automated sequence.
          {reference ? <> Your reference is <strong>{reference}</strong>.</> : null}
        </p>
        <Link href="/" className="ghostBtn">
          <span>Back to the site</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  return (
    <form className={styles.flow} onSubmit={submit} noValidate>
      <div className={styles.rail} aria-hidden="true">
        <span className={styles.railCount}>
          {String(Math.min(index + 1, total)).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span className={styles.railTrack}>
          <span className={styles.railFill} style={{ transform: `scaleX(${(index + 1) / total})` }} />
        </span>
        <span className={styles.railLabel}>{current ? current.title : 'How to reach you'}</span>
      </div>

      {/* One live region for the whole flow: the step's questions are swapped
          in place, so announcing the region is announcing the new step. */}
      <div className={styles.stage} aria-live="polite">
        {current
          ? current.questions.map((question, questionIndex) => (
              <fieldset key={question.id} className={styles.block}>
                <legend className={styles.legend}>
                  <span
                    className={styles.prompt}
                    // Focus target on step change; not in the tab order itself.
                    ref={questionIndex === 0 ? headingRef : undefined}
                    tabIndex={-1}
                  >
                    {question.prompt}
                  </span>
                  {question.help ? <span className={styles.help}>{question.help}</span> : null}
                  {showErrors && !isAnswered(question, answers) ? (
                    <span className={styles.error}>Pick one to continue.</span>
                  ) : null}
                </legend>

                {question.groups ? (
                  question.groups.map((group) => (
                    <div key={group.label} className={styles.group}>
                      <span className={styles.groupLabel}>{group.label}</span>
                      <div className={styles.chips}>
                        {group.options.map((option) => (
                          <Chip
                            key={option.id}
                            question={question}
                            optionId={option.id}
                            label={option.label}
                            hint={option.hint}
                            answers={answers}
                            onSingle={setSingle}
                            onMulti={toggleMulti}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.chips}>
                    {(question.options ?? []).map((option) => (
                      <Chip
                        key={option.id}
                        question={question}
                        optionId={option.id}
                        label={option.label}
                        hint={option.hint}
                        answers={answers}
                        onSingle={setSingle}
                        onMulti={toggleMulti}
                      />
                    ))}
                  </div>
                )}
              </fieldset>
            ))
          : (
            <div className={styles.block}>
              <p className={styles.prompt} ref={headingRef} tabIndex={-1}>
                Last bit. Who are you?
              </p>
              <p className={styles.help}>
                Two required fields. Everything above is what we&rsquo;ll actually read first.
              </p>

              <fieldset className={styles.sourceBlock}>
                <legend className={styles.sourceLegend}>{SOURCE_QUESTION.prompt}</legend>
                <div className={styles.chips}>
                  {(SOURCE_QUESTION.options ?? []).map((option) => (
                    <Chip
                      key={option.id}
                      question={SOURCE_QUESTION}
                      optionId={option.id}
                      label={option.label}
                      answers={answers}
                      onSingle={setSingle}
                      onMulti={toggleMulti}
                    />
                  ))}
                </div>
              </fieldset>

              <div className={styles.fields}>
                <Field
                  id="name"
                  label="Your name"
                  value={contact.name}
                  onChange={(v) => setContact((c) => ({ ...c, name: v }))}
                  autoComplete="name"
                  required
                  invalid={showErrors && contact.name.trim().length < 2}
                />
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  value={contact.email}
                  onChange={(v) => setContact((c) => ({ ...c, email: v }))}
                  autoComplete="email"
                  required
                  invalid={showErrors && !EMAIL.test(contact.email.trim())}
                />
                <Field
                  id="company"
                  label="Business name"
                  optional
                  value={contact.company ?? ''}
                  onChange={(v) => setContact((c) => ({ ...c, company: v }))}
                  autoComplete="organization"
                />
                <Field
                  id="phone"
                  label="Phone"
                  type="tel"
                  optional
                  value={contact.phone ?? ''}
                  onChange={(v) => setContact((c) => ({ ...c, phone: v }))}
                  autoComplete="tel"
                />
              </div>

              <label className={styles.noteWrap} htmlFor="note">
                <span className={styles.noteLabel}>Anything else? (optional)</span>
                <textarea
                  id="note"
                  className={styles.note}
                  rows={3}
                  value={contact.note ?? ''}
                  onChange={(e) => setContact((c) => ({ ...c, note: e.target.value }))}
                  placeholder="A link, a deadline, the thing that made you get in touch."
                />
              </label>

              <Summary answers={answers} />
            </div>
          )}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.back}
          onClick={back}
          disabled={index === 0}
        >
          Back
        </button>

        {onContact ? (
          <button type="submit" className={styles.next} disabled={status === 'sending'}>
            <span>{status === 'sending' ? 'Sending…' : 'Send enquiry'}</span>
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button type="button" className={styles.next} onClick={next}>
            <span>Continue</span>
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>

      {status === 'error' ? (
        <p className={styles.sendError} role="alert">
          That didn&rsquo;t send. Try again, or email us directly at{' '}
          <a href="mailto:info@scalinamedia.com" className="inlineLink">
            info@scalinamedia.com
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}

function Chip({
  question,
  optionId,
  label,
  hint,
  answers,
  onSingle,
  onMulti,
}: {
  question: Question;
  optionId: string;
  label: string;
  hint?: string;
  answers: Answers;
  onSingle: (questionId: string, optionId: string) => void;
  onMulti: (questionId: string, optionId: string) => void;
}) {
  const value = answers[question.id];
  const checked =
    question.kind === 'multi'
      ? Array.isArray(value) && value.includes(optionId)
      : value === optionId;

  return (
    <label className={`${styles.chip} ${checked ? styles.chipOn : ''} ${hint ? styles.chipWide : ''}`}>
      <input
        className={styles.chipInput}
        type={question.kind === 'multi' ? 'checkbox' : 'radio'}
        name={question.id}
        value={optionId}
        checked={checked}
        onChange={() =>
          question.kind === 'multi' ? onMulti(question.id, optionId) : onSingle(question.id, optionId)
        }
      />
      <span className={styles.chipLabel}>{label}</span>
      {hint ? <span className={styles.chipHint}>{hint}</span> : null}
    </label>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  optional,
  required,
  invalid,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  optional?: boolean;
  required?: boolean;
  invalid?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.fieldLabel}>
        {label}
        {optional ? <span className={styles.fieldOptional}> (optional)</span> : null}
      </span>
      <input
        id={id}
        className={`${styles.input} ${invalid ? styles.inputInvalid : ''}`}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

/* What they are about to send, in their own words back to them. Cheap to
   build from the closed vocabulary, and it stops the last step feeling like a
   form they have lost track of. */
function Summary({ answers }: { answers: Answers }) {
  const entries = Object.entries(answers).filter(([, value]) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );
  if (!entries.length) return null;

  return (
    <div className={styles.summary}>
      <span className={styles.summaryLabel}>What you&rsquo;ve told us</span>
      <ul className={styles.summaryList}>
        {entries.map(([questionId, value]) => (
          <li key={questionId} className={styles.summaryItem}>
            {(Array.isArray(value) ? value : [value as string])
              .map((optionId) => labelFor(questionId, optionId))
              .join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
