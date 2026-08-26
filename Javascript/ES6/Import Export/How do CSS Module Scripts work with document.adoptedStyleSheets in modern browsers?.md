*** copy How do CSS Module Scripts work with document.adoptedStyleSheets in modern browsers?.md ***

**CSS Module Scripts** allow you to import CSS files directly into JavaScript modules using standard ESM syntax and import attributes. Rather than inserting a `<style>` or `<link>` tag into the DOM, the browser compiles the imported stylesheet into a **`CSSStyleSheet` object (Constructable Stylesheet)**, which can be applied to the document or Web Components via **`adoptedStyleSheets`**.

---

### Core Syntax & Lifecycle

```javascript
// 1. Import CSS as a constructable CSSStyleSheet instance
import sheet from './styles.css' with { type: 'css' };

// 2. Adopt the stylesheet at the Document level
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

```

---

### Step-by-Step Execution Model

1. **1. Fetch & MIME Validation:**
The browser fetches `styles.css` with a strict requirement for the `text/css` MIME type. If the server serves a mismatched header (e.g., `text/javascript`), the browser throws a `TypeError`.

2. **2. Constructable Stylesheet Instantiation:**
The CSS text is parsed directly into an in-memory `CSSStyleSheet` instance. The module exports this instance as its **`default`** export.

3. **3. Adoption via adoptedStyleSheets:**
The `CSSStyleSheet` object is added to the `adoptedStyleSheets` array of a `Document` or `ShadowRoot`. The CSS engine applies the rules immediately without recreating DOM nodes.

---

### Key Use Case: Shadow DOM & Web Components

Historically, styling multiple Web Component instances required either duplicating `<style>` tags inside every Shadow Root (consuming memory and forcing redundant CSS parses) or using `<link>` tags (causing Flash of Unstyled Content (FOUC)).

With CSS Module Scripts, **a single parsed `CSSStyleSheet` instance is shared across hundreds of Shadow Roots**:

```javascript
import baseStyles from './base-button.css' with { type: 'css' };
import themeStyles from './theme.css' with { type: 'css' };

class CustomButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    // Share identical stylesheet references across all instances
    shadow.adoptedStyleSheets = [baseStyles, themeStyles];
    
    shadow.innerHTML = `<button><slot></slot></button>`;
  }
}

customElements.define('custom-button', CustomButton);

```

---

### Dynamic Imports with CSS Module Scripts

CSS module scripts can also be loaded conditionally or lazily using dynamic `import()`:

```javascript
async function applyTheme(themeName) {
  const { default: themeSheet } = await import(`./themes/${themeName}.css`, {
    with: { type: 'css' },
  });

  // Dynamically adopt the new theme stylesheet
  document.adoptedStyleSheets = [themeSheet];
}

```

---

### Live Rule Mutation & Shared Updates

Because `sheet` is a reference to a live `CSSStyleSheet` instance in memory, modifying its CSS rules via CSSOM immediately updates **every document and Shadow Root** that has adopted it:

```javascript
import sheet from './theme.css' with { type: 'css' };

document.adoptedStyleSheets = [sheet];
shadowRoot.adoptedStyleSheets = [sheet];

// Mutating the rule updates both targets simultaneously with zero re-parsing:
sheet.insertRule(':root { --primary-color: #ff0055; }', 0);

```

---

### Comparison: Traditional `<style>` Tags vs. CSS Module Scripts

| Feature               | Legacy `<style>` Injection                | CSS Module Scripts (`adoptedStyleSheets`)               |
| --------------------- | ----------------------------------------- | ------------------------------------------------------- |
| **DOM Overhead**      | Adds physical `<style>` nodes to DOM tree | No DOM elements; managed directly in CSSOM              |
| **Memory Allocation** | Cloned / re-parsed per component instance | Single shared `CSSStyleSheet` instance in memory        |
| **Parsing Cost**      | Parsed per instance                       | Parsed once during module evaluation                    |
| **FOUC Risk**         | High if using async `<link>` injection    | None (evaluates synchronously with the JS module graph) |
| **Module Lifecycle**  | Disconnected from JS module graph         | Integrated into ESM dependency tree & static analysis   |
