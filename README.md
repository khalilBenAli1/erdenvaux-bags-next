# ErdenVaux — Form, in motion.

An original fictional luxury bags application created in **November 2026**. Eight sculptural silhouettes, ten matching variants, and a complete demo shopping journey built with Next.js App Router, React, strict TypeScript and Zustand.

![ErdenVaux fashion campaign](docs/screenshots/home-desktop.png)

[Source](https://github.com/khalilBenAli1/erdenvaux-bags-next) · [Quality and deployment](https://github.com/khalilBenAli1/erdenvaux-bags-next/actions) · [Architecture](docs/ARCHITECTURE.md) · [Asset provenance](ASSETS.md)

**[Open the live demo](https://khalilbenali1.github.io/erdenvaux-bags-next/)** — anonymously verified in Chromium, WebKit and touch emulation. [Delivery evidence](docs/DELIVERY.md).

## Explore

- An original asymmetric paired-portrait fashion campaign, Bodoni Moda display type, Manrope interface type, fine rules and ivory/ink/oxblood surfaces.
- Collection filters for silhouette, material, colour and price; sorting, empty/reset states, composed same-turn URL changes, Back and reload.
- Eight exported product routes with accurate variant imagery/materials, stock limits, quantities, saved pieces and a keyboard gallery. Detail frames are explicitly crops of the same photograph.
- A common-scale SVG comparison using actual fixture body centimetres, visible width/height/depth labels and a 10cm ruler. Handles are excluded from body dimensions.
- A variant-aware persistent bag/wishlist with versioned validation, corrupt/unknown/blocked-storage recovery and a brand-specific key that preserves other demos’ saved data.
- Delivery, validated sample details, review and a **demo confirmation**. No cards, payment, purchase or external message. Contact details remain in feature memory; the confirmation stays fixed after bag/reset changes and clears when you leave or reload.
- Page metadata, social imagery, sitemap, direct routes, reduced motion, keyboard/focus behavior and a deliberate404.

These are **fictional product concepts and illustrative prices/stock**, not a trading business or client commission. No heritage, awards, testimonials, real availability or manufacturing assurances are invented.

## Run

Node **22.23.1**, npm **10.9.8**, and the committed lockfile. No account, API key, backend or paid service is required.

```sh
nvm install
npm ci
npm run dev
```

Open `http://127.0.0.1:4202/erdenvaux-bags-next/`. Production preview uses `npm run build` followed by `npm run preview`. The preview serves actual exported files and directory routes rather than an SPA fallback.

```sh
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
npx playwright install chromium webkit
npm run test:e2e
node scripts/measure-build.mjs
```

`npm test` runs 48 domain/adapter/store tests. The 27 browser checks cover Chromium, WebKit and a touch-emulated Pixel configuration, including native taps, a full shopping/confirmation journey, stock, wishlist reload, shared-origin reset isolation, rapid filters, delayed native close, focus, all exported HTML routes, Axe, reduced motion, strict `clientWidth` at 320/390/768/1440, maximum valid contact content and exact idempotent 200% critical text.

Use **Reset demo selections** in the footer to clear this app’s bag and wishlist. It leaves other apps’ storage keys and an already displayed confirmation unchanged. The preview checkout accepts sample details only and persists none of them.

## Engineering and evidence

Pages compose focused catalog, product, bag and checkout features. Pure pricing/stock/validation/snapshot rules stay outside React; storage stays behind its adapter. A Zustand factory creates each provider’s state independently, with after-mount restoration and no mutable customer state shared by server requests. See [data flow and boundaries](docs/ARCHITECTURE.md).

Real production captures: [mobile campaign](docs/screenshots/home-mobile.png), [product](docs/screenshots/product-desktop.png), [size comparison](docs/screenshots/size-guide-desktop.png), [bag](docs/screenshots/bag-desktop.png), [checkout desktop](docs/screenshots/checkout-desktop.png), [checkout mobile](docs/screenshots/checkout-mobile.png). The approved campaign’s internal visual verdict is 95/100; this is not an accessibility certification or Lighthouse score.

[Actual payload measurements](docs/PERFORMANCE.md) include generated HTML/JavaScript/CSS, original WebP imagery and the two self-hosted WOFF2 files. [Toolchain notes](docs/TOOLCHAIN.md) explain the maintained lint configuration and documented development-only advisories.

## Scope and licenses

Original code is [MIT](LICENSE). Font SIL OFL notices and photography provenance are included in [ASSETS.md](ASSETS.md). No third-party storefront assets or private client implementation were copied.

The WCAG 2.2 AA target is supported by rendered Axe and keyboard checks; physical device/screen-reader testing was not performed. The common unquoted email format is validated without DNS/network lookup. The production dependency audit reports zero vulnerabilities; twelve moderate development lint dependency advisories remain documented. No real commerce is connected.
