# Interview Q&A: Choosing Route Handler vs. Server Action

**Q: Your team built a "contact us" form as a Server Action. Marketing now wants to embed the same form on a separate marketing microsite hosted outside this Next.js app. What changes?**
A: The Server Action can't be called cross-origin/cross-app the way it currently works — it's bound to this app's internal action-invocation mechanism. You'd expose the underlying submit logic as a Route Handler (`POST /api/contact`) instead, so the external site can `fetch()` it directly, and keep (or drop) the original Server Action for the in-app form, ideally both calling a shared `submitContactForm()` service function so validation logic isn't duplicated.

**Q: Is it ever correct to use a Route Handler for a same-app form instead of a Server Action?**
A: Yes — when you need behaviors Server Actions don't give you cleanly, such as custom response headers, streaming responses, file downloads with `Content-Disposition`, or very fine-grained HTTP status code control beyond success/error. A CSV export triggered by a button click is a good example: it's same-app, but it's really "give me a file," which maps more naturally to a Route Handler response than to a form action's state-return model.

**Q: Do Server Actions support GET-like read-only data fetching?**
A: Not really, and you shouldn't reach for them that way. Server Actions are designed around React's mutation-triggering action model (form submissions, imperative calls that change state) — they don't have caching semantics, they're always a POST-shaped request under the hood, and using them for "fetch some data" fights the model. Reads belong in Server Components using `fetch`/DB calls directly (with Next's fetch cache), or in a `GET` Route Handler when the read needs to be externally addressable.

**Q: How would you explain the tradeoff in one sentence to a junior engineer?**
A: "If someone outside your own React component tree — a mobile app, a webhook, another service — needs to call this, it's a Route Handler; if it's a mutation triggered by your own UI and nobody outside your app needs a stable URL for it, it's a Server Action."
