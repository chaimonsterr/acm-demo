# Aircraft City Model — Demo Copy

A rebuilt demo of aircraftcitymodel.com, used to develop and present the chatbot and control panel.
It is **not** the official store: a banner says so on every page, search engines are told not to index it, and there are no real payments.

## What works now
- Home, Shop, Collections and Product pages, matching the live site's layout, fonts, colours and light/dark toggle
- The real catalogue (739 products) and size prices, loaded live from the official site's public feed
- Search, category filter, sorting, 24-per-page pagination
- Product configurator (quantity, size, details) and a demo cart saved in the browser

- Customize form: saves Custom Order inquiries (with optional reference image) to Supabase
- Sign up / sign in with demo accounts (Supabase Auth)
- Cart, checkout (login required, no payment) and an Account page with order status and requests

## Supabase setup (once)
1. Supabase → SQL Editor → paste `supabase/schema.sql` → Run.
2. Authentication → URL Configuration → Site URL: `https://acm-demo-pi.vercel.app`
3. For quick demo sign-ups: Authentication → Sign In / Providers → Email → turn off **Confirm email**
   (otherwise each sign-up needs an email confirmation, and Supabase's built-in mailer only sends a few per hour).
4. To make someone admin (for the control panel later): run the `insert into public.admins …` line at the bottom of `schema.sql`.

The site uses the **publishable** key only (`src/supabase.js`). Never put a secret key in this repo.

## Coming next
- The chatbot widget (one `<script>` line in `index.html`, already marked)
- The owner's control panel

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
```
`/api/*` and `/live/assets/*` are forwarded to the live site (see `vite.config.js`).

## Deploy to Vercel
Option A — GitHub (recommended for a group):
1. Push this folder to a new GitHub repo.
2. In Vercel: **Add New → Project → Import** the repo. Framework: **Vite** (auto-detected). Deploy.

Option B — CLI:
```bash
npm i -g vercel
vercel          # first time: answer the prompts, accept the Vite defaults
vercel --prod
```

Then in the Vercel project: **Settings → Deployment Protection** → turn on password protection (or Vercel Authentication) so only your group, instructor and the owner can open it.

## How the live data works
`vercel.json` rewrites:
- `/api/products`, `/api/product-sizes` → aircraftcitymodel.com (read-only catalogue)
- `/live/assets/*` → the live site's images (logo and hero aircraft)

If the owner redeploys his site, the hashed image filenames in `src/api.js` (`IMG`) may change; update them there.
