# Toolchain baseline

Next.js 16.4.4, React 19.3.1, Zustand 5.0.16 and TypeScript 6.0.3 use Node 22.23.1 and npm 10.9.8. Versions are exact in the manifest/lockfile, and peer resolution is explicitly non-legacy in repository config.

The [official Next.js ESLint guide](https://nextjs.org/docs/app/api-reference/config/eslint) supports ESLint 10, but documents stale peer declarations in some plugins bundled by `eslint-config-next`. We use the official `@next/eslint-plugin-next` directly with its recommended/Core Web Vitals rules, current TypeScript ESLint recommended rules and current React Hooks recommended rules. This keeps a maintained ESLint 10 baseline and valid required peer graph, without forced dependency metadata or an end-of-life linter. `npm ci` and `npm ls` are checked explicitly. Rendered accessibility is additionally verified through Axe and keyboard journeys.

At setup, `npm audit --omit=dev` reports zero vulnerabilities. The complete audit reports moderate minimatch glob-amplification advisories in development lint dependencies. These tools consume repository file patterns, not public request inputs. No force-downgrade or incompatible global dependency override hides those findings. The exact result is rechecked at release.
