# Interview Q&A — Grid vs. Flexbox and Advanced Topics

**Q: When would you choose grid over flexbox for a layout?**
Whenever the layout needs alignment across two dimensions at once — rows and columns lining up together, like a dashboard, a page shell with header/sidebar/main/footer, or a photo gallery. Flexbox only ever manages a single axis at a time, so achieving true cross-row/cross-column alignment with it requires either nested containers (which don't share alignment with each other) or manual measurement.

**Q: Can grid and flexbox be used together in the same layout? Give an example.**
Yes, and this is the normal real-world pattern: grid for the outer page shell (e.g. `grid-template-areas` for header/nav/main/footer), and flexbox for the one-dimensional components living inside each grid area (e.g. a flex row of nav links inside the `nav` grid area). Treating them as mutually exclusive for an entire page is a common beginner mistake.

**Q: What problem does `subgrid` solve that a nested `display: grid` doesn't?**
A nested `display: grid` element sizes its own internal tracks independently of its parent's tracks, so sibling items in a repeating layout (e.g. multiple cards in a row) won't have their internal sections (title/body/footer) aligned to each other unless every card happens to have identically-sized content. `subgrid` makes a nested grid's tracks align to — and grow with — the *parent's* track sizing, so, e.g., every card's title row grows to match the tallest title across all cards in the row.

**Q: What's the key rule for a valid `grid-template-areas` declaration?**
Every named region's occupied cells must form a single, unbroken rectangle, and every row string must declare the same number of columns. If any named region is non-rectangular (an L-shape, for instance), the entire `grid-template-areas` declaration is invalid and dropped, and every item falls back to default auto-placement.

**Q: What's `grid-auto-flow: column` for, and what does it typically pair with?**
It changes auto-placement to fill column by column instead of the default row by row, generating new implicit *columns* as needed rather than new rows. It's typically paired with `grid-auto-columns` (to size those implicit columns) and used for layouts that are conceptually a fixed number of rows with an unbounded, scrollable number of columns — e.g. a horizontally-scrolling card carousel laid out with grid.
