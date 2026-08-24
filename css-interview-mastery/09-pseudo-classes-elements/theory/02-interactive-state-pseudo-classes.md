# Interactive State Pseudo-Classes

These pseudo-classes match an element based on user interaction or input state, not its position in the document.

## `:hover` and `:active`

```css
button:hover { background: #eee; }   /* pointer is over the element */
button:active { transform: translateY(1px); } /* being pressed, between mousedown and mouseup */
```

`:active` fires only for the duration of the press and has no meaning for pure keyboard interaction — a keyboard `Enter` press on a button does *not* trigger `:active` in the same visual sense in all browsers, which is one reason it shouldn't be relied on for the only interactive feedback.

## `:focus`, `:focus-visible`, and `:focus-within`

```css
input:focus { outline: 2px solid #2563eb; }             /* matches on ANY focus, mouse or keyboard */
input:focus-visible { outline: 2px solid #2563eb; }     /* matches only when the browser thinks focus should be visibly indicated */
fieldset:focus-within { border-color: #2563eb; }         /* matches when ANY descendant has focus */
```

| Selector | Fires on mouse click | Fires on keyboard tab | Typical use |
|---|---|---|---|
| `:focus` | Yes | Yes | Legacy default — same style regardless of input method |
| `:focus-visible` | Usually no (browser heuristic) | Yes | Show focus rings only for keyboard/AT users, hide the "ugly" ring on mouse click |
| `:focus-within` | N/A (matches ancestor) | N/A (matches ancestor) | Highlight a whole form group / card when something inside it has focus |

### Why `:focus-visible` exists

Before `:focus-visible`, developers commonly did `outline: none` on `:focus` to avoid the focus ring appearing on mouse clicks (which felt visually noisy), but this also removed it for keyboard users — a serious accessibility regression, since keyboard users rely on the focus ring to know where they are. `:focus-visible` lets the browser apply its own heuristic (roughly: "was this focus event likely the result of keyboard/AT navigation, or a pointer click?") so you can style visible focus only when it's actually useful, without punishing keyboard users:

```css
/* Bad: removes focus indication for everyone, including keyboard users */
button:focus { outline: none; }

/* Good: no ring on mouse click, full ring for keyboard navigation */
button:focus { outline: none; }
button:focus-visible { outline: 2px solid #2563eb; }
```

## `:focus-within` for compound widgets

`:focus-within` matches an element if it *or any of its descendants* currently has focus — useful for highlighting an entire form row, card, or custom dropdown when the user is interacting with anything inside it, without JavaScript:

```css
.search-bar:focus-within { box-shadow: 0 0 0 2px #2563eb; }
```
