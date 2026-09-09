***  07-structured-data-mismatched-content.md ***

# Output: JSON-LD Claims a Rating the Page Doesn't Show

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Trail Runner Pro",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1500"
  }
}
</script>
```

The visible page has no star rating, no review count, and no reviews section anywhere in the rendered content.

**Question:** Does adding this JSON-LD guarantee a star-rating rich result appears in search for this product?

**Answer:** No — and it risks worse than just "not working": if flagged, it can trigger a manual action / structured data penalty, since the rating data has no corresponding visible content on the page.

**Why:** Structured data is meant to describe content that's actually present and visible on the page — search engines' guidelines explicitly require this correspondence, partly enforced by both automated and manual review. Fabricated or invisible structured data (a rating shown only in markup, never to an actual page visitor) is treated as manipulative/spammy, since it attempts to influence how the page is displayed in search without providing the underlying user-facing content that would justify it. Even setting the penalty risk aside, structured data being present is necessary but not sufficient for a rich result — search engines still apply independent quality and eligibility checks and can simply choose not to show it regardless. The correct approach is to only include an `aggregateRating` block when the page genuinely displays a matching rating/review count to visitors.
