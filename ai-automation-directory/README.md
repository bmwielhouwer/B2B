# AI Automation Agency Directory

A turnkey, revenue-ready B2B directory that connects businesses with agencies that build **AI and automation workflows** — marketing automation, sales automation, data analytics, workflow automation, AI chatbots, process automation, and AI consulting.

It ships with **150 seed listings**, paid self-serve submissions through Stripe, automated confirmation emails, an owner dashboard, and full SEO out of the box. Deploy it, point a domain at it, and it's a business on day one.

---

## What this is and why it's valuable

This is a **productized, niche lead-generation asset.** Directories are one of the most durable business models on the web: they compound in SEO value over time, cost almost nothing to run, and monetize from both sides of a marketplace.

- **A real, populated product on launch day.** 150 original, categorized agency profiles mean the site looks credible and ranks for long-tail searches immediately — no "empty marketplace" cold-start problem.
- **Revenue from the first visitor.** Agencies pay to be listed (Standard **$49** / Featured **$99**, one-time) via Stripe Checkout. Payments, emails, and record-keeping are fully automated.
- **Near-zero running costs.** Static pages on Vercel's free/low tier, file-based content, and serverless functions mean hosting can run at hobby-project cost while generating real revenue.
- **A growing SEO moat.** Every agency and category is a statically generated, individually optimized page with structured data — exactly what search engines reward in a focused niche.
- **Fully owned and portable.** No proprietary CMS lock-in. Content is a single JSON file; the whole thing is a standard Next.js app you can host anywhere.

The AI/automation services market is expanding fast, and the buyers (businesses) and sellers (agencies) are both actively searching. This directory sits in the middle and charges for placement.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js (App Router) + React |
| Language | TypeScript |
| Styling | Tailwind CSS (no component library — fully owned markup) |
| Content | Flat-file JSON (`data/agencies.json`) |
| Payments | Stripe Checkout + webhooks |
| Email | Resend (transactional confirmation emails) |
| Storage | Upstash Redis / Vercel KV (paid submissions) |
| Hosting | Vercel (one-click deploy) |
| SEO | Static generation, per-page metadata, canonical URLs, Schema.org JSON-LD, sitemap & robots |

There are no paid dependencies to run the core directory. Stripe, Resend, and Upstash all have free tiers that comfortably cover early traffic.

---

## Deploy to Vercel in under 10 minutes

1. **Push the code to a Git repo** (GitHub, GitLab, or Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and **import the repository.** Vercel auto-detects Next.js — no build settings to change.
3. In the import screen, open **Environment Variables** and add the variables listed in [`.env.example`](./.env.example). You can start with Stripe **test** keys to verify the flow, then switch to live keys.
4. Click **Deploy.** In ~2 minutes you'll have a live URL.
5. **Add your custom domain** under Project → Settings → Domains, and set `NEXT_PUBLIC_SITE_URL` to that domain (e.g. `https://www.yourdomain.com`) so canonical tags and the sitemap use it.
6. **Redeploy** after setting the domain variable so the SEO URLs pick it up.

That's the whole site live. The next sections wire up payments and email.

---

## Configure Stripe and create the two price IDs

1. Create a free account at [stripe.com](https://stripe.com).
2. In the dashboard, go to **Developers → API keys** and copy:
   - **Secret key** → set as `STRIPE_SECRET_KEY`
   - **Publishable key** → set as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Create the two listing products under **Product catalog → Add product**:
   - **Standard Listing** — one-time price of **$49**. Save and copy its price ID (`price_…`) → `STRIPE_STANDARD_PRICE_ID`.
   - **Featured Listing** — one-time price of **$99**. Copy its price ID → `STRIPE_FEATURED_PRICE_ID`.
   > Price IDs are **never hardcoded** — the app reads them from these environment variables, so you can change pricing without touching code.
4. Set up the webhook so paid submissions are recorded and customers are emailed:
   - Go to **Developers → Webhooks → Add endpoint.**
   - Endpoint URL: `https://yourdomain.com/api/stripe-webhook`
   - Event to send: **`checkout.session.completed`**
   - Save, then copy the **Signing secret** (`whsec_…`) → `STRIPE_WEBHOOK_SECRET`.
5. Redeploy (or it auto-deploys on the env change). Run a test purchase with a [Stripe test card](https://stripe.com/docs/testing) to confirm the end-to-end flow.

---

## Configure Resend and set the sending domain

1. Create an account at [resend.com](https://resend.com).
2. Go to **API Keys**, create a key, and set it as `RESEND_API_KEY`.
3. Go to **Domains → Add Domain**, enter your domain, and add the DNS records Resend provides (SPF/DKIM) at your domain registrar. Wait for verification (usually minutes).
4. Set `RESEND_FROM_EMAIL` to an address on that verified domain — for example `hello@yourdomain.com`. Emails are sent as **"Directory" `<RESEND_FROM_EMAIL>`**.
5. After a test purchase, the customer receives an automated confirmation explaining their listing will be reviewed and added within 48 hours.

> Until a domain is verified you can use Resend's sandbox sender for testing, but a verified domain is required for production deliverability.

---

## Add or edit listings

All directory content lives in a single file: **`data/agencies.json`**. There is no database or CMS to manage.

1. Open `data/agencies.json`.
2. Add a new object (or edit an existing one) following the existing shape:
   ```json
   {
     "id": "151",
     "slug": "example-agency",
     "name": "Example Agency",
     "tagline": "One-line pitch.",
     "description": "Two to three sentences about the agency.",
     "category": "ai-consulting",
     "services": ["Service one", "Service two", "Service three"],
     "location": { "city": "Austin", "country": "United States" },
     "website": "https://www.exampleagency.com",
     "founded": 2022,
     "teamSize": "11-50",
     "featured": false
   }
   ```
   - `slug` must be unique and URL-friendly (it becomes `/agencies/<slug>`).
   - `category` must be one of: `marketing-automation`, `sales-automation`, `data-analytics`, `workflow-automation`, `ai-chatbots`, `process-automation`, `ai-consulting`.
   - Set `"featured": true` to give a listing the gold border and top placement.
3. Commit and push. Vercel redeploys automatically and statically regenerates the new/updated pages and the sitemap.

This makes fulfilling a paid submission a 60-second job: copy the buyer's details from the admin dashboard into the JSON file and push.

---

## View new paid submissions

Every completed Stripe payment is recorded automatically and shown at:

```
https://yourdomain.com/admin/submissions
```

The page lists each paid submission — agency name, email, tier, website, and submission date — newest first. It is intentionally **not linked anywhere** on the site and is protected only by its obscure URL (keep it private). Use it as your fulfillment queue: when a payment lands, the buyer's details appear here, and you add them to `data/agencies.json`.

> Want stronger protection later? Putting this route behind Vercel password protection or a simple auth check is a small, optional upgrade.

---

## Revenue model

The directory is built to earn from multiple, stacking streams:

- **Paid submissions (live today).** Agencies pay a one-time **$49 Standard** fee to be listed. This is the core, repeatable revenue line and scales directly with traffic and outreach.
- **Featured upgrades (live today).** Agencies pay **$99** for a Featured listing — gold styling, homepage priority, and top placement in their category. Featured tiers reliably convert a meaningful share of buyers and roughly double the average order value.
- **Sponsorships (ready to add).** Once traffic builds, sell category sponsorships (e.g. "Presented by …" on `/category/ai-chatbots`), homepage banner placements, or a newsletter — high-margin recurring revenue layered on top of the per-listing fees.

Because fulfillment is mostly automated and hosting is cheap, margins are high and incremental sales drop almost entirely to the bottom line.

---

## Growth levers for the new owner

- **SEO compounding.** Every agency and category page is statically generated with unique titles, descriptions, canonical URLs, and Schema.org `LocalBusiness` markup, plus an auto-generated sitemap. Publish more listings and category content and rankings compound over time for high-intent, long-tail queries.
- **Direct outreach.** The fastest path to revenue: email agencies that fit each category and invite them to claim or upgrade a listing. Conversion is strong because the offer is concrete (visibility to in-market buyers) and cheap.
- **Category expansion.** Adding adjacent niches (e.g. "RevOps automation", "AI implementation for healthcare") creates whole new SEO surfaces and audiences with near-zero engineering effort — they're just new category slugs and listings.
- **Content & comparisons.** "Best [category] agencies in [city]" roundups and buyer guides funnel organic traffic straight into paid listing pages.
- **Geographic expansion.** Listings already span 15+ US cities and 20+ international locations — lean into city/country landing pages to capture local search demand.
- **Tier and pricing experiments.** Because prices are environment variables, the owner can test pricing, add annual featured placements, or bundle sponsorships without code changes.

---

## Local development (for reference)

```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev                  # http://localhost:3000
npm run build                # production build
```

All secrets are referenced by environment-variable name only — none are hardcoded anywhere in the codebase. See `.env.example` for the full list.
