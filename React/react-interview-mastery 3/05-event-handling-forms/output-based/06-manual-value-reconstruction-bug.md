***  06-manual-value-reconstruction-bug.md ***

# Output-Based: What breaks when a handler rebuilds the value from stale state instead of `e.target.value`?

```jsx
function EmailForm() {
  const [form, setForm] = React.useState({ email: '' });
  function handleChange(e) {
    setForm(prev => ({ ...prev, email: form.email + e.target.value.slice(-1) }));
  }
  return <input value={form.email} onChange={handleChange} />;
}
```

**Answer:** Typing normally (not pasting) appears to work correctly by coincidence for single-character insertions at the end, but this breaks (produces garbled/duplicated text) the moment the user edits in the middle of the string, deletes characters, or pastes multi-character text.

**Why:** The handler mixes a stale closure value (`form.email`, captured at render time) with the live `e.target.value`, reconstructing the new value manually instead of just using `e.target.value` directly. `e.target.value` already reflects the DOM input's full current value after the keystroke — there's no reason to reconstruct it from old state, and doing so is fragile and incorrect for anything beyond appending one character at the end.
