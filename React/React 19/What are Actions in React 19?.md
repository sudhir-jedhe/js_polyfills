**Actions** in React 19 are a standardized design pattern for handling asynchronous operations—such as submitting a form, updating a database, or making an API request—directly integrated into React's core lifecycle.

Before React 19, handling a simple form submission required a lot of repetitive boilerplate: writing an `onSubmit` handler, calling `e.preventDefault()`, manually extracting data from a `FormData` object, setting up a `try/finally` block to manage loading spinners, and storing error messages in separate state variables.

Actions completely automate this lifecycle.

---

### How Actions Work

An **Action** is simply a JavaScript function (which can be asynchronous) that React manages for you. When you pass an Action to elements like `<form action={fn}>`, React takes over the execution flow:

1. **Automatic Pending States:** React automatically tracks when the action is running, letting you disable buttons or show loaders via hooks like `useActionState` or `useTransition`.
2. **Automatic Error Handling:** Actions integrate with Error Boundaries to catch failures gracefully.
3. **Optimistic Updates Integration:** Actions pair seamlessly with `useOptimistic` to update the UI instantly while the action resolves in the background.

---

### Code Example: Form Actions

Here is how clean a form becomes using React 19 Actions. Notice there is no `onSubmit`, no `e.preventDefault()`, and no manual state management for loading.

```jsx
import { useActionState } from "react";

// This is an Action (can be a Server Action or run on the client)
async function updateName(previousState, formData) {
  const name = formData.get("name");

  const response = await fetch('/api/update', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    return { success: false, error: "Failed to update" };
  }

  return { success: true, error: null };
}

export default function NameForm() {
  // useActionState binds the Action to React's lifecycle
  const [state, formAction, isPending] = useActionState(updateName, { success: false, error: null });

  return (
    {/* Pass the action directly to the form */}
    <form action={formAction}>
      <input type="text" name="name" placeholder="New name" />

      {/* isPending automatically turns true while updateName is running */}
      <button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update"}
      </button>

      {state.error && <p>{state.error}</p>}
    </form>
  );
}

```

---

### Client Actions vs. Server Actions

Actions can live entirely on the client, but they are designed to easily extend to the server (especially in frameworks like Next.js or Remix).

- **Client Actions:** Regular async functions that run in the user's browser, handling standard API calls.
- **Server Actions:** Functions marked with the `"use server"` directive at the top. When passed to a form, React automatically serializes the form data and makes a secure POST request to the backend server to execute the function directly on your database, shipping zero client-side JavaScript for that mutation.

By convention, an Action is an async function passed to a React API that runs it inside a transition: useActionState, startTransition (from useTransition), or a <form action={...}> prop. React tracks pending state, surfaces errors, and applies updates inside a transition so the UI stays responsive. This removes the usual boilerplate of toggling a loading flag, wrapping in try/catch, and managing error and data state separately.

```js
import { useActionState } from "react";

async function updateName(prevState, formData) {
  const name = formData.get("name");
  const error = await saveName(name);
  if (error) return { error };
  return { name };
}

function NameForm() {
  const [state, dispatchAction, isPending] = useActionState(updateName, {
    name: "",
  });
  return (
    <form action={dispatchAction}>
      <input name="name" defaultValue={state.name} />
      <button disabled={isPending}>Save</button>
      {state.error && <p>{state.error}</p>}
    </form>
  );
}
```
