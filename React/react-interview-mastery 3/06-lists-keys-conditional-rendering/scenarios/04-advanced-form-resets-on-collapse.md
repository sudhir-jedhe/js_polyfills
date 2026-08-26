*** copy 04-advanced-form-resets-on-collapse.md ***

# Scenario: Conditional rendering causes an expensive form to reset unexpectedly

You built a settings page where an "Advanced options" section toggles visibility with `{showAdvanced && <AdvancedForm />}`. Users complain that if they fill in advanced fields, collapse the section, then reopen it, all their input is lost.

**Approach:** Confirm the mental model with the team: `&&`/ternary conditional rendering unmounts the component, discarding all of its internal state. Two valid fixes depending on desired UX:

1. If the fields should reset each time (common for "advanced" sections that are rarely reopened), this is expected behavior — document it.
2. If input should persist, either lift the form state up to the parent (controlled inputs backed by parent state that survives the toggle) or keep the section mounted and hide it visually:

```jsx
<div style={{ display: showAdvanced ? 'block' : 'none' }}>
  <AdvancedForm />
</div>
```

Lifting state up is usually preferable to `display: none` because it keeps the DOM lean and makes the "source of truth" explicit, but `display: none` is faster to ship when the form is complex and you don't want to refactor its internal state management.
