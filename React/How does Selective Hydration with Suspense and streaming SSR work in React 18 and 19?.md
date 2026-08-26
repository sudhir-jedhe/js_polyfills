How does Selective Hydration with Suspense and streaming SSR work in React 18 and 19?

In traditional React SSR (React 17 and earlier), hydration was an **all-or-nothing, waterfall process**:

1. You had to fetch all data on the server before sending any HTML.
2. The browser had to download all JavaScript bundles before hydrating anything.
3. React had to hydrate the entire document tree in a single, synchronous pass before any part of the page became interactive.

Starting with React 18 and enhanced in React 19, **Streaming SSR** and **Selective Hydration** break this monolithic waterfall into independent, concurrent chunks wrapped inside `<Suspense>` boundaries.

---

### The Three Core Problems of Traditional SSR vs. Modern Streaming

```
Traditional SSR Waterfall:
[Fetch All Data] ──▶ [Send All HTML] ──▶ [Load All JS] ──▶ [Hydrate Everything]
(Slowest API blocks HTML)               (Slowest JS blocks TTI) (Hydration blocks main thread)

Streaming SSR + Selective Hydration:
[Send Shell HTML immediately]
      │
      ├──▶ [Stream Suspended HTML chunks progressively as data resolves]
      │
      └──▶ [Hydrate ready components independently as their JS arrives]
           └── [User clicks an unhydrated part? Prioritize that part immediately!]

```

---

### 1. Streaming SSR: Progressive HTML Delivery

Instead of waiting for slow database queries or external microservices to finish before sending the initial HTML, the server streams the layout shell immediately:

```tsx
import { Suspense } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Comments } from './Comments'; // Slow data fetch

export default function Page() {
  return (
    <div className="layout">
      <Header />
      <Sidebar />

      {/* React streams this fallback immediately */}
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments />
      </Suspense>
    </div>
  );
}

```

#### What Happens Over the HTTP Stream

1. **Initial Shell Flushed:** React sends the HTML for `<Header>` and `<Sidebar>`, along with `<CommentsSkeleton>` inside the `<Suspense>` slot. The browser renders this markup instantly (**Fast First Contentful Paint**).
2. **Data Resolves on the Server:** When `Comments` finishes fetching data on the server, React streams an inline HTML chunk containing the real `Comments` markup, accompanied by a small inline `<script>` that instructs the browser to swap out the skeleton for the actual HTML.

---

### 2. Selective Hydration: Independent Component Hydration

With Selective Hydration, React does not wait for all JavaScript or all HTML to load before beginning hydration:

* **Hydrate Before Everything Loads:** If the JavaScript bundle for `<Header>` and `<Sidebar>` has loaded, React hydrates those components **immediately**, even while `<Comments>` is still streaming HTML or downloading its bundle.
* **Non-Blocking Work:** A heavy or slow component wrapped in `<Suspense>` will not block the rest of the application from becoming interactive (**Lower Time to Interactive / TTI**).

---

### 3. Early Interaction Prioritization (Click-Driven Hydration)

The most powerful aspect of Selective Hydration is **Interaction Prioritization**.

If the user interacts with a component that hasn't finished hydrating yet, React intercepts the interaction, pauses the default hydration queue, and hydrates that specific component immediately:

```
Default Queue:        [ Hydrate Navbar ] ──▶ [ Hydrate Sidebar ] ──▶ [ Hydrate Comments ]
                                                  ▲
                                                  │ User clicks a button in `Comments`!
                                                  │
Reprioritized Queue:  [ Hydrate Comments (URGENT) ] ──▶ [ Resume Navbar/Sidebar ]

```

#### How React Replays the Click

1. **Capture:** The user clicks a button inside `<Comments>` while React is still hydrating `<Sidebar>`.
2. **Prioritization:** React pauses hydrating `<Sidebar>` and switches priority to the `<Suspense>` boundary containing `<Comments>`.
3. **Hydration:** `<Comments>` is synchronously hydrated on the spot.
4. **Replay:** React replays the user's original click event against the newly attached handler so the user never notices a dropped click.
5. **Resume:** React resumes hydrating background components (e.g., `<Sidebar>`) during idle browser cycles.

---

### Summary: Traditional SSR vs. Selective Hydration

| Dimension                             | Traditional SSR (React ≤17)                           | Streaming SSR + Selective Hydration (React 18 & 19)                    |
| ------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| **HTML Delivery**                     | Monolithic (blocked by slowest data fetch).           | **Progressive stream** via `<Suspense>`.                               |
| **Hydration Strategy**                | Single, blocking, full-page pass.                     | **Granular subtrees** hydrated as code arrives.                        |
| **Main Thread Impact**                | Long CPU blocking tasks.                              | Chunked, concurrent, cooperative scheduling.                           |
| **User Interaction During Hydration** | Clicks dropped/ignored until full hydration finishes. | **Clicks prioritized and replayed** to hydrate the target immediately. |
| **JS Dependency**                     | Must download 100% of client JS before hydrating.     | Can hydrate subtrees independently as code chunks arrive.              |
