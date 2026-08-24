// app/products/page.tsx
// Reading searchParams in a Server Component. Presence of searchParams
// usage forces this page into dynamic rendering (no generateStaticParams
// applicable here since there's no dynamic path segment, and no query
// string can be known ahead of time).

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    sort?: string;
    page?: string;
    tag?: string | string[];
  }>;
}) {
  const { sort, page, tag } = await searchParams;

  const tags = Array.isArray(tag) ? tag : tag ? [tag] : [];
  const pageNumber = Number(page ?? '1');
  const sortOrder = sort ?? 'newest';

  const products = await getProducts({ sort: sortOrder, page: pageNumber, tags });

  return (
    <div>
      <p>
        Sorted by {sortOrder}, page {pageNumber}
        {tags.length > 0 && `, filtered by: ${tags.join(', ')}`}
      </p>
      <ProductList products={products} />
    </div>
  );
}

async function getProducts(opts: { sort: string; page: number; tags: string[] }) {
  const params = new URLSearchParams({
    sort: opts.sort,
    page: String(opts.page),
  });
  opts.tags.forEach((t) => params.append('tag', t));

  const res = await fetch(`https://api.example.com/products?${params}`, {
    cache: 'no-store',
  });
  return res.json();
}

function ProductList({ products }: { products: unknown[] }) {
  return <pre>{JSON.stringify(products, null, 2)}</pre>;
}
