# Going live on Cloudflare Workers

The complete setup, in the order it has to happen. The code side is done: the
site builds for Workers and every integration below switches on from settings
alone. Budget an afternoon, most of it waiting for DNS.

**Accounts you will use:** Squarespace (domain), Cloudflare (DNS, hosting,
Turnstile, analytics), GitHub (code), Resend (sending email), Google Workspace
admin (the info@ group), Google Search Console, Google Business Profile.

**Assumed address:** `https://scalinamedia.com`. If the site will live
somewhere else, change `NEXT_PUBLIC_SITE_URL` in `.env.production` first.

---

## How the pieces fit

```
Visitor ──> Cloudflare (DNS + Worker "scalina-website") ──> the website
                                   │
                   enquiry form ───┼──> Turnstile check (is it a person?)
                                   └──> Resend ──> info@ Google Group ──> your inboxes

Email to info@ from anyone ──> Google Workspace (MX records), unchanged
```

**Your email keeps running on Google Workspace.** Moving DNS to Cloudflare
only changes who *publishes* your domain's records. The `MX` records still point
at Google, so mail is delivered to Google exactly as now; Cloudflare never
touches it. Resend only *sends* (website → info@); it does not receive anything,
and its DNS records sit on their own names (`send.` and `resend._domainkey`), so
they do not clash with Google's.

---

## Phase 1: Move DNS to Cloudflare (the domain stays at Squarespace)

The domain stays registered and billed at Squarespace. Only its nameservers
change.

1. **Screenshot your current DNS.** Squarespace > Domains > `scalinamedia.com` >
   DNS (DNS Settings). Capture every record, especially:
   - `MX` records (Google: `smtp.google.com`, or the older `aspmx.l.google.com`
     set)
   - `TXT` on `@` starting `v=spf1` (SPF)
   - `TXT` on `google._domainkey` (DKIM), if present
   - `TXT` `google-site-verification=...`, if present
   - `_dmarc` `TXT`, if present
   - anything else (CNAMEs for other services)
2. **Create a Cloudflare account** at dash.cloudflare.com > **Add a domain** >
   `scalinamedia.com` > *Quick scan for DNS records* > **Free** plan.
3. **Check the imported records** against your screenshot. Add anything missing.
   Every mail record must be **DNS only** (grey cloud). Delete any imported
   `A`/`CNAME` records for `@` and `www` that pointed at Squarespace's website
   builder; the Worker replaces them in Phase 3.
4. **Turn off DNSSEC at Squarespace** (Domains > `scalinamedia.com` > DNSSEC, or
   under Advanced settings). Leaving it on while nameservers change can make the
   domain unreachable.
5. **Change nameservers at Squarespace:** Domains > `scalinamedia.com` > DNS >
   **Domain nameservers** > *Use custom nameservers*. Enter the two names
   Cloudflare shows (like `xxx.ns.cloudflare.com`). Save.
6. **Wait for "Active".** Cloudflare emails you; usually within a few hours, up
   to 24. Email keeps working throughout as long as step 3 was right.
7. **Check email still arrives:** send a message to info@ from a personal
   address once Cloudflare says Active.
8. Optional, later: Cloudflare > DNS > Settings > **Enable DNSSEC**, then add the
   DS record it shows in Squarespace's DNSSEC settings.

## Phase 2: Deploy the site from GitHub

Cloudflare builds and deploys every time `main` changes.

1. **Merge the launch work into `main`.** The work is on the `launch-prep`
   branch: on GitHub, open a pull request from `launch-prep` into `main` and
   merge it.
2. Cloudflare > **Workers & Pages** > **Create** > **Import a repository** >
   connect GitHub (allow the Cloudflare app access to
   `sianshrestha/scalina-website`; it is private).
3. Settings on the setup screen:

   | Field | Value |
   |---|---|
   | Project / Worker name | `scalina-website` (must match `wrangler.jsonc`) |
   | Production branch | `main` |
   | Build command | `npx opennextjs-cloudflare build` |
   | Deploy command | `npx opennextjs-cloudflare deploy` |
   | Non-production branch deploy command | `npx opennextjs-cloudflare upload` |
   | Root directory | (leave empty) |

   No build variables are needed: the public values are in `.env.production`.
4. **Save and Deploy.** The first build takes a few minutes. When it finishes,
   open the `scalina-website.<your-subdomain>.workers.dev` address and click
   through every page.
5. **Plan:** start on **Workers Free** (the site fits its limits; videos and
   images are served free and do not count as requests). After launch, check
   Workers & Pages > `scalina-website` > **Metrics**. If you ever see
   *Exceeded CPU* errors, switch to **Workers Paid** (US$5/month) in Workers &
   Pages > Plans.

Deploying from your own computer also works: `npx wrangler login`, then
`npm run deploy`.

## Phase 3: Point scalinamedia.com at the Worker

Needs Phase 1 to be Active.

1. Workers & Pages > `scalina-website` > **Settings** > **Domains & Routes** >
   **Add** > **Custom domain** > `scalinamedia.com`. Cloudflare creates the DNS
   record and the HTTPS certificate itself.
2. Add a second custom domain: `www.scalinamedia.com`.
3. **Send www to the bare domain:** Cloudflare > `scalinamedia.com` > **Rules** >
   **Redirect Rules** > *Create rule* > template **Redirect from WWW to root**
   (301). Deploy.
4. Check `https://scalinamedia.com` and that `https://www.scalinamedia.com`
   redirects to it.
5. Once that works, turn off the workers.dev address: Settings > Domains &
   Routes > `workers.dev` > Disable (so search engines see one copy of the site).

## Phase 4: Resend, so enquiries reach the info@ group

### 4a. Verify the domain in Resend

1. Sign up at resend.com > **Domains** > **Add Domain** > `scalinamedia.com`,
   region **Tokyo (ap-northeast-1)** (closest to Sydney).
2. Choose **Sign in to Cloudflare** (automatic setup) if offered; it adds the
   records for you. Otherwise add them by hand in Cloudflare > DNS, all
   **DNS only**:

   | Type | Name | Value |
   |---|---|---|
   | `TXT` | `resend._domainkey` | the long `p=...` key Resend shows |
   | `MX` | `send` | `feedback-smtp.<region>.amazonses.com`, priority 10 |
   | `TXT` | `send` | `v=spf1 include:amazonses.com ~all` |

   Copy the exact values from Resend; the table shows the shape. **Do not**
   change your root `@` SPF record or root MX records, and **do not** enable
   Resend's *Receiving / Inbound* feature: that would take over mail meant for
   Google.
3. Click **Verify** in Resend; it turns green within minutes.
4. **DMARC**, if you had none in your screenshot: Cloudflare > DNS > Add `TXT`,
   name `_dmarc`, value `v=DMARC1; p=none; rua=mailto:info@scalinamedia.com`.
   If one already exists, leave it.

### 4b. Give the website a key

1. Resend > **API Keys** > **Create API Key**: name `scalina-website`,
   permission **Sending access**, domain `scalinamedia.com`. Copy it (shown
   once).
2. Cloudflare > Workers & Pages > `scalina-website` > **Settings** >
   **Variables and Secrets** > **Add** > Type **Secret** > Name `RESEND_API_KEY`,
   value the key > **Deploy**.

The site sends from `Scalina Website <website@scalinamedia.com>` to
`info@scalinamedia.com` by default. `website@` does not need to be a real
mailbox: replies go to the visitor, not to it. To change either, add
`ENQUIRY_FROM` / `ENQUIRY_TO` the same way (Type: Text is fine).

### 4c. Let the info@ group accept mail from the website

Google Groups refuses mail from outside your organisation by default, and to
Google, Resend is outside.

1. **Admin console** (admin.google.com) > Apps > Google Workspace > **Groups for
   Business** > **Sharing settings** > tick **Group owners can allow incoming
   email from outside the organisation** > Save.
2. **groups.google.com** > the info@ group > **Group settings**:
   - *Who can post*: **Anyone on the web**
   - *Message moderation*: **No moderation**
   - *Spam messages* (if shown): **Post suspicious messages to the group**
     (until you trust the setup; it stops a false positive being held silently)
   - Save.
3. Make sure everyone who should see enquiries is a member of the group with
   email delivery on (*Each email*).

### 4d. Test it

1. On the live site, go to `/start`, pick any option, enter your own name and a
   personal email, and send.
2. You should see "Thanks, ..." and a reference like `SC-6OCDCT`.
3. Within a minute every group member gets "Enquiry SC-...: Your Name". Hitting
   **Reply** addresses your personal email (the visitor).
4. Nothing arrived? Check, in order: Resend > **Emails** (was it sent? bounced?),
   the group's *Pending messages*, spam folders, then Cloudflare > `scalina-website`
   > **Logs** for lines starting `[enquiry]`.

Resend's free plan allows 100 emails a day and 3,000 a month. With spam
protection on, that is far more enquiries than the site will get.

## Phase 5: Turnstile (stops bots using the form)

1. Cloudflare > **Turnstile** > **Add widget**: name `Scalina enquiry`;
   hostnames `scalinamedia.com` and `www.scalinamedia.com`; mode **Managed**;
   pre-clearance **No**. Create.
2. Copy the **Site key** into `.env.production`:
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAA...`, then commit and push to `main`.
   It is public by design. Cloudflare rebuilds the site with it.
3. After that deploy finishes, add the **Secret key**: `scalina-website` >
   Settings > Variables and Secrets > Add > Type **Secret** > Name
   `TURNSTILE_SECRET_KEY` > Deploy.
4. Send another test enquiry (Phase 4d). It should still go through. Visitors
   almost never see the check; it only appears when Cloudflare is unsure.

**Order matters:** site key first, secret second. With only the secret set,
every enquiry is refused.

## Phase 6: Analytics (free, no cookies)

1. Cloudflare > **Analytics & Logs** > **Web Analytics** > **Add a site** >
   `scalinamedia.com`.
2. If it offers **automatic setup** for the domain, use it and you are done.
3. Otherwise choose the JS snippet, copy only the `token` value from it into
   `.env.production` as `NEXT_PUBLIC_CF_BEACON_TOKEN=...`, commit and push.

Use one method, not both, or visits are counted twice. Numbers appear within a
few minutes of the first visits. It sets no cookies, which is what the Cookie
Policy promises.

## Phase 7: Google Search Console

1. search.google.com/search-console > **Add property** > **Domain** >
   `scalinamedia.com`.
2. Verify with the `TXT` record it gives you. Choose Cloudflare as the provider
   if offered and it adds the record for you; otherwise add it in Cloudflare >
   DNS by hand.
3. **Sitemaps** > submit `https://scalinamedia.com/sitemap.xml`.
4. **URL Inspection** > `https://scalinamedia.com/` > **Request indexing**.
5. Come back in a week: *Pages* shows what Google indexed and why anything was
   left out.

## Phase 8: Google Business Profile

1. business.google.com > **Add business** > name **Scalina**.
2. Category: **Marketing agency**; add **Website designer** and **Software
   company** as additional categories.
3. "Add a location customers can visit?" **No**: a service-area business, so no
   public street address. Service areas: Sydney, plus wherever else you work.
4. Phone **0401 115 776** (matches the site; Google compares them). Website
   `https://scalinamedia.com`.
5. Verify (Google decides how: video, phone or postcard).
6. Fill in: logo `docs/launch-assets/logo-720.png`, cover
   `docs/launch-assets/cover-1200x630.png`, services from `/services`, hours,
   the homepage description, and links to Instagram and Facebook.
7. Ask a few clients for reviews once it is verified.

## Phase 9: Before you announce it

- [ ] LinkedIn URL: add it to `SOCIAL_LINKS` in `lib/content.ts`.
- [ ] Registered business name and ABN in `lib/legal.ts` (the legal pages print
      them once filled in).
- [ ] Have someone qualified read `/privacy` and `/terms`.
- [ ] Test on a real iPhone and an Android phone, including sending an enquiry.
- [ ] Paste the homepage link into a private chat to see the preview card.
- [ ] workers.dev address disabled (Phase 3, step 5).

---

## Everyday changes after launch

- **Change the site:** push to `main`; Cloudflare rebuilds and deploys in a few
  minutes. Other branches get their own preview address.
- **Roll back a bad deploy:** `scalina-website` > **Deployments** > pick an
  earlier one > **Rollback**.
- **Secrets and settings:** `scalina-website` > Settings > Variables and
  Secrets. Changing one takes effect on the next deploy (the Deploy button
  there).
- **The CRM, later:** add `SCALINA_CRM_ENDPOINT` (and `SCALINA_CRM_TOKEN`) as
  secrets. Enquiries then go to both the CRM and info@; no code change.

## Reference: every setting

| Name | Where | Secret? | Purpose |
|---|---|---|---|
| `RESEND_API_KEY` | Worker > Variables and Secrets | yes | sends enquiry emails |
| `TURNSTILE_SECRET_KEY` | Worker > Variables and Secrets | yes | verifies the bot check |
| `ENQUIRY_TO` / `ENQUIRY_FROM` | Worker > Variables and Secrets | no | optional overrides |
| `SCALINA_CRM_ENDPOINT` / `_TOKEN` | Worker > Variables and Secrets | token yes | CRM, later |
| `NEXT_PUBLIC_SITE_URL` | `.env.production` (in git) | no | canonical address |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `.env.production` (in git) | no | shows the bot check |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | `.env.production` (in git) | no | analytics, if not automatic |
