# Implementation boundaries and acceptance notes

- `src/data/products.ts`: eight typed canonical fixtures, preserving the media brief's ten exact variant identities, stock, cents and body dimensions. Enrich with original prose and short silhouette categories; do not change media identity.
- `src/domain/`: pure bag line transitions, wishlist transitions, integer cents pricing, allowed delivery fixtures, contact validation, deep immutable order snapshot, and saved-envelope validation. No React, DOM or storage calls.
- `src/state/`: Zustand vanilla factory per provider; separate cart/wishlist arrays and persistence readiness. Derive totals/counts in selectors/consumers, never store duplicate money. Server and first client render start empty; restore only in a client effect.
- `src/adapters/persistence.ts`: custom StorageLike boundary. Version1 strict whitelist of version/cart/wishlist, known product+variant IDs, safe integer quantities within stock, no duplicates, bounded arrays/serialized size. Unknown/corrupt/blocked storage recovers visibly and safely. Store no contacts or confirmations.
- `src/hooks/use-url-state.ts`: useSyncExternalStore for a stable search-string snapshot and an empty server snapshot. Every filter/variant event reads a fresh window URL at event time before synchronous push/replace and a custom notification. This preserves same-turn composed updates and Back/reload without stale closures.
- `src/components/ui/Dialog.tsx`: controlled native dialog, state changed only by explicit close/backdrop/cancel intent. Ignore passive native close events. Effect opens/closes and restores opener focus; keyboard Tab handling remains consistent across engines.
- `src/features/catalog/`: URL filter/sort panel, result count, product cards and intentional empty/reset state. Static server content remains useful before hydration.
- `src/features/product/`: local selected variant/quantity feedback, accurate variant image, full/photo-detail gallery (honest crop labels), typed stock guards, wishlist, and size comparison. No global store for dialog/hover/input state.
- `src/features/bag/`: shared line rendering and quantity/removal bounds, empty state, header-controlled drawer, full bag route and derived subtotal. Delivery is selected in checkout rather than silently assumed.
- `src/features/checkout/`: local hook orchestrates delivery/details/review/confirmation; focused step components; pure validators outside markup. No cards or transmission. Confirmation is a deep-frozen copy of lines, customer, delivery and totals prepared before the bag is cleared. Resetting shared selections must not change it.
- `src/app/`: server route composition, eight generated product paths, metadata/sitemap/robots, story/size-guide/collection/bag/wishlist/checkout and 404. Native Next static export uses basePath/trailingSlash and an actual file/directory preview, never an SPA fallback.

## Visual composition

Restrained Bodoni Moda wordmark plus Manrope navigation. A centered, generous asymmetric paired-portrait campaign: the adult-model fashion image stays at2:3 to retain the canonical bag near the lower portion; the Oxblood object portrait provides the second image. Display heading occupies the upper portion of the smaller right column. Preserve both portraits, fine rules, large margins, no beige-linen accessories imagery or split hotel hero. Follow with a four-piece product edit, a concise material story, collection link and restrained oxblood footer. Mobile retains two staggered portrait columns with a smaller display heading; essential controls remain44px.

## Verification that must stay meaningful

Pure tests: variant merging/separate identities; safe integer stock bounds; removal/reset; cents delivery totals; pure contact length/allowlist validation; strict persisted-field mutations; unknown version/corrupt/blocked storage; independently created stores; frozen confirmation after cart changes.

Browser: discovery→variant→quantity→bag→delivery→details→review→local confirmation; reload and stock states; wishlist; rapid same-turn URL changes; Back/reload/empty reset; late native close after reopening; keyboard focus/Escape; actual touch-mobile; narrow390/768/1440 and320; maximum-length unbroken name/email; stressed product copy; doubled critical text; Axe and reduced motion. Always compare documentElement.scrollWidth with clientWidth, and fix wrapping rather than hide overflow.
