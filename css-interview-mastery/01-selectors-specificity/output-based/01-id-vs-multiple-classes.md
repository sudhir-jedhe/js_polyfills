# Output: ID Selector vs. a Chain of Classes and Types

```css
.container ul li a { color: red; }
#nav .menu-item { color: blue; }
```

```html
<nav id="nav">
  <div class="container">
    <ul><li><a class="menu-item" href="#">Link</a></li></ul>
  </div>
</nav>
```

**Question:** What color is the link?

**Answer:** `blue`

**Why:** `.container ul li a` has specificity (id:0, class:1, type:3). `#nav .menu-item` has specificity (id:1, class:1, type:0). Compare column by column, ID first: `1 > 0`, so `#nav .menu-item` wins outright — the fact that the other rule has three type selectors is irrelevant, because specificity columns are never summed into a single number, only compared left to right.
