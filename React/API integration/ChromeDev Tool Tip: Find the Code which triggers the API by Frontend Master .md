Here is how to locate the exact line of frontend code that triggers a network/API call using Chrome DevTools:

---

### Method 1: The Network Tab "Initiator" Column (Quickest)

1. Open DevTools (F12 or Cmd + Option + I) and switch to the **Network** tab.
2. Filter by **Fetch/XHR** so only API requests are visible.
3. Perform the UI action (e.g., click the button) that fires the request.
4. Look at the **Initiator** column for that request:

* **Hover over the file link:** A full call stack popup appears showing the complete execution trace from the click event down to `fetch()` or `axios`.
* **Click the top application file link:** DevTools navigates straight to the line of code that triggered the call inside the **Sources** tab.

---

### Method 2: XHR/fetch Breakpoints (Best for Stepping Through Execution)

When requests are wrapped in complex abstraction layers or service workers, use an XHR breakpoint to freeze JavaScript execution at the exact moment the call is made:

1. Go to the **Sources** tab.
2. In the right-hand panel, expand **XHR/fetch Breakpoints**.
3. Click the **`+`** icon:

* Leave it blank and press Enter to break on **any** network request, **OR**
* Enter a specific URL fragment (e.g., `/api/v1/cart` or `users`) to break only on matching endpoints.

1. Trigger the action on the page.
2. The browser will pause execution inside the `fetch`/`XMLHttpRequest` call:

* Look at the **Call Stack** panel on the right.
* Step down through the stack trace to skip library code (like Axios, React internals, or Fetch polyfills) and jump directly into your application code.

---

### Method 3: Event Listener Breakpoints (When Initiated by a User Click)

If you don't know the endpoint name yet:

1. Open **Sources** $\rightarrow$ Expand **Event Listener Breakpoints**.
2. Expand **Mouse** and check **`click`**.
3. Click the UI element on the page. The debugger will pause on the immediate click handler, allowing you to step forward (F10/F11) to observe what request function is called.

---

### Pro-Tip: Ignore Third-Party Scripts (Blackboxing)

To avoid getting stuck in `node_modules`, `axios.min.js`, or React internal files while stepping through the call stack:

* Right-click the vendor file inside the **Call Stack** or editor tab and select **"Add script to ignore list"**. DevTools will automatically skip straight to your handwritten application logic.
