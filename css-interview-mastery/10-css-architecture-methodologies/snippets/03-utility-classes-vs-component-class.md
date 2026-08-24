# Snippet: Same Button, Utility-First vs Component Class

## Utility-first (Tailwind-style)

```html
<button class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
  <svg class="w-4 h-4"><!-- icon --></svg>
  Save changes
</button>
```

No custom CSS file is needed at all — every visual property is expressed as a utility class, composed directly in markup.

## Component-scoped (semantic class + hand-written CSS)

```html
<button class="btn-save">
  <svg class="btn-save__icon"><!-- icon --></svg>
  Save changes
</button>
```

```css
.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  font-weight: 600;
  border-radius: 8px;
}
.btn-save:hover {
  background: #1d4ed8;
}
.btn-save__icon {
  width: 1rem;
  height: 1rem;
}
```

Same rendered result, two philosophies: the utility version needs no naming decisions and no separate CSS file, but every usage repeats the full class list; the component version needs one name invented (`.btn-save`) but keeps markup minimal and the visual definition in exactly one place.
