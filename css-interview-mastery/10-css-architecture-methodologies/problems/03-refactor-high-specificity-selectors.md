# Problem: Refactor Over-Specific Selectors Down to a Manageable Baseline

## Problem Statement

You're given a stylesheet fragment riddled with unnecessarily high specificity — nested selectors, an ID, and a chain of classes — that makes it hard for anyone to safely override in the future. Refactor it so every rule has the lowest specificity that still correctly targets only the intended elements, without changing which elements are matched.

## Starting Point

```css
#page-wrapper div.content ul.nav-list li.nav-item a.nav-link.active {
  color: #2563eb;
  font-weight: 700;
}

#page-wrapper div.content ul.nav-list li.nav-item a.nav-link:hover {
  text-decoration: underline;
}
```

Specificity of the first rule: 1 ID, 5 classes, 2 types → (1,5,2) — extremely high for what is ultimately just "the active nav link."

## Constraints

- Final selectors must still match exactly the same elements as before (no behavior change).
- No `!important` anywhere in the solution.
- Prefer flat, BEM-style single-class selectors.

## Solution

```html
<!-- Assume markup can be updated to add clear, purpose-built classes -->
<nav class="nav">
  <ul class="nav__list">
    <li class="nav__item">
      <a class="nav__link nav__link--active" href="#">Dashboard</a>
    </li>
  </ul>
</nav>
```

```css
.nav__link--active {
  color: #2563eb;
  font-weight: 700;
}

.nav__link:hover {
  text-decoration: underline;
}
```

New specificity: `.nav__link--active` is (0,1,0) — a single class — down from (1,5,2). `.nav__link:hover` is (0,2,0) — one class plus one pseudo-class (pseudo-classes count as a class for specificity purposes) — down from (1,5,2) as well.

**Why this is safe and preferable:** the original selector's enormous specificity came entirely from encoding the full ancestor chain (`#page-wrapper` → `.content` → `.nav-list` → `.nav-item` → `.nav-link.active`) into a single rule, none of which is actually necessary to uniquely identify "the active nav link" — a single well-named class does that job just as precisely, at a fraction of the specificity. Because the new rules are flat single-class selectors, any future override (a themed variant, a per-page tweak) only needs an equal-or-later single class to win, instead of requiring another ID or a longer selector chain — which is exactly the kind of specificity escalation the original code had already fallen into.
