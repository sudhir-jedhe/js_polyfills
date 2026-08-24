# `transition: all` — What Actually Gets Watched, and What's the Cost?

```css
.card {
  width: 200px;
  padding: 16px;
  background: white;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.1);
  transform: scale(1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
}
```

**Question:** On `:hover`, only `transform` and `box-shadow` actually change values. Does `transition: all` still have a meaningful performance cost here, beyond just animating those two properties individually would?

**Answer:** Functionally, the visible animated result is the same as if `transition: transform 0.3s ease, box-shadow 0.3s ease;` had been written explicitly — only properties that actually change value produce a visible transition; `transition: all` doesn't animate `width`/`padding`/`background` here since they never change. But `transition: all` does carry real, meaningful downsides beyond this specific snapshot, which is why it's generally discouraged in production code.

**Why:** `transition: all` tells the browser to watch *every* animatable property on the element for changes, not just the ones you currently intend to animate — this has two concrete costs. First, it's a forward-compatibility/maintenance hazard: if a later code change adds, say, a `width` change on `:hover` (perhaps unintentionally, via an unrelated class also being toggled at the same time), that change now silently gets swept into the transition too, potentially introducing an expensive, Layout-triggering animated property without anyone deliberately deciding that should be animated — `transition: all` makes it easy to accidentally animate an expensive property by omission rather than by explicit choice. Second, there's a genuine (if often small) runtime cost: the browser has to actively monitor every property on the element for changes each frame to determine whether anything needs to transition, rather than only checking the specific, known set of properties actually listed. For both reasons — explicit intent and avoiding accidental expensive-property animation — listing the exact properties intended to transition (`transition: transform 0.3s ease, box-shadow 0.3s ease;`) is the generally recommended practice over `transition: all`, even though in this particular snapshot of the code, the visible behavior happens to be identical either way.
