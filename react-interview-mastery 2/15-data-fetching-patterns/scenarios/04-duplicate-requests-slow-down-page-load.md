# Duplicate Requests Slow Down Page Load

Multiple independent components on the same page (a header avatar, a profile card, and a settings panel) each fetch `/api/users/me` on mount, tripling an otherwise-identical request and making the network tab noisy.

**Approach:** The root problem is that fetching is duplicated per-component with no shared cache. Two viable fixes: lift the fetch to a common ancestor and pass data down via props/context, or introduce a small cache layer (or adopt React Query/SWR) so identical in-flight requests are deduped automatically. For a lightweight fix without a library:

```jsx
const userCache = new Map();

function useCurrentUser() {
  const [user, setUser] = useState(() => userCache.get("me") ?? null);

  useEffect(() => {
    if (userCache.has("me")) return;
    let cancelled = false;
    let promise = userCache.get("me-promise");
    if (!promise) {
      promise = fetch("/api/users/me").then((r) => r.json());
      userCache.set("me-promise", promise);
    }
    promise.then((data) => {
      userCache.set("me", data);
      if (!cancelled) setUser(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return user;
}
```

In a real codebase, this is exactly the problem React Query solves out of the box via query-key-based deduplication — worth naming as the "real" fix in an interview even if you sketch the manual version.
