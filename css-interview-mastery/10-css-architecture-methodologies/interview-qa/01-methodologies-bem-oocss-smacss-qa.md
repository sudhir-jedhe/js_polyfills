# Interview Q&A — BEM, OOCSS, SMACSS

**Q: What problem is BEM specifically trying to solve?**
Selector fragility and specificity creep caused by nesting CSS selectors to match markup structure. Nested selectors like `.card .header .title` couple styling to a specific DOM shape (breaking if markup is restructured) and increase specificity in an uncontrolled way as nesting deepens. BEM's flat `block__element--modifier` naming keeps every selector a single class (constant specificity) and encodes structural relationships in the name instead of in selector nesting.

**Q: In BEM, why shouldn't elements nest more than one level, e.g. `.card__header__title`?**
Because in BEM, an Element always belongs directly to its Block, not to another Element. `.card__header__title` implies "title belongs to header, which belongs to card" — BEM instead treats both as flat elements of the same block: `.card__header` and `.card__title`, even if `card__title` is visually nested inside `card__header` in the markup. This keeps naming predictable and avoids ever-lengthening double/triple-underscore chains.

**Q: What are OOCSS's two core principles?**
(1) Separate structure from skin — put layout/sizing properties in one reusable class and visual/color properties in another, so structure can be reused across different visual variants. (2) Separate container from content — style components based on their own class, not based on which parent container they happen to be placed inside, so the same component looks the same anywhere it's used.

**Q: What are the five SMACSS categories, and what's each one for?**
Base (unclassed element defaults/resets), Layout (major page regions), Module (reusable components), State (JS-toggled or conditional states, e.g. `.is-active`), Theme (swappable visual theming). The categorization implies both a mental model for classifying any given rule and typically a matching file/import structure.

**Q: Are BEM, OOCSS, and SMACSS mutually exclusive? How do teams typically combine them?**
No — they solve related but distinct problems and are commonly combined: SMACSS-style categorization for how files/rules are organized, OOCSS's structure/skin principle as a design habit within components, and BEM as the actual class-naming syntax used for Module/Component-category rules. None require special build tooling; all three are conventions applied to plain CSS.
