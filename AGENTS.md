# THE ARCHIVE — Development Guide

## Project overview

THE ARCHIVE is a single-page, editorial fashion storefront. The current collection uses transparent garment images arranged on a hanging rail over a photographic studio background. Hover changes each item from its side view to its front view; clicking opens a full-screen product detail view. A bag, guest checkout, and order confirmation complete a **demonstration** purchase flow.

The working tree contained substantial uncommitted changes when this guide was created. Inspect `git status` before editing, and preserve the user's current work. There was no pre-existing README or AGENTS.md in the project root.

## Stack and entry points

- React 18, TypeScript, Vite 5; `src/main.tsx` mounts `src/App.tsx` inside `CartProvider`.
- Tailwind CSS 3 with PostCSS and Autoprefixer. Theme extensions live in `tailwind.config.js`; base rules and custom font classes live in `src/index.css`.
- GSAP drives the `TextLoop` sale ticker and the staged entrance timeline in `src/App.tsx`. Lucide provides icons. `src/utils/audio.ts` provides synthesized interaction sounds.
- Three.js, React Three Fiber, and Drei are installed, but the active storefront uses 2D image assets. `src/hooks/useGarmentModel.ts` and `src/utils/textureGenerator.ts` are legacy/unused 3D helpers; do not assume a live 3D scene exists.
- No router, test framework, lint script, persistent database, payment SDK, or deployment configuration is currently defined.

## Architecture and data flow

- `src/data/garments.ts` is the seven-product catalog. `src/types.ts` defines garment, cart, customer, and order shapes. Public image paths in the catalog map to `public/garments/<id>/{side,front,back}.png`; each product also has a separate `campaign-front.webp` render for its detail stage. The original transparent `campaign-front.png` files are retained as source assets. Preserve the original angle assets for the hanging rail and back/side views.
- `src/App.tsx` owns rail hover, selected product, and menu state. It also accepts `?hover=<id-or-index>`, `?detail=<id-or-index>`, and product `?angle=front|side|back` query parameters for direct viewing.
- `src/components/HangingRail.tsx` handles pointer tracking and item spacing. `GarmentCard.tsx` renders the image transition and visual hanger. `ProductDetailDrawer.tsx` handles angles, sizes, specifications, and add-to-bag.
- `src/context/CartContext.tsx` owns bag, checkout, confirmation, totals, and the `the_archive_cart_v1` localStorage value. `src/utils/pricing.ts` defines the advertised 20% sale and is shared by client and demo API. `CartDrawer.tsx`, `CheckoutModal.tsx`, and `OrderConfirmationModal.tsx` consume cart state.
- `src/utils/api.ts` calls same-origin `/api/*` endpoints, with a client-side demo checkout fallback when the API is unavailable.
- `src/server/apiPlugin.ts` installs in-memory API middleware **only on the Vite development server**: health, payment config, cart, checkout, and order lookup. Cart and order records disappear when the server restarts. The cart is a process-wide variable rather than an isolated user session.
- `vite.config.ts` installs the React and demo API plugins. `public/studio-stage.jpg` is the active scene background.

## Design guidelines

- Preserve the current studio/editorial visual language: warm concrete photographic stage, hanging product silhouettes, restrained motion, generous negative space, and a vivid red sale ticker.
- Use the self-hosted Anybody variable font (`public/fonts/Anybody-variable.ttf`) for wordmarks, headlines, body, and controls. Set width and weight deliberately: wide/heavy for large editorial headings, near-normal width for body. Use system monospace for small technical labels and prices. The font is under the SIL Open Font License, included at `public/fonts/OFL-Anybody.txt`.
- The storefront is intentionally full-viewport. The product detail stage carries a subdued studio image and a warm paper information panel; bag and checkout use near-black surfaces, fine borders, white text, and small uppercase labels. Tailwind's `studio` colors define the base palette.
- Keep the rail aligned with the rod in `studio-stage.jpg`, and verify layout across desktop and narrow viewports before changing positioning, image dimensions, or breakpoints.
- Keep controls keyboard accessible with visible focus states and usable labels. Respect reduced-motion preferences when adding animation.
- Keep garment cutouts transparent and consistent across views. Check every referenced angle asset before adding a product.
- Campaign fronts are generated transparent editorial product renders, not verified photographs of manufactured inventory. Keep the catalog silhouettes, color, and defining details faithful. Before selling real inventory, replace or approve these renders against physical samples. Do not reuse Pinterest imagery without explicit rights.
- Keep the entrance under about two seconds, wait only briefly for critical visual assets, and use `gsap.context()` cleanup so React StrictMode cannot leave duplicate timelines. Honor `prefers-reduced-motion`; keep rail swiping under direct user control.
- Side and front garment cutouts already include their own hanger hooks. Do not draw a second hook over them; align the built-in hook to the photographed rail. On mobile the initial rail framing shows the first garment beside the centered second garment, with horizontal scrolling for the rest.

## Coding conventions

- Use typed React function components and the existing named component exports; keep shared domain shapes in `src/types.ts`.
- Keep catalog content in `src/data/garments.ts` and public assets under `public/garments/`. Use stable garment IDs and asset paths.
- Use Tailwind utilities for component layout and styling; reserve `src/index.css` for shared base styles and reusable custom classes.
- Keep React state local unless multiple commerce components need it, in which case use `CartContext`.
- Do not introduce a new backend, payment provider, router, or large dependency as an incidental cleanup. Discuss product and architecture changes with the user first.
- Do not describe demo orders as charged, dispatched, or emailed. Production commerce needs a real payment flow, persistent orders, and fulfillment/receipt integrations. Keep the catalog price authoritative on the server and use `src/utils/pricing.ts` for sale calculations.

## Run and verify

1. Use a current Node.js and npm installation. The inspected environment ran Node 22 and npm 10.
2. Install with `npm ci` if dependencies are absent.
3. Run `npm run dev` and open `http://localhost:5173/`.
4. Run `./node_modules/.bin/tsc --noEmit` for a source-only type check. `npm run build` runs TypeScript and Vite, writing output to ignored `dist/`.
5. Test rail hover and keyboard activation; product angles and sizes; bag quantity/removal and localStorage persistence; checkout entry; and desktop/mobile layout. `GET /api/health` should return a healthy status in dev mode.
6. `npm run preview` serves the static build. The Vite development API middleware is not part of that build, so checkout falls back to local browser storage. Do not interpret a successful demo order as a processed payment.

## Known risks and refinement targets

- The payment-config endpoint intentionally reports sandbox mode. `/api/checkout` validates catalog items and prices, but **never charges a card**. Never market this as live checkout without implementing and verifying a provider end to end.
- Demo orders exist only in memory while the dev server runs. The process-wide cart and basic customer validation are unsuitable for production. The Vite dev server is bound to loopback by default.
- The client creates a local demo order only when the API is unreachable or a static preview responds without JSON. JSON API errors are shown to the user.
- The mobile rail scrolls horizontally with snap points; verify rail alignment and product panel layout on narrow and short screens whenever assets or spacing change.
- Dialogs share a focus trap through `src/hooks/useDialogFocus.ts`; continue checking keyboard and screen reader behavior when controls change.
- No automated test or lint command is configured. Add coverage around real behavior when implementation work is approved.
