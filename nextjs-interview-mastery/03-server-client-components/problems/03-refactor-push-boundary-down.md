# Problem 3: Refactor to Push the Client Boundary Down

## Task

You're given a `"use client"`-marked settings page that fetches user settings on mount via `useEffect`, renders a settings form, and has one toggle switch for "Enable email notifications." Refactor it so only the toggle switch is a Client Component, and explain the bundle-size win.

## Before

```tsx
// app/settings/page.tsx
'use client'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState<{ name: string; email: string; notifications: boolean } | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then(setSettings)
  }, [])

  if (!settings) return <p>Loading…</p>

  return (
    <div>
      <h1>Settings</h1>
      <p>Name: {settings.name}</p>
      <p>Email: {settings.email}</p>
      <label>
        Email notifications
        <input
          type="checkbox"
          checked={settings.notifications}
          onChange={(e) =>
            fetch('/api/settings', {
              method: 'PATCH',
              body: JSON.stringify({ notifications: e.target.checked }),
            })
          }
        />
      </label>
    </div>
  )
}
```

## After

```tsx
// app/settings/page.tsx — Server Component
import { NotificationsToggle } from './NotificationsToggle'
import { getSettings } from '@/lib/settings' // direct server-side call, no /api round trip needed here

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div>
      <h1>Settings</h1>
      <p>Name: {settings.name}</p>
      <p>Email: {settings.email}</p>
      <NotificationsToggle initialValue={settings.notifications} />
    </div>
  )
}
```

```tsx
// app/settings/NotificationsToggle.tsx — only Client Component in the tree
'use client'
import { useState, useTransition } from 'react'
import { updateNotifications } from './actions'

export function NotificationsToggle({ initialValue }: { initialValue: boolean }) {
  const [enabled, setEnabled] = useState(initialValue)
  const [, startTransition] = useTransition()

  return (
    <label>
      Email notifications
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => {
          setEnabled(e.target.checked)
          startTransition(() => updateNotifications(e.target.checked))
        }}
      />
    </label>
  )
}
```

```tsx
// app/settings/actions.ts
'use server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

export async function updateNotifications(enabled: boolean) {
  const userId = await getCurrentUserId()
  await db.user.update({ where: { id: userId }, data: { notifications: enabled } })
}
```

**Bundle-size win:** Before, the entire settings page — including its data-fetching logic, loading state handling, and rendering of `name`/`email` — was client JS, and the page also required a `GET /api/settings` round trip after the initial (empty) page load, producing a loading flash. After, `SettingsPage` fetches data directly server-side with zero client JS for that logic, renders `name`/`email` as plain server-rendered text (no client bundle contribution at all), and the client bundle shrinks to just `NotificationsToggle` — a `useState`/`useTransition` checkbox and a Server Action reference, likely a few hundred bytes versus what could be several KB of fetch/state/loading logic in the "before" version. There's also no loading flash anymore: the settings values are present in the initial HTML instead of appearing after a client-side fetch resolves.
