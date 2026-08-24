// app/products/[id]/page.jsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  return <main>{product ? <h1>{product.name}</h1> : <p>Not found</p>}</main>;
}

async function getProduct(id) {
  const res = await fetch(`https://api.example.com/products/${id}`);
  if (!res.ok) return null;
  return res.json();
}
