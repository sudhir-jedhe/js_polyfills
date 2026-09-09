***  04-json-ld-for-product-page.md ***

# Problem: Write JSON-LD Structured Data for a Product Page

## Problem Statement

Given the following product data, write a valid, complete `Product` JSON-LD block suitable for embedding in the page, eligible for a price/availability/rating rich result.

**Product data:**
```js
const product = {
  name: 'Trail Runner Pro',
  description: 'Lightweight trail running shoe with reinforced grip and breathable mesh upper.',
  sku: 'TR-PRO-42',
  brand: 'ExampleGear',
  image: 'https://example.com/images/trail-runner-pro.jpg',
  price: 129.99,
  currency: 'USD',
  inStock: true,
  url: 'https://example.com/products/trail-runner-pro',
  rating: { value: 4.6, count: 312 },
};
```

## Requirements

- Output must be a `Product` type per schema.org, embedded in a `<script type="application/ld+json">` block.
- `offers.availability` must map `inStock: true/false` to the correct schema.org URL (`https://schema.org/InStock` or `https://schema.org/OutOfStock`).
- `offers.price` must be a string (schema.org expects price as a string, not a number, to avoid floating-point/locale ambiguity).
- Include `aggregateRating` only if `rating` is present in the input data.
- The function should return the full `<script>` tag as a string, ready to inject into `<head>`.

## Approach

Map the flat input object onto the nested schema.org `Product`/`Offer`/`AggregateRating`/`Brand` structure, handling the boolean-to-URL translation for availability and the number-to-string conversion for price explicitly, then wrap the serialized JSON in the required `<script>` tag.

## Solution

```js
function renderProductJsonLd(product) {
  const {
    name, description, sku, brand, image,
    price, currency, inStock, url, rating,
  } = product;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    sku,
    image,
    url,
    brand: { '@type': 'Brand', name: brand },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price: price.toFixed(2), // schema.org expects price as a STRING
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  if (rating) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value.toString(),
      reviewCount: rating.count.toString(),
    };
  }

  return `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`;
}

// --- verification ---
const product = {
  name: 'Trail Runner Pro',
  description: 'Lightweight trail running shoe with reinforced grip and breathable mesh upper.',
  sku: 'TR-PRO-42',
  brand: 'ExampleGear',
  image: 'https://example.com/images/trail-runner-pro.jpg',
  price: 129.99,
  currency: 'USD',
  inStock: true,
  url: 'https://example.com/products/trail-runner-pro',
  rating: { value: 4.6, count: 312 },
};

console.log(renderProductJsonLd(product));
/*
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Trail Runner Pro",
  ...
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/trail-runner-pro",
    "priceCurrency": "USD",
    "price": "129.99",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "312"
  }
}
</script>
*/

// A product with no rating data omits aggregateRating entirely, rather than
// emitting a fabricated or zero-valued rating block:
console.log(renderProductJsonLd({ ...product, rating: undefined }));
```

**Why `price` is explicitly converted with `.toFixed(2)` rather than just interpolated:** schema.org's `Offer.price` expects a plain decimal string; passing a raw JS number risks locale-dependent serialization quirks (and `.toFixed(2)` also guards against a value like `129.9` being emitted as `"129.9"` instead of the expected `"129.90"`-style two-decimal price format buyers expect to see).

**Why `aggregateRating` is conditionally omitted rather than defaulted to zero:** A `ratingValue: "0"` with `reviewCount: "0"` would be misleading structured data claiming a rating exists when it doesn't — since this violates the "must match visible page content" requirement covered in this topic's theory, omitting the whole block when there's genuinely no rating data is the only correct behavior, not an edge case to special-case away.
