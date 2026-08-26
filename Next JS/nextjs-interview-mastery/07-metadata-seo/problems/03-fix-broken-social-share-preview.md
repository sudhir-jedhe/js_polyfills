# Problem 3: Fix a Page Whose Social Share Preview Is Broken

## Task

You're given this broken page. Diagnose and fix every issue so that sharing
`/products/wireless-mouse` on Slack shows the correct product name,
description, and image.

```jsx
// app/products/[slug]/page.jsx — BROKEN
export const metadata = {
  title: 'Acme Store',
  description: 'Shop the best products at Acme Store.',
};

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  return (
    <main>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
    </main>
  );
}

async function getProduct(slug) {
  const res = await fetch(`https://api.example.com/products/${slug}`);
  return res.json();
}
```

## Constraints

- Fix must preserve fast page rendering — don't fetch the product twice
  unnecessarily (rely on Next's fetch deduplication).
- Handle the case where `getProduct` returns nothing for an invalid slug
  (currently this would crash on `product.name` with no product).
- Root layout has no `metadataBase` set — decide whether that needs fixing
  too, and why.

## Solution

There are three separate problems here, and the fix addresses each:

1. **Static `metadata` instead of `generateMetadata()`** — the page can never
   reflect per-product data since `metadata` is a fixed object.
2. **No `openGraph`/`twitter` metadata at all** — even fixing #1 to set a
   dynamic `title`/`description` wouldn't populate OG tags, since those are a
   distinct object that must be set explicitly.
3. **No handling for a missing product** — both a metadata generation crash
   risk and an unhandled render crash on `product.name`.

```jsx
// app/products/[slug]/page.jsx — FIXED
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);

  if (!product) {
    return { title: 'Product Not Found', robots: { index: false } };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, width: 1200, height: 630, alt: product.name }],
      siteName: 'Acme Store',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
    </main>
  );
}

async function getProduct(slug) {
  const res = await fetch(`https://api.example.com/products/${slug}`, {
    next: { revalidate: 1800 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}
```

On `metadataBase`: yes, it should also be added to the root layout
(`metadataBase: new URL('https://acmestore.example.com')`) if `product.image`
can ever be a relative path from the product data source — otherwise the OG
image tag risks containing an unresolvable relative URL for products whose
image field isn't already a full URL. Setting it once at the root is cheap
insurance regardless of whether today's data happens to already use absolute
URLs.
