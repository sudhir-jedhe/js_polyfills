# Dashboard Takes Forever to Load

Your dashboard fetches the current user, then the user's team, then the team's projects — each fetch starts only after the previous one resolves, and support tickets say the page feels sluggish even though each individual API call is fast (~150ms).

**Approach:** Profile the network waterfall first — three sequential 150ms calls is 450ms minimum even though nothing about them is inherently sequential if you already have IDs up front (e.g., team ID comes back with the user, but if `teamId` is available from auth/session data already, you don't need to wait). Restructure to fetch independent data in parallel and only sequence what's a genuine dependency.

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
      // projects depend on team.id, but could be parallelized with anything
      // that doesn't need team data
      const projects = await fetchProjects(team.id);
      if (!cancelled) setState({ user, settings, team, projects });
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!state) return <Spinner />;
  return <DashboardView {...state} />;
}
```

Only `team` truly depends on `user`, and only `projects` truly depends on `team` — but `settings` never depended on anything and was needlessly serialized in the original waterfall.
