# Aircraft City Model — Demo Copy

A rebuilt demo of aircraftcitymodel.com, used to develop and present the chatbot and control panel.
It is **not** the official store: a banner says so on every page, search engines are told not to index it, and there are no real payments.

## What works now
- Home, Shop, Collections and Product pages, matching the live site's layout, fonts, colours and light/dark toggle
- The real catalogue (739 products) and size prices, loaded live from the official site's public feed
- Search, category filter, sorting, 24-per-page pagination
- Product configurator (quantity, size, details) and a demo cart saved in the browser

## Coming next
- Customize, Login/Sign up, Cart and Checkout pages (demo accounts and orders in Supabase, no payment)
- The chatbot widget (one `<script>` line in `index.html`, already marked)

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
