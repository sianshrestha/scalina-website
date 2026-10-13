# Going live on Cloudflare Workers (scalina.io)

The complete setup, in order. The code side is done: the site builds for
Workers and every integration below switches on from settings alone.

**Domain:** `scalina.io`, registered at Cloudflare, so its DNS already lives in
your Cloudflare account. No nameservers to move.
**Email:** Google Workspace on `scalina.io`; enquiries go to the
`info@scalina.io` group.

**Accounts you will use:** Cloudflare (domain, hosting, Turnstile, analytics),
GitHub (code), Resend (sends the website's emails), Google Workspace admin (the
info@ group), Google Search Console, Google Business Profile.

---

## How the pieces fit

```
Visitor ──> scalina.io (Cloudflare) ──> Worker "scalina-website" ──> the website
                                              │
                          enquiry form ───────┼──> Turnstile: is it a person?
                                              └──> Resend ──> info@scalina.io group ──> members' inboxes

Anyone emailing info@ or you ──> Google Workspace (via the MX records), untouched by all of this
```

**Google Workspace keeps handling all your email.** The `MX` records in
Cloudflare DNS point at Google, so mail goes straight to Google; Cloudflare only
publishes those records, it never carries the mail. Resend only *sends* (website
→ info@). Its records sit on their own names (`send.` and `resend._domainkey`),
so they do not clash with Google's.

---

## Phase 0: Check the email records Google Workspace needs

Workspace setup adds some of these, not always all. Cloudflare > `scalina.io` >
**DNS** > **Records**. All of them must be **DNS only** (grey cloud).

| Type | Name | Value | Notes |
|---|---|---|---|
| `MX` | `scalina.io` (`@`) | `smtp.google.com`, priority 1 | required; Workspace setup adds it |
| `TXT` | `scalina.io` (`@`) | `v=spf1 include:_spf.google.com ~all` | SPF; must be the ONLY `v=spf1` record on `@` |
| `TXT` | `google._domainkey` | `v=DKIM1; k=rsa; p=...` | DKIM, see below |
| `TXT` | `_dmarc` | added by Cloudflare DMARC Management (below) | DMARC; required by Gmail for good delivery |

**DKIM is usually missing**, because Google makes you generate it yourself:
Google Admin console (admin.google.com) > Apps > Google Workspace > Gmail >
**Authenticate email** > select `scalina.io` > **Generate new record** (2048-bit)
> add the `TXT` record it shows to Cloudflare DNS > wait ~10 minutes > back in
Admin, **Start authentication**. Without DKIM, mail you send from Gmail is more
likely to land in spam.

**DMARC:** Cloudflare > `scalina.io` > **Email** > **DMARC Management** >
**Enable**. It adds the `_dmarc` record for you with `p=none` (monitor only)
and collects the daily reports on a dashboard, instead of mailing them to
info@. Do not point `rua=` at info@: every mail provider would send the group a
report every day. After two to four weeks of clean reports, you can tighten the
policy to `p=quarantine`.

**After DKIM, confirm it is on:** Admin console > Apps > Google Workspace >
Gmail > Authenticate email > `scalina.io` should say **Authenticating email**.
If it says *Not authenticating*, click **Start authentication**.

Check: send an email from a personal address to `info@scalina.io` and confirm
the group members receive it.

### If mail to info@ lands in Spam

Common in the first days: `scalina.io` is brand new, the group is new, and
Gmail is wary of both. In order:

1. **Read Gmail's reason.** Open the message in Spam; the grey/yellow banner
   says why ("similar to messages identified as spam", "sender could not be
   verified", ...). *More (⋮) > Show original* shows SPF / DKIM / DMARC: all three
   should say PASS for the *sender's* domain.
2. **Mark it Not spam.** Each member, on each copy. Gmail learns per mailbox.
3. **Test like a real email.** A one-word "test" from a fresh personal account is
   exactly what spam looks like. Send a normal message with a subject and a few
   sentences.
4. **Make sure DMARC exists** and **DKIM is authenticating** (above).
5. **Belt and braces, per member:** Gmail > search bar > *Show search options* >
   **To:** `info@scalina.io` > **Create filter** > tick **Never send it to Spam**
   (and optionally *Apply the label* `Info`) > **Create filter**. Trade-off: real
   junk sent to info@ then reaches the inbox too. The website form is protected
   by Turnstile, so that is mostly a concern for the public address itself.
6. **Give it a couple of weeks.** Reputation builds as the domain sends and
   receives normal mail; spam placement usually fades on its own.

## Phase 0b: Create the info@scalina.io group, and reply as info@

`info@` is a **Google Group**, not a user, so it costs no licence. Everyone in
it receives what is sent to info@, and each member can send and reply **as**
info@ from their own Gmail.

### Allow groups to receive outside email (once, organisation-wide)

Admin console (admin.google.com) > Menu > **Apps** > **Google Workspace** >
**Groups for Business** > **Sharing settings** > tick **Group owners can allow
incoming email from outside the organisation** > **Save**. Without this,
customers (and the website) cannot email the group at all.

### Create the group

1. Admin console > Menu > **Directory** > **Groups** > **Create group**.
2. Group details:
   - **Group name:** `Scalina Info`
   - **Group email:** `info` @ `scalina.io`
   - **Description:** `Enquiries and general contact. Website enquiries arrive here.`
   - **Group owner(s):** yourself (and any co-owner)
   - **Next**. Leave the *Security* label unticked > **Next**.
3. Access type: choose **Custom**, then set the table so:
   - **Who can post:** tick **External** (this is the one that matters; it
     lets customers, Resend and Gmail's verification email in)
   - **Who can view conversations:** Group members
   - **Who can view members:** Group managers
   - **Who can contact group owners:** Entire organisation
   - **Who can join the group:** Only invited users
   - **Allow members outside your organisation:** Off
   - **Next** > **Create group**.
4. **Add members:** open the group > **Members** > **Add members** > each person
   who should see enquiries, role **Member** (or Owner), delivery **Each email**.
5. groups.google.com > **Scalina Info** > **Group settings**, check:
   - *Who can post*: **Anyone on the web**
   - *Message moderation*: **No moderation**
   - *Spam messages*: **Post suspicious messages to the group**
6. Test: from a personal address, email `info@scalina.io`. Every member should
   get it within a minute.

### Make replies go out as info@ (each member does this once, in their own Gmail)

1. Gmail on a computer > **Settings** (gear) > **See all settings** >
   **Accounts** tab.
2. **Send mail as** > **Add another email address**:
   - Name: `Scalina`
   - Email address: `info@scalina.io`
   - Leave **Treat as an alias** ticked > **Next step**.
3. Google sends a confirmation email **to info@**, so it lands in every member's
   inbox. Click the link in it (or paste its code). If it never arrives, the
   group's *Who can post* is not set to External / Anyone on the web.
4. Back in **Settings > Accounts > Send mail as**, set **When replying to a
   message:** **Reply from the same address the message was sent to**.
   Optionally click **make default** next to info@ to send *everything new* as
   info@ too.
5. Done. Now:
   - A website enquiry arrives "To: info@scalina.io". Press **Reply**: it is
     addressed to the visitor (the site sets Reply-To) and the **From** is
     `info@scalina.io` automatically.
   - Customer emails sent to info@ work the same way.
   - Writing a new email: pick `info@scalina.io` in the **From** line.
   - In the Gmail phone app, check the **From** line before sending; tap it to
     switch if needed. The app uses the same addresses once step 2 is done on a
     computer.

**Tip: keep the team in the loop.** Add `info@scalina.io` in **Bcc** when you
reply to a customer. Every member then gets a copy, so two people never answer
the same enquiry. A Gmail filter on subject `Enquiry SC-` (Apply label
`Enquiries`) keeps website enquiries together.

Emails sent as info@ go out through Google with your domain's DKIM signature,
so finish the DKIM step in Phase 0 first or they may land in customers' spam.

## Phase 1: Code is on `main`

The launch work is merged into `main` (done). Cloudflare deploys from `main`.

## Phase 2: Create the Worker from GitHub

Cloudflare builds and deploys every time `main` changes.

1. Cloudflare dashboard > **Workers & Pages** > **Create** > **Import a
   repository**.
2. **Connect GitHub** and give the Cloudflare app access to
   `sianshrestha/scalina-website` (it is private, so grant that repo).
3. Fill in:

   | Field | Value |
   |---|---|
   | Project / Worker name | `scalina-website` (must match `wrangler.jsonc`) |
   | Production branch | `main` |
   | Build command | `npx opennextjs-cloudflare build` |
   | Deploy command | `npx opennextjs-cloudflare deploy` |
   | Non-production branch deploy command | `npx opennextjs-cloudflare upload` |
   | Root directory | leave empty |
   | Build variables | none needed (public values are in `.env.production`) |

4. **Create and deploy.** The first build takes a few minutes; watch it under
   the Worker's **Deployments** tab. A failed build shows the log there.
5. Open `https://scalina-website.<your-account>.workers.dev` and click through
   every page. The enquiry form will say it cannot send yet; that is expected
   until Phase 4.

**Plan:** stay on **Workers Free** to start. The site fits its limits, and
videos, images and scripts are served free without counting as requests. After
launch, check the Worker's **Metrics** tab now and then; if *Exceeded CPU*
errors ever appear, move to **Workers Paid** (US$5/month) under Workers & Pages
> Plans.

## Phase 3: Put the site on scalina.io

1. Workers & Pages > `scalina-website` > **Settings** > **Domains & Routes** >
   **Add** > **Custom domain** > `scalina.io` > Add. Cloudflare creates the DNS
   record and HTTPS certificate itself (a minute or two).
2. Add another custom domain: `www.scalina.io`.
3. Redirect www to the bare domain: Cloudflare > `scalina.io` > **Rules** >
   **Redirect Rules** > **Create rule** > template **Redirect from WWW to root**
   > status **301** > Deploy.
4. Check that `https://scalina.io` loads and `https://www.scalina.io` lands on
   it.
5. Turn off the workers.dev address so search engines only see one copy: same
   Domains & Routes screen > `workers.dev` > **Disable**.
6. Recommended: Cloudflare > `scalina.io` > **DNS** > **Settings** > **Enable
   DNSSEC** (one click for Cloudflare-registered domains).

## Phase 4: Resend, so enquiries reach info@scalina.io

### 4a. Verify scalina.io in Resend

1. Sign up at resend.com > **Domains** > **Add Domain** > `scalina.io`, region
   **Tokyo (ap-northeast-1)**, the closest to Sydney.
2. Click **Sign in to Cloudflare** (automatic setup). It adds three records to
   your DNS:

   | Type | Name | Value |
   |---|---|---|
   | `TXT` | `resend._domainkey` | a long `p=...` key |
   | `MX` | `send` | `feedback-smtp.ap-northeast-1.amazonses.com`, priority 10 |
   | `TXT` | `send` | `v=spf1 include:amazonses.com ~all` |

   If you add them by hand instead, copy the exact values from Resend and set
   each to **DNS only**.
3. **Do not** change the root (`@`) MX or SPF records from Phase 0, and **do
   not** turn on Resend's *Receiving / Inbound* option. Either would take mail
   away from Google.
4. Press **Verify** in Resend; it goes green within minutes.

### 4b. Give the website a Resend key

1. Resend > **API Keys** > **Create API Key**: name `scalina-website`,
   permission **Sending access**, domain `scalina.io`. Copy the key (shown once).
2. Cloudflare > Workers & Pages > `scalina-website` > **Settings** >
   **Variables and Secrets** > **Add**: Type **Secret**, Name `RESEND_API_KEY`,
   Value the key > **Deploy**.

The website sends as `Scalina Website <website@scalina.io>` to
`info@scalina.io`. `website@` does not need to exist as a mailbox: replies go to
the visitor, not to it. To change either, add `ENQUIRY_FROM` or `ENQUIRY_TO` the
same way (Type: Text).

### 4c. Let the info@ group accept the website's emails

By default a Google Group only accepts mail from inside your organisation, and
Resend counts as outside.

1. **Admin console** > Apps > Google Workspace > **Groups for Business** >
   **Sharing settings** > tick **Group owners can allow incoming email from
   outside the organisation** > Save.
2. **groups.google.com** > `info@scalina.io` > **Group settings**:
   - *Who can post*: **Anyone on the web**
   - *Message moderation*: **No moderation**
   - *Spam messages* (if shown): **Post suspicious messages to the group**
   - Save.
3. **Members**: everyone who should see enquiries, each with subscription
   **Each email**.

### 4d. Test it

1. Open `https://scalina.io/start`, choose any option, enter your name and a
   personal email address, and send.
2. You should see "Thanks, ..." and a reference such as `SC-6OCDCT`.
3. Within a minute every group member gets "Enquiry SC-...: Your Name" from
   Scalina Website. **Reply** addresses the visitor (your personal email).
4. Nothing arrived? Check in order: Resend > **Emails** (sent, bounced or
   delivered?), the group's **Pending** messages, spam folders, then Cloudflare >
   `scalina-website` > **Logs** for lines starting `[enquiry]`.

Resend's free plan covers 100 emails a day and 3,000 a month.

## Phase 5: Turnstile (stops bots using the form)

1. Cloudflare > **Turnstile** > **Add widget**: name `Scalina enquiry`;
   hostnames `scalina.io` and `www.scalina.io`; mode **Managed**; pre-clearance
   **No** > Create.
2. Put the **Site key** in `.env.production`
   (`NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAA...`), then commit and push to
   `main`. It is public by design. Wait for that deploy to finish.
3. Then add the **Secret key**: `scalina-website` > Settings > Variables and
   Secrets > Add > Type **Secret** > Name `TURNSTILE_SECRET_KEY` > Deploy.
4. Repeat the Phase 4d test. Visitors almost never see the check; it appears
   only when Cloudflare is unsure.

**Site key first, secret second.** With only the secret set, every enquiry is
refused.

## Phase 6: Analytics (free, no cookies)

1. Cloudflare > **Analytics & Logs** > **Web Analytics** > **Add a site** >
   `scalina.io`.
2. If it offers **automatic setup** for the domain, choose it; done.
3. Otherwise take the JS snippet, copy only its `token` value into
   `.env.production` as `NEXT_PUBLIC_CF_BEACON_TOKEN=...`, commit and push.

One method, not both, or every visit counts twice. It sets no cookies, which is
what the Cookie Policy says.

## Phase 7: Google Search Console

1. search.google.com/search-console > **Add property** > **Domain** >
   `scalina.io`.
2. Verify: choose **Cloudflare** as the provider when asked and approve; it adds
   the `TXT` record for you. (Or copy the `TXT` into Cloudflare DNS by hand.)
3. **Sitemaps** > submit `https://scalina.io/sitemap.xml`.
4. **URL Inspection** > `https://scalina.io/` > **Request indexing**.
5. A week later, **Pages** shows what Google indexed and why anything was left
   out.

## Phase 8: Google Business Profile

1. business.google.com > **Add business** > **Scalina**.
2. Category **Marketing agency**; additional categories **Website designer**
   and **Software company**.
3. "Add a location customers can visit?" **No** (service-area business, no
   public street address). Service areas: Sydney, plus anywhere else you work.
4. Phone **0401 115 776** (matches the site). Website `https://scalina.io`.
5. Verify (Google picks the method: video, phone or postcard).
6. Add the logo `docs/launch-assets/logo-720.png`, the cover
   `docs/launch-assets/cover-1200x630.png`, services from `/services`, hours,
   the homepage description, and Instagram and Facebook links.
7. Ask a few clients for reviews once verified.

## Phase 9: Before you announce it

- [x] LinkedIn added to the footer (`SOCIAL_LINKS` in `lib/content.ts`).
- [ ] Registered business name and ABN in `lib/legal.ts`.
- [ ] Someone qualified reads `/privacy` and `/terms`.
- [ ] Test on a real iPhone and Android phone, including an enquiry.
- [ ] Paste `https://scalina.io` into a private chat to check the preview card.
- [ ] Instagram and Facebook bios link to `https://scalina.io`.
- [ ] If you still own **scalinamedia.com**: anything printed with it (the
      portfolio deck, email signatures) needs updating. To keep old links
      working, add that domain to Cloudflare too and create a Redirect Rule
      sending every request to `https://scalina.io`.

---

## After launch

- **Change the site:** push to `main`; Cloudflare rebuilds and deploys in a few
  minutes. Other branches get a preview address of their own.
- **Undo a bad deploy:** `scalina-website` > **Deployments** > pick an earlier
  one > **Rollback**.
- **Change a secret or setting:** `scalina-website` > Settings > Variables and
  Secrets, then Deploy. Plain-text variables survive future deploys
  (`keep_vars` is on).
- **Connect the CRM later:** add `SCALINA_CRM_ENDPOINT` (and
  `SCALINA_CRM_TOKEN`) as secrets. Enquiries then go to the CRM and to info@; no
  code change.
- **Change the contact email or phone on the site:** `lib/content.ts`
  (`EMAIL`, `PHONE`, `SOCIAL_LINKS`); everything reads from there.

## Reference: every setting

| Name | Where | Secret? | Purpose |
|---|---|---|---|
| `RESEND_API_KEY` | Worker > Variables and Secrets | yes | sends enquiry emails |
| `TURNSTILE_SECRET_KEY` | Worker > Variables and Secrets | yes | verifies the bot check |
| `ENQUIRY_TO` / `ENQUIRY_FROM` | Worker > Variables and Secrets | no | optional overrides |
| `SCALINA_CRM_ENDPOINT` / `SCALINA_CRM_TOKEN` | Worker > Variables and Secrets | token yes | CRM, later |
| `NEXT_PUBLIC_SITE_URL` | `.env.production` (in git) | no | `https://scalina.io` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `.env.production` (in git) | no | shows the bot check |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | `.env.production` (in git) | no | analytics, if not automatic |
