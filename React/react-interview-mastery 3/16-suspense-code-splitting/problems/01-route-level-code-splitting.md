# Problem: Implement Route-Level Code Splitting

## Task

Implement a small app with three routes (`Home`, `Dashboard`, `Settings`) where each route's component code is only downloaded when the user navigates to it, using `React.lazy` + `Suspense`. Show a loading fallback specific to route transitions (not a generic blank screen).

## Solution

```jsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Each import() call is a separate chunk, only fetched when that route renders.
const Home = lazy(() => import("./routes/Home"));
const Dashboard = lazy(() => import("./routes/Dashboard"));
const Settings = lazy(() => import("./routes/Settings"));

function PageLoader() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>Loading page…</p>
    </div>
  );
}

function NavBar() {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      {/* One boundary shared by all routes: on every navigation to a route
          whose chunk hasn't loaded yet, this fallback appears until it does. */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// routes/Home.js
export default function Home() {
  return <h1>Home</h1>;
}

// routes/Dashboard.js
export default function Dashboard() {
  return <h1>Dashboard</h1>;
}

// routes/Settings.js
export default function Settings() {
  return <h1>Settings</h1>;
}
```

## Why this works

- Each route component lives in its own file and is wrapped in `React.lazy`, so the bundler (webpack/Vite) emits a separate chunk per route instead of bundling all three into the main file.
- The dynamic `import()` only executes — and therefore only triggers a network request — when React actually renders that `<Route>`'s element for the first time, i.e., when the user navigates there.
- A single `Suspense` boundary around `<Routes>` covers every route with one shared loading fallback; since only one route renders at a time, there's no risk of one route's fallback blocking on another's chunk.
- Once a route's chunk has loaded, navigating away and back to it does not re-trigger the fallback or a new network request — the module is cached after the first successful import.

## Things to watch out for

- Don't wrap the whole app (including `NavBar`) in the `Suspense` boundary — only the routed content should suspend, so navigation controls stay visible and interactive during a route transition.
- For a smoother feel during navigation (keeping the old route on screen instead of an abrupt fallback swap), combine this with `useTransition` around the navigation state — see the scenario on jarring blank screens in `../scenarios/02-jarring-blank-screen-during-route-transitions.md`.
