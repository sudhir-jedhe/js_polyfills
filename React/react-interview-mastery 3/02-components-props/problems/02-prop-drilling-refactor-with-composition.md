*** copy 02-prop-drilling-refactor-with-composition.md ***

# Problem: Demonstrate Prop Drilling Through 3 Layers, Then Refactor It Away With Composition

## Problem Statement

Build a small `<AppShell>` → `<Dashboard>` → `<Sidebar>` → `<UserBadge>` tree where a `currentUser` object has to be drilled through two components that don't use it (`Dashboard`, `Sidebar`) to reach `UserBadge`. Then refactor the same behavior using **composition** (passing an already-built element as a prop) instead of Context, per the topic's guidance that composition should be tried before reaching for Context.

## Requirements

- The "before" version must show `currentUser` being explicitly accepted and forwarded by `Dashboard` and `Sidebar`, even though neither renders anything based on it.
- The "after" version must remove `currentUser` from `Dashboard`'s and `Sidebar`'s prop signatures entirely — they should not know the concept exists.
- The refactor must not introduce Context — it must use composition (an element built at the top and passed down as a prop/children).
- Both versions must render the same final output.

## Approach

In the "before" version, `currentUser` threads through every layer's function signature purely to reach the bottom. In the "after" version, `AppShell` builds the `<UserBadge user={currentUser} />` element itself and hands the *already-built element* down through `Dashboard` and `Sidebar` as an opaque prop (`sidebarExtra`) — those components just place it somewhere in their output without ever importing, typing, or knowing about `UserBadge` or `currentUser`.

## Solution

```jsx
// ---------- BEFORE: prop drilling ----------
function AppShell({ currentUser }) {
  return <Dashboard currentUser={currentUser} />;
}

function Dashboard({ currentUser }) {
  // Dashboard doesn't use currentUser at all — pure pass-through
  return (
    <div className="dashboard">
      <Sidebar currentUser={currentUser} />
      <main>Dashboard content</main>
    </div>
  );
}

function Sidebar({ currentUser }) {
  // Sidebar doesn't use currentUser either — another pure pass-through
  return (
    <aside>
      <nav>...</nav>
      <UserBadge user={currentUser} />
    </aside>
  );
}

function UserBadge({ user }) {
  return <div className="user-badge">{user.name}</div>;
}

// ---------- AFTER: composition, no drilling, no Context ----------
function AppShellComposed({ currentUser }) {
  // Build the element ONCE, at the top, where currentUser is naturally available.
  return <DashboardComposed sidebarExtra={<UserBadge user={currentUser} />} />;
}

function DashboardComposed({ sidebarExtra }) {
  // Never mentions currentUser — just forwards an opaque, already-built element.
  return (
    <div className="dashboard">
      <SidebarComposed extra={sidebarExtra} />
      <main>Dashboard content</main>
    </div>
  );
}

function SidebarComposed({ extra }) {
  // Also never mentions currentUser — just places `extra` wherever it belongs.
  return (
    <aside>
      <nav>...</nav>
      {extra}
    </aside>
  );
}

// --- verification: both trees render an identical UserBadge for the same user ---
const user = { name: 'Ada Lovelace' };
// <AppShell currentUser={user} /> and <AppShellComposed currentUser={user} />
// both ultimately render: <div class="user-badge">Ada Lovelace</div> inside the sidebar
```

**Why this works:** `AppShell` is the one place that actually has `currentUser` in scope and cares about rendering a user badge with it, so building `<UserBadge user={currentUser} />` there and passing the *result* down means `Dashboard` and `Sidebar` only ever handle a generic "some JSX to render here" value — their signatures stop being coupled to what that JSX actually is. If `currentUser`'s shape changes, or `UserBadge` is swapped for a different component entirely, `Dashboard` and `Sidebar` require zero changes, unlike the drilled version where the prop threading itself is unaffected but every layer's mental model still references `currentUser`.

**When this wouldn't be enough:** composition works cleanly here because `Sidebar` doesn't need to *conditionally* render `UserBadge` based on other logic Sidebar owns, and there's only one such prop being threaded. If many unrelated pieces of deeply-nested UI all need the same cross-cutting data (theme, auth, locale) independent of any single render tree's shape, Context (see `01-deep-tree-needs-theme-preference.md` in `../scenarios/`) is the better fit — composition and Context solve overlapping but not identical problems.
