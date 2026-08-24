When navigating between tabs or pages, standard React `Suspense` immediately replaces the **entire existing content** with a fallback spinner as soon as a new child suspends (throws a Promise).

By wrapping the navigation state change in `useTransition`, React defers swapping the UI until the new page has finished loading its async data, **keeping the current page fully visible and interactive in the meantime**.

---

### The Problem Without `useTransition` (Screen Flashes to Spinner)

```tsx
function TabContainer() {
  const [tab, setTab] = useState('home');

  return (
    <div>
      <TabButton onClick={() => setTab('profile')}>Profile</TabButton>
      
      <Suspense fallback={<Spinner />}>
        {tab === 'home' && <HomeTab />}
        {tab === 'profile' && <ProfileTab />} {/* Suspends during fetch */}
      </Suspense>
    </div>
  );
}

```

#### What happens

1. User clicks **"Profile"**.
2. React switches `tab = 'profile'` immediately in a standard priority lane (`DefaultLane`).
3. `ProfileTab` throws a Promise (suspends to fetch data).
4. Because this is an urgent update, React cannot delay the commit: it **unmounts `<HomeTab/>` immediately** and displays `<Spinner/>`.
5. *Result:* The screen flashes to a blank spinner, hiding already-loaded content.

---

### The Solution: Combining `Suspense` + `useTransition`

```tsx
function TabContainer() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  function selectTab(nextTab: string) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <div>
      <TabButton onClick={() => selectTab('profile')}>
        Profile {isPending && '(Loading...)'}
      </TabButton>
      
      <Suspense fallback={<Spinner />}>
        <div style={{ opacity: isPending ? 0.7 : 1 }}>
          {tab === 'home' && <HomeTab />}
          {tab === 'profile' && <ProfileTab />}
        </div>
      </Suspense>
    </div>
  );
}

```

#### What happens under the hood

1. `setTab('profile')` runs inside `startTransition`, assigning the update to a **`TransitionLane`**.
2. React begins building the **`workInProgress` (WIP) tree** off-screen for the new `tab = 'profile'`.
3. `ProfileTab` suspends on its data Promise.
4. **The Transition Rule:** Because this render is marked as a *transition*, React detects that committing right now would hide already-visible UI with a fallback. **React deliberately pauses the commit.**
5. React leaves the `current` Fiber tree (showing `<HomeTab/>`) on the screen untouched, while setting `isPending = true`.
6. Once the data Promise resolves, React finishes the off-screen `workInProgress` tree and commits `<ProfileTab/>` in a single smooth swap.

---

### How Fiber Manages the Suspended State

```
User Clicks "Profile"
        │
        ▼
startTransition(() => setTab('profile'))
        │
        ├──► Synchronous pass: isPending = true (Shows inline spinner/indicator)
        │
        └──► Offscreen WIP Tree rendering in TransitionLane
                │
                ▼
          <ProfileTab /> suspends (throws Promise)
                │
                ▼
React attaches listener: promise.then(pingSuspendedFiber)
                │
                ▼
Is WIP tree a Transition?
 ├── YES ──► Do NOT commit Suspense fallback. Keep <HomeTab /> on screen.
 └── NO  ──► Replace <HomeTab /> with <Spinner /> immediately.
                │
                ▼
Promise Resolves ──► Ping fires ──► React completes WIP Tree ──► Commits <ProfileTab />

```

---

### Key Behavioral Differences

| Action                              | Standard `setState` + `Suspense`                 | `startTransition` + `Suspense`                                |
| ----------------------------------- | ------------------------------------------------ | ------------------------------------------------------------- |
| **Initial Render (Mount)**          | Shows `<Suspense fallback>`                      | Shows `<Suspense fallback>`                                   |
| **Subsequent Updates (Navigation)** | **Hides existing UI** and shows fallback spinner | **Retains existing UI** on screen while loading               |
| **Pending Feedback**                | Fallback component renders                       | `isPending` boolean (e.g., inline indicator, reduced opacity) |
| **User Interactivity**              | User sees spinner, cannot interact with old page | Old page remains interactive during data loading              |
| **Interruption**                    | Cannot be safely abandoned                       | Can be aborted if user clicks another tab mid-fetch           |
