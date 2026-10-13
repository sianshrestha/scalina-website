# Going live: Cloudflare Workers

The steps that need your accounts, in order. The code side is already done: the
site builds and runs on Workers (`npm run preview` runs the real Workers runtime
locally), and every integration below switches on from configuration alone.

Assumes the site will live at **scalinamedia.com**. If not, change
`NEXT_PUBLIC_SITE_URL` in `.env.production` first: canonical links, the sitemap,
robots.txt and share images are all built from it.

---

## 1. Put the domain's DNS on Cloudflare

The domain **stays registered with Squarespace** (renewals and billing do not
change). Only its nameservers move, so Cloudflare answers DNS for it. That is
what lets a Worker serve the bare domain.

1. Create a Cloudflare account and **Add a domain**: `scalinamedia.com`, Free plan.
2. **Before switching nameservers, check the DNS records Cloudflare imported**
   against the list in Squarespace (Domains > `scalinamedia.com` > DNS). Your
   Google Workspace mail (`MX` records, the `TXT` SPF record, any
   `google._domainkey` DKIM record, any Google verification `TXT`) must all be
   there, set to *DNS only* (grey cloud). If one is missing, email to info@
   stops when the nameservers change. Screenshot the Squarespace list first.
3. In Squarespace: Domains > `scalinamedia.com` > **DNSSEC: turn it off**
   (leaving it on while nameservers change can take the domain offline).
4. Still in Squarespace: DNS > **Domain nameservers** > *Use custom
   nameservers*, and enter the two Cloudflare gives you. It usually goes active
   within a few hours (up to 24). Cloudflare emails you when it does.
5. Optional, once active: turn DNSSEC on again from Cloudflare (DNS > Settings)
   and paste the DS record it shows into Squarespace's DNSSEC settings.

## 2. Deploy the Worker

On the Workers Paid plan (US$5/month, Workers & Pages > Plans). The Worker
is about 1.5 MiB compressed, so it fits the free plan too; Paid gives headroom.

```bash
npx wrangler login
npm run deploy
```

That builds with OpenNext and deploys the `scalina-website` Worker to a
`*.workers.dev` address. Open it and click through every page.

**Or deploy on every push** instead: Workers & Pages > Create > Import a
repository > `sianshrestha/scalina-website`, build command
`npx opennextjs-cloudflare build`, deploy command `npx opennextjs-cloudflare deploy`.

## 3. Attach the domain

Workers & Pages > `scalina-website` > Settings > Domains & Routes > Add >
Custom domain: `scalinamedia.com`, then again for `www.scalinamedia.com`.

Send www to the bare domain: Rules > Redirect Rules > Create from template >
"Redirect from WWW to root", status 301.

Once the custom domain works, turn off the `workers.dev` address on the same
screen (or add `"workers_dev": false` to `wrangler.jsonc`) so search engines only
see one copy of the site.

## 4. Turnstile (spam protection on the enquiry form)

1. Dashboard > Turnstile > Add widget. Name: `Scalina enquiry`. Hostnames:
   `scalinamedia.com`, `www.scalinamedia.com`. Widget mode: **Managed**.
2. Put the **site key** in `.env.production` as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
   It is public; it gets built into the page. Commit it.
3. Set the **secret key** on the Worker (never in a file):
   ```bash
   npx wrangler secret put TURNSTILE_SECRET_KEY
   ```
4. Redeploy (`npm run deploy`). The site key only takes effect after a rebuild.

Set both or neither. With only the secret set, every enquiry is refused.

## 5. Resend (enquiries to info@)

1. resend.com > Domains > Add `scalinamedia.com` (region: Tokyo `ap-northeast-1`
   is closest to Sydney). Add the DNS records it lists in Cloudflare, all
   *DNS only*. Wait for **Verified**.
2. API Keys > Create, permission **Sending access**, domain `scalinamedia.com`.
3. ```bash
   npx wrangler secret put RESEND_API_KEY
   ```
4. **Google Groups:** open the info@ group > Group settings > *Who can post* >
   **Anyone on the web**. Otherwise the website's emails bounce or wait in
   moderation.
5. If there is no DMARC record yet, add a `TXT` record named `_dmarc` with
   `v=DMARC1; p=none; rua=mailto:info@scalinamedia.com`.
6. Send a real enquiry from the live site. It should arrive within a minute, from
   "Scalina Website", with Reply going to the visitor. Check spam the first time.

Optional overrides (same `wrangler secret put` command, or plain variables in
the dashboard): `ENQUIRY_TO`, `ENQUIRY_FROM`. Later, the CRM: `SCALINA_CRM_ENDPOINT`
and `SCALINA_CRM_TOKEN`; no code change is needed.

## 6. Analytics (free, cookieless)

Dashboard > Analytics & Logs > Web Analytics > Add a site > `scalinamedia.com`.

- **Easiest:** choose *automatic setup* for the domain. Cloudflare injects the
  script; nothing to change here.
- **Or** choose the JS snippet, copy the `token` value from it into
  `.env.production` as `NEXT_PUBLIC_CF_BEACON_TOKEN`, and redeploy.

Pick one, not both, or every visit counts twice. It sets no cookies, which is
what the Cookie Policy says, so no consent banner is needed.

## 7. Google Search Console

1. search.google.com/search-console > Add property > **Domain** >
   `scalinamedia.com`.
2. Verify with the DNS `TXT` record it gives you (Search Console can add it to
   Cloudflare for you if you sign in when it asks).
3. Sitemaps > submit `https://scalinamedia.com/sitemap.xml`.
4. URL Inspection > `https://scalinamedia.com/` > Request indexing.

## 8. Google Business Profile

1. business.google.com > Add business > **Scalina**.
2. Category: *Marketing agency*. Add *Website designer* and *Software company*
   as additional categories.
3. "Do you want to add a location customers can visit?" **No** (a
   service-area business, so no public street address). Service area: Sydney,
   plus any other areas you serve.
4. Phone: **0401 115 776**, the same number as the site (Google compares
   them). Website: `https://scalinamedia.com`.
5. Verify (Google chooses: video, phone, or postcard).
6. Then add: logo `docs/launch-assets/logo-720.png`, cover
   `docs/launch-assets/cover-1200x630.png`, the services from `/services`, hours,
   and the description from the homepage. Ask past clients for reviews once it is
   live.

## 9. Before you announce it

- [ ] LinkedIn URL: add it to `SOCIAL_LINKS` in `lib/content.ts` (footer and
      search data both pick it up).
- [ ] Registered business name and ABN in `lib/legal.ts`. The legal pages
      print them when they are filled in.
- [ ] Have someone qualified read `/privacy` and `/terms`. They describe what
      the site actually does, but they are not legal advice.
- [ ] Test on a real iPhone and Android phone.
- [ ] Share the homepage link in a private chat to check the preview card.
