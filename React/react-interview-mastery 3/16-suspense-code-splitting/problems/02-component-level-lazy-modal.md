# Problem: Implement a Component-Level Lazy-Loaded Modal

## Task

Implement a toolbar with a "Settings" button that opens a modal. The modal's code (and any heavy dependencies it pulls in) should only be downloaded the first time the user actually clicks the button to open it — not as part of the initial page bundle.

## Solution

```jsx
import { lazy, Suspense, useState } from "react";

// The import() only executes the first time <SettingsModal /> is rendered,
// which only happens after `open` becomes true.
const SettingsModal = lazy(() => import("./SettingsModal"));

function ModalLoadingFallback() {
  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ padding: "2rem" }}>
        <p>Loading settings…</p>
      </div>
    </div>
  );
}

export default function Toolbar() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Settings</button>

      {/* Mounting SettingsModal only when `open` is true is what defers
          the network request — the lazy() call above just registers the
          loader function, it doesn't fetch anything by itself. */}
      {open && (
        <Suspense fallback={<ModalLoadingFallback />}>
          <SettingsModal onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}

// SettingsModal.js
export default function SettingsModal({ onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Settings</h2>
        {/* Imagine heavy dependencies here — a color picker, a rich
            select library, etc. — that only this modal needs. */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

## Why this works

- `React.lazy(() => import("./SettingsModal"))` registers a loader but does not fetch anything on its own — the dynamic `import()` inside it only runs when the lazy component is actually rendered.
- Because `{open && <Suspense>...</Suspense>}` only renders that subtree once `open` is `true`, the browser has no reason to request the `SettingsModal` chunk until the user clicks "Settings" for the first time.
- Closing and reopening the modal afterward does not re-fetch the chunk — the module is cached by the browser/bundler runtime after the first successful resolution, so subsequent opens render synchronously with no fallback flash.

## Things to watch out for

- If `SettingsModal` were imported normally at the top of the file (`import SettingsModal from "./SettingsModal"`), it would ship in the same chunk as `Toolbar`, defeating the purpose — the whole point is that the `import()` call is *inside* the `lazy()` callback, not a static top-level import.
- Give the fallback the same visual shape as the real modal (backdrop + centered box) so there's no layout jump between the loading state and the loaded modal.
- Pair this with an error boundary (see `03-suspense-error-boundary-retry.md`) in production — a failed chunk load on a rarely-used modal is exactly the kind of thing that can go unnoticed until a user hits it after a deploy.
