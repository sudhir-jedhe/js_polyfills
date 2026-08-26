*** copy 04-void-elements-examples.md ***

# Snippet: Void Elements in Practice

```html
<!-- All of these are void elements: no closing tag, ever -->
<img src="diagram.png" alt="System architecture diagram" width="600" height="400">

<input type="email" name="email" id="email" required>

<br>

<hr>

<meta name="description" content="Semantic HTML interview prep">

<link rel="icon" href="/favicon.ico">

<!-- <source> is void and used inside <picture>/<video>/<audio> -->
<picture>
  <source srcset="hero-wide.jpg" media="(min-width: 800px)">
  <img src="hero-narrow.jpg" alt="Hero banner">
</picture>

<!-- <col> is void, used inside <colgroup> for table column styling -->
<table>
  <colgroup>
    <col style="background: #f5f5f5">
    <col>
  </colgroup>
  <tr><td>A</td><td>B</td></tr>
</table>
```

```html
<!-- INVALID — do not attempt to close a void element -->
<br></br>
<img src="x.jpg"></img>

<!-- INVALID — do not self-close a normal element expecting it to behave like JSX -->
<script src="app.js" />
```
