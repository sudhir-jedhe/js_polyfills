***  06-template-content-not-rendered.md ***

# Output: Is Content Inside `<template>` Rendered or Fetched?

```html
<template id="t">
  <img src="https://example.com/photo.jpg" alt="photo" />
  <p>Hello</p>
</template>

<script>
  console.log(document.querySelector('template p')); // A
  console.log(document.querySelector('#t').content.querySelector('p')); // B
</script>
```

**Question:** What does the page display, does the browser fetch `photo.jpg`, and what do `console.log` lines A and B print?

**Answer:** The page displays nothing from the template (no image, no "Hello" text), the browser does **not** fetch `photo.jpg`, line A logs `null`, and line B logs the `<p>` element.

**Why:** Everything inside `<template>` is **inert** — parsed as valid DOM, but never attached to the rendered document and never triggers side effects like image fetches. Crucially, `<template>`'s children live inside `template.content` (a separate `DocumentFragment`), **not** as direct children of the `<template>` element itself in the main document tree — that's why `document.querySelector('template p')` (line A) finds nothing (`null`): a plain `querySelector` walks the light DOM, and the template's children aren't there. You must go through `.content` (line B) to reach them. Only once a clone of `template.content` is appended into the live document does the `<img>` actually fetch and the `<p>` actually render.
