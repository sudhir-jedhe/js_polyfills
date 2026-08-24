# Which Rule Wins? A Specificity Conflict

```html
<div id="app">
  <nav class="sidebar">
    <a class="nav-link active" href="#">Dashboard</a>
  </nav>
</div>
```

```css
#app .sidebar a { color: #333; }
.sidebar .nav-link.active { color: #2563eb; }
nav a.active { color: green; }
```

**Question:** What color is the link, and why?

**Answer:** `#333` (dark gray) — the first rule wins.

**Why:** Compute specificity for each (ID, class, type):
- `#app .sidebar a` → 1 ID, 1 class, 1 type → (1,1,1)
- `.sidebar .nav-link.active` → 0 IDs, 3 classes (`.sidebar`, `.nav-link`, `.active`), 0 types → (0,3,0)
- `nav a.active` → 0 IDs, 1 class, 2 types → (0,1,2)

Comparing left-to-right (IDs first, then classes, then types): the first rule has 1 ID, and neither of the others has any ID at all — an ID selector always outweighs any number of classes or type selectors, regardless of how many are stacked. So `#app .sidebar a` wins outright at (1,1,1), even though it has the fewest classes of the three. This is exactly the scenario the "avoid ID selectors for styling" guidance warns about: once an ID sneaks into a selector, no amount of well-organized class-based CSS elsewhere can override it without escalating specificity further or using `@layer`.
