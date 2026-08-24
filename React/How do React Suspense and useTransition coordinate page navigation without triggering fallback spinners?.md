When navigating between pages or views wrapped in `<Suspense>`, initiating the route change inside `startTransition` tells React that the navigation is **interruptible and non-urgent**.

Instead of immediately unmounting the current view and flashing a `<Suspense>` fallback (spinner/skeleton), React **retains the existing page on screen** while it renders the next page in an off-screen, in-memory tree until the asynchronous data or lazy components resolve.

---

### The Problem: Immediate Fallback "Flicker"

Without `useTransition`, a standard state update (or router transition) is considered urgent:

```
[ User Clicks "Profile" Tab ] 
         │
         ▼
[ Current Page Immediately Unmounts ] 
         │
         ▼
[ <Suspense> Fallback (Spinner) Flashes ]  <── Disorienting layout shift
         │
         ▼ (Data / Code Loads)
[ New Profile Page Mounts ]

```

---

### The Solution: `startTransition` + `Suspense` Coordination

When wrapped in `startTransition`, React delays committing the transition to the real DOM:

```
[ User Clicks "Profile" Tab inside startTransition ]
         │
         ▼
[ Current Page STAYS Visible & Interactive ]
         │
         ├─► `isPending` becomes `true` (render an inline progress bar / subtle UI indicator)
         │
         └─► In Memory: React fetches code/data for <ProfilePage />
                   │
                   ▼ (Data Resolves in Memory)
[ Atomic Swap: Old Page ──► New Page ]  (No intermediate fallback flicker!)

```

---

### Implementation Example

#### 1. Lazy / Suspense-Enabled View

```jsx
import { Suspense, useState, useTransition } from 'react';

// Lazy-loaded routes / components
const HomePage = React.lazy(() => import('./HomePage'));
const ProfilePage = React.lazy(() => import('./ProfilePage'));

export function App() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  const navigateTo = (nextTab) => {
    // Wrap the navigation state update in startTransition
    startTransition(() => {
      setTab(nextTab);
    });
  };

  return (
    <div>
      <nav>
        <button onClick={() => navigateTo('home')}>Home</button>
        <button onClick={() => navigateTo('profile')}>Profile</button>
        {isPending && <span className="inline-loader"> Loading page...</span>}
      </nav>

      <main style={{ opacity: isPending ? 0.7 : 1 }}>
        <Suspense fallback={<div className="skeleton">Loading Skeleton...</div>}>
          {tab === 'home' && <HomePage />}
          {tab === 'profile' && <ProfilePage />}
        </Suspense>
      </main>
    </div>
  );
}

```

---

### Under the Hood: React's Concurrent State Machine

1. **Suspending in Memory:** When `tab` transitions to `'profile'`, React begins rendering `<ProfilePage/>` in an off-screen work-in-progress fiber tree.
2. **Promise Catching:** Inside `<ProfilePage/>`, dynamic code splitting (`import()`) or a Suspense-enabled data fetch (e.g., React Server Components, TanStack Query with `suspense: true`, or Relay) throws a Promise.
3. **Suspense Boundary Detection:** The nearest `<Suspense>` boundary catches this Promise.
4. **Transition Check:**

* **If Urgent Update:** React commits the Suspense boundary's fallback immediately.
* **If Transition Update (`startTransition`):** React defers committing the fiber tree until the thrown Promise resolves. The user continues viewing the previous tab without interruption.

1. **Atomic Commit:** Once all promises resolve, React swaps the entire prepared tree into the real DOM in a single browser paint.

---

### Managing User Expectations: The `isPending` Feedback

Because the existing screen remains active, the user might assume the click failed if there is no visual indicator.

* **Best Practice:** Use `isPending` to show lightweight non-blocking feedback:
* Dim the current page container (`opacity: isPending ? 0.6 : 1`).
* Display a top-bar progress line (like YouTube/GitHub page loaders).
* Show a small spinner icon inside the clicked button.

---

### When Does the Fallback Still Show?

React will still trigger the `<Suspense>` fallback under two specific conditions:

1. **Initial Page Load:** On the first mount, there is no previous view to retain, so the boundary immediately renders the fallback.
2. **Nested New Boundaries:** If the new page contains an inner `<Suspense>` boundary that was not part of the transition, the outer page renders while the inner boundary displays its own localized fallback.
