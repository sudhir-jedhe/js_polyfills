# Interview Q&A: Environment Variables & Security

**Q: What does the `NEXT_PUBLIC_` prefix actually do?**
A: It tells Next.js to inline that variable's value directly into the client-side JavaScript bundle at build time, as a literal string. Without the prefix, a variable is only available in server-side code and resolves to `undefined` if referenced from a Client Component.

**Q: If a secret key is accidentally given a `NEXT_PUBLIC_` prefix and deployed, is removing the prefix and redeploying sufficient to fix it?**
A: No. The value was already compiled into a previous build's bundle and served to every visitor — removing the prefix stops *future* builds from exposing it but does nothing to un-expose the value that already shipped. The affected credential must be rotated (regenerated at the source, e.g., in the payment provider's or API's dashboard) in addition to fixing the code.

**Q: Why doesn't referencing a server-only env var from a Client Component throw an error?**
A: Because Next.js's build-time inlining simply doesn't include non-prefixed variables in the client bundle at all — there's no runtime check or guard, the reference just resolves to `undefined` like any other undefined property access. This is a deliberate design choice (fail silently/safely rather than expose or crash) but means the mistake can go unnoticed without explicit review.

**Q: Give an example of a value that's safe to expose as `NEXT_PUBLIC_` even though it looks like a credential.**
A: A Stripe *publishable* key (`pk_live_...`) is explicitly designed by Stripe to be public — it can only be used to create tokens/payment intents client-side and can't move money or read sensitive account data on its own. This is different from Stripe's *secret* key (`sk_live_...`), which must never be client-exposed. The naming convention itself (publishable vs. secret) is usually the vendor's own signal for which values are safe to expose.
