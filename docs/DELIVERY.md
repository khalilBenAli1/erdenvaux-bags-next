# Verified delivery

ErdenVaux is an original fictional luxury bags application created in November 2026.

- [Public demo](https://khalilbenali1.github.io/erdenvaux-bags-next/)
- [Public source](https://github.com/khalilBenAli1/erdenvaux-bags-next)
- [Feature PR](https://github.com/khalilBenAli1/erdenvaux-bags-next/pull/1), normal-merged with milestone history preserved
- Verified application merge: `b0a07fd5554240c6f1a9afc249222b5571afa793`
- [Successful quality and Pages deployment](https://github.com/khalilBenAli1/erdenvaux-bags-next/actions/runs/41589111622)

## Evidence

A clean pinned install and required lint peer graph, lint/format checking, strict type generation/TypeScript, 48 unit tests, cold static export, and all 27 browser checks passed before the candidate was merged. Main repeated those checks before Pages publication.

All 27 checks were then run against the actual public URL and passed in Chromium, WebKit and touch-emulated Chromium in 49.6 seconds. This includes discovery/variant/stock/quantity/selection persistence, wishlist reload, a complete delivery/details/review/demo confirmation, no contact payload or mutation request, immutable confirmation after reset, another demo’s storage sentinel, rapid same-turn URL updates, late native close after reopening, actual SVG bounds and shared scale, keyboard/focus, native taps, reduced motion, Axe, all 16 logical HTML routes/assets, clientWidth at 320/390/768/1440, maximum valid details and exact 200% critical text.

Independent cold/default/query verification in Chromium and WebKit confirmed populated SVG metadata and no hydration errors. Additional public checks confirmed anonymous direct product HTML, sitemap/media access, a real HTTP404 for an unknown path and working navigation back to the collection. Fonts and local images load without broken requests.

The live default campaign captures are [desktop](screenshots/home-desktop.png) and [mobile](screenshots/home-mobile.png). Other actual production captures show [product](screenshots/product-desktop.png), [comparison](screenshots/size-guide-desktop.png), [bag](screenshots/bag-desktop.png) and [checkout desktop](screenshots/checkout-desktop.png)/[mobile](screenshots/checkout-mobile.png). The campaign’s internal visual verdict is 95/100; it is not a performance or accessibility certification.

[Architecture](ARCHITECTURE.md), [real payload measurements](PERFORMANCE.md), [toolchain limitations](TOOLCHAIN.md) and [asset/font provenance](../ASSETS.md) are included. No external deployment blocker remains. Physical device/screen-reader verification was not performed. Twelve moderate development lint advisories remain; the production dependency audit reports zero. No real commerce is connected.
