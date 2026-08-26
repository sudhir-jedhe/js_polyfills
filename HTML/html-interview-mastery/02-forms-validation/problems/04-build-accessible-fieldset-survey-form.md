*** copy 04-build-accessible-fieldset-survey-form.md ***

# Problem: Build an Accessible Multi-Section Survey Form

## Problem Statement

Build a short survey form with three distinct, clearly grouped sections: (1) a single-choice radio group ("How did you hear about us?"), (2) a 1-5 rating using `type="range"` with the current value displayed live via `<output>`, and (3) an open-ended comments `<textarea>` with a live character counter (max 300 characters). The whole form must be screen-reader navigable with clear group boundaries.

## Constraints

- Each logical group must be a `<fieldset>` with a `<legend>`.
- The range input's live value must be exposed via `<output>`, correctly associated with the input.
- The character counter must update live and be announced without being obnoxiously verbose (i.e., not read out on every single keystroke).
- No field should trap keyboard focus or be unreachable via Tab.

## Solution

```html
<form id="survey-form">
  <h1>Quick Survey</h1>

  <fieldset>
    <legend>How did you hear about us?</legend>
    <label><input type="radio" name="source" value="search" required> Search engine</label>
    <label><input type="radio" name="source" value="social"> Social media</label>
    <label><input type="radio" name="source" value="friend"> Friend/colleague</label>
    <label><input type="radio" name="source" value="other"> Other</label>
  </fieldset>

  <fieldset>
    <legend>How would you rate your experience?</legend>
    <label for="rating">Rating (1-5)</label>
    <input id="rating" type="range" min="1" max="5" step="1" value="3"
           oninput="ratingOutput.value = this.value">
    <output id="ratingOutput" for="rating">3</output>
  </fieldset>

  <fieldset>
    <legend>Additional comments</legend>
    <label for="comments">Comments (optional, max 300 characters)</label>
    <textarea id="comments" name="comments" maxlength="300"
              aria-describedby="char-count"></textarea>
    <p id="char-count" aria-live="polite">300 characters remaining</p>
  </fieldset>

  <button type="submit">Submit Survey</button>
</form>
```

```js
const comments = document.getElementById('comments');
const charCount = document.getElementById('char-count');
const MAX = 300;

let debounceTimer;
comments.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  const remaining = MAX - comments.value.length;
  // update the visible text immediately…
  charCount.textContent = `${remaining} characters remaining`;
  // …but debounce when a screen reader actually ANNOUNCES it, to avoid a firehose of chatter mid-typing
  debounceTimer = setTimeout(() => {
    charCount.setAttribute('aria-live', 'polite');
  }, 500);
});
```

**Why this satisfies the constraints:** three distinct `<fieldset>`/`<legend>` groups give screen reader users clear section boundaries when tabbing through. `<output for="rating">` programmatically associates the live rating value with its source input (the same `for`/`id` relationship pattern as `<label>`), so assistive tech can identify what the output represents. `aria-live="polite"` on the character counter means updates are queued and announced when the screen reader is idle rather than interrupting — "polite" (not "assertive") is the deliberate choice here since a running character count is informative but not urgent, and the debounce further avoids announcing every single keystroke, which is important because a naive live region on a fast-typing textarea can otherwise produce an unusable wall of audio feedback.
