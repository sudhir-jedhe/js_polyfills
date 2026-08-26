*** copy How do you use the Prioritized Task Scheduling API (scheduler.postTask) to manage user-blocking vs background tasks?.md ***

The **Prioritized Task Scheduling API (`scheduler.postTask`)** allows you to schedule asynchronous work with explicit browser priority levels, dynamic cancellation, and priority reassignment via `TaskController`.

---

### Priority Levels

`scheduler.postTask(callback, options)` provides three distinct priority tiers:

| Priority                       | Intended Use Case                                                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`'user-blocking'`**          | Critical UI updates, immediate feedback after user interactions (clicks, keypresses). Stops the page from feeling unresponsive.                     |
| **`'user-visible'`** (Default) | Important work the user will notice soon, but not critical to the immediate millisecond (e.g., rendering search results, non-critical DOM updates). |
| **`'background'`**             | Low-priority maintenance work that can wait until idle (e.g., analytics logging, cache pre-warming, indexing).                                      |

---

### Basic Usage

`scheduler.postTask` returns a standard Promise resolving with the task's return value:

```javascript
// 1. User-Blocking Task (Runs before visible or background tasks)
scheduler.postTask(() => {
  renderDropdownMenu();
}, { priority: 'user-blocking' });

// 2. User-Visible Task (Default)
scheduler.postTask(() => {
  renderArticleComments();
}, { priority: 'user-visible' });

// 3. Background Task (Runs only when the thread has free capacity)
scheduler.postTask(() => {
  sendAnalyticsEvent({ type: 'page_view', timestamp: Date.now() });
}, { priority: 'background' });

```

---

### Dynamic Priority and Cancellation (`TaskController`)

Using **`TaskController`** (which extends `AbortController`), you can dynamically change priority or cancel queued tasks before they execute.

```javascript
const taskController = new TaskController({ priority: 'background' });

// Schedule a background search indexer
const indexTask = scheduler.postTask(
  ({ signal }) => {
    // Check if task was aborted before running expensive work
    if (signal.aborted) return;
    return generateSearchIndex();
  },
  { signal: taskController.signal }
);

// Scenario 1: User focuses the search input -> Boost priority dynamically
document.querySelector('#search-input').addEventListener('focus', () => {
  // Elevate from 'background' to 'user-blocking' instantly!
  taskController.setPriority('user-blocking');
});

// Scenario 2: User navigates away -> Abort the task to free memory
window.addEventListener('beforeunload', () => {
  taskController.abort();
});

```

---

### Delaying Tasks (`delay` option)

You can specify a delay without relying on `setTimeout`:

```javascript
// Run background sync 3 seconds after page interaction
scheduler.postTask(
  () => syncOfflineDrafts(),
  { priority: 'background', delay: 3000 }
);

```

---

### Cross-Browser Fallback Wrapper

For environments or browsers where `scheduler.postTask` is not yet available, wrap it with standard fallbacks (`requestIdleCallback`, `MessageChannel`, `setTimeout`):

```javascript
function scheduleTask(callback, options = {}) {
  const { priority = 'user-visible', delay = 0, signal } = options;

  // Native API support
  if ('scheduler' in window && 'postTask' in window.scheduler) {
    return window.scheduler.postTask(callback, { priority, delay, signal });
  }

  // Fallback implementation
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const run = () => {
      try {
        resolve(callback());
      } catch (err) {
        reject(err);
      }
    };

    if (priority === 'background' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => run(), { timeout: delay + 2000 });
    } else {
      setTimeout(run, delay);
    }
  });
}

```
