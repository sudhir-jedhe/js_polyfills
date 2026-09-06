React Router data routers handle mutations using **`action` functions** paired with the **`<Form>` component**. When a `<Form>` is submitted, React Router intercepts the browser request, executes the route's `action`, and **automatically revalidates** (re-runs) all active loaders on the page, keeping your UI in sync without manual state management.

---

### 1. Define the Action and Route Configuration

An `action` receives an object containing `request` and `params`. You extract form fields via `request.formData()`:

```jsx
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import ProjectDetails, { projectLoader } from "./ProjectDetails";
import EditProject from "./EditProject";

// Action function for handling updates to /projects/:projectId/edit
async function editProjectAction({ request, params }) {
  const formData = await request.formData();
  
  // Extract input values using their input "name" attributes
  const updates = {
    name: formData.get("name"),
    status: formData.get("status"),
    description: formData.get("description"),
  };

  // Validation example: return errors directly to the form
  if (!updates.name || updates.name.trim().length === 0) {
    return { error: "Project name is required" };
  }

  // Send the mutation to the backend
  const res = await fetch(`https://api.example.com/projects/${params.projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    throw new Response("Failed to update project", { status: res.status });
  }

  // Redirect back to the details view on success
  return redirect(`/projects/${params.projectId}`);
}

export const router = createBrowserRouter([
  {
    path: "/projects/:projectId",
    element: <ProjectDetails />,
    loader: projectLoader,
  },
  {
    path: "/projects/:projectId/edit",
    element: <EditProject />,
    loader: projectLoader, // Reuse loader to pre-populate form
    action: editProjectAction,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

```

---

### 2. Building the Form Component

Use `<Form method="post">` instead of a regular HTML form. Use `useActionData()` to read validation errors returned from the action, and `useNavigation()` to manage submission states.

```jsx
import {
  Form,
  useLoaderData,
  useActionData,
  useNavigation,
  Link,
} from "react-router-dom";

export default function EditProject() {
  const project = useLoaderData();
  const actionData = useActionData(); // Accesses { error: ... } if validation fails
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <h2>Edit Project: {project.name}</h2>

      {/* Show validation errors returned by the action */}
      {actionData?.error && (
        <p style={{ color: "crimson" }}>{actionData.error}</p>
      )}

      <Form method="post">
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name">Project Name</label>
          <br />
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={project.name}
            disabled={isSubmitting}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="status">Status</label>
          <br />
          <select
            id="status"
            name="status"
            defaultValue={project.status}
            disabled={isSubmitting}
          >
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="description">Description</label>
          <br />
          <textarea
            id="description"
            name="description"
            defaultValue={project.description}
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <Link to={`/projects/${project.id}`}>Cancel</Link>
        </div>
      </Form>
    </div>
  );
}

```

---

### 3. In-Place Mutations with `useFetcher`

When performing mutations that **do not need a URL change or page transition** (e.g., toggling a star, changing a status badge, or deleting an item from a list), use the `useFetcher` hook instead of `<Form>`:

```jsx
import { useFetcher } from "react-router-dom";

export function QuickStatusToggle({ projectId, currentStatus }) {
  const fetcher = useFetcher();

  // Optimistic UI: display target state immediately while submitting
  const isUpdating = fetcher.state === "submitting";
  const displayedStatus = isUpdating
    ? fetcher.formData.get("newStatus")
    : currentStatus;

  return (
    <fetcher.Form method="post" action={`/projects/${projectId}/quick-status`}>
      <input
        type="hidden"
        name="newStatus"
        value={displayedStatus === "Active" ? "Paused" : "Active"}
      />
      <button type="submit" disabled={isUpdating}>
        {displayedStatus === "Active" ? "Pause Project" : "Resume Project"}
      </button>
    </fetcher.Form>
  );
}

```

### Key Lifecycle Guarantees

* **Automatic Revalidation:** Whenever any `action` finishes executing successfully, React Router automatically invokes all active route `loaders` in parallel. You do not need `queryClient.invalidateQueries()` or manual refetch hooks.
* **No `e.preventDefault()`:** `<Form>` handles event cancellation, FormData extraction, serialization, and abort-controller cleanup automatically.
