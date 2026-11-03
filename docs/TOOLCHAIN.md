# Toolchain baseline

Next.js 16.4.4, React 19.3.1, Zustand 5.0.16 and TypeScript 6.0.3 use Node 22.23.1 and npm 10.9.8. Versions are exact in the manifest/lockfile, and peer resolution is explicitly non-legacy in the repository config.

The [official Next.js ESLint guide](https://nextjs.org/docs/app/api-reference/config/eslint) explicitly supports ESLint 10 starting with current Next configuration releases. Some bundled plugins still declare older peer ranges; the official guide documents the resulting package-manager warnings. We use the maintained ESLint 10 baseline and the complete recommended Next/Core Web Vitals/TypeScript rules, rather than an end-of-life linter or disabled checks.

At initial setup, `npm audit --omit=dev` reports zero vulnerabilities. The complete audit reports moderate minimatch glob-amplification advisories in development lint dependencies. These tools consume the repository's trusted file patterns, not public request inputs. No force-downgrade or incompatible global dependency override is applied to hide those findings. The exact result will be rechecked at release.
