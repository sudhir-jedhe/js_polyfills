// app/shop/[[...slug]]/page.tsx
// Optional catch-all: matches /shop, /shop/electronics, /shop/electronics/laptops.
// When nothing follows /shop, `slug` is undefined -- not an empty array.

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  // Guard against undefined before treating it as an array.
  const categoryPath = slug ?? [];

  if (categoryPath.length === 0) {
    return <AllCategoriesGrid />;
  }

  const category = categoryPath[categoryPath.length - 1];
  const products = await getProductsByCategory(category);

  return <ProductGrid category={category} products={products} />;
}

async function getProductsByCategory(category: string) {
  const res = await fetch(`https://api.example.com/products?category=${category}`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}

function AllCategoriesGrid() {
  return <div>Browse all categories</div>;
}

function ProductGrid({
  category,
  products,
}: {
  category: string;
  products: unknown[];
}) {
  return (
    <div>
      <h1>{category}</h1>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
}
