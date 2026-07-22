**Code splitting** is a technique that allows you to split your JavaScript bundle into smaller chunks, which are then loaded on demand (lazily) rather than downloading the entire application all at once when the user first visits.

---

### Why is Code Splitting Important?

By default, bundlers (like Webpack or Vite) combine all your React components into a single massive `main.js` file. As your app grows, this bundle size balloons, leading to slow initial page load times because the user has to download code for pages or features they might never even look at.

Code splitting solves this by packaging your app into smaller chunks. The browser only downloads what is needed for the current screen, dramatically speeding up initial load times.

---

### How to Implement Code Splitting in React

React provides two core built-in tools for code splitting: **`React.lazy()`** and **`Suspense`**.

#### 1. `React.lazy()`

`React.lazy()` lets you render a dynamic import as a regular component. It delays loading the component's code until it is actually rendered on the screen for the first time.

#### 2. `<Suspense>`

Because loading a component over the network takes time, `<Suspense>` lets you specify a fallback UI (like a loading spinner or skeleton screen) to display while the lazy component is being fetched.

---

### Example: Route-Based Code Splitting

The most common place to apply code splitting is across different pages (routes) of an application.

```jsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// 1. Lazily load components instead of standard top-level imports
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |<Link to="/dashboard">Dashboard</Link> |
        <Link to="/settings">Settings</Link>
      </nav>

      {/* 2. Wrap routes in Suspense to show a fallback while chunks load */}
      <Suspense
        fallback={<div className="loading-spinner">Loading page...</div>}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
```

---

### When Should You Code Split?

- **Route-by-Route (Recommended):** Split your app by top-level pages. This is the easiest and most effective way to improve performance.
- **Component-by-Component:** Split heavy, rarely used components that appear conditionally—such as a massive modal dialog, a rich-text editor, heavy charts, or an interactive data grid that only opens on user interaction.

**Code splitting** in a React application is a technique used to improve performance by splitting the code into smaller chunks that can be loaded on demand. This helps in reducing the initial load time of the application. You can achieve code splitting using dynamic import() statements or React's React.lazy and Suspense.

```js
import { lazy, Suspense } from "react";

const LazyComponent = lazy(() => import("./LazyComponent"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

**What is code splitting in a React application?**
Introduction
Code splitting is a performance optimization technique that involves breaking down your application's code into smaller, more manageable chunks. This allows the application to load only the necessary code initially and defer the loading of other parts until they are needed. This can significantly reduce the initial load time and improve the overall user experience.

**How to implement code splitting**
**Using dynamic import()**
Dynamic import() is a JavaScript feature that allows you to load modules asynchronously. This can be used to split your code into separate chunks.

```js
// Dynamic import example
import("./module").then((module) => {
  // Use the module
});
```

**Using lazy and Suspense**
React provides built-in support for code splitting through lazy and Suspense. lazy lets you render a dynamic import as a regular component, and Suspense lets you specify a loading fallback while the chunk is being fetched.

```js
import { lazy, Suspense } from "react";

const LazyComponent = lazy(() => import("./LazyComponent"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

**Route-based splitting**
The dominant real-world use case is splitting at route boundaries — each route loads its own chunk so users only download the code for the page they visit. With React Router this is typically:

```js
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

**Framework-level splitting**
Modern React frameworks handle code splitting for you. Next.js (App Router) and Remix / React Router (framework mode) automatically split per route and per Server / Client Component boundary, so you usually do not need lazy for routes — only for genuinely opt-in subtrees like modals, editors, or charts.

**Pairing Suspense with error boundaries**
Suspense only handles the loading state. If the dynamic import fails (network error, deploy mismatch), you need an error boundary to render a fallback and let the user retry:

````js
<ErrorBoundary fallback={<RetryUI />}>
  <Suspense fallback={<Spinner />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>


**Suspense for data and use()**
In React 19, Suspense integrates with data fetching through the use() hook — components can use(promise) to suspend on data the same way lazy suspends on a code chunk. This means a single <Suspense> boundary can coordinate both code loading and data loading.

**Preloading**
You can warm a lazy chunk before it is needed (e.g. on hover or focus) by simply calling the dynamic import — the bundler / browser will fetch and cache it:```
```js
const Editor = lazy(() => import('./Editor'));

function OpenButton() {
  return (
    <button
      onMouseEnter={() => import('./Editor')} // preload on hover
      onClick={openEditor}>
      Open editor
    </button>
  );
}
````

**Benefits of code splitting**
**Improved performance:** By loading only the necessary code initially, you can reduce the initial load time of your application.
**Better user experience:** Faster load times lead to a smoother and more responsive user experience.
Efficient resource usage: Code splitting ensures that resources are used more efficiently by loading code only when it is needed.

**Tools and libraries**
**Webpack / Rspack / Vite / Turbopack:** Modern bundlers all support code splitting out of the box and split on dynamic import() boundaries automatically.
**React Loadable: **A predecessor to React.lazy that is now abandoned (unmaintained for years). New code should use lazy and Suspense instead.
