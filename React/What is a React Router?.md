React Router is a popular routing library for React applications that enables navigation between different components based on the URL. It provides declarative routing, allowing you to define routes and their corresponding components in a straightforward manner.

**How does React Router work, and how do you implement dynamic routing?**
React Router maps URL paths to components, enabling navigation in single-page apps. Dynamic routing allows you to use URL parameters to render components based on dynamic values.

```js
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

function UserPage() {
  const { id } = useParams(); // Access dynamic parameter
  return <h1>User ID: {id}</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/:id" element={<UserPage />} /> {/* Dynamic path */}
      </Routes>
    </BrowserRouter>
  );
}
```

Key features:

**Dynamic Segments**: :id captures dynamic data from the URL.
**useParams Hook**: Accesses these dynamic values for rendering.

**React Router** is the standard routing library for React. It enables "client-side routing," allowing your web app to update the browser URL, manage history, and render different components without triggering a full page reload from the server.

---

### How React Router Works Under the Hood

1. **Listening to the URL:** React Router wraps your application in a router component (like `<BrowserRouter>`), which hooks into the browser's native History API (`window.history` and `popstate` events).
2. **Matching Routes:** When the URL changes (e.g., a user clicks a `<Link>` or types a new path), React Router compares the current pathname against the route definitions inside your `<Routes>` tree.
3. **Rendering the Match:** Once it finds a matching `<Route path="...">`, it mounts and renders the corresponding component element without refreshing the page, creating a smooth Single Page Application (SPA) experience.

---

### How to Implement Dynamic Routing

Dynamic routing refers to routes that contain **URL parameters** (variables like an ID, username, or slug) so a single component can dynamically render different data based on what's in the address bar.

Here is how you implement dynamic routing using modern React Router (v6+):

#### 1. Define Dynamic Paths using Colons (`:`)

You use a colon (`:`) in your route path to denote a dynamic segment.

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UserProfile from "./UserProfile";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/users/101">Alice (ID: 101)</Link> |
        <Link to="/users/202">Bob (ID: 202)</Link>
      </nav>

      <Routes>
        {/* Dynamic route segment: ':userId' acts as a placeholder */}
        <Route path="/users/:userId" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

#### 2. Extract Dynamic Parameters Using `useParams`

Inside your target component, you retrieve the dynamic value from the URL using the **`useParams()`** hook. You can then use that parameter to fetch data or display specific content.

```jsx
import { useParams } from "react-router-dom";

export default function UserProfile() {
  // Extract 'userId' which matches the ':userId' segment in the route path
  const { userId } = useParams();

  return (
    <div>
      <h2>User Profile Page</h2>
      <p>
        Currently viewing profile for User ID: <strong>{userId}</strong>
      </p>
      {/* Here you would typically fetch user data using the userId */}
    </div>
  );
}
```

**How do you handle nested routes and route parameters in React Router?**

Nested routes allow you to create hierarchies of components, and useParams helps access dynamic route parameters.

Key techniques:

<Outlet>: Renders child routes within a parent layout
useParams: Retrieves route parameters for dynamic routing

```js
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useParams,
} from "react-router-dom";

function UserProfile() {
  const { userId } = useParams();
  return <h2>User ID: {userId}</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="user/:userId" element={<Outlet />}>
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

**Nested routing** is a pattern where a parent route renders its own layout and UI while containing child routes that render inside specific designated areas (called **outlets**) depending on the sub-path in the URL.

---

### How Nested Routes Work with `<Outlet/>`

In React Router (v6+), nested routing is achieved by:

1. Nesting `<Route>` elements inside a parent `<Route>`.
2. Using the **`<Outlet/>`** component inside the parent layout component to tell React Router _where_ the child route's element should be rendered.

---

### Implementation Example: Nested Routes & Parameters

Imagine a dashboard application where a user can view their profile or settings, and each section also accepts dynamic parameters (like a specific tab or item ID).

#### 1. Setting Up Nested Routes in `App.jsx`

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import DashboardHome from "./DashboardHome";
import UserDetail from "./UserDetail";
import Settings from "./Settings";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/dashboard">Dashboard</Link> |
        <Link to="/dashboard/users/42">User 42</Link> |
        <Link to="/dashboard/settings">Settings</Link>
      </nav>

      <Routes>
        {/* Parent Route */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Index Route (renders at default '/dashboard') */}
          <Route index element={<DashboardHome />} />

          {/* Nested Child Route with a dynamic parameter (:id) */}
          <Route path="users/:id" element={<UserDetail />} />

          {/* Nested Static Child Route */}
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

#### 2. Creating the Parent Layout with `<Outlet/>`

The parent component provides persistent UI elements (like a sidebar, top navigation, or wrapper styling) that stay on screen while only the child content inside the `<Outlet/>` swaps out.

```jsx
import { Outlet, Link } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", border: "1px solid #ccc", padding: "15px" }}>
      {/* Persistent Sidebar */}
      <aside style={{ width: "200px", borderRight: "1px solid #eee" }}>
        <h3>Dashboard Menu</h3>
        <ul>
          <li>
            <Link to="/dashboard">Overview</Link>
          </li>
          <li>
            <Link to="/dashboard/users/99">View User 99</Link>
          </li>
          <li>
            <Link to="/dashboard/settings">Settings</Link>
          </li>
        </ul>
      </aside>

      {/* Dynamic Content Area */}
      <main style={{ paddingLeft: "20px", flex: 1 }}>
        <h2>Dashboard Area</h2>
        {/* <Outlet /> renders whichever child route currently matches the URL */}
        <Outlet />
      </main>
    </div>
  );
}
```

#### 3. Accessing Parameters in Nested Child Components

Child components like `UserDetail` can access both their own dynamic parameters (using `useParams`) and any parameters belonging to parent routes if needed.

```jsx
import { useParams } from "react-router-dom";

export default function UserDetail() {
  // Extracts the ':id' parameter defined in the child route path ('users/:id')
  const { id } = useParams();

  return (
    <div>
      <h4>User Detail Sub-Page</h4>
      <p>
        Displaying detailed records for User ID: <strong>{id}</strong>
      </p>
    </div>
  );
}
```

**`BrowserRouter`** and **`HashRouter`** are the two primary router implementations provided by React Router for managing client-side navigation. While they both achieve the same goal—updating the view without a full page refresh—they do so using entirely different mechanisms in the URL.

---

### 1. `BrowserRouter`

`BrowserRouter` uses the **HTML5 History API** (`pushState`, `replaceState`, and the `popstate` event) to keep your UI in sync with the URL.

- **URL Format:** Clean, standard URLs (e.g., `[https://example.com/dashboard/settings](https://example.com/dashboard/settings)`).
- **How it Works:** It modifies the real browser URL cleanly. When a user clicks a link, the URL updates seamlessly without reloading the page.
- **The Catch (Server Configuration):** Because the server sees the clean URL path (e.g., `/dashboard/settings`), if a user manually refreshes the page or types that URL directly into the browser, the web server tries to look for a physical file or route named `/dashboard/settings`. If the server isn't configured to redirect all requests back to `index.html`, it will return a **404 Not Found error**.
- **Best For:** Standard production web applications where you control the server configuration (e.g., configuring Nginx, Apache, Vercel, or Netlify to fallback to `index.html`).

---

### 2. `HashRouter`

`HashRouter` uses the **hash portion** of the URL (`window.location.hash`) to keep your UI in sync.

- **URL Format:** URLs include a hash symbol `#` (e.g., `[https://example.com/#/dashboard/settings](https://example.com/#/dashboard/settings)`).
- **How it Works:** Everything after the `#` symbol is handled entirely by the browser client-side and is **never sent to the server**. When the path changes, the server only ever receives the base URL (`[https://example.com/](https://example.com/)`), ignoring everything after the hash.
- **The Catch:**
- **No 404 Issues:** Because the server never sees the hash path, refreshing the page or deep-linking always loads the root server file successfully without requiring complex server configuration.
- **SEO & Aesthetics:** URLs look less professional. Furthermore, search engine crawlers historically struggled to index hash-based URLs properly, making `HashRouter` poor for SEO.

- **Best For:** Static file hosting where you cannot configure the server (e.g., GitHub Pages subpaths), legacy browsers, or internal tools/electron apps where clean SEO URLs don't matter.

---

### Comparison at a Glance

| Feature                    | `BrowserRouter`                                            | `HashRouter`                                                   |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| **URL Example**            | `[example.com/about/team](https://example.com/about/team)` | `[example.com/#/about/team](https://example.com/#/about/team)` |
| **Underlying API**         | HTML5 History API (`pushState`)                            | `window.location.hash`                                         |
| **Server Setup Required?** | Yes (Must redirect all requests to `index.html`)           | No (Server only sees root domain)                              |
| **SEO Friendly?**          | Yes                                                        | No                                                             |
| **Aesthetics**             | Clean, modern URLs                                         | Cluttered with `#`                                             |

**How React Router is different from the history library?**

The **`history` library** and **React Router** are separate tools that serve different layers of a client-side routing system. They are not competing alternatives; rather, **React Router uses the `history` library under the hood**.

---

### 1. The `history` Library (The Low-Level Engine)

The `history` library is a standalone, framework-agnostic JavaScript package. Its sole job is to manage session history across different environments (browsers, memory, or non-browser setups) by abstracting away the messy details of native APIs like `window.history`.

- **What it does:**
- Tracks the current URL location and session stack.
- Provides methods to change the location imperatively (e.g., `history.push()`, `history.replace()`, `history.goBack()`).
- Listens for changes (e.g., `history.listen()`) when a user clicks the browser's back/forward buttons.

- **Scope:** It knows **nothing** about React, UI rendering, components, or JSX. It is purely a URL and navigation state manager.

---

### 2. React Router (The High-Level Framework)

React Router is a React-specific library built on top of the `history` library.

- **What it does:**
- Takes the raw location data provided by the `history` library and maps it to a **declarative component tree** (using `<Routes>`, `<Route>`, `<Outlet>`, etc.).
- Intercepts standard clicks on `<Link>` components to prevent full-page browser reloads and tell `history` to update instead.
- Provides React context and hooks (like `useNavigate`, `useParams`, and `useLocation`) so your components can easily read or alter routing state.

- **Scope:** It focuses entirely on **UI rendering and component lifecycles** based on what the URL dictates.

---

### Summary of Differences

| Feature                  | The `history` Library                                           | React Router                                                        |
| ------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Primary Role**         | Manages URL session state and navigation tracking imperatively. | Renders UI components declaratively based on the current URL.       |
| **Framework Dependency** | Framework-agnostic (Vanilla JS, React, Vue, etc.).              | Built specifically for React.                                       |
| **DOM / UI Awareness**   | None. It doesn't render HTML or know what components are.       | High. Manages component mounts, unmounts, and layouts (`<Outlet>`). |
| **Developer API**        | Imperative methods like `history.push('/path')`.                | Declarative components (`<Route>`) and hooks (`useNavigate()`).     |

React Router is a routing library for React that provides a declarative API for defining routes and handling navigation. It manages components and URLs.

History library is a lower-level utility that only manages browser history (e.g., pushing and popping history entries). It doesn't handle UI rendering or routing, making it more generic and not React-specific.

React Router uses the history library internally but adds additional features like routing and component management.

React Router has evolved significantly across these versions, transitioning from a purely component-based client library into a unified, full-stack framework ecosystem.

The primary **router components**—the top-level wrappers that initialize routing context—differ based on whether you are using traditional **Declarative mode** (client-side SPAs) or **Data/Framework mode** (data loaders, SSR, and modern paradigms).

---

### 1. React Router v6 (The Modern Data/Declarative Split)

React Router v6 introduced a major rewrite. While it kept traditional declarative components, v6.4+ introduced **Data Routers** powered by a configuration object.

- **`<BrowserRouter>` / `<HashRouter>` / `<MemoryRouter>`:**
- The classic top-level wrappers used in **Declarative mode**. They wrap your component tree and use either the HTML5 history API, URL hashes, or an in-memory history stack.

- **`<RouterProvider>`:**
- Introduced in v6.4 to support **Data mode** (loaders, actions, error boundaries). Instead of wrapping JSX route components, you pass it a router object created via `createBrowserRouter()`.

---

### 2. React Router v7 (The Remix Convergence)

React Router v7 merged with Remix, unifying single-page applications and full-stack framework features under a single package (`react-router` instead of separating `react-router-dom`).

- **`<RouterProvider>`:**
- Becomes the primary recommended top-level component for production apps utilizing Data and Framework modes (SSR, file-based routing, type-safe route modules).

- **`<BrowserRouter>`:**
- Still supported for lightweight client-side **Declarative mode**, but imports are streamlined directly from `'react-router'` rather than `'react-router-dom'`.

---

### 3. React Router v8 (Modern Baseline & Architecture)

React Router v8 standardizes architectural features like **built-in request middleware** as a baseline and removes legacy DOM re-export wrappers (`react-router-dom` is no longer used; everything is imported from `react-router`).

- **`<RouterProvider>`:**
- The standard wrapper for modern data-driven and full-stack framework instances, fully integrating advanced server middleware pipelines and environment configurations.

- **`<BrowserRouter>`:**
- Retained for basic client-side-only declarative fallbacks, though framework and data-router modes (`RouterProvider`) remain the heavily favored architectural standard.

---

### Summary of Core Router Components Across Versions

| Router Component       | Role & Mode                                 | v6 Status                           | v7 Status                  | v8 Status                        |
| ---------------------- | ------------------------------------------- | ----------------------------------- | -------------------------- | -------------------------------- |
| **`<RouterProvider>`** | Data/Framework Mode (loaders, actions, SSR) | Introduced (v6.4+)                  | Primary recommended        | Standard for data/framework apps |
| **`<BrowserRouter>`**  | Declarative Mode (SPA history tracking)     | Core component (`react-router-dom`) | Supported (`react-router`) | Supported (`react-router`)       |
| **`<HashRouter>`**     | Declarative Mode (Hash-based history)       | Supported                           | Supported                  | Supported                        |
| **`<MemoryRouter>`**   | Testing / Non-browser environments          | Supported                           | Supported                  | Supported                        |

In React Router v6, the key <Router> components are:

<BrowserRouter>: Uses the HTML5 history API to keep the UI in sync with the URL. It's commonly used for web applications.
<HashRouter>: Uses URL hash fragments (#) to manage routing, making it suitable for static file hosting or legacy browsers that don't support the HTML5 history API.
<MemoryRouter>: Keeps the URL in memory (no address bar changes), useful for non-browser environments like tests or embedded apps.
<StaticRouter>: Used for server-side rendering (SSR), where routing is handled without a browser, typically in Node.js environments.
Each of these routers serves different use cases but provides the same routing functionality within a React app.

The `push` and `replace` methods are core functions used to manipulate the browser's history stack programmatically, allowing you to change the URL and navigate between views without triggering a full page reload.

---

### 1. The `push` Method

- **Purpose:** Adds a **new entry** to the browser's history stack.
- **How it behaves:** When you navigate using `push`, the browser records the new page on top of the existing stack.
- **User Experience:** The user can click the browser's **"Back"** button to return to the previous page they were just on.
- **Common Use Case:** Standard navigation, such as clicking a link, moving to a next page, or submitting a form to view a success/detail screen.

---

### 2. The `replace` Method

- **Purpose:** **Replaces** the current entry on the browser's history stack with the new one.
- **How it behaves:** Instead of adding a new layer, it swaps out the current URL in the history stack, keeping the stack length the same.
- **User Experience:** The user **cannot** use the browser's "Back" button to return to the page that was replaced.
- **Common Use Case:** Redirecting unauthorized users away from a login page, handling error states/invalid URLs (so users don't get trapped clicking back into a 404 page), or after completing a destructive action like deleting an item.

---

### Comparison at a Glance

| Feature                   | `push`                               | `replace`                                                     |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------- |
| **History Stack Action**  | Adds a new entry on top.             | Overwrites/swaps the current entry.                           |
| **Stack Length**          | Increases by 1.                      | Stays the same.                                               |
| **Browser "Back" Button** | Takes the user to the previous page. | Skips the previous page entirely.                             |
| **Typical Use Case**      | Standard forward navigation.         | Redirects, login transitions, or cleaning up sensitive steps. |

_(Note: In modern React Router v6+, these low-level methods are handled via the `useNavigate` hook, where passing `{ replace: true }` triggers a replacement instead of a push)._

This [React JS | Programmatically navigate | Routing | history push vs replace](https://www.youtube.com/watch?v=58JwXUEy07w) video provides a helpful overview of how these programmatic navigation methods work in practice.

**How do you navigate programmatically in React Router?**
In modern React Router, programmatic navigation (navigating automatically when an action completes, such as submitting a form or clicking a custom button) is handled primarily using the **`useNavigate`** hook.

---

### 1. Using the `useNavigate` Hook (Recommended)

The `useNavigate` hook returns a navigation function that accepts either a path string or a numeric delta to move through the history stack.

```jsx
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Perform login logic...

    // Programmatically navigate to the dashboard
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Log In</button>
    </form>
  );
}
```

---

### Key Navigation Options

#### A. Replacing the History Entry (`replace: true`)

By default, `navigate('/path')` uses a **push** operation. If you want to redirect the user without adding a new entry to the browser history (preventing them from clicking "Back" to return to this screen), pass `{ replace: true }`:

```jsx
// Replaces current entry on the history stack (useful for redirects or post-login)
navigate("/dashboard", { replace: true });
```

#### B. Passing State via Navigation

You can pass custom data into the target route using the `state` option. The target route can read this data using the **`useLocation`** hook.

```jsx
// Sending state with navigation
navigate("/profile", { state: { fromLogin: true, userId: 101 } });
```

To read that state on the target page:

```jsx
import { useLocation } from "react-router-dom";

function Profile() {
  const location = useLocation();
  console.log(location.state); // { fromLogin: true, userId: 101 }
}
```

#### C. Navigating Back or Forward (Delta)

You can pass an integer into `navigate()` to move backward or forward through the browser history stack:

```jsx
// Go back 1 page (same as clicking browser's "Back" button)
navigate(-1);

// Go forward 1 page
navigate(1);

// Go back 2 pages
navigate(-2);
```

---

### 2. Declarative Redirects with `<Navigate/>`

If you need to trigger a programmatic redirect purely during a component's render phase (for instance, when enforcing protected routes), use the **`<Navigate/>`** component:

```jsx
import { Navigate } from "react-router-dom";

function ProtectedDashboard({ isAuthenticated }) {
  if (!isAuthenticated) {
    // Automatically redirects to /login when rendered
    return <Navigate to="/login" replace={true} />;
  }

  return <h1>Welcome to your private dashboard!</h1>;
}
```

In React Router v6, you can navigate programmatically by using the useNavigate hook. First, import useNavigate from react-router-dom and call it to get the navigate function. Then, you can use navigate('/new-page') to navigate to a different route.

For example:

```js
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();
  const goToPage = () => navigate("/new-page");
  return <button onClick={goToPage}>Go to New Page</button>;
}
```

In React Router v5, the useHistory hook provides access to the history object, which you can use to push a new route. For example, history.push('/new-page') will navigate to the specified route.

For example:

```js
import { useHistory } from "react-router-dom";

function MyComponent() {
  const history = useHistory();
  const goToPage = () => history.push("/new-page");
  return <button onClick={goToPage}>Go to New Page</button>;
}
```

Both methods allow you to navigate programmatically in React Router

**How would you implement route guards or private routes in React?**

In modern React Router, programmatic navigation (navigating automatically when an action completes, such as submitting a form or clicking a custom button) is handled primarily using the **`useNavigate`** hook.

---

### 1. Using the `useNavigate` Hook (Recommended)

The `useNavigate` hook returns a navigation function that accepts either a path string or a numeric delta to move through the history stack.

```jsx
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Perform login logic...

    // Programmatically navigate to the dashboard
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Log In</button>
    </form>
  );
}
```

---

### Key Navigation Options

#### A. Replacing the History Entry (`replace: true`)

By default, `navigate('/path')` uses a **push** operation. If you want to redirect the user without adding a new entry to the browser history (preventing them from clicking "Back" to return to this screen), pass `{ replace: true }`:

```jsx
// Replaces current entry on the history stack (useful for redirects or post-login)
navigate("/dashboard", { replace: true });
```

#### B. Passing State via Navigation

You can pass custom data into the target route using the `state` option. The target route can read this data using the **`useLocation`** hook.

```jsx
// Sending state with navigation
navigate("/profile", { state: { fromLogin: true, userId: 101 } });
```

To read that state on the target page:

```jsx
import { useLocation } from "react-router-dom";

function Profile() {
  const location = useLocation();
  console.log(location.state); // { fromLogin: true, userId: 101 }
}
```

#### C. Navigating Back or Forward (Delta)

You can pass an integer into `navigate()` to move backward or forward through the browser history stack:

```jsx
// Go back 1 page (same as clicking browser's "Back" button)
navigate(-1);

// Go forward 1 page
navigate(1);

// Go back 2 pages
navigate(-2);
```

---

### 2. Declarative Redirects with `<Navigate/>`

If you need to trigger a programmatic redirect purely during a component's render phase (for instance, when enforcing protected routes), use the **`<Navigate/>`** component:

```jsx
import { Navigate } from "react-router-dom";

function ProtectedDashboard({ isAuthenticated }) {
  if (!isAuthenticated) {
    // Automatically redirects to /login when rendered
    return <Navigate to="/login" replace={true} />;
  }

  return <h1>Welcome to your private dashboard!</h1>;
}
```

To implement private routes, create a component that checks if the user is authenticated before rendering the desired route.

Example:

```js
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}
```

PrivateRoute: Checks authentication and either renders the children (protected routes) or redirects to the login page.
<Navigate>: Replaces the deprecated <Redirect> for redirecting in React Router v6+.

**How do you manage the active route state in a multi-page React application?**

Managing the active route state in a multi-page (or single-page application with multiple views) React application is typically handled by dedicated routing libraries that synchronize the UI with the browser's URL history.

Here are the primary approaches and tools used to manage active route state effectively:

---

### 1. The Standard Approach: React Router (v6+)

In the React ecosystem, **React Router** is the industry standard for managing route state. It automatically handles the active route, URL parameters, query strings, and navigation history under the hood.

- **BrowserRouter & Routes:** Wraps your application to listen to history changes (`window.location`) and renders matching components based on the current path.
- **Active Link Styling (`NavLink`):** React Router provides a built-in `<NavLink>` component that automatically applies an `active` class (or allows an inline `style` callback) when the current URL matches the link's `to` prop.

```jsx
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Dashboard
      </NavLink>
    </nav>
  );
}
```

---

### 2. Accessing Route State programmatically

When you need to read or react to the current route state inside your components, React Router provides several essential hooks:

- **`useLocation()`:** Returns the current location object, containing the pathname, search query parameters, hash, and any state passed during navigation. Useful for triggering side-effects (like analytics page-views) when the route changes.
- **`useParams()`:** Extracts dynamic route parameters (e.g., `/users/:id`) directly from the URL.
- **`useSearchParams()`:** Manages query parameters (e.g., `?sort=asc&filter=active`) as reactive state, similar to `useState`.

```jsx
import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function ProductCatalog() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read a query parameter, e.g., ?category=shoes
  const category = searchParams.get("category");

  useEffect(() => {
    // Runs every time the route or path changes
    console.log("Current path:", location.pathname);
  }, [location]);

  return <div>Viewing category: {category}</div>;
}
```

---

### 3. Alternative Framework-Level Routing (Next.js / Remix)

If your "multi-page" React application is built using a modern full-stack framework like **Next.js** (App Router) or **Remix**, route state is managed entirely through the **file-system**.

- **File-System Routing:** Folders and files define the URL structure automatically (e.g., `app/dashboard/page.jsx` maps to `/dashboard`).
- **Active Route Hooks:**
- In Next.js, you use **`usePathname()`** from `next/navigation` to get the current route string and conditionally apply active states.
- In Remix, hooks like **`useNavigation()`** track whether a page transition or data mutation is actively pending.

```jsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

function Sidebar() {
  const pathname = usePathname();

  return (
    <Link href="/settings" className={pathname === "/settings" ? "active" : ""}>
      Settings
    </Link>
  );
}
```

---

### 4. Global State vs. URL State

A common architectural pitfall is storing active route data (like the currently selected tab, pagination page, or active filters) in global state managers like Redux or Zustand.

> **Best Practice:** Keep UI state tied to the URL whenever possible using query parameters or path segments. This ensures that the application state is **shareable, bookmarkable, and survives page refreshes**. Use global state only for transient data that shouldn't affect the browser history.
> **How do you handle 404 errors or page not found in React Router?**

Handling 404 (Not Found) errors in **React Router (v6+)** involves configuring a "catch-all" route that matches any URL path not explicitly defined by your application routes.

---

### 1. The Catch-All Route (`*`)

React Router allows you to use an asterisk (`*`) as a wildcard in the `path` prop of a `<Route>`. Because React Router evaluates routes in order of specificity, placing the wildcard route at the very **end** of your `<Routes>` block ensures it only triggers if no other routes match.

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Dashboard from "./Dashboard";
import NotFound from "./NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Catch-all route for any undefined paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

### 2. Creating the 404 Component

The component rendered by the wildcard route can be a simple page with a friendly message, navigation links back home, or even logic to capture analytics.

```jsx
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="home-link">
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
```

---

### 3. Handling Nested 404s (Layout-Level Catch-All)

If your application uses nested layouts (such as a dashboard layout with a sidebar where only specific sub-pages should trigger a 404), you can place a catch-all route inside the child `<Routes>` block:

```jsx
<Routes>
  {/* Parent route with a layout */}
  <Route path="/dashboard/*" element={<DashboardLayout />}>
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />

    {/* Triggers if someone visits /dashboard/random-invalid-page */}
    <Route path="*" element={<DashboardNotFound />} />
  </Route>

  {/* Global fallback for the entire app */}
  <Route path="*" element={<GlobalNotFound />} />
</Routes>
```

---

### 4. Important Considerations for Production

- **Server-Side Configuration:** Because React apps are typically Single Page Applications (SPAs) loaded via client-side routing, you must configure your web server (e.g., Nginx, Apache, Netlify, Vercel) to **redirect all incoming requests to `index.html**`. Otherwise, if a user refreshes or directly types a deep URL, the server itself will return a native 404 server error before React Router even loads.
- **HTTP Status Codes:** Client-side 404 components render visually, but the browser technically receives an `HTTP 200 OK` status code because the index shell loaded successfully. If proper SEO or server-side error logging is critical, consider using a full-stack framework like **Next.js** or **Remix**, which natively support true server-side `404` status responses.

**How to get query parameters in React Router?**

To get and manage query parameters in **React Router (v6+)**, you use the built-in **`useSearchParams`** hook. It acts very much like React's standard `useState` hook, but it reads and writes directly to the URL's query string.

---

### 1. Using `useSearchParams()`

The `useSearchParams` hook returns an array with two values:

1. An **URLSearchParams** object to read current query values.
2. A **setter function** to update the query parameters in the URL.

```jsx
import { useSearchParams } from "react-router-dom";

function ProductFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read a specific query parameter (e.g., /products?category=shoes&sort=asc)
  const category = searchParams.get("category"); // "shoes"
  const sortOrder = searchParams.get("sort"); // "asc"

  // Function to update query parameters programmatically
  const updateFilter = () => {
    setSearchParams({ category: "electronics", sort: "desc" });
  };

  return (
    <div>
      <p>Current Category: {category}</p>
      <p>Sort Order: {sortOrder}</p>
      <button onClick={updateFilter}>Change Filters</button>
    </div>
  );
}
```

---

### 2. Updating Single Parameters Without Overwriting Others

If you want to update just one query parameter (like changing a page number or search term) while keeping the rest intact, you can clone the existing `searchParams` object:

```jsx
import { useSearchParams } from "react-router-dom";

function Pagination() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Default to page 1 if not present
  const currentPage = searchParams.get("page") || "1";

  const goToNextPage = () => {
    const next = parseInt(currentPage, 10) + 1;

    // Pass a callback or new URLSearchParams object
    setSearchParams((prev) => {
      prev.set("page", next);
      return prev;
    });
  };

  return (
    <div>
      <p>Current Page: {currentPage}</p>
      <button onClick={goToNextPage}>Next Page</button>
    </div>
  );
}
```

---

### 3. Alternative: `useLocation()`

If you only need to **read** the raw query string once (for example, passing it to an external analytics tracker or parsing it manually), you can use the `useLocation` hook combined with the native JavaScript `URLSearchParams` constructor:

```jsx
import { useLocation } from "react-router-dom";

function AnalyticsTracker() {
  const location = useLocation();

  // location.search contains the full string, e.g., "?ref=newsletter&campaign=summer"
  const queryParams = new URLSearchParams(location.search);
  const ref = queryParams.get("ref");

  return <div>Referrer: {ref}</div>;
}
```

**How do you perform an automatic redirect after login in React Router?**
To perform an automatic redirect after login in React Router (v6+), you can use either the **`useNavigate`** hook inside an event handler or the declarative **`<Navigate>`** component.

Here are the standard approaches used to handle post-login navigation.

---

### 1. Using the `useNavigate` Hook (Imperative Approach)

The most common way to redirect after a successful login API call is to use the `useNavigate` hook inside your form submission or authentication handler.

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1. Perform your login API request
      // await authService.login(email, password);

      // 2. Redirect to the dashboard upon success
      // Use { replace: true } so the user can't click "Back" to return to the login page
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Log In</button>
    </form>
  );
}
```

---

### 2. Using the `<Navigate>` Component (Declarative Approach)

If your login state is stored globally (e.g., in a Context, Redux, or Zustand store), you can conditionally render the `<Navigate>` component as soon as the authentication state changes to logged-in.

```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Custom auth hook

function Login() {
  const { user } = useAuth();

  // If the user state becomes available, redirect immediately
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <h2>Please log in</h2>
      {/* Login form elements */}
    </div>
  );
}
```

---

### 3. Redirecting Back to the Intended Page (Protected Route pattern)

Often, a user tries to visit a protected page (like `/settings`), gets intercepted by a login wall, and should be sent back to `/settings` automatically after logging in instead of a generic dashboard.

You can handle this using route **location state**:

**Step 1: In your Protected Route wrapper, capture the attempted path:**

```jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Pass the current location in state so we can return here later
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```

**Step 2: In your Login component, read the state and redirect back:**

```jsx
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback to "/dashboard" if no previous location was saved
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSuccessfulLogin = () => {
    navigate(from, { replace: true });
  };

  // ... render form
}
```

**. How do you pass props to a route component in React Router?**

In **React Router (v6+)**, passing props to a route component is straightforward because the `element` prop accepts standard JSX. Instead of specialized `render` or `component` props used in older versions, you simply instantiate your component inside the JSX tags and pass your custom props directly.

---

### 1. Passing Custom Props Directly

You can pass static or dynamic values straight into the component element inside the `<Route>` definition.

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./Profile";

function App() {
  const userRole = "admin";

  return (
    <BrowserRouter>
      <Routes>
        {/* Pass custom props directly to the element JSX */}
        <Route
          path="/profile"
          element={<Profile role={userRole} theme="dark" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
```

---

### 2. Passing Dynamic URL Parameters as Props

If you want to extract dynamic segments from the URL (like a user ID) and pass them down as component props, you can wrap the target component or extract them using hooks inside the component itself.

> **Best Practice:** React Router recommends using built-in hooks like `useParams()` directly inside your child component rather than manually parsing and passing them from the router configuration.

```jsx
import { Routes, Route, useParams } from "react-router-dom";

// 1. Component uses the hook internally
function UserProfile() {
  let { userId } = useParams();
  return <div>User ID: {userId}</div>;
}

function App() {
  return (
    <Routes>
      <Route path="/user/:userId" element={<UserProfile />} />
    </Routes>
  );
}
```

If you _must_ pass route parameters as standard component props (for instance, when wrapping a generic or legacy component), you can create a simple wrapper component:

```jsx
import { Routes, Route, useParams } from "react-router-dom";

// Wrapper to convert router hooks into traditional props
function UserProfileWrapper({ Component }) {
  const params = useParams();
  return <Component {...params} />;
}

// Usage in Routes
<Route
  path="/user/:userId"
  element={<UserProfileWrapper Component={MyGenericProfileComponent} />}
/>;
```
