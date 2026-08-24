# Scenario: A Video Player That Shouldn't Restart on Navigation

Your team is building a learning platform. Each course has multiple lesson pages (`/course/[id]/lesson/[lessonId]`), and there's a persistent mini video player docked at the bottom of the screen that should keep playing audio/video uninterrupted as the user browses between lesson pages, reads the transcript, or checks the course outline — as long as they stay within that course.

Product complains that with the current implementation, every time a user clicks to the next lesson, the video player flashes and restarts from 0:00.

**Approach:** The root cause is almost always that the player is being rendered inside `page.tsx` (or a component that only exists on some pages) instead of a shared `layout.tsx`. Anything rendered inside `page.tsx` unmounts and remounts on every navigation, because `page.tsx` is precisely the part of the tree the App Router replaces. The fix is to lift the player into `app/course/[id]/layout.tsx`, which persists across navigation between all lesson routes nested under that course ID.

```tsx
// app/course/[id]/layout.tsx
import { PersistentPlayer } from './PersistentPlayer'

export default function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  return (
    <div>
      <CourseOutline courseId={params.id} />
      <main>{children}</main>
      <PersistentPlayer courseId={params.id} />
    </div>
  )
}
```

```tsx
// app/course/[id]/PersistentPlayer.tsx
'use client'
import { useRef } from 'react'

export function PersistentPlayer({ courseId }: { courseId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  // Because this component lives in the layout, its DOM node (and the
  // underlying <video> element's playback state) survives navigation
  // between /course/[id]/lesson/1 and /course/[id]/lesson/2.
  return <video ref={videoRef} src={`/api/courses/${courseId}/stream`} controls />
}
```

One caveat to flag to the team: this only holds for navigation *within* `/course/[id]/*` — going from one course to a different course (`id` changes) means a different `params.id`, and since the segment matched by `[id]` itself changes, React treats it as a different route tree position and remounts the layout (and the player) fresh. If you need the player to survive across different course IDs too, it needs to live even higher, e.g. in the root layout, with the course ID passed down via client state instead of route params.
