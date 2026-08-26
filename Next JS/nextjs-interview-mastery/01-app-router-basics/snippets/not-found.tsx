// app/dashboard/settings/[section]/not-found.tsx
// Rendered automatically when notFound() is called, or when no segment matches.
export default function NotFound() {
  return (
    <div>
      <h2>Settings section not found</h2>
      <p>Check the URL or pick a valid settings section from the menu.</p>
    </div>
  )
}

// app/dashboard/settings/[section]/page.tsx
import { notFound } from 'next/navigation'

const VALID_SECTIONS = ['profile', 'billing', 'security']

export default function SettingsSection({
  params,
}: {
  params: { section: string }
}) {
  if (!VALID_SECTIONS.includes(params.section)) {
    notFound() // triggers not-found.tsx above
  }

  return <h1>Settings: {params.section}</h1>
}
