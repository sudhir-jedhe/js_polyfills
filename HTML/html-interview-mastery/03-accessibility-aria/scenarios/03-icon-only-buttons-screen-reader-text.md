*** copy 03-icon-only-buttons-screen-reader-text.md ***

# Scenario: A Toolbar of Icon-Only Buttons Announces as "button, button, button"

**Scenario:** A rich-text editor toolbar has icon-only buttons for Bold, Italic, Underline, and Link. An accessibility audit reports that a screen reader announces every single one identically as just "button" with no way to distinguish them. How do you fix it, and how do you prevent this class of bug from recurring as new toolbar buttons get added?

**Diagnosis:** Each button's only content is an `<svg>` icon with no accessible name — SVG icons, unlike `<img>`, have no `alt` equivalent that's used by default, so the button's computed accessible name falls back to empty/whitespace, and screen readers announce just the generic role.

```html
<!-- Before: no accessible name on any of these -->
<button><svg><!-- bold icon --></svg></button>
<button><svg><!-- italic icon --></svg></button>
<button><svg><!-- underline icon --></svg></button>
```

**Fix:**

```html
<button aria-label="Bold">
  <svg aria-hidden="true" focusable="false"><!-- bold icon --></svg>
</button>
<button aria-label="Italic">
  <svg aria-hidden="true" focusable="false"><!-- italic icon --></svg>
</button>
<button aria-label="Underline">
  <svg aria-hidden="true" focusable="false"><!-- underline icon --></svg>
</button>
```

Each button now has a distinct accessible name via `aria-label`, and `aria-hidden="true"` on each `<svg>` prevents any incidental content inside the icon (e.g. a `<title>` element some icon systems auto-inject) from being announced redundantly or confusingly alongside it.

**Preventing recurrence — a reusable icon-button component:**

```jsx
function IconButton({ label, icon, onClick }) {
  return (
    <button aria-label={label} onClick={onClick}>
      <Icon svg={icon} aria-hidden="true" focusable="false" />
    </button>
  );
}

// usage — the label is now a REQUIRED prop, not an easy-to-forget attribute
<IconButton label="Bold" icon={boldIcon} onClick={toggleBold} />
```

**Why this matters at the process level, not just the code level:** the actual bug wasn't "someone forgot an attribute once" — it's that the toolbar's button markup pattern made it *easy* to forget, with no guardrail. Wrapping icon-only buttons in a shared component that requires a `label` prop (and ideally fails a type check or lint rule if omitted) turns "remember to add `aria-label` every time" into "the component literally can't be used without it" — the more durable fix, since audits catching existing violations doesn't prevent the next developer from reintroducing the same bug in a new button six months later.
