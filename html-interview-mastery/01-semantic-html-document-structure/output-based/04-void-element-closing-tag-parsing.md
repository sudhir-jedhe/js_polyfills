# Output: Closing a Void Element

```html
<p>Line one<br></br>Line two</p>
```

**Question:** What does the resulting DOM look like — does `</br>` create a second line break, get treated as an error, or something else?

**Answer:** The DOM ends up as `<p>Line one<br>Line two</p>` — a single `<br>`, and the `</br>` is discarded by the parser without creating any node or throwing a visible error. Rendered output is just two lines: "Line one" then "Line two" — there is no extra blank line from a "second" `<br>`.

**Why:** The HTML5 parsing algorithm has an explicit, spec-defined list of void elements. When the tokenizer encounters an end tag matching a void element's name (`</br>`), the spec's parsing rules say to treat it as a **parse error** but still just ignore/discard the token — it does not get inserted into the DOM as a node, and it does not close anything (since `<br>` never opened an element that needs closing — it was never "open" in the tree in the first place, as void elements are inserted and immediately considered complete). This is why the visible symptom is "nothing happens" rather than a crash or a doubled line break, even though strictly speaking it is invalid markup that a validator will flag.
