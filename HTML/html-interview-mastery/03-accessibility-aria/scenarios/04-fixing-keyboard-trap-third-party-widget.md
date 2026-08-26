*** copy 04-fixing-keyboard-trap-third-party-widget.md ***

# Scenario: A Third-Party Date Picker Widget Traps Keyboard Focus

**Scenario:** You've integrated a third-party date-picker library. A user reports: once they Tab into the calendar popup to pick a date, they can never Tab back out — focus just keeps cycling through the calendar's own days/month-nav buttons forever, and Escape does nothing. You don't control the library's source. How do you diagnose and fix this without forking it?

**Diagnosis:** This is a genuine **WCAG 2.1.2 keyboard trap** — not the "good" kind of contained focus a modal uses (which always has an escape route), but focus that's stuck with literally no way out via keyboard. The library almost certainly implemented its own internal Tab-wrapping logic (similar to the modal focus-trap pattern) but never wired up an `Escape` handler to close the popup and release focus — an easy thing to miss when the internal focus-cycling logic looks superficially "correct" (it does cycle nicely among its own elements) but was never tested for the exit path specifically.

**Fix options, most to least preferable:**

**1. Check for an existing config option first.** Many mature date-picker libraries (e.g. anything modeled on the WAI-ARIA datepicker pattern) already support `Escape`-to-close but require it to be explicitly enabled via a prop/option — check the library's docs/GitHub issues before writing a workaround; this is by far the most common actual resolution.

**2. Patch it externally with a capturing document-level listener**, if no built-in option exists:

```js
document.addEventListener('keydown', (e) => {
  const openPicker = document.querySelector('.thirdparty-datepicker.is-open');
  if (openPicker && e.key === 'Escape') {
    e.preventDefault();
    const closeBtn = openPicker.querySelector('[data-close]')
      || openPicker; // fall back to just triggering the library's own close mechanism if exposed
    // trigger whatever the library's documented "close" API/event is
    openPicker.dispatchEvent(new CustomEvent('close-request'));
    // then manually restore focus, since the library likely won't do this for an externally-triggered close
    document.querySelector('[data-datepicker-trigger]')?.focus();
  }
}, true); // capture phase, so this runs even if the widget's own listener would otherwise swallow the event first
```

**3. If the library genuinely cannot be escaped by any means, replace it.** A component with a true, unfixable keyboard trap is a severe, blocking accessibility violation — not something to ship with a "known issue" label. If no config option or external patch is possible, evaluate an alternative library (or fall back to a native `<input type="date">`, which has zero keyboard-trap risk since it uses the OS/browser's own native picker) rather than accepting the regression.

**General lesson:** third-party UI libraries are a common source of accessibility bugs precisely because "does it visually work" is what most teams test, and keyboard-trap bugs are invisible unless someone actually tries navigating the widget with a mouse unplugged — this is exactly the kind of issue that automated tools like axe often miss too (a keyboard trap requires *interaction sequence* testing, not static markup analysis), which is why manual keyboard-only testing remains necessary even on a page that passes every automated audit.
