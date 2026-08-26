# Interview Q&A: Dynamic Segments

**Q: What's the difference between `[slug]`, `[...slug]`, and `[[...slug]]`?**
A: `[slug]` matches exactly one path segment and returns a `string`. `[...slug]` (catch-all) matches one or more segments and returns a `string[]`; it does not match the parent path with zero segments. `[[...slug]]` (optional catch-all) matches zero or more segments, so it also matches the parent path itself, and returns `string[] | undefined` — `undefined`, not an empty array, when nothing is captured.

**Q: Can you have two dynamic segments with different names as siblings at the same folder level, like `app/[id]/page.tsx` and `app/[slug]/page.tsx`?**
A: No — that's a build error. Both would match the exact same set of single-segment URLs, and Next.js has no way to route between them since the param *name* doesn't affect matching, only the segment shape does. You need to disambiguate with a static prefix, e.g. `app/user/[id]` and `app/post/[slug]`.

**Q: Are `params` values ever anything other than strings?**
A: For a single segment (`[slug]`) it's always `string`. For a catch-all or optional catch-all it's `string[]` (or `undefined` for the optional variant when nothing matches). Never numbers, booleans, or parsed objects — any typed value you need (an integer ID, a date) has to be parsed and validated explicitly in your component.

**Q: If I need a route like `/blog/2024/03/my-post`, would you use `[slug]` or `[...slug]`?**
A: Depends on whether the shape is fixed. If every blog URL has exactly year/month/post-slug, a nested folder structure of three single dynamic segments (`[year]/[month]/[slug]`) is more precise and gives you three distinctly-typed params. If the depth genuinely varies (some posts nested under a category, some not), `[...slug]` is the right tool since it doesn't assume a fixed depth.
