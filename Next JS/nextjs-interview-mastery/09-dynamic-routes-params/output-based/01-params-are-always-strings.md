# What does this render (or crash with)?

```tsx
// app/products/[id]/page.tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id > 100) {
    return <div>Premium product</div>;
  }
  return <div>Standard product</div>;
}
```

Visiting `/products/999`. What renders?

**Answer:** "Standard product" — even though 999 is clearly greater than 100.

**Why:** `params.id` is always a `string`, never coerced to a number by Next.js. `"999" > 100` triggers JavaScript's loose comparison, which coerces `100` to the string `"100"` for a **string comparison**, not a numeric one. String comparison is lexicographic: `"999" > "100"` compares character by character — `'9' > '1'` is true, so this particular case accidentally returns true... but the real trap is more subtle: try `/products/25`. `"25" > 100` coerces `100` to `"100"` and compares `"25" > "100"` lexicographically: `'2' > '1'` is true, so `"25" > "100"` evaluates `true` even though 25 is numerically less than 100. The fix is to always explicitly parse: `const numericId = Number(id); if (Number.isNaN(numericId)) notFound();` before doing any numeric comparison. This is one of the most common silent bugs in dynamic routes — nothing throws, the page just renders the wrong branch.
