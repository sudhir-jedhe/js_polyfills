CSS Interview Questions and Answers
CSS interviews test more than vocabulary. They test how the language behaves in production: how layout, specificity, the cascade, responsive design, and animations interact when a page has many components, multiple breakpoints, and elements that have to stay sticky on scroll.

Our list of over 75 CSS interview questions and answers is curated by ex-FAANG interviewers who actually conducted these interviews. Each question comes with a worked answer, common mistakes to avoid, and where applicable, an in-browser coding workspace with automated test cases so you can verify your styles in seconds.

The list contains two large categories: CSS coding interview questions (build something) and CSS quiz interview questions (explain how something works).

What CSS interviews actually test
Across every front-end interview round we've seen, CSS questions cluster around six areas:

Layouts. Flexbox, Grid, multi-column layouts, sticky positioning, and the classic "three columns, fluid middle, sticky footer" Holy Grail. Junior rounds focus on Flexbox; senior rounds expect fluency in both Flexbox and Grid and the judgment to pick the right one.
Specificity and the cascade. When two rules collide, who wins, and why? Includes inline styles versus selectors, !important, the cascade layers introduced in @layer, and inheritance gotchas. Interviewers usually move past textbook definitions and ask you to debug a real selector conflict.
Box model and positioning. box-sizing, margin collapse, stacking contexts, position: sticky quirks, and why z-index sometimes does nothing.
Responsive design. Media queries, container queries (@container), clamp() for fluid type, and the modern intrinsic-sizing primitives like min-content, max-content, and fit-content.
Animations and transitions. When to use transform and opacity for performance, why animating width or height is expensive, the will-change hint, and prefers-reduced-motion.
Modern features and architecture. :has() (the parent selector), subgrid, @layer for cascade control, container queries, CSS custom properties, and the architectural debate between BEM, utility-first (Tailwind), and CSS Modules.
Example CSS interview questions
A small sample of the types of questions you'll see, with one-sentence answers. Each links to the full, worked solution.

Layout
Question: Build the Holy Grail layout (header, footer, three columns with fluid middle).
Answer: The modern answer is CSS Grid with grid-template-areas so the layout shape is declared visibly; Flexbox is the legacy answer most candidates still show.
Question: How does Flexbox differ from CSS Grid, and when should you use each?
Answer: Flexbox is one-dimensional (row OR column); Grid is two-dimensional. Reach for Grid for page-level layouts where intent should be visible in CSS, and Flexbox for small components and single-axis distribution.
Specificity and the cascade
Question: How does CSS selector specificity work?
Answer: Specificity is a 4-part tuple: inline, then IDs, then classes/attributes/pseudo-classes, then elements/pseudo-elements. Equal specificity is broken by source order. @layer lets you override the order without inflating selectors.
Box model and positioning
Question: Explain the box model and how to switch between content-box and border-box.
Answer: Default content-box makes width and height refer to content only; padding and border push the box larger. border-box makes width and height inclusive, which is far easier to reason about and is why most teams set it globally. Switch via box-sizing: border-box.
Question: What is the difference between display: none, visibility: hidden, and opacity: 0?
Answer: display: none removes the element from the layout entirely. visibility: hidden hides it but reserves space. opacity: 0 shows it transparently and still receives pointer events.
Responsive design
Question: Why use rem and em instead of px for typography?
Answer: rem scales with the user's root font size, which is critical for accessibility users who increase the default font size in browser settings. px is fixed and bypasses that preference. em scales with the parent's font size, which is useful for component-relative spacing.
Animations
Question: Why are transform and opacity the recommended properties for animations?
Answer: The browser can animate them on the GPU compositor without recalculating layout or repainting. Animating width, height, top, or left triggers layout work on every frame and is the most common cause of janky animations on mid-tier devices.
Interview difficulty progression
CSS questions track candidate level closely. Here is roughly what to expect at each:

Junior (0-2 years). float and clear, basic Flexbox, box-sizing: border-box, simple media queries, specificity tiebreakers, and the difference between position: relative and position: absolute. Building a centered modal or a responsive nav bar.
Mid-level (2-5 years). CSS Grid template areas, custom properties (CSS variables), advanced selectors (:not, :nth-child), position: sticky and stacking contexts, why z-index does not always work, and basic animations with @keyframes and transition.
Senior (5+ years). Container queries (@container), :has(), subgrid, @layer for cascade control, performance (will-change, content-visibility, contain), CSS architecture tradeoffs (BEM versus utility-first versus CSS Modules), accessibility patterns (focus management, prefers-reduced-motion, prefers-color-scheme), and animating efficiently for low-end devices.
