# 11 — Deployment & Performance

Shipping a Next.js app well requires understanding the tradeoffs baked into build/deployment configuration (Node server vs. static export), the sharp security boundary around environment variables, how the App Router's automatic code-splitting and Server Components affect what actually ships to the browser, the Edge-vs-Node runtime tradeoff, and Core Web Vitals as a concrete, diagnostic framework for "is this fast" — tying directly back to rendering strategy (topic 02) and image/font optimization (topic 08).

## Key takeaways

- `output: 'export'` produces a fully static site with no server requirement, but it's an all-or-nothing setting: no request-time Server Component data, no Route Handlers, no ISR, no Middleware, and `next/image`'s built-in optimizer needs `unoptimized: true` or a third-party loader.
- Only `NEXT_PUBLIC_`-prefixed environment variables are inlined into the client bundle; everything else resolves to `undefined` client-side, silently rather than with an error. Accidentally prefixing a secret exposes it permanently in every past build — removing the prefix afterward requires also rotating the credential, not just fixing the code.
- Code-splitting is automatic per route in the App Router, and Server Components ship zero JS by default — the biggest bundle-size lever is often the *scope* of `'use client'` boundaries, not manual splitting. `@next/bundle-analyzer` is the practical tool for finding unexpected bloat (barrel imports are a classic culprit).
- Edge Runtime trades a full Node.js environment for lower cold-start latency and global proximity to users — it only supports Web-standard APIs, with no Node-native modules or native-binding packages. Middleware always runs on Edge, with no opt-out.
- Core Web Vitals (LCP, CLS, INP) give performance a measurable definition that maps directly onto specific fixes: LCP → rendering strategy and `next/image priority`; CLS → reserved image/font dimensions; INP → client bundle size and event-handler cost.

## Index

### theory/
- `01-build-output-types.md`
- `02-environment-variables-and-security.md`
- `03-bundle-analysis-and-code-splitting.md`
- `04-edge-vs-nodejs-runtime.md`
- `05-core-web-vitals-framework.md`

### snippets/
- `01-next-config-static-export.js`
- `02-env-usage-client-server.tsx`
- `03-bundle-analyzer-config.js`
- `04-edge-runtime-route.ts`
- `05-node-runtime-route.ts`
- `06-web-vitals-reporting.tsx`

### output-based/
- `01-NEXT_PUBLIC-exposed-secret.md`
- `02-edge-runtime-node-api-failure.md`
- `03-static-export-dynamic-route-fails.md`
- `04-env-var-undefined-in-client-component.md`
- `05-bundle-bloat-from-barrel-import.md`
- `06-cls-from-unset-image-dimensions.md`
- `07-lcp-blocked-by-client-fetch.md`

### scenarios/
- `01-edge-runtime-migration.md`
- `02-env-secret-audit.md`
- `03-slow-page-diagnosis.md`
- `04-static-export-limitations-discovery.md`

### interview-qa/
- `01-build-output-qa.md`
- `02-env-vars-security-qa.md`
- `03-runtime-and-performance-qa.md`

### problems/
- `01-configure-edge-runtime-route.md`
- `02-audit-and-fix-exposed-secret.md`
- `03-diagnose-slow-page-and-propose-fix.md`

### assets/
- `README.md` — placeholder for original notes/images
