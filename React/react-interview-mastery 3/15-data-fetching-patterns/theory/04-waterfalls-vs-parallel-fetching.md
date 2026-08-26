# Waterfalls vs Parallel Fetching

A waterfall happens when a child component's fetch depends on a parent's fetch finishing first, even when the data isn't actually dependent — e.g., fetching a user, then only *after* that fetching their posts, when both could be fetched with the user ID you already had. Fix by hoisting the fetches and firing them together:

```jsx
// Waterfall — posts fetch waits on user fetch to even start
useEffect(() => {
  fetchUser(id).then((u) => {
    setUser(u);
    fetchPosts(id).then(setPosts); // could've started immediately
  });
}, [id]);

// Parallel
useEffect(() => {
  Promise.all([fetchUser(id), fetchPosts(id)]).then(([u, p]) => {
    setUser(u);
    setPosts(p);
  });
}, [id]);
```

## Waterfall vs parallel fetching

| Aspect | Waterfall | Parallel (`Promise.all`) |
|---|---|---|
| Total time | Sum of each request's latency | Max of the request latencies |
| When appropriate | Second request genuinely needs data from the first (e.g., needs an ID returned by request 1) | Requests are independent, even if they're "related" conceptually |
| Code shape | Nested `.then` / sequential `await` | `Promise.all([...])` or parallel hooks |
| Common mistake | Sequencing fetches out of habit ("fetch user, then fetch their posts") when the post fetch only needs `userId`, which was already known | Firing parallel requests when the second genuinely depends on data only the first response provides, causing a failed/undefined request |

Default to parallel; only fall back to a waterfall when there's a real data dependency — e.g., you need a `teamId` returned by `/api/me` before you can call `/api/teams/:teamId`. Forcing that into `Promise.all` doesn't work because the second call has no valid input yet; the dependency is real, not incidental.

## Handling loading/error state across multiple fetches

Track each fetch's status independently or combine them into a single derived status: loading if any are still pending, error if any failed, success only once all have resolved. Using `Promise.all` for the "fetch all three in parallel" case and one shared `status` state (`'idle' | 'loading' | 'success' | 'error'`) usually keeps this cleaner than three separate booleans that can get out of sync.

```jsx
function Dashboard({ userId }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // user and org-level settings are independent — fetch in parallel
      const [user, settings] = await Promise.all([
        fetchUser(userId),
        fetchOrgSettings(userId),
      ]);
      // team depends on user.teamId, so it must come after
      const team = await fetchTeam(user.teamId);
      const projects = await fetchProjects(team.id);
      if (!cancelled) setState({ user, settings, team, projects });
    }
    load();
    return () => { cancelled = true; };
  }, [userId]);

  if (!state) return <Spinner />;
  return <DashboardView {...state} />;
}
```

Only `team` truly depends on `user`, and only `projects` truly depends on `team` — `settings` never depended on anything and shouldn't be needlessly serialized after it.
