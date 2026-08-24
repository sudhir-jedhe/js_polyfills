# Snippet: CSS Modules Scoping

```css
/* Card.module.css */
.card {
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}
.title {
  font-size: 1.1rem;
  font-weight: 600;
}
```

```jsx
// Card.jsx
import styles from './Card.module.css';

function Card({ children }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{children}</h3>
    </div>
  );
}
```

At build time, the bundler rewrites `.card` and `.title` into globally-unique class names (e.g. `Card_card__f8a2b`, `Card_title__7c1de`), and `styles.card` / `styles.title` resolve to those generated strings. This means `.title` in `Card.module.css` can never collide with an unrelated `.title` class defined in a completely different file — each module's classes are scoped to only the component that imports them, without any naming-convention discipline (like BEM) required to prevent collisions.
