# Interview Q&A: Performance and Anti-Patterns

**Q: Why is "keep middleware fast" repeated so often as a rule, rather than just being general good-practice advice?**
A: Because middleware executes on every matched request — not once per session or once per user, but on every navigation, prefetch, and reload within its scope. A DB query or slow external call that would be a minor inefficiency in a single page load becomes a compounding tax across an entire session when placed in middleware, since it runs before literally every page transition in that scope.

**Q: A teammate wants to add a full user-profile DB lookup in middleware to personalize a header banner across the whole site. What's the concern, and what would you suggest instead?**
A: The concern is adding a DB round trip (with its latency and connection/load implications) to every single request site-wide, for something that's presentational, not routing-critical. Suggest moving the personalization into the actual page/layout that renders the banner (a Server Component fetching that data once for that render), and reserving middleware for the narrower job of routing decisions — reading a lightweight cookie/JWT claim if some personalization *does* need to influence routing (e.g., rewriting to a personalized landing variant), rather than the full DB fetch itself.

**Q: What's wrong with putting rate-limiting logic that calls an external Redis-backed service in middleware?**
A: In principle, nothing — it's actually one of the better-justified uses of an external call in middleware, since the entire point is to reject abusive traffic before it reaches your main compute. The real risk is doing it *without* a tight timeout and fallback behavior: if the rate-limit service is slow or down, every request site-wide inherits that latency or failure unless you explicitly fail open (allow the request through) with a short timeout, rather than letting a hung external call block every visitor.

**Q: How would you explain to a junior engineer why an "auth check" they wrote in middleware silently didn't work in production, even though it looked correct?**
A: Ask to see the actual returned value of every code branch. A very common version of this bug is a branch that does real work (logs, computes something) but forgets to explicitly `return NextResponse.redirect(...)` or similar — an implicit `undefined` return is treated as "let the request through," so the check silently no-ops with zero errors or warnings, which is why it's easy to miss without specifically testing that the block actually happens.
