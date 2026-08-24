# HTML5 APIs & Storage

Beyond markup, HTML5 shipped a set of browser-native JavaScript APIs that used to require plugins or libraries: persistent client-side storage, drag-and-drop, geolocation, client-side routing via the History API, background threads via Web Workers, and native `<template>`/`<dialog>` elements. This topic is heavily tested because it sits at the exact boundary of "HTML" and "JS" that interviewers use to check whether a candidate actually understands the platform, not just markup syntax — the classic example being the localStorage/sessionStorage/cookies/IndexedDB comparison table, which shows up in nearly every front-end interview loop.

## Folder structure

- **`theory/`** — Web Storage fundamentals and the `storage` event, the full storage-mechanism comparison table, the Drag and Drop API, the Geolocation API, the History API for SPA routing, Web Workers basics, and the `<template>`/`<dialog>` elements.
- **`snippets/`** — 7 small, runnable examples: one per API/concept.
- **`output-based/`** — 7 "what does this do?" questions covering storage-event asymmetry, `pushState`/`popstate` behavior, dialog modal semantics, and more.
- **`scenarios/`** — 5 real-world situations: cross-tab logout sync, building a SPA router, an offline-capable note app, a native confirm-delete modal, and a heavy CSV-parsing UI freeze.
- **`interview-qa/`** — Q&A grouped into themed files: storage mechanisms, browser APIs (drag-and-drop/geolocation/workers), and History/routing.
- **`problems/`** — 4 hands-on challenges: build a persisted-state hook backed by localStorage, a drag-and-drop sortable list, a tiny SPA router, and a confirm dialog utility.
- **`assets/`** — placeholder for diagrams (see `assets/README.md`).

## What's covered

- `localStorage` vs `sessionStorage` vs cookies vs IndexedDB — capacity, persistence, sync/async, and whether data is sent with every HTTP request
- The `storage` event and its cross-tab-only firing behavior
- The Drag and Drop API: `dragstart`/`dragover`/`drop`, `DataTransfer`, and the `preventDefault()` requirement
- The Geolocation API: `getCurrentPosition` vs `watchPosition`, permission flow, error codes
- The History API: `pushState` vs `replaceState`, the `popstate` event, and building SPA-style routing
- Web Workers: `postMessage`, structured cloning, what workers can/can't access
- `<template>` (inert, cloneable markup) and `<dialog>` (native accessible modals) — `show()` vs `showModal()`
