# What Class Name Does CSS Modules Actually Generate?

```css
/* Alert.module.css */
.warning {
  background: #fef3c7;
  border: 1px solid #f59e0b;
}
```

```jsx
// Alert.jsx
import styles from './Alert.module.css';

console.log(styles.warning);
function Alert() {
  return <div className={styles.warning}>Careful!</div>;
}
```

**Question:** What does `styles.warning` actually evaluate to at runtime, and why doesn't the rendered HTML just say `class="warning"`?

**Answer:** It evaluates to a generated, scoped string — something like `"Alert_warning__k3f9a"` (exact format depends on the bundler/loader configuration, but it's always a transformed, effectively-unique identifier, not the literal string `"warning"`). The rendered `<div>` ends up with `class="Alert_warning__k3f9a"`, not `class="warning"`.

**Why:** CSS Modules works by having the build tool rewrite every class *selector* in the `.module.css` file into a unique, hashed/prefixed name (avoiding cross-file collisions is the entire point), and simultaneously exports a JS object (`styles`) mapping the *original* class name (`warning`) to that generated string. This is why you must always reference classes via `styles.warning` in the component rather than hardcoding `className="warning"` — hardcoding the original name would apply no styling at all, since no element in the actually-shipped CSS has a plain `.warning` selector anymore.
