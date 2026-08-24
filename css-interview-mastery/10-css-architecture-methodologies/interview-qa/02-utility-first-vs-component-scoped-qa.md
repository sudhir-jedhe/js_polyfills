# Interview Q&A — Utility-First vs Component-Scoped CSS

**Q: What's the core philosophical difference between utility-first CSS and component-scoped CSS?**
Utility-first composes designs from small, single-purpose classes directly in markup (styling logic lives in the HTML/JSX). Component-scoped CSS (CSS Modules, styled-components) keeps conventional CSS in a separate file/block, scoped uniquely to the component that imports it (styling logic lives apart from markup, referenced by class/tag).

**Q: How does CSS Modules prevent class name collisions without requiring a naming convention like BEM?**
At build time, the tooling rewrites every class selector in a `.module.css` file into a generated, effectively-unique name (e.g. `.card` becomes `Card_card__a1b2c`), and exposes a JS object mapping the original name to the generated one. Since every module's classes are transformed independently, two files can both use `.title` with zero risk of collision — uniqueness is guaranteed by tooling, not by developer discipline in naming.

**Q: What's a common criticism of utility-first CSS, and how do teams typically address it?**
That class lists on complex elements become long and visually noisy in markup, hurting readability. Teams typically address this by extracting genuinely repeated utility combinations into a reusable component (a React/Vue component, or a build-time `@apply`-style composition in some tooling), rather than writing custom CSS for every instance — the goal is to keep utilities as the default while still allowing extraction where a combination repeats enough to earn its own name.

**Q: Does utility-first CSS eliminate specificity problems entirely?**
Mostly, yes, by design — utility classes are (by convention) single-property and flat (0,1,0) specificity, and frameworks like Tailwind carefully control generation order so conflicting utilities resolve predictably by source order. It doesn't eliminate specificity as a *concept*, but it removes most of the practical risk of unpredictable specificity wars, since there's rarely any nested or nested-nested utility selector to escalate specificity in the first place.

**Q: If a team already has strong design tokens (spacing scale, color palette, type scale), how does that affect the utility-first vs component-scoped decision?**
It tends to favor utility-first, because a utility framework (like Tailwind) can be configured to expose *exactly* the token scale as its only allowed values — so using an off-scale spacing or color value becomes structurally difficult, not just a style-guide suggestion. Component-scoped CSS can still consume the same tokens via CSS custom properties, but nothing prevents a developer from hardcoding an arbitrary value inside a `.module.css` file; enforcement relies more on code review/linting rather than the class system itself.
