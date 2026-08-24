# Scenario: A Teammate's PR Is Failing CI with a Serialization Error

A teammate opens a PR adding a "Refresh Inventory" button to a Server Component page. CI fails on the build step with an error about functions not being passable to Client Components. They're confused because "it's just a regular function, why is Next.js complaining?"

**Approach:** Pull up the diff and look at exactly where the function is defined and how it's passed.

```tsx
// app/inventory/page.tsx — the broken version
import { InventoryTable } from './InventoryTable'
import { db } from '@/lib/db'

async function refreshInventory() {
  await db.inventory.sync() // touches the database directly
}

export default async function InventoryPage() {
  const items = await db.inventory.findMany()
  return <InventoryTable items={items} onRefresh={refreshInventory} />
}
```

```tsx
// app/inventory/InventoryTable.tsx
'use client'
export function InventoryTable({
  items,
  onRefresh,
}: {
  items: unknown[]
  onRefresh: () => Promise<void>
}) {
  return (
    <div>
      <button onClick={() => onRefresh()}>Refresh</button>
      {/* table rendering */}
    </div>
  )
}
```

The explanation for the teammate: `refreshInventory` is defined and executed on the server (it directly calls `db.inventory.sync()`), but it's being handed to `InventoryTable`, a Client Component, as a plain prop. Props crossing from a Server Component into a Client Component have to be serializable, and a function — its closure, its reference to `db` — has no serializable form. This isn't about the function being "irregular"; *any* plain function hits this same error, because React can't ship executable server-side logic across the RSC boundary as data.

The fix is one line: mark `refreshInventory` as a Server Action with `'use server'`. That changes what actually gets sent across the boundary — instead of trying to serialize the function body, Next.js serializes a reference/ID to it, and clicking the button on the client triggers a real network request back to the server, which runs the actual function (with real database access) there.

```tsx
// app/inventory/page.tsx — fixed
import { InventoryTable } from './InventoryTable'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

async function refreshInventory() {
  'use server'
  await db.inventory.sync()
  revalidatePath('/inventory')
}

export default async function InventoryPage() {
  const items = await db.inventory.findMany()
  return <InventoryTable items={items} onRefresh={refreshInventory} />
}
```

Worth flagging to the teammate as a follow-up: since this is now a Server Action, adding `revalidatePath('/inventory')` after the sync ensures the page reflects the refreshed data on the next render — without it, the action would run correctly server-side but the already-rendered client UI wouldn't automatically know to re-fetch/re-render with the new data.
