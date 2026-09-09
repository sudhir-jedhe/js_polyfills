***  04-doctype-quirks-mode-and-validation.md ***

# DOCTYPE, Quirks Mode, and HTML Validation

## What `<!DOCTYPE html>` actually does

The doctype's *only* practical job in a modern browser is to trigger **standards mode** instead of **quirks mode**. It is not a version declaration, not a schema reference, and (unlike in HTML 4/XHTML) doesn't point to a DTD the browser fetches or validates against. `<!DOCTYPE html>` is the shortest string that reliably triggers standards mode across all browsers — that's the entire reason HTML5 simplified it down from the old, unwieldy HTML 4.01/XHTML doctype strings.

```html
<!DOCTYPE html>  <!-- the only doctype you need, ever, for a modern page -->
```

## The three rendering modes

| Mode | Trigger | Behavior |
|---|---|---|
| **Standards mode** (aka "no-quirks mode") | Valid `<!DOCTYPE html>` as the very first thing in the document | CSS box model, table layout, and other rendering follow the CSS/HTML specs as written |
| **Quirks mode** | Missing doctype, or a very old/malformed one | Browser emulates ~1990s Navigator/IE bugs: notably the "quirks" box model (width includes border+padding, like `box-sizing: border-box` was forced), incorrect table cell sizing, font-size inheritance quirks, and looser CSS parsing |
| **Limited-quirks mode** ("almost standards") | Certain older doctypes (e.g. HTML 4.01 Transitional with a URL) | Mostly standards mode, except for a narrow vertical-sizing quirk in table cells |

## Why quirks mode is dangerous today

Nobody sets out to trigger quirks mode — it happens by accident, usually from:
- A missing doctype entirely (e.g. an HTML fragment served directly, or a doctype accidentally stripped by a templating/build tool)
- Anything (even whitespace or a comment) appearing *before* the doctype in the source
- Legacy server-rendered pages inheriting an old boilerplate

The symptom is usually "my CSS box-sizing math doesn't add up" or "table cells aren't sizing the way the CSS says they should" — because the browser is silently reinterpreting width/height/padding math using pre-2000s rules. This is a classic legacy-codebase bug: the fix is almost always just adding/restoring `<!DOCTYPE html>` as the literal first line.

## Checking which mode a page is in

```js
console.log(document.compatMode);
// "CSS1Compat" -> standards mode (or limited-quirks — the DOM API doesn't distinguish these two)
// "BackCompat" -> quirks mode
```

## HTML validation

Validation checks markup against the HTML spec's syntax and content-model rules — not against "does it render correctly" (broken HTML often still renders something, because browsers are lenient error-correctors).

**Common validation errors:**
- Unclosed tags (`<p>` without `</p>` — technically allowed for `<p>` due to auto-closing rules, but not for most elements)
- Invalid nesting (a `<div>` inside a `<p>` — `<p>`'s content model is phrasing content only, so this force-closes the `<p>` early)
- Duplicate `id` attributes (must be unique per document)
- Missing required attributes (`<img>` without `alt`, `<a>` without `href` when meant to be a link vs. `<button>`)
- Using an obsolete/removed element or attribute (`<center>`, `<font>`, `align="..."`)

**Tools:**
- The [W3C Markup Validation Service](https://validator.w3.org/) (nu.validator.org) — the canonical spec-compliance checker
- Browser DevTools console warnings for some structural issues (nesting mistakes are often silently auto-corrected by the parser rather than warned about, which is exactly why a validator is still necessary — the rendered result can look fine while the markup is technically wrong)
- Linters: `htmlhint`, `eslint-plugin-html` for JSX/template-embedded HTML

## Why "it renders fine" isn't proof of valid HTML

Browsers implement an **error-correcting parser** (the HTML5 parsing algorithm is explicit about this — unlike XML, which fails hard on malformed input, HTML must always produce *some* DOM). A `<table>` missing a `<tbody>`, a `<li>` outside a `<ul>`/`<ol>`, or mismatched tag nesting will often "just work" visually because the parser silently repairs it according to spec-defined error-recovery rules — but the repaired DOM structure may not match what the author intended, and it's exactly the kind of thing that trips up CSS selectors, JS DOM traversal, and assistive technology that all assume a specific structure.
