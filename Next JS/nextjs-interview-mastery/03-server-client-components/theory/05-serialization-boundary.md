# The Serialization Boundary: What Can Cross from Server to Client

When a Server Component renders a Client Component and passes it props, those props have to cross a real boundary — from the server render (which produces a special RSC payload, not literal JavaScript objects) into the client bundle that will hydrate. That boundary requires props to be **serializable**.

Serializable means: primitives (strings, numbers, booleans, `null`, `undefined`), plain objects and arrays composed of serializable values, `Date` objects, and a few other specific types React's RSC serialization format supports. **Not** serializable: functions, class instances (other than a few special-cased ones), `Map`/`Set` in some configurations, Symbols, and anything holding a reference to something that only makes sense on the server (like an open database connection or a React `ref`).

```tsx
// app/page.tsx — Server Component
import { InteractiveList } from './InteractiveList'

export default async function Page() {
  const items = await getItems() // plain array of plain objects — serializable, fine

  return <InteractiveList items={items} />
}
```

```tsx
// app/InteractiveList.tsx
'use client'

export function InteractiveList({ items }: { items: { id: string; name: string }[] }) {
  return <ul>{items.map((i) => <li key={i.id}>{i.name}</li>)}</ul>
}
```

The classic failure mode is trying to pass a **function** from a Server Component to a Client Component as a prop:

```tsx
// app/page.tsx — Server Component
import { DeleteButton } from './DeleteButton'

async function deleteItem(id: string) {
  'use server' // this makes it a Server Action reference, which CAN cross the boundary
  await db.item.delete({ where: { id } })
}

export default async function Page() {
  return <DeleteButton onDelete={deleteItem} /> // OK, because deleteItem is a Server Action
}
```

Without the `'use server'` directive, passing a plain server-side function (say, a regular `async function deleteItem(id) { await db... }` without the directive) as a prop throws a runtime error along the lines of "functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with 'use server'." Server Actions are the sanctioned exception — under the hood, Next.js doesn't actually serialize the function's code; it serializes a **reference** to it, and invoking it from the client triggers a network call back to the server to run the real function there. That's why Server Actions look like ordinary function props but behave completely differently from a plain closure.

The same rule applies to Context: you can't pass a live Context value computed inside a Server Component through the boundary as if it were normal state — Context providers/consumers only work within the client tree, so any server-computed initial values need to be passed as plain serializable props into a Client Component that itself sets up the Context Provider.

The practical rule of thumb: if you're passing data across a Server-to-Client boundary, ask "could this be `JSON.stringify`'d and survive?" — if not (functions without `'use server'`, class instances, refs), it needs to be transformed into a plain serializable shape first, or handled via a Server Action instead of a plain callback prop.
