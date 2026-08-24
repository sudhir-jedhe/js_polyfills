# Margin Collapsing — All the Edge Cases

Margin collapsing is where two or more **vertical** margins combine into a single margin instead of adding together. It's one of the most misunderstood parts of CSS because it applies in some situations and not others, and the rules genuinely differ per case.

## The rule that never changes: only vertical margins of block-level, in-flow, same-block-formatting-context boxes collapse

Horizontal margins **never** collapse, under any circumstance. And collapsing only happens between boxes that are all block-level, in normal flow (not floated, not absolutely/fixed positioned), and share the same block formatting context (BFC) — flex items, grid items, and table cells never collapse margins with anything, by spec.

## Case 1: adjacent siblings

The bottom margin of one block collapses with the top margin of the next, as long as nothing (border, padding, inline content, clearance) separates them:

```css
.a { margin-bottom: 30px; }
.b { margin-top: 20px; }
```
```html
<div class="a">A</div>
<div class="b">B</div>
```
Gap between them is **30px** (the larger of the two), not 50px — see the "resulting size" rule below.

## Case 2: parent and first/last child

A parent's top margin collapses with its **first in-flow child's** top margin (and separately, the parent's bottom margin with its **last in-flow child's** bottom margin), *through* the parent, as if the parent's own margin didn't provide separation — **provided the parent has no border, no padding, and no inline content on that edge**, and the parent doesn't establish a new BFC:

```css
.parent { margin-top: 40px; }
.child { margin-top: 20px; }
```
```html
<div class="parent"><div class="child">Child</div></div>
```
The `.parent`'s effective top margin becomes **40px** (the collapsed max of 40 and 20) — and crucially, this margin appears *outside* `.parent`, pushing the parent itself down, not adding extra space between the parent's border and the child (because the parent has no border/padding to stop the collapse from passing through). This is the classic "why is there a gap above my container, even though the container has no margin set on itself" bug.

**What stops this specific case:** giving the parent `padding-top: 1px` (or any padding/border on that edge), or `overflow: hidden`/`auto` (creates a new BFC), or `display: flow-root` (creates a new BFC with no other side effects — the modern, purpose-built fix).

## Case 3: empty blocks collapse their own top and bottom margins together

If an element has no content, no border, no padding, and no height, its top and bottom margins touch each other directly and collapse into one:

```css
.spacer { margin-top: 20px; margin-bottom: 30px; }
```
```html
<div class="spacer"></div>
```
`.spacer`'s own top and bottom margins collapse into a single 30px margin (max of 20/30) — and **that** combined margin can then go on to collapse with an adjacent sibling's margin, or the parent's margin, per cases 1 and 2. This chaining is why three empty, nested `<div>`s can end up making a margin "jump" all the way past all of them to collapse with something far away in the DOM.

## The resulting size when margins collapse

- **Both positive:** the result is the **larger** of the two (not the sum) — e.g. 30px + 20px collapses to 30px.
- **Both negative:** the result is the **more negative** of the two (largest absolute value) — e.g. -10px and -25px collapses to -25px.
- **One positive, one negative:** the result is the **sum** of the largest positive and the smallest (most negative) margin — e.g. 30px and -10px collapses to 20px.

## What prevents margin collapsing entirely

| Situation | Collapses? |
|---|---|
| Two block siblings, no border/padding/content between | Yes |
| Parent/first-child, parent has `padding-top` or `border-top` | No — the padding/border blocks it |
| Parent has `overflow: hidden`, `auto`, or `display: flow-root` | No — new BFC isolates the parent's margins from its children's |
| Flex items or grid items | Never — margins never collapse in flex/grid formatting contexts |
| Floated or absolutely positioned elements | Never — they're out of normal flow |
| `display: inline-block` elements | Never — not block-level boxes for this purpose |
