***  05-csv-import-freezes-the-page.md ***

# Scenario: Importing a Large CSV Freezes the Entire Page

**Scenario:** Users can upload a CSV file (sometimes 50k+ rows) which your app parses client-side, validates row-by-row, and renders a preview table. Support is getting reports that the browser tab becomes completely unresponsive — no scrolling, no clicking anything, sometimes a "Page Unresponsive" browser warning — for several seconds during import. The parsing/validation logic itself is already reasonably efficient. What's the fix?

**Diagnosis:** The symptom (frozen scrolling, unresponsive clicks, browser's own "page unresponsive" warning) is the classic signature of **main-thread blocking** — JavaScript execution and rendering share a single thread, so a long synchronous parse+validate loop over 50k rows starves the browser of any opportunity to paint, respond to input, or run other scheduled work until the loop finishes. Optimizing the loop's internal efficiency only pushes the freeze duration down, it doesn't eliminate the fundamental problem: it's still one unbroken synchronous block on the thread the UI depends on.

**Fix — move parsing and validation into a Web Worker:**

```js
// main.js
const worker = new Worker('csv-worker.js');

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  showSpinner();
  file.text().then((text) => worker.postMessage(text)); // hand the raw text off entirely
});

worker.onmessage = (e) => {
  hideSpinner();
  renderPreviewTable(e.data.rows); // only the final result touches the DOM, on the main thread
  if (e.data.errors.length) showValidationErrors(e.data.errors);
};
```

```js
// csv-worker.js
self.onmessage = (e) => {
  const rows = parseCSV(e.data);         // heavy work — now off the main thread
  const errors = validateRows(rows);     // also heavy — also off the main thread
  self.postMessage({ rows, errors });    // structured-cloned back to main thread
};
```

**Why this actually fixes it, not just relocates the freeze:** The worker runs on a genuinely separate OS-level thread, so while it churns through 50k rows, the main thread is completely free to keep painting, handling scroll, and responding to clicks — the spinner shown by `showSpinner()` animates smoothly instead of freezing, because nothing on the main thread is blocked anymore.

**What has to change in the parsing code:** The worker has no access to the DOM at all, so any part of the existing parse/validate logic that touched `document` (e.g., building preview `<tr>` elements inline as it parses) has to be split — the worker returns plain data (`rows`, `errors`), and DOM rendering happens back on the main thread in `onmessage`, as shown above.

**When a Worker isn't the fix:** If the freeze were instead caused by a slow `fetch` or awaiting a server response, a Worker wouldn't help — network I/O is already non-blocking on the main thread via the event loop; Workers specifically address **CPU-bound synchronous computation**, which is what a 50k-row parse+validate loop is.
