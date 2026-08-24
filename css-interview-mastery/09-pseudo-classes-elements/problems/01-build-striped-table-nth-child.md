# Problem: Build a Striped, Hoverable Data Table

## Problem Statement

Build a table styling solution (pure CSS, no JS, no extra classes in the markup) that:
1. Alternates row background colors (zebra striping).
2. Highlights whichever row the mouse is currently over, even on top of the striping.
3. Visually distinguishes the header row from data rows.
4. Bold the *first* and *last* data row without knowing the row count ahead of time.

## Constraints

- No JavaScript.
- No per-row classes added in markup — selectors must be purely structural.
- Must work regardless of how many `<tr>` rows are in `<tbody>`.

## Solution

```html
<table class="data-table">
  <thead>
    <tr><th>Name</th><th>Role</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr><td>Aiko</td><td>Engineer</td><td>Active</td></tr>
    <tr><td>Ben</td><td>Designer</td><td>Active</td></tr>
    <tr><td>Chidi</td><td>PM</td><td>On leave</td></tr>
    <tr><td>Dana</td><td>Engineer</td><td>Active</td></tr>
  </tbody>
</table>
```

```css
.data-table {
  border-collapse: collapse;
  width: 100%;
}

.data-table th,
.data-table td {
  padding: 0.6rem 1rem;
  text-align: left;
}

/* 3. Distinguish header */
.data-table thead th {
  background: #1f2937;
  color: white;
  font-weight: 600;
}

/* 1. Zebra striping */
.data-table tbody tr:nth-child(odd) {
  background: #f9fafb;
}
.data-table tbody tr:nth-child(even) {
  background: #ffffff;
}

/* 2. Hover highlight — placed AFTER the striping rules so it wins on equal specificity */
.data-table tbody tr:hover {
  background: #dbeafe;
}

/* 4. First and last row, regardless of total count */
.data-table tbody tr:first-child,
.data-table tbody tr:last-child {
  font-weight: 700;
}
```

**Why this works:** `:nth-child(odd/even)` handles striping without touching markup. `:hover` is written after the striping rules in source order — since `tr:hover` and `tr:nth-child(odd)` have identical specificity (0,0,1,1 each — one pseudo-class, one type selector), the later rule in the cascade wins, so hover correctly overrides the stripe color regardless of which row is hovered. `:first-child`/`:last-child` scoped to `tbody tr` bold the outer rows without any row-count logic, and continue to work correctly as rows are added or removed.
