*** copy 04-iframe-sandbox-missing-allow-scripts.md ***

# Output: Sandboxed Iframe Missing `allow-scripts`

```html
<iframe src="https://interactive-widget.example.com/app" sandbox="allow-forms"></iframe>
```

**Question:** The embedded widget is a JavaScript-driven interactive app (e.g. a calculator or a chat widget). What happens when it loads inside this iframe?

**Answer:** The embedded page's HTML/CSS renders normally, but **no JavaScript in it executes at all** — any `<script>` tags, inline event handlers, or dynamically-added behavior inside the iframe are inert. From the user's perspective, the widget likely appears completely broken or static/non-interactive — buttons that should respond to clicks do nothing, since the click handlers that would normally be attached via JS never run.

**Why:** An explicit `sandbox` attribute applies maximum restriction by default, and only the tokens you list are re-enabled — `allow-forms` alone re-enables form submission but says nothing about script execution, which requires the separate `allow-scripts` token. This is a common integration bug: someone copies a `sandbox="..."` value from one embed context without realizing the specific widget being embedded here requires JS to function, and the failure mode (silent, no console error about "blocked by sandbox" in many cases, just inert behavior) can be genuinely confusing to debug without knowing to check the sandbox token list first.
