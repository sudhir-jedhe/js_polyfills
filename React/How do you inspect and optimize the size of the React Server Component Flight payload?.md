When using React Server Components (RSC) and full-stack frameworks like Next.js App Router, the browser downloads the **RSC Flight payload** (a text-based serialized stream containing the virtual DOM tree, module references, and serialized props) during initial SSR (embedded in HTML) and during every client-side page transition.

An oversized Flight payload inflates network transfer size, spikes memory usage, and degrades Interaction to Next Paint (INP) during client-side hydration.

---

### Step-by-Step Inspection in Chrome DevTools

1. **Filter Network Requests by Fetch/XHR:**
Open Chrome DevTools (`F12` or `Cmd + Option + I`) $\rightarrow$ **Network** tab. Enable the **Fetch/XHR** filter.

2. **Perform a Soft Client-Side Navigation:**
Click a link (`<Link href="...">`) in your app to trigger a soft route transition. Look for the request corresponding to the route:

* In Next.js App Router, these requests include the query parameter `?_rsc=...` or request header `RSC: 1`.

1. **Inspect the Response / Flight Stream:**
Click on the request and open the **Response** tab. You will see serialized Flight lines starting with `0:`, `1:`, `M:`, `I:`, or `$`:

* Look for large JSON blobs inside prop definitions (e.g., thousands of unpruned database fields or huge nested arrays).

1. **Inspect Initial SSR Embedded Payload:**
For the initial page load, switch to the main document request $\rightarrow$ **Response** tab and search for `self.__next_f.push` or `react-server-dom` script tags to see the initial payload embedded directly into the HTML.

---

### Core Flight Payload Optimization Strategies

#### 1. Prune Data at the Database / Fetch Boundary (Pass Only What Is Rendered)

Passing raw ORM records (Prisma, Drizzle, Mongoose) or complete API responses directly across the boundary forces React to serialize entire tables—including unused fields like audit timestamps, internal flags, and heavy text fields.

```jsx
// ❌ BAD: Serializes 40+ unused DB columns into the Flight stream
export default async function ProductPage({ params }) {
  const product = await db.product.findUnique({ where: { id: params.id } });
  return <ProductView product={product} />; // product is passed to a Client Component
}

// ✅ GOOD: Project/Select only the exact fields needed by the UI
export default async function ProductPage({ params }) {
  const product = await db.product.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      price: true,
      thumbnailUrl: true, // Only 4 fields serialized!
    },
  });
  return <ProductView product={product} />;
}

```

---

#### 2. Push the `'use client'` Boundary Down to Leaf Nodes

Every prop passed from a Server Component to a Client Component is serialized into the Flight payload. If you mark a top-level parent component as `'use client'`, all data passed into that component is serialized.

```jsx
// ❌ BAD: Large page container marked as 'use client' forces all feed data into Flight payload
'use client';
export default function Feed({ posts }) {
  return (
    <div>
      <Header />
      {posts.map(p => <PostCard key={p.id} post={p} />)}
    </div>
  );
}

// ✅ GOOD: Keep Feed as a Server Component; isolate 'use client' only to the interactive button
// Feed.server.jsx
export default async function Feed() {
  const posts = await getPosts();
  return (
    <div>
      <Header />
      {posts.map(p => (
        <article key={p.id}>
          <h2>{p.title}</h2>
          <p>{p.content}</p>
          <LikeButton postId={p.id} /> {/* Only postId is serialized to Client Component */}
        </article>
      ))}
    </div>
  );
}

```

---

#### 3. Use the Children / Slot Pattern (Passing Server Components as Children)

When a Server Component is passed as `children` to a Client Component, the Server Component is executed on the server, and only its static virtual DOM markup descriptor is transmitted. Its server dependencies and internal data models are not serialized into client props.

```jsx
// Sidebar.client.jsx ('use client')
export function CollapsibleSidebar({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <aside>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children}
    </aside>
  );
}

// Page.server.jsx (Server Component)
export default async function Page() {
  const complexNavTree = await fetchHugeNavData();
  return (
    <CollapsibleSidebar>
      {/* Heavy nav tree rendered on server, avoiding passing raw tree data to client state */}
      <ServerNavigation data={complexNavTree} />
    </CollapsibleSidebar>
  );
}

```

---

#### 4. Avoid Redundant Prop Duplication Across Siblings

If multiple sibling Client Components need parts of a dataset, avoid passing the entire parent object to each child:

```jsx
// ❌ BAD: Serializes full user profile 3 times in the Flight stream
<UserAvatar user={user} />
<UserBio user={user} />
<UserSocialLinks user={user} />

// ✅ GOOD: Pass scalar primitives
<UserAvatar src={user.avatarUrl} name={user.name} />
<UserBio bio={user.bio} />
<UserSocialLinks links={user.links} />

```

---

### Diagnostic Checklist for Flight Bloat

| Audit Item                      | Warning Sign                                                      | Remediation                                                                            |
| ------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **`?_rsc=` request size**       | Payload $> 50\text{ KB}$ on route change                          | Check for unpruned database queries passed to Client Components.                       |
| **Duplicate Object Keys**       | Same JSON object structure repeated dozens of times               | Normalize list payloads or render repeated items directly in Server Components.        |
| **`I[...]` Module Descriptors** | Long lists of client imports                                      | Consolidate micro-client components or move static UI parts back to Server Components. |
| **High TBT / INP on Hydration** | Main thread blocks for $> 100\text{ ms}$ processing Flight chunks | Reduce depth and element count of the serialized server tree.                          |
