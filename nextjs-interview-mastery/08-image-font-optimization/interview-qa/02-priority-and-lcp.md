# Interview Q&A: `priority` and LCP

**Q: What does the `priority` prop actually do under the hood?**
A: Two things: it disables lazy loading for that specific image (equivalent to `loading="eager"`), and it injects a `<link rel="preload">` hint into the document `<head>`, telling the browser to start fetching that image as early as possible in the load sequence — often before the HTML parser would otherwise even reach the `<img>` tag in the body. The preload hint is frequently the larger of the two effects on real LCP timing.

**Q: How many images on a page should typically be marked `priority`?**
A: Usually one, occasionally a small handful — specifically the actual LCP candidate(s), most often a single hero/banner image. Marking every image `priority` defeats the purpose: all images then compete eagerly for bandwidth at once, which can measurably regress LCP rather than improve it, on top of losing the bandwidth-saving benefit of lazy-loading below-the-fold content.

**Q: An image loads fast once its network request starts, but LCP is still poor. What's the likely diagnosis?**
A: The delay is probably in *when* the request starts, not how long it takes — check first whether the image is missing `priority` (so it's waiting on lazy-loading/viewport-intersection logic to trigger the fetch) and second whether the image URL is only known after a client-side data fetch resolves (meaning the browser can't even discover the URL until JS hydrates), rather than being present in the server-rendered HTML from the start.

**Q: Does `priority` help with CLS as well as LCP, or only LCP?**
A: `priority` itself is purely about load timing (LCP); it doesn't directly affect CLS. CLS prevention comes from the required `width`/`height` (or `fill` + sized container) reserving layout space ahead of time — a `priority` image without correct dimensions would load faster but could still cause layout shift, which is why the two are always discussed together: `priority` for when it loads, dimensions for how much space it reserves while loading.
