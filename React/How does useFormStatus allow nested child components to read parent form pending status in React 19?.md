In React 19, **`useFormStatus`** is a specialized hook from `react-dom` that allows deeply nested child components to access the submission status, data, and HTTP method of their parent `<form>` **without prop drilling or custom Context providers**.

It acts like an implicit React Context subscription created automatically by any `<form action={...}>`.

---

### The Problem It Solves: Prop Drilling Form State

In earlier React versions, disabling a submit button or showing an inline spinner inside a nested field component required lifting `isPending` state up to the form and drilling it down through every intermediate component:

```tsx
// ❌ Old Way: Prop drilling `isPending` through layouts to reach the submit button
<Form isPending={isPending}>
  <FormBody>
    <InputFields isPending={isPending} />
    <SubmitButton isPending={isPending} />
  </FormBody>
</Form>

```

---

### The React 19 Solution: `useFormStatus`

With `useFormStatus`, the child component automatically hooks into the nearest parent `<form>`:

```tsx
'use client';

import { useFormStatus } from 'react-dom';

// 1. Nested Submit Button Component
export function SubmitButton({ label = 'Submit' }: { label?: string }) {
  // Reads status directly from the nearest parent <form>
  const { pending, data, method, action } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 transition"
    >
      {pending ? 'Submitting...' : label}
    </button>
  );
}

```

```tsx
// 2. Parent Form Component
import { SubmitButton } from './SubmitButton';
import { updateProfile } from './actions';

export function ProfileForm() {
  return (
    <form action={updateProfile} className="space-y-4">
      <input name="username" placeholder="Username" required className="border p-2 rounded" />
      <input name="email" type="email" placeholder="Email" required className="border p-2 rounded" />

      {/* No props needed! SubmitButton reads the form status automatically */}
      <SubmitButton label="Save Changes" />
    </form>
  );
}

```

---

### What `useFormStatus()` Returns

The hook returns an object containing four properties:

```tsx
const { pending, data, method, action } = useFormStatus();

```

* **`pending` (`boolean`):** `true` if the parent `<form>` is actively executing its async `action` or Server Action; `false` otherwise.
* **`data` (`FormData | null`):** A `FormData` instance containing the submitted values. If no submission is pending, it evaluates to `null`.
* **`method` (`string | null`):** The HTTP method used (`"get"` or `"post"`). Defaults to `"get"` for standard forms, or `"post"` for Server Actions.
* **`action` (`function | string | null`):** A reference to the function or URI passed to the parent `<form action={...}>`.

---

### Practical Use Cases

#### 1. Live Optimistic Input Preview

You can read `data` to preview the value being submitted inside any child component while the submission is in flight:

```tsx
function SubmissionSummary() {
  const { pending, data } = useFormStatus();

  if (!pending || !data) return null;

  return (
    <div className="text-sm text-gray-500 italic">
      Submitting update for: <strong>{data.get('username') as string}</strong>...
    </div>
  );
}

```

#### 2. Multiple Distinct Submit Buttons

If a form contains multiple submit buttons that perform different actions, each button can inspect the active `action`:

```tsx
function ActionButtons() {
  const { pending, action } = useFormStatus();

  return (
    <div className="flex gap-2">
      <button
        type="submit"
        formAction={publishPost}
        disabled={pending}
      >
        {pending && action === publishPost ? 'Publishing...' : 'Publish'}
      </button>

      <button
        type="submit"
        formAction={saveDraft}
        disabled={pending}
      >
        {pending && action === saveDraft ? 'Saving Draft...' : 'Save Draft'}
      </button>
    </div>
  );
}

```

---

### The #1 Rule: Must Be Called in a Child of `<form>`

> **Important Constraint:** `useFormStatus` will **not** return status information if it is called in the same component that renders the `<form>` tag. It must be called from a component rendered **inside** the form's children.

```tsx
// ❌ WRONG: useFormStatus called in the SAME component that renders <form>
function BadForm() {
  const { pending } = useFormStatus(); // ⚠️ `pending` will ALWAYS be false!

  return (
    <form action={myAction}>
      <button disabled={pending}>Submit</button>
    </form>
  );
}

// ✅ CORRECT: useFormStatus called inside a child component
function GoodForm() {
  return (
    <form action={myAction}>
      <SubmitButton /> {/* Hook lives inside this child */}
    </form>
  );
}

```

---

### Comparison: `useActionState` vs. `useFormStatus`

| Feature              | `useActionState`                                  | `useFormStatus`                                |
| -------------------- | ------------------------------------------------- | ---------------------------------------------- |
| **Location**         | In the component defining the action/form         | In **child leaf components** inside the form   |
| **Primary Role**     | Manages action return state, errors, and dispatch | Reads parent form's pending state & `FormData` |
| **Prop Requirement** | Returns `[state, formAction, isPending]`          | Returns `{ pending, data, method, action }`    |
| **Use Case**         | Error display, state updates, form bindings       | Submit buttons, spinners, field disabling      |
