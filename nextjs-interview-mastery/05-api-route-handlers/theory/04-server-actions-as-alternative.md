# Server Actions: A Mutation Path That Isn't a Fetch

Server Actions are async functions that run exclusively on the server but can be **called directly from Client Components as if they were local functions** — no `fetch`, no manually-defined API route, no client-side serialization code. You mark a function (or an entire module) with the `"use server"` directive, and Next.js generates the network plumbing for you at build time.

```js
// app/actions/create-note.js
'use server';

export async function createNote(formData) {
  const title = formData.get('title');
  if (!title || title.length < 1) {
    return { error: 'Title is required' };
  }

  // direct DB/ORM call — no HTTP hop, no route file
  const note = await db.note.create({ data: { title } });
  return { success: true, note };
}
```

```jsx
// app/new-note-form.jsx
'use client';

import { createNote } from './actions/create-note';
import { useFormState } from 'react-dom';

export default function NewNoteForm() {
  const [state, formAction] = useFormState(createNote, {});

  return (
    <form action={formAction}>
      <input name="title" />
      {state?.error && <p className="error">{state.error}</p>}
      <button type="submit">Add note</button>
    </form>
  );
}
```

Two invocation styles matter. The idiomatic one is passing the action straight to a `<form action={...}>` — React and Next.js handle serializing the `FormData`, progressive enhancement (it still works with JS disabled, since it's a real form submission under the hood), and pending/error states via `useFormState`/`useFormStatus`. The second style is calling the action like a normal async function from an event handler:

```jsx
'use client';
import { deleteNote } from './actions/delete-note';

export default function DeleteButton({ id }) {
  return <button onClick={() => deleteNote(id)}>Delete</button>;
}
```

Under the hood, Next.js still performs a `POST` to a special internal endpoint carrying a serialized reference to the action — but you never write or see that request. The framework handles it, including re-validating any cache tags you invalidate with `revalidatePath()`/`revalidateTag()` inside the action.

A subtlety interviewers probe: Server Actions can be defined inline inside a Server Component file (`async function action() { 'use server'; ... }` nested in the component) or exported from a separate `'use server'` module for reuse across Client Components. Inline actions are convenient for one-off form handlers colocated with the Server Component that renders the form; a shared `'use server'` file is right when multiple Client Components need to call the same mutation (e.g., a delete button reused in a list and a detail page).

Because Server Actions are just server-side functions with a generated RPC boundary, they get you the same "no client bundle bloat, secrets stay on server" benefits as Route Handlers, but with far less boilerplate for the common case of "a form on my own site needs to mutate my own database." They are not, however, a substitute for a public API — that distinction is covered in the next theory file.
