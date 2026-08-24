# Snippet: OOCSS Structure/Skin Separation

```html
<button class="btn btn--primary">Save</button>
<button class="btn btn--outline">Cancel</button>
<button class="btn btn--danger">Delete</button>
```

```css
/* STRUCTURE — shared layout/sizing, reused by every variant */
.btn {
  display: inline-block;
  padding: 0.6em 1.4em;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
}

/* SKIN — visual variants, mixed onto the shared structure */
.btn--primary {
  background: #2563eb;
  color: white;
}
.btn--outline {
  background: transparent;
  border-color: #2563eb;
  color: #2563eb;
}
.btn--danger {
  background: #dc2626;
  color: white;
}
```

Sizing/padding/border-radius live once, in `.btn`. Adding a new visual variant (`.btn--success`) never requires touching or duplicating the structural rule — this is the OOCSS "structure vs skin" principle in its simplest form.
