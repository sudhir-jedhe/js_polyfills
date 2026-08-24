In component-driven frameworks like React and Vue, detached DOM leaks occur when a component is unmounted and its elements are removed from the browser's render tree, but asynchronous tasks, global listeners, external third-party instances, or closures created during its lifecycle still hold references to those elements or the component's internal fiber/instance nodes.

---

### Detached DOM Leaks in React (`useEffect`)

#### 1. Missing Cleanup on Global Event Listeners & Observers

If a `useEffect` registers a listener on a global target (`window`, `document`, or a shared event emitter) and references a local DOM ref inside the callback, omitting the cleanup function traps the DOM node in memory indefinitely.

```jsx
// LEAK: Unmounting leaves the resize handler active
function ChartComponent() {
  const chartRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.style.width = `${window.innerWidth}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    // Missing return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={chartRef} className="chart-container" />;
}

```

* **Why it detaches:** When `ChartComponent` unmounts, React removes the `<div>` from the document. The global `window` retains `handleResize`, whose lexical closure context retains `chartRef`, which points directly to the unmounted `HTMLDivElement`.
* **Fix:** Always return a cleanup function or pass an `AbortSignal`:

```jsx
useEffect(() => {
  const handleResize = () => { /* ... */ };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

```

---

#### 2. Uncleared Timers & Asynchronous Promises

Pending promises or intervals that resolve after unmount can hold onto DOM refs via closures.

```jsx
// LEAK: Async callback retains ref after unmount
function AlertBox() {
  const boxRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      // Retains boxRef on every tick
      boxRef.current?.classList.toggle('pulse');
    }, 1000);

    // Missing: return () => clearInterval(timer);
  }, []);

  return <div ref={boxRef}>Alert!</div>;
}

```

---

#### 3. Third-Party Imperative Libraries (Charts, Editors, Maps)

Non-React libraries (e.g., Chart.js, D3, Leaflet, TinyMCE) create internal references to the DOM nodes passed to them. If the library instance is not explicitly destroyed during cleanup, its internal references prevent garbage collection.

```jsx
// LEAK: Chart instance holds the canvas DOM node
function AnalyticsChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const chart = new ThirdPartyChart(canvasRef.current);

    // MUST call chart.destroy() on unmount
    return () => {
      chart.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

```

---

### Detached DOM Leaks in Vue (`onUnmounted` / `beforeUnmount`)

#### 1. Uncleaned Global Listeners & Reactive Observers

In Vue 3 (Composition API), listeners attached inside `onMounted` must be dismantled inside `onUnmounted`.

```vue
<!-- LEAK: Global listener closes over template ref -->
<script setup>
import { ref, onMounted } from 'vue';

const panel = ref(null);

onMounted(() => {
  const onScroll = () => {
    if (panel.value) {
      panel.value.scrollTop = window.scrollY;
    }
  };

  document.addEventListener('scroll', onScroll);
  // Missing: onUnmounted(() => document.removeEventListener('scroll', onScroll));
});
</script>

<template>
  <div ref="panel" class="scroll-panel">Content</div>
</template>

```

* **Why it detaches:** Vue unmounts the component and strips the `<div class="scroll-panel">` from the document. The global `document` listener retains the `onScroll` closure, which holds `panel` (a Ref pointing to the detached element).

---

#### 2. Native DOM Mutation / Custom Directives Without Unbind

Custom Vue directives that attach listeners or clone elements without implementing the `unmounted` hook are a frequent source of detached trees:

```javascript
// LEAK: Directive adds listener to window but never cleans up
app.directive('sticky-track', {
  mounted(el) {
    const handler = () => {
      el.style.top = `${window.scrollY}px`;
    };
    window.addEventListener('scroll', handler);
    // Pinning handler on el to unbind later
    el._stickyHandler = handler;
  },
  // Missing 'unmounted' hook:
  unmounted(el) {
    window.removeEventListener('scroll', el._stickyHandler);
    delete el._stickyHandler;
  }
});

```

---

#### 3. Global State Stores (Pinia / Vuex) Retaining Component Instances or Elements

Storing a DOM element reference or component template ref directly in a global Pinia store:

```javascript
// LEAK: Pinia store pins DOM node globally
import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
  state: () => ({ activeModalElement: null }),
  actions: {
    setModal(el) {
      this.activeModalElement = el; // Storing raw DOM reference in global store
    }
  }
});

```

* **Fix:** Store plain serializable IDs, booleans, or keys (`activeModalId: 'settings'`) in global stores rather than raw DOM nodes or component instances.

---

### Framework Retainers in DevTools Heap Snapshots

When inspecting detached nodes created by React or Vue in Chrome DevTools:

| Framework | What You See in the Retainers Pane                                             | What It Points To                                                         |
| --------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **React** | `stateNode in FiberNode` $\rightarrow$ `memoizedState` $\rightarrow$ `Context` | A `useRef` or event callback attached to an uncleaned Fiber tree.         |
| **Vue**   | `vnode.el` $\rightarrow$ `componentInstance.subTree`                           | A component instance retained by a global reactive effect or Pinia store. |
