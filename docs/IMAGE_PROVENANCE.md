# ErdenVaux image provenance

ErdenVaux is an original fictional portfolio brand. These are newly generated illustrative photographs, not real commercial products, client campaigns, heritage claims, celebrity endorsements or photographs copied from another business. No Atelier No.8 imagery was reused.

## Production and references

All twelve selected assets were created with the built-in OpenAI ImageGen tool on 2026-11-03, in twelve separate calls: eight original canonical product photographs, two canonical variant edits and two referenced campaign images. The CLI/API-key fallback was not used.

- Pleat 01 Oxblood is a targeted color edit of the generated canonical Ink photograph. Fold geometry, grain, handle and silver hardware were retained.
- Meridian 02 Espresso Suede is a material/color edit of the canonical Oxblood Smooth photograph, retaining the elongated silhouette and silver fittings.
- The fashion campaign depicts an original, fully clothed adult model carrying the canonical Ink Pleat 01. The model is synthetic and is not presented as a real ambassador or customer.
- The object campaign uses the canonical Oxblood Pleat 01 in a new dark architectural still-life composition.
- All referenced canonical images were inspected before being passed to the tool. All twelve selected outputs were visually inspected for subject, material/color, product identity, complete framing, silver hardware and absence of text/logos/watermarks.

Exact prompts, reference relationships, source-master locations, source dimensions, output dimensions, file sizes and SHA-256 checksums are recorded in [image-prompts.json](image-prompts.json). Master locations use `$CODEX_HOME` so the manifest does not publish a machine-specific home directory. Raw PNG masters remain outside this repository; only the optimized WebP assets are shipped.

## Web delivery

Canonical product photographs: full 1200×1500px and small 640×800px. Campaign portraits: full 1200×1800px and small 640×960px. Every canonical basename has a `-small.webp` sibling. Sharp 0.35.5 performed proportional contain resizing and WebP encoding at quality 83 / effort 6 only; semantic editing and variant recoloring were performed through ImageGen.

The native product masters are 1122×1402px and campaign masters 1024×1536px. Normalization to the requested 1200px delivery width includes modest upscaling; it is not a claim of native 4K imagery. Small variants are resized from the selected native masters. No product/handle was cropped out during delivery conversion.

All 24 delivered WebP files total **1,056,432 bytes** (about 1.06 MB). No image needs a remote host or local filesystem path at runtime.

| Asset                     | Full bytes | Small bytes | Reference / role              |
| ------------------------- | ---------: | ----------: | ----------------------------- |
| `pleat-ink`               |     89,198 |      25,684 | Original canonical photograph |
| `meridian-oxblood`        |     33,000 |      12,632 | Original canonical photograph |
| `halo-ivory`              |     38,402 |      16,382 | Original canonical photograph |
| `vessel-tobacco`          |     67,420 |      18,924 | Original canonical photograph |
| `fold-stone`              |     37,362 |       9,078 | Original canonical photograph |
| `passage-ink`             |     76,522 |      21,814 | Original canonical photograph |
| `trace-cognac`            |     77,148 |      24,308 | Original canonical photograph |
| `column-graphite`         |     31,438 |      10,076 | Original canonical photograph |
| `pleat-oxblood`           |     87,486 |      27,906 | pleat-ink                     |
| `meridian-espresso-suede` |     39,124 |      12,942 | meridian-oxblood              |
| `campaign-fashion`        |     86,730 |      29,842 | pleat-ink                     |
| `campaign-object`         |    138,106 |      44,908 | pleat-oxblood                 |

## Integration notes and limits

- Use each product/variant photograph only for its matching fixture. Espresso Suede is intentionally supplied even though that fixture is sold out.
- The campaign portraits retain a complete bag; preserve the portrait composition when laying them out. The fashion bag sits in the lower part of the image, so wide crops can remove it.
- A gallery zoom/crop from a canonical photograph is the same photograph, not a separately photographed back or side view. Label it accordingly.
- The fictional body dimensions in PRODUCT_IMAGE_BRIEF.json exclude handle drop. These generated photographs are illustrative and are not calibrated measurement evidence; the app's common-scale comparison should use the fixture centimetres directly.
- Generated imagery is documented separately from the original application code license. It does not imply a real product, real model endorsement, real company history or a warranty of unique copyright rights. Font licensing is maintained by the app owner.
