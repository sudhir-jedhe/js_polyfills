# Snippet: Overriding an Inherited Custom Property in a Nested Scope

```html
<div class="panel">
  <p>Uses the default --panel-text value</p>
  <div class="panel panel--warning">
    <p>Uses the overridden --panel-text value, scoped to this subtree only</p>
  </div>
</div>
```

```css
.panel {
  --panel-text: #1a1a1a; /* default, inherited by descendants that don't redeclare it */
  border: 1px solid #ddd;
  padding: 16px;
}

.panel--warning {
  --panel-text: #92400e; /* overrides --panel-text for this element and ITS descendants only */
  background: #fef3c7;
}

.panel p {
  color: var(--panel-text); /* resolves differently depending on which .panel ancestor it's nested in */
}
```

Both `<p>` elements share the exact same `color: var(--panel-text)` rule, yet render in different colors — because `--panel-text`'s inherited value differs depending on which `.panel` ancestor is nearest, and inheritance means each `<p>` independently resolves the property based on its own position in the DOM tree, not a single global value.
