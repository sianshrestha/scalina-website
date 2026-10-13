import 'server-only';

/* Server-side check of a Cloudflare Turnstile token from the enquiry form.

   TURNSTILE_SECRET_KEY unset: the check is skipped (returns true), so local
   development works without keys. Set it in production, as a Worker secret:
   `npx wrangler secret put TURNSTILE_SECRET_KEY`.

   Set and the check fails, or Cloudflare cannot be reached: returns false.
   Failing closed means a real visitor occasionally has to retry or email, but
   failing open would let a bot through whenever the check itself is down. */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

type VerifyResponse = { success: boolean; action?: string; 'error-codes'?: string[] };

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp: string | null
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret, response: token, ...(remoteIp ? { remoteip: remoteIp } : {}) }),
      signal: AbortSignal.timeout(5000),
    });
    const result = (await response.json()) as VerifyResponse;
    if (!result.success) {
      console.warn('[enquiry] turnstile rejected', result['error-codes']?.join(',') ?? '');
      return false;
    }
    /* A token minted for some other form on the domain is not good enough. */
    return !result.action || result.action === 'enquiry';
  } catch (error) {
    console.error('[enquiry] turnstile unreachable', error instanceof Error ? error.message : error);
    return false;
  }
}
