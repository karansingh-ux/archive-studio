# THE ARCHIVE

An interactive editorial fashion storefront built with React, TypeScript, Vite, Tailwind CSS, and GSAP. The collection hangs on a swipeable rail; each product has a full-screen detail view, size selection, a bag, and a demonstration checkout.

## Run locally

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite (normally `http://127.0.0.1:5173/`).

## Production build

```bash
npm run build
npm run preview
```

The build runs TypeScript checks and writes a static site to `dist/`. The built frontend uses a browser-local **demo checkout**. It does not charge payments, send receipts, or persist orders on a server. The `/api/*` endpoints in `src/server/apiPlugin.ts` run only under the Vite development server. See [AGENTS.md](AGENTS.md) for architecture and development conventions.

## Deploy

### Vercel

Import this GitHub repository as a new project. Use the Vite preset, build command `npm run build`, and output directory `dist`. No environment variables are required for the demo site.

### Cloudflare Pages

Connect this GitHub repository to Pages. Use framework preset **Vite**, build command `npm run build`, and build output directory `dist`. No environment variables are required for the demo site.

The app is a single-page site at `/`; it does not need route rewrites. Keep the deployment as a static site until a real commerce backend and payment provider are designed and implemented.

## Assets and performance

- The studio background and Anybody variable font are preloaded for the entrance scene. The font is self-hosted under the SIL Open Font License; its license is at `public/fonts/OFL-Anybody.txt`.
- The seven detail-view campaign renders load as transparent WebP files of roughly 130–350 KiB each. Their transparent PNG masters and the original garment angle images are included in `public/garments/`.
- Campaign renders are generated editorial concepts, not verified photos of manufactured products. Their prompt set and paths are documented in `public/garments/CAMPAIGN_ASSETS.md`.
- The rail images remain small PNG cutouts to preserve the photographed hanger alignment.

## Key files

- `src/App.tsx` — stage, entrance timeline, rail, and navigation
- `src/data/garments.ts` — seven-product catalog and image paths
- `src/components/` — rail, product detail, bag, and checkout UI
- `src/context/CartContext.tsx` — client cart and checkout state
- `src/utils/api.ts` — development API client and production demo fallback
- `src/server/apiPlugin.ts` — Vite development-only demo endpoints
