Using `createBrowserRouter` with **loaders** eliminates `useEffect` data fetching waterfalls by parallelizing data fetching before components render. In nested setups, parent and child loaders run in parallel across the route tree.

---

### Route Configuration (`createBrowserRouter`)

Define the routes as an object hierarchy. Each route can specify an `element`, a `loader`, and child `children`.

```jsx
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  NavLink,
  useLoaderData,
  useNavigation,
} from "react-router-dom";

// 1. Parent Loader: Fetches the list of projects
async function projectsLoader() {
  const res = await fetch("https://api.example.com/projects");
  if (!res.ok) throw new Response("Failed to load projects", { status: res.status });
  return res.json();
}

// 2. Child Loader: Receives route `params` to fetch the specific project
async function projectDetailsLoader({ params }) {
  const res = await fetch(`https://api.example.com/projects/${params.projectId}`);
  if (!res.ok) {
    throw new Response("Project Not Found", { status: 404 });
  }
  return res.json();
}

// 3. Router Definition
export const router = createBrowserRouter([
  {
    path: "/projects",
    element: <ProjectsLayout />,
    loader: projectsLoader,
    errorElement: <ProjectsError />,
    children: [
      {
        index: true,
        element: <p>Select a project from the sidebar to view details.</p>,
      },
      {
        path: ":projectId",
        element: <ProjectDetails />,
        loader: projectDetailsLoader,
        errorElement: <ProjectDetailError />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

```

---

### Parent Layout (`ProjectsLayout`)

Call `useLoaderData()` to retrieve the array returned by `projectsLoader`. The `<Outlet/>` renders the nested child view.

```jsx
export function ProjectsLayout() {
  const projects = useLoaderData();
  const navigation = useNavigation();

  // navigation.state can be "idle", "loading", or "submitting"
  const isNavigating = navigation.state === "loading";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar navigation */}
      <aside style={{ width: "260px", borderRight: "1px solid #ddd", padding: "1rem" }}>
        <h3>Projects</h3>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {projects.map((project) => (
              <li key={project.id} style={{ margin: "6px 0" }}>
                <NavLink
                  to={project.id}
                  style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive ? "#0066cc" : "inherit",
                  })}
                >
                  {project.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "1.5rem", opacity: isNavigating ? 0.6 : 1 }}>
        <Outlet />
      </main>
    </div>
  );
}

```

---

### Child Component (`ProjectDetails`)

The child route accesses its loader data through `useLoaderData()`. No manual fetching or `useEffect` dependencies on `projectId` are required—React Router calls the child loader automatically whenever the URL parameter changes.

```jsx
import { useLoaderData, Link } from "react-router-dom";

export function ProjectDetails() {
  const project = useLoaderData();

  return (
    <div>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <dl>
        <dt>Status</dt>
        <dd>{project.status}</dd>
        <dt>Owner</dt>
        <dd>{project.owner}</dd>
      </dl>
    </div>
  );
}

```

---

### Handling Errors & Accessing Parent Data

* **Scoped Error Boundaries:** Setting `errorElement` at both the parent and child level ensures an error in `:projectId` only replaces the `<Outlet/>` area with `ProjectDetailError`, keeping the parent sidebar intact.
* **Accessing Parent Data in Children:** If the child component needs the data returned by the parent loader instead of re-fetching it, assign an `id` to the parent route and use `useRouteLoaderData`:

```jsx
// In route definition:
{
  path: "/projects",
  id: "projects-root",
  loader: projectsLoader,
  children: [ ... ]
}

// In child component:
import { useRouteLoaderData } from "react-router-dom";

export function ProjectSummary() {
  const allProjects = useRouteLoaderData("projects-root");
  return <div>Total projects: {allProjects.length}</div>;
}

```
