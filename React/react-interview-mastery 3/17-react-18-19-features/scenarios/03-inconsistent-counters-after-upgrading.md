# A Team Is Debugging Inconsistent Counters After Upgrading to React 18

After upgrading from React 17 to React 18, a team notices a feature that increments two related counters inside a `setTimeout` callback (used for a debounced analytics batch update) now behaves differently — a test asserting an intermediate DOM state between the two updates started failing.

**Approach:** Explain that this is expected: React 18's automatic batching now applies inside `setTimeout` (previously only event handlers were batched), so both `setState` calls commit together in one render instead of two separate ones. The intermediate DOM state the test asserted on no longer exists because there's no render in between the two updates. Fix the test to assert on the final state, or if an intermediate render is genuinely required for correctness (rare), force it with `flushSync`.

```jsx
import { flushSync } from "react-dom";

function recordAnalyticsBatch() {
  setTimeout(() => {
    flushSync(() => {
      setPending(true); // forces its own render, if genuinely needed
    });
    setCount((c) => c + 1);
    setLastUpdated(Date.now());
    // these two still batch together into one render
  }, 300);
}
```

In practice, the better fix is almost always to stop relying on intermediate render timing in tests and assert on the final, settled state instead — `flushSync` should be a last resort since it opts out of a performance optimization.
