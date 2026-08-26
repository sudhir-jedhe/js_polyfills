# Which of these two setups handles `/docs` (no further path)?

Setup A:
```
app/docs/[...slug]/page.tsx
```

Setup B:
```
app/docs/[[...slug]]/page.tsx
```

A team has both a route at `app/docs/page.tsx` (a landing page) AND `app/docs/[...slug]/page.tsx` in the same project. Does this cause a conflict?

**Answer:** No conflict — `[...slug]` (Setup A, non-optional catch-all) never matches the bare `/docs` path, because a catch-all requires **at least one** segment after it. `/docs` alone is served by `app/docs/page.tsx`, and `/docs/anything/here` is served by `app/docs/[...slug]/page.tsx`. They partition the URL space cleanly. Setup B (`[[...slug]]`, optional catch-all) would be a genuine conflict if `app/docs/page.tsx` also existed, because the optional catch-all *already* matches the bare `/docs` path on its own — having both is redundant, and in practice you'd typically use `[[...slug]]` specifically to avoid needing a separate root `page.tsx`, letting one component own both the root and nested cases.

**Why:** The non-optional catch-all (`[...slug]`) and a static sibling `page.tsx` are a legitimate, common pairing: the static page owns the "index/root" URL and the catch-all owns everything with depth. The optional catch-all is a different tool entirely — it's for when the root and the nested pages should share identical logic/component (e.g., a category browser where "all categories" and "electronics > laptops" render through the same code path with different filtering). Reaching for `[[...slug]]` when you actually want a distinct root page (different UI, different data shape) creates an awkward component that has to branch heavily on whether `slug` is `undefined`; reaching for `[...slug]` plus a sibling `page.tsx` when you actually wanted shared logic creates unwanted duplication between the two files. The interview signal here is recognizing this is a design decision, not just a syntax choice.
