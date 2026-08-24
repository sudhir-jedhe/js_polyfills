# Interview Q&A — History API, `<template>`, `<dialog>`

**Q: What's the difference between `history.pushState()` and `history.replaceState()`?**
`pushState` adds a new entry to the session history stack, so the Back button returns to whatever was there before. `replaceState` overwrites the *current* entry in place — no new Back-button stop is created, and the entry it replaced is gone from the stack entirely.

**Q: Does calling `pushState` trigger the `popstate` event?**
No. `popstate` fires only for actual history navigation — the user clicking Back/Forward, or code calling `history.back()`/`forward()`/`go()`. Calling `pushState`/`replaceState` yourself never fires it, which is why a router must render manually right after pushing state, and rely on the `popstate` listener only to cover Back/Forward navigation.

**Q: If a SPA uses `pushState`-based routing (not hash-based), what does the server need to support?**
The server must serve the SPA's `index.html` (or equivalent shell) as a fallback for any route path, since a hard refresh or a direct link to a client-side route (e.g., `/products/42`) is a real HTTP request the server receives and must respond to — unlike hash-based routing (`/#/products/42`), where everything after `#` never reaches the server at all.

**Q: What's inside `template.content`, and why can't you just append it directly to the DOM?**
`template.content` is a `DocumentFragment` containing the template's parsed-but-inert children. Appending it directly *moves* those nodes out of the template (emptying it for future use) rather than copying them — so in practice you almost always call `template.content.cloneNode(true)` first, to get a fresh, independent copy each time.

**Q: Why is content inside `<template>` considered "inert"?**
Because the browser parses it into a valid but unattached `DocumentFragment` — images inside don't fetch, scripts don't execute, custom elements don't upgrade — none of the side effects of being part of the live, rendered document happen until (a clone of) the content is actually inserted into the active DOM.

**Q: What's the functional difference between `dialog.show()` and `dialog.showModal()`?**
`show()` opens a non-modal dialog: no backdrop, no focus trap, the rest of the page stays fully interactive, and `Escape` doesn't close it. `showModal()` opens it as a true modal: renders a styleable `::backdrop`, traps focus inside the dialog, makes the rest of the page inert, and closes automatically on `Escape`.

**Q: How does `<form method="dialog">` interact with a `<dialog>` element?**
Submitting a form with `method="dialog"` that's inside an open `<dialog>` automatically closes that dialog (no `preventDefault`/manual `close()` call needed) and sets `dialog.returnValue` to the `value` attribute of whichever submit button triggered the submission — a built-in way to implement Cancel/Confirm without wiring up click handlers.
