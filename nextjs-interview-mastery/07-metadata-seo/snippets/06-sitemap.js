// app/sitemap.js
export default async function sitemap() {
  const staticEntries = [
    { url: 'https://example.com', changeFrequency: 'monthly', priority: 1 },
    { url: 'https://example.com/about', changeFrequency: 'yearly', priority: 0.5 },
  ].map((entry) => ({ ...entry, lastModified: new Date() }));

  const posts = await getAllPosts();
  const postEntries = posts.map((post) => ({
    url: `https://example.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}

async function getAllPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}
