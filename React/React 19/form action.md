In React 19, the `<form>` element's `action` prop received a massive upgrade. While standard HTML requires the `action` prop to be a URL string, **React 19 allows you to pass a function (including async functions) directly to the `action` prop.**

These functions are referred to as **Actions**. This shift drastically reduces the boilerplate required to handle form submissions, eliminating the need for manual event handlers, `e.preventDefault()`, and custom state tracking just to submit data.

### The Old Way vs. React 19

Before React 19, a standard form submission required managing local state, preventing default browser behavior, and manually extracting data from the event:

```jsx
// BEFORE REACT 19
import { useState } from "react";

export default function UserForm() {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    // Manually extract data
    const formData = new FormData(e.target);
    await fetch("/api/user", {
      method: "POST",
      body: formData,
    });

    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      <button type="submit" disabled={isPending}>
        Submit
      </button>
    </form>
  );
}
```

In React 19, you pass an action function directly to the `action` prop. React automatically handles the submission event and passes the native `FormData` object directly to your function:

```jsx
// IN REACT 19
export default function UserForm() {
  // This is an "Action"
  async function submitUser(formData) {
    const username = formData.get("username");
    await fetch("/api/user", {
      method: "POST",
      body: formData,
    });
  }

  return (
    // Pass the function directly
    <form action={submitUser}>
      <input name="username" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### How the `action` Prop Interacts with New Hooks

Passing a function to `action` is just the foundation. React 19 introduced several new hooks designed specifically to plug into this new form architecture:

#### 1. `useActionState` (Handling Success and Errors)

If your form needs to display server errors or success messages, you wrap your action function in `useActionState`. It manages the state returned by your action function and automatically provides a pending state.

```jsx
import { useActionState } from "react";

// Note: Action functions passed to useActionState receive
// the previous state as their first argument.
async function submitUser(previousState, formData) {
  const result = await myApiCall(formData);
  if (result.error) return result.error;
  return "User created successfully!";
}

export default function UserForm() {
  // Returns the current state, the action to pass to the form, and a pending boolean
  const [state, formAction, isPending] = useActionState(submitUser, null);

  return (
    <form action={formAction}>
      <input name="username" />
      <button type="submit" disabled={isPending}>
        Submit
      </button>
      {state && <p>{state}</p>}
    </form>
  );
}
```

#### 2. `useFormStatus` (Managing Pending States in Children)

If you have deeply nested components (like a custom submit button) and want to know if the parent form is currently submitting, you no longer need to pass `isPending` props down via context. `useFormStatus` reads the status of the parent `<form>`'s action.

```jsx
import { useFormStatus } from "react-dom";

function SubmitButton() {
  // Automatically detects if the parent form's action is currently running
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  );
}
```

---

### Key Benefits of the New `action` Prop

- **Automatic Uncontrolled Reset:** If the action succeeds, React will automatically reset the form for uncontrolled components. (If you need to trigger a manual reset, React 19 provides a new `requestFormReset` API).
- **Progressive Enhancement:** If you are using React Server Components (like in Next.js), Server Actions passed to the `action` prop allow the form to submit and function before the client-side JavaScript bundle has even finished loading.
- **Built-in Transitions:** React automatically wraps the `action` function in a Transition (via `useTransition` under the hood). This means the UI remains responsive and isn't blocked while the async form submission is processing.
- **Method Override:** When a function is passed to the `action` prop, React automatically sets the HTTP method to `POST` behind the scenes, regardless of what the HTML `method` attribute dictates.
