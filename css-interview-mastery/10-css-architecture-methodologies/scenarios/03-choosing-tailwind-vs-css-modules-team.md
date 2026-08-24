# Scenario: Choosing Between Tailwind and CSS Modules for a New Team

**Situation:** You're starting a new product and need to pick a CSS approach for a team of 6 engineers, most with a React background, mixed CSS experience levels, and a design team that ships a fairly comprehensive design-token system (spacing scale, color palette, type scale) up front.

**Approach:** Frame the decision around the actual tradeoffs rather than personal preference:

**Arguments for Tailwind (utility-first):**
- The team already has a token system (spacing/colors/type scale) — Tailwind's config maps almost directly onto that, turning tokens into enforced utility classes so engineers *can't* accidentally use an off-scale value.
- Junior engineers with less CSS depth can compose reasonable UI without deep selector/specificity knowledge — the failure mode of "used the wrong utility" is far more visible and low-stakes than "wrote a selector that silently conflicts elsewhere."
- No naming burden — nobody has to invent or bikeshed class names.

**Arguments for CSS Modules:**
- Cleaner separation of markup and style, which the team may prefer if design iterates heavily on visual details independent of markup structure.
- More familiar for engineers coming from traditional CSS backgrounds, lower ramp-up cost for that subset of the team.
- No risk of extremely long, hard-to-scan `className` strings on complex components.

**Recommendation approach:** given a comprehensive token system already exists and the team is React-based with mixed CSS seniority, utility-first (Tailwind) is usually the stronger default — it directly enforces the design tokens at the point of use (a class like `p-4` can only ever mean the 4th spacing-scale step, not an arbitrary value), which reduces design drift more effectively than convention alone. The main risk to flag: without discipline, long utility class lists can become unreadable on complex components — mitigate this by extracting genuinely repeated utility combinations into a component (via a UI library or wrapping component), not by fighting the utility-first model itself.

**Why this matters for the interview answer:** the "right" choice depends on team composition, existing tooling, and how strictly design tokens need to be enforced — a good answer identifies *which factors* tip the decision rather than declaring one approach universally superior.
