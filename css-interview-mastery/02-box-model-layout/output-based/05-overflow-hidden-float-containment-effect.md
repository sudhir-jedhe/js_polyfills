# Output: `overflow: hidden` and Float Containment

```css
.container { border: 2px solid black; }
.float-child { float: left; width: 100px; height: 80px; background: coral; }
```
```html
<div class="container">
  <div class="float-child"></div>
</div>
```

**Question:** What height does `.container`'s border box render at (assuming no other children and no explicit height set)? Then, what changes if `.container` gets `overflow: hidden` added?

**Answer (without `overflow: hidden`):** `.container` collapses to **0px height** (just its border, no content height). Floated elements are removed from normal flow, so they don't contribute to their parent's auto height at all — the parent behaves as if the float weren't there for sizing purposes, even though the float is visually still inside its border box.

**Answer (with `overflow: hidden`):** `.container` renders at **80px height** (the height of `.float-child`), plus its border. `overflow: hidden` (any value other than `visible`, really) establishes a new block formatting context, and a new BFC is required by spec to fully contain its floated descendants' height — this is the classic pre-`flow-root` "overflow clearfix" trick. Note the tradeoff: any content that legitimately needs to overflow `.container`'s bounds (a dropdown, a `box-shadow`) would now also get clipped as an unwanted side effect — `display: flow-root` achieves the same containment without that risk.
