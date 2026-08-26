A cleanup function in `useEffect` runs before the component unmounts and **before every re-execution of the effect** when dependencies change. Writing robust cleanups ensures your application avoids memory leaks, stale subscriptions, and async race conditions.

---

### 1. Match Every Setup with a Mirror Cleanup

Every asynchronous or external subscription opened in the setup must have a corresponding teardown in the cleanup return.

* **Browser Event Listeners:**

```tsx
useEffect(() => {
  function handleResize() {
    setWindowWidth(window.innerWidth);
  }

  window.addEventListener('resize', handleResize);
  // Mirror cleanup
  return () => window.removeEventListener('resize', handleResize);
}, []);

```

* **Timers (`setInterval` / `setTimeout`):**

```tsx
useEffect(() => {
  const timerId = setInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(timerId);
}, []);

```

* **WebSockets / EventSource Subscriptions:**

```tsx
useEffect(() => {
  const socket = new WebSocket(`wss://api.example.com/chat/${roomId}`);
  socket.onmessage = (event) => setMessages((prev) => [...prev, event.data]);

  return () => {
    socket.close(); // Cleanly close connection on roomId change or unmount
  };
}, [roomId]);

```

---

### 2. Guard Async Fetch Calls with `AbortController` or Boolean Flags

Async promises cannot be cancelled once created in JavaScript. If a component unmounts or a dependency changes before a fetch resolves, updating state triggers race conditions or memory warnings.

**Using `AbortController` (Recommended for `fetch`):**

```tsx
useEffect(() => {
  const controller = new AbortController();

  async function loadData() {
    try {
      const res = await fetch(`/api/user/${userId}`, { signal: controller.signal });
      const data = await res.json();
      setUser(data);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    }
  }

  loadData();

  // Aborts in-flight network request immediately if userId changes or component unmounts
  return () => controller.abort();
}, [userId]);

```

**Using an `ignore` Flag (For third-party async libraries):**

```tsx
useEffect(() => {
  let ignore = false;

  async function loadUser() {
    const data = await thirdPartySdk.getUser(userId);
    if (!ignore) {
      setUser(data);
    }
  }

  loadUser();

  return () => {
    ignore = true; // Prevents setting stale state if response arrives late
  };
}, [userId]);

```

---

### 3. Clean Up Non-React DOM Nodes & Modals

If your effect interacts with imperative third-party DOM widgets (maps, rich text editors, charts, native `<dialog>` elements), tear down the instance in the cleanup.

```tsx
useEffect(() => {
  if (!mapContainerRef.current) return;

  const map = new MapWidget(mapContainerRef.current, { center: coordinates });

  return () => {
    map.destroy(); // Releases WebGL context and removes listeners
  };
}, [coordinates]);

```

---

### 4. Reset Shared / Global State on Exit

If your effect mutates global document attributes (e.g., `document.title`, `document.body.style.overflow` for modals), restore the original values in the cleanup:

```tsx
useEffect(() => {
  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden'; // Lock background scroll for modal

  return () => {
    document.body.style.overflow = originalOverflow; // Restore on close
  };
}, []);

```

---

### 5. Keep Cleanup Functions Pure and Synchronous

* **Do not make the cleanup function `async`:**

```tsx
// ❌ BAD: Returns a Promise instead of a cleanup function
useEffect(() => {
  return async () => {
    await api.logout();
  };
}, []);

// ✅ GOOD: Synchronous cleanup function
useEffect(() => {
  return () => {
    api.logout(); // Non-blocking sync call or beacon
  };
}, []);

```

* **Do not run new side-effects inside cleanup:** The cleanup should only undo what was set up in the preceding execution of that specific effect.

---

### Summary Checklist

| Resource Type           | Setup Action                        | Cleanup Action                           |
| ----------------------- | ----------------------------------- | ---------------------------------------- |
| **DOM Events**          | `window.addEventListener(type, fn)` | `window.removeEventListener(type, fn)`   |
| **Timers**              | `const id = setTimeout(...)`        | `clearTimeout(id)` / `clearInterval(id)` |
| **Data Fetching**       | `fetch(url, { signal })`            | `controller.abort()`                     |
| **Async Tasks**         | `let ignore = false; fetch(...)`    | `ignore = true;`                         |
| **WebSockets**          | `const ws = new WebSocket(...)`     | `ws.close()`                             |
| **3rd-Party Libraries** | `instance.init()`                   | `instance.destroy()`                     |
