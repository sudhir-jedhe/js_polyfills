# Interview Q&A: Form Submission & Debouncing

**Q: Why should form submission logic go on the form's `onSubmit` rather than a submit button's `onClick`?**
Because `onSubmit` fires regardless of whether the form was submitted by clicking a `type="submit"` button or by pressing Enter while focused in a text field, while `onClick` on the button only catches the click path — missing Enter-key submission entirely, which is a real accessibility/UX gap.

**Q: What does `event.preventDefault()` do in a form's `onSubmit` handler, and why is it almost always needed?**
It cancels the browser's default behavior for that submission, which is a full-page navigation/reload (submitting to the current URL or the form's `action`). In a React single-page app, you almost always want to handle submission with JavaScript (an API call, client-side routing) instead of letting the browser reload the page, so `preventDefault()` is standard in nearly every `onSubmit` handler.

**Q: How would you implement debouncing for a search input without an external library?**
Use `useEffect` keyed on the input value: schedule a `setTimeout` to perform the actual search, and return a cleanup function that clears that timeout. Because the cleanup runs before the effect re-runs on the next keystroke, each new keystroke cancels the previous pending call, so the actual search only fires once the user pauses typing for the debounce duration.

## Comparison tables

### `onClick` + `preventDefault` vs. `onSubmit` on the `<form>`

| Aspect | `preventDefault()` in a button's `onClick` | `preventDefault()` in the form's `onSubmit` |
|---|---|---|
| Covers Enter-key submission | No — only cancels that specific click's default action | Yes — fires regardless of whether submission was triggered by click or Enter key |
| Correctness for accessible forms | Incomplete | Correct — matches how forms are meant to be submitted |

Always attach submission logic to the form's `onSubmit`, not a button's `onClick`, so both mouse and keyboard (Enter) submission paths are handled uniformly.

### Debouncing vs. throttling input handlers

| Aspect | Debounce | Throttle |
|---|---|---|
| Behavior | Waits for a pause in activity, then fires once | Fires at most once per fixed interval, regardless of activity |
| Best for | Search-as-you-type, autosave — where only the "final" value matters | Scroll/resize handlers — where you want steady periodic updates during continuous activity |
| Typical implementation in React | `useEffect` + `setTimeout`, cleanup clears the pending timeout | `useRef` to track last-fired timestamp, or a dedicated utility |

Use debounce when you only care about the value once the user stops interacting. Use throttle when you need to keep responding periodically throughout continuous activity. The common mistake is debouncing a scroll handler, which causes visible lag versus the desired continuous feedback that throttling provides.
