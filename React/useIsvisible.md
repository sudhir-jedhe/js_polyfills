```jsx
import { useState, useEffect, useRef } from "react";


- useIsVisible
- Tracks whether a referenced element is visible in the viewport.
-
- @param {Object} options
- @param {number|number[]} options.threshold - % of element that must be visible (0–1)
- @param {string} options.rootMargin - margin around root (e.g. "0px 0px -100px 0px")
- @param {boolean} options.once - stop observing after first time it becomes visible
- @returns [ref, isVisible]
  \*/
  export function useIsVisible({ threshold = 0.1, rootMargin = "0px", once = false } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
const node = ref.current;
if (!node) return;

    // Fallback for browsers without IntersectionObserver
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);

        // If "once", unobserve after first appearance
        if (entry.isIntersecting && once) {
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    // Cleanup — prevents memory leaks
    return () => observer.disconnect();

}, [threshold, rootMargin, once]);

return [ref, isVisible];
}


```
