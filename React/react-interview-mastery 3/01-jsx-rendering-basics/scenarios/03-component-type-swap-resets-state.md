***  03-component-type-swap-resets-state.md ***

# New Component Tree Flashes/Unmounts Entirely on Minor Prop Change

**Scenario:** You're building a settings page where a `<Panel>` component conditionally renders as either `<AdminPanel>` or `<UserPanel>` based on a role prop, and every time the role prop briefly flips during a loading transition, all child state (expanded sections, scroll position) resets.

**Approach:** React's reconciliation compares elements at the same tree position by *type*. Swapping between `<AdminPanel>` and `<UserPanel>` — different component types at the same slot — causes React to unmount the old subtree entirely and mount a fresh one, discarding all local state and DOM (including scroll position). If the panels are meant to represent variations of "the same logical panel," unify them into one component that branches internally so the type stays stable across the transition:

```jsx
function Panel({ role, ...sharedState }) {
  return (
    <div className="panel">
      {role === 'admin' ? <AdminControls /> : <UserControls />}
      {/* shared scroll container / state stays mounted */}
    </div>
  );
}
```

If they must remain separate top-level components, preserve state outside the component (lift it up) so it survives the unmount/remount, or use a stable `key` intentionally to force remount only when you actually want a reset.
