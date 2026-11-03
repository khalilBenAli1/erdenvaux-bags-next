# Architecture and data flow

ErdenVaux is a fictional portfolio application, created November 2026. Next.js 16.4.4 exports static HTML and navigation payloads; GitHub Pages needs no runtime application server. The store and checkout use browser-local behavior without an API or payment integration.

## Responsibilities

`src/data/products.ts` defines eight typed products and ten variants matching the approved media brief. A contract test verifies names, identities, materials, colours, cents, body dimensions, stock and local image files. Product photos keep 4:5 frames; campaigns keep 2:3. No unrelated photo stands in for another product or view.

`src/domain/` owns pure stock/quantity transitions, selection identity, integer-cent totals, delivery fixtures, common email/contact validation, persisted-envelope validation and immutable confirmation creation. It imports no React, DOM or storage. Prices are resolved from catalog fixtures rather than accepted from saved data.

`src/state/commerce-store.ts` creates a new Zustand vanilla store for every provider. Arrays are copied at initialization and restoration. Cart/wishlist selectors expose source state; counts, line amounts and totals are derived. `CommerceProvider` restores only after mounting so the server and first client render agree. Server Components never read or mutate customer selections.

`src/adapters/persistence.ts` owns the storage boundary. Only `erdenvaux-selections-v1` is read/written, and only a versioned cart/wishlist envelope is serialized. IDs, variant identity, safe integer quantities, current stock, duplicate keys, allowed fields and size bounds are checked. Malformed/unknown versions recover to a fresh selection; unavailable storage keeps the current visit usable. No clear-all call or unrelated-key enumeration is used. A browser sentinel proves another demo’s key survives reset.

`src/hooks/use-url-state.ts` publishes a stable search-string snapshot with an empty server snapshot. Each event reads the current browser URL before synchronously pushing/replacing and notifying subscribers. Rapid same-turn filters compose correctly rather than deriving from a stale render snapshot. Back/reload remain meaningful.

`src/components/ui/Dialog.tsx` owns controlled native modal behavior. Explicit button, backdrop or cancel intent changes the caller’s local state. Passive native `close` events do not drive that state, so an old queued close cannot dismiss a reopened view. Opening controls explicitly focus themselves for WebKit parity; Tab/Escape and opener restoration are exercised in browser tests. Transform-only motion retains stable contrast and respects reduced motion.

`src/features/` separates collection controls/cards, product selection/gallery, bag/wishlist, and focused delivery/details/review/confirmation steps. Routes retrieve data and compose these features. Temporary dialogs, quantity requests and form inputs remain local. Contact fields and confirmation are never persisted.

The checkout hook validates details before review. `createConfirmation` copies and freezes customer, line, delivery and totals data before clearing the shared bag. The rendered outcome reads that snapshot, not the newly emptied store. Resetting shared selections cannot alter it.

## Rendering and graphics

`output: 'export'`, `basePath: '/erdenvaux-bags-next'` and `trailingSlash: true` generate eight direct product routes and supporting pages. The preview serves those actual files, including a404 fallback. Next links receive the configured base automatically; local image paths include it explicitly. `next/image` is unoptimized for static hosting, inside a picture source with real 640/1200px candidates. No image optimization server is required.

The comparison uses a common five SVG units per centimetre, baseline 230 and a 50-unit 10 cm ruler. Body bounding boxes match the fixture width/height; visible HTML also gives depth. Handles are illustrative and excluded. Browser geometry checks verify actual SVG bounds and the shared screen transform.

SVG title/description metadata uses one string child. React 19 otherwise renders an interpolated title array as empty SSR title markup and produces a hydration mismatch. A cold export and default/query renders in Chromium/WebKit were checked after this fix; IDs and geometry were retained. [React’s primary title guidance](https://react.dev/reference/react-dom/components/title#use-variables-in-the-title).

Bodoni Moda and Manrope are self-hosted through Next local fonts with OFL notices. The full rendered UI uses these two intentional families. [Asset provenance](../ASSETS.md) documents the original generated imagery and researched official references.

## Verified limits

The release matrix includes 48 unit tests and 27 browser checks across Chromium, WebKit and touch emulation: buying simulation, stock/cents, strict stored-field mutations and blocked/corrupt data, store isolation, saved variant reload, unrelated-key reset survival, rapid URL updates, late native close, SVG scale, keyboard/focus, Axe, all direct HTML routes and assets, reduced motion, clientWidth reflow and exact 200% critical text with maximum valid content.

Physical devices and screen readers remain unverified. The form supports common unquoted email addresses with explicit length/character checks, not a complete RFC/DNS service. Generated imagery is conceptual. No real purchase, delivery or external submission occurs. Development-only dependency advisories are recorded in [TOOLCHAIN.md](TOOLCHAIN.md).
