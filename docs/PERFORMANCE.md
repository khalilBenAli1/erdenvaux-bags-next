# Actual production payloads

Measured from the local production export in November 2026 using `npm run build` and `node scripts/measure-build.mjs`. Gzip values are local compression estimates, not promised network transfer sizes or Lighthouse scores. Chunk names and small byte differences may change with build metadata/toolchain versions.

| Export category                                  | Files | Raw bytes |   Local gzip bytes |
| ------------------------------------------------ | ----: | --------: | -----------------: |
| All JavaScript chunks                            |    19 |   672,385 |            209,105 |
| CSS                                              |     5 |    35,552 |              8,954 |
| Generated HTML, including framework error copies |    18 |   445,034 |             93,245 |
| Static navigation/route payloads                 |    65 |   445,302 |            129,700 |
| Responsive WebP imagery                          |    24 | 1,056,432 | Already compressed |
| Self-hosted WOFF2                                |     2 |    71,096 | Already compressed |

There are sixteen logical HTML routes in the browser audit; the export also contains framework error-route copies. All eight product paths are generated individually.

| Representative route | HTML bytes | Modern initial JavaScript references | JS raw bytes | JS local gzip bytes |
| -------------------- | ---------: | -----------------------------------: | -----------: | ------------------: |
| Home                 |     31,798 |                                    8 |      503,475 |             151,613 |
| Collection           |     27,798 |                                    8 |      508,310 |             153,107 |
| Pleat 01             |     31,888 |                                    8 |      511,244 |             153,846 |
| Checkout             |     15,463 |                                    8 |      517,328 |             155,309 |

These per-route values count unique modern script references in generated HTML, excluding `nomodule` scripts. They do not count later prefetch/navigation requests as initial scripts. Next/React provide the framework baseline; route-specific client features add to it. The static HTML/navigation payloads are reported separately rather than pretending that a stateful shopping app ships no JavaScript.

The largest image is the 1200×1800 Oxblood campaign portrait at 138,106 bytes. Full product images are 1200×1500, small products 640×800; campaigns are 2:3. The complete 24-image set totals about 1.01 MiB, while visitors select responsive candidates rather than download every size. Gallery details reuse their selected variant’s photograph.

Bodoni Moda WOFF2 is 46,260 bytes; Manrope is 24,836 bytes. Both are local/preloaded by Next’s font support; no external font service is requested. Main campaign/product images are eager, other media is lazy, and intrinsic dimensions reserve layout space. No real-device speed score is claimed.
