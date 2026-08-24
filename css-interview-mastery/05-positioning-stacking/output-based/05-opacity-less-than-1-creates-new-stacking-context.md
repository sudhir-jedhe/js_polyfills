# Does This Element Establish a New Stacking Context?

```css
.el-1 { position: static; opacity: 1; }
.el-2 { position: static; opacity: 0.999; }
.el-3 { position: relative; z-index: auto; }
.el-4 { position: relative; z-index: 0; }
.el-5 { filter: none; }
.el-6 { filter: blur(0px); }
.el-7 { will-change: opacity; }
.el-8 { transform: none; }
```

**Question:** For each rule above, does the element establish a new stacking context?

**Answer:**

| Selector | New stacking context? | Why |
|---|---|---|
| `.el-1` | No | `opacity: 1` is the initial value — only `opacity` values **less than 1** trigger this |
| `.el-2` | **Yes** | `0.999 < 1` — any value below `1`, even barely, qualifies; there's no "close enough to 1" exception |
| `.el-3` | No | `position: relative` alone doesn't create one — needs `z-index` other than `auto` too |
| `.el-4` | **Yes** | `position: relative` + `z-index: 0` (a value other than `auto`) satisfies the rule — `0` still counts as "not auto" |
| `.el-5` | No | `filter: none` is the initial value — no effect |
| `.el-6` | **Yes** | Any non-`none` `filter` value counts, even one that's visually a no-op like `blur(0px)` |
| `.el-7` | **Yes** | `will-change: opacity` names a property that would itself trigger a stacking context, so it triggers one preemptively |
| `.el-8` | No | `transform: none` is the initial value — no effect |

**Why this matters:** several of these (`.el-2`, `.el-6`, `.el-7`) are exactly the kind of "harmless-looking" values developers write without expecting any structural consequence — a near-1 opacity for a subtle fade, a zero blur left over from a removed effect, or a defensive `will-change`. All three quietly create a new stacking context anyway, because the spec's trigger conditions are about whether the property is set to something *other than its initial/none value* — not about whether the value produces a visible effect.
