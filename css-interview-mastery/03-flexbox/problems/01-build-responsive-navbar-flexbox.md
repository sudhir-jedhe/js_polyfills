# Problem: Build a Responsive Navbar With Flexbox

## Problem Statement

Build a navbar with a logo on the left, a horizontal list of nav links in the middle/right, and a "Sign up" button pinned to the far right. On viewports narrower than 640px, the nav links should disappear (replaced by a hamburger button, which you don't need to wire up functionality for — just show/hide the two elements via a checkbox-based CSS toggle) and the layout should collapse to logo + hamburger only.

## Constraints

- No JavaScript — use a `<input type="checkbox">` + `<label>` toggle pattern for the mobile menu state.
- Nav links must not shrink below their label width at any size above the mobile breakpoint (avoid the flex-shrink text-wrap trap).
- Must use flexbox, not floats or grid.

## Solution

```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  gap: 24px;
}

.navbar__logo {
  flex: 0 0 auto;
  font-weight: 700;
}

.navbar__links {
  display: flex;
  gap: 20px;
  flex: 1 1 auto;
  justify-content: center;
}

.navbar__link {
  flex: 0 0 auto; /* never shrinks below label width — avoids the flex-shrink text-wrap trap */
  white-space: nowrap;
}

.navbar__cta {
  flex: 0 0 auto;
}

.navbar__toggle {
  display: none; /* hidden by default; shown only below the breakpoint */
}

#nav-toggle {
  display: none; /* the actual checkbox driving the CSS-only toggle, visually hidden */
}

@media (max-width: 640px) {
  .navbar__links,
  .navbar__cta {
    display: none;
  }
  .navbar__toggle {
    display: block;
    flex: 0 0 auto;
  }
  #nav-toggle:checked ~ .navbar__links {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    background: white;
    padding: 16px;
  }
}
```

```html
<nav class="navbar">
  <div class="navbar__logo">Brand</div>
  <input type="checkbox" id="nav-toggle" />
  <ul class="navbar__links">
    <li class="navbar__link"><a href="#">Product</a></li>
    <li class="navbar__link"><a href="#">Pricing</a></li>
    <li class="navbar__link"><a href="#">About</a></li>
  </ul>
  <button class="navbar__cta">Sign up</button>
  <label class="navbar__toggle" for="nav-toggle">☰</label>
</nav>
```

**Why this works:** the outer `.navbar` uses `justify-content: space-between` to push the logo and (on desktop) CTA to opposite ends, with the flexible `.navbar__links` container absorbing the space between them via `flex: 1 1 auto`. Each individual link uses `flex: 0 0 auto` so it never shrinks below its label's natural width — avoiding the classic flex-shrink/text-wrap trap covered in the scenarios file. The checkbox-plus-sibling-combinator (`#nav-toggle:checked ~ .navbar__links`) pattern is a well-known no-JS way to toggle visibility purely with CSS, relying on the checkbox's `:checked` pseudo-class and the general sibling combinator.
