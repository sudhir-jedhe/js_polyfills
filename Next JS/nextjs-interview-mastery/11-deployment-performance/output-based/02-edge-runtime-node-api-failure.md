# Why does this route fail only in production, not in local dev?

```ts
// app/api/thumbnail/route.ts
export const runtime = 'edge';

import sharp from 'sharp'; // native image-processing library with C++ bindings

export async function POST(request: Request) {
  const buffer = await request.arrayBuffer();
  const thumbnail = await sharp(Buffer.from(buffer)).resize(200, 200).toBuffer();
  return new Response(thumbnail, { headers: { 'Content-Type': 'image/png' } });
}
```

A developer tests this locally with `next dev` and it appears to work (or at least doesn't obviously crash in the way they expect). After deploying, requests to this route fail.

**Answer:** `sharp` relies on native Node.js bindings (compiled C++ addons) to do its image processing, which are fundamentally incompatible with the Edge Runtime's execution model — Edge Runtime doesn't support native modules at all, only pure JavaScript/WebAssembly running inside a V8 isolate. In many deployment environments this fails at the build/bundling step (the bundler can't resolve `sharp`'s native binary for an Edge target) or at request time with an error indicating the module isn't supported — either way, the request never completes successfully once actually deployed to an edge-executed environment. Local `next dev` may behave inconsistently here because the dev server doesn't always fully emulate every constraint of the deployed Edge Runtime the same way the production build/deploy pipeline does.

**Why:** This is exactly the tradeoff the Edge Runtime theory file describes: no Node-native APIs, no native module bindings. The fix is either (1) remove `export const runtime = 'edge'` and let this route run on the default Node.js runtime, where `sharp` works fine, or (2) if Edge's latency/locality benefits are genuinely needed for this endpoint, replace `sharp` with a WebAssembly-based or pure-JS image processing approach compatible with Edge (or offload the actual processing to a separate Node.js/serverless function and use the Edge route only as a thin proxy). The broader lesson: adding `export const runtime = 'edge'` to an existing Route Handler isn't safe to do reflexively for a latency win — every dependency that handler pulls in needs to be Edge-compatible, and that has to be verified, not assumed.
