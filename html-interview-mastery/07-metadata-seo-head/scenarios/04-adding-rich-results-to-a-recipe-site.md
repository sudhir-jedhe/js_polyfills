# Scenario: A Recipe Site Wants Star Ratings and Cook Time to Show in Search Results

**Scenario:** A recipe blog's pages already display a star rating, review count, prep/cook time, and calorie count to visitors. Competitors' recipes show up in Google search with a star rating and cook time visible directly in the snippet, but this site's listings are plain blue links with no rich preview. Content and layout are already fine — what's missing?

**Diagnosis:** Rich results (star ratings, cook time, calorie info shown directly in the SERP) require structured data — visible content on the page alone is not enough, since search engines need a machine-readable description of that content in a format they recognize (schema.org vocabulary via JSON-LD is the recommended format) to know which specific values correspond to "rating," "cook time," etc., and to consider the page eligible for that rich result type.

**Fix — add a `Recipe` JSON-LD block matching the visible content exactly:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Classic Banana Bread",
  "image": "https://example.com/recipes/banana-bread.jpg",
  "author": { "@type": "Person", "name": "Ada Lovelace" },
  "prepTime": "PT15M",
  "cookTime": "PT55M",
  "totalTime": "PT1H10M",
  "recipeYield": "1 loaf",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "210 calories"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "246"
  },
  "recipeIngredient": [
    "3 ripe bananas",
    "1/3 cup melted butter",
    "1 teaspoon baking soda"
  ],
  "recipeInstructions": [
    { "@type": "HowToStep", "text": "Preheat oven to 350°F and grease a loaf pan." },
    { "@type": "HowToStep", "text": "Mash bananas in a large bowl, then mix in melted butter." }
  ]
}
</script>
```

**Why exact correspondence with visible content matters here specifically:** `prepTime`/`cookTime`/`aggregateRating` must match numbers actually shown to a visitor on the page — search engine guidelines require this correspondence, and recipe rich results are a category that's actively monitored for exactly this kind of mismatch (a common past abuse pattern was inflating ratings only in markup).

**Why this alone doesn't guarantee the rich result appears:** As with all structured data, adding a valid, accurate `Recipe` block makes the page *eligible*, not guaranteed — search engines apply their own additional quality/trust signals (site history, content depth, sometimes even manual curation for certain rich result types) on top of valid markup before deciding to actually render the enhanced snippet.

**Practical validation step:** Before shipping, validate the JSON-LD against a structured data testing tool to catch schema errors (missing required fields like `image` or `recipeIngredient` for the `Recipe` type specifically block eligibility, unlike optional fields).
