# Snippet: Empty Block Self-Collapsing Margins

```css
.spacer {
  margin-top: 20px;
  margin-bottom: 60px;
  /* no border, no padding, no height, no content — qualifies for self-collapsing */
}
.before { margin-bottom: 10px; }
.after { margin-top: 15px; }
```
```html
<div class="before">Before</div>
<div class="spacer"></div>
<div class="after">After</div>
```

Walkthrough: `.spacer`'s own top (20px) and bottom (60px) margins collapse into one 60px margin (the max of the two), since it's empty. That single 60px margin then further collapses with `.before`'s bottom margin (10px) on one side, and `.after`'s top margin (15px) on the other — both adjacent-sibling collapses resolve to the max, which is 60px both times. Net result: a single **60px** gap between `.before` and `.after`, with the empty, invisible `.spacer` `<div>` contributing nothing of its own beyond having "transmitted" the largest margin through the chain.
