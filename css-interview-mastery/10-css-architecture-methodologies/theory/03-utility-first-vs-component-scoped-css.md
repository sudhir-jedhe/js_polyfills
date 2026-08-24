# Utility-First CSS vs Component-Scoped CSS

This is the dominant real-world architecture debate today, roughly split into two camps.

## Utility-first CSS (Tailwind-style)

Instead of authoring semantic component classes, you compose designs directly in markup from small, single-purpose utility classes, each mapping to one CSS property/value.

```html
<button class="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
  Save changes
</button>
```

No custom CSS is written for this button at all — every visual decision is expressed as a composition of existing utilities.

## Component-scoped CSS (CSS Modules, styled-components)

You write conventional CSS (or CSS-in-JS), but the tooling guarantees class names/styles are scoped to the component that defines them, so there's no risk of a `.title` in one file colliding with a `.title` in another.

```css
/* Button.module.css */
.button {
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border-radius: 8px;
}
```
```jsx
import styles from './Button.module.css';
function Button() { return <button className={styles.button}>Save changes</button>; }
// styles.button compiles to something like "Button_button__a1b2c" — guaranteed unique
```

```jsx
// styled-components: CSS lives inside the JS file itself, scoped via a generated class
const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border-radius: 8px;
`;
```

## Tradeoffs

| Aspect | Utility-first (Tailwind) | Component-scoped (CSS Modules / styled-components) |
|---|---|---|
| Where styling lives | Inline in markup, as class lists | In a separate CSS file or CSS-in-JS block, referenced by the component |
| Naming burden | None — no need to invent class names like `.card__title` | Requires naming every reusable class |
| Bundle size at scale | Stays roughly flat — the utility set is finite and shared/reused across the whole app | Grows roughly linearly with number of unique components/styles |
| Specificity conflicts | Rare — utilities are single-property and (with Tailwind's engine) intentionally ordered/deduped | Possible without scoping tooling; CSS Modules/styled-components solve this via generated unique class names |
| Readability of markup | Class lists can get long and visually noisy | Markup stays clean; styling logic is separated out |
| Design consistency | Enforced by the utility scale itself (fixed spacing/color tokens) | Only as consistent as developer discipline (though design tokens via CSS variables help) |
| Learning curve / new-team-member ramp-up | Need to learn the utility vocabulary | More familiar to anyone who already knows CSS |
| Refactoring/renaming a component's look | Edit classes across every usage in markup, or extract with `@apply`-like patterns | Edit one CSS/CSS-in-JS file, all usages update automatically |

## The pragmatic take

Neither is objectively "correct" — the tradeoff is fundamentally about *where* styling logic should live (markup vs a dedicated file) and how much you trust build tooling vs convention to prevent collisions. Utility-first tends to win for teams that want speed and consistency without needing to name things; component-scoped CSS tends to win for teams that want a clean separation between markup and presentation, or that already have significant CSS authored using traditional selectors. Many real codebases mix both: utilities for one-off layout tweaks, scoped component CSS for genuinely reusable design-system pieces.
