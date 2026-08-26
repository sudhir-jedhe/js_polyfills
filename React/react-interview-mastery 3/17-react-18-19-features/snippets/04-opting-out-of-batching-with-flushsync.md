# Opting Out of Batching with flushSync

```jsx
import { flushSync } from "react-dom";

function handleClick() {
  flushSync(() => {
    setCount((c) => c + 1); // commits immediately, own render
  });
  flushSync(() => {
    setFlag((f) => !f); // commits immediately, separate render
  });
}
```
