# Snippet: JSON-LD Structured Data for an FAQ Page

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you ship internationally?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we ship to over 40 countries with rates calculated at checkout."
      }
    },
    {
      "@type": "Question",
      "name": "What is your return policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unworn items can be returned within 30 days of delivery for a full refund."
      }
    }
  ]
}
</script>
```

This structured data mirrors visible FAQ content on the page (it must match what's actually shown, not be fabricated) and makes the page eligible for an expandable FAQ rich result directly in search results — though whether it's actually shown that way remains at the search engine's discretion.
