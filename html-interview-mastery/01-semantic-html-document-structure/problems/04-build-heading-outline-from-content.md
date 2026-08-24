# Problem: Build a Correct Heading Outline from Raw Content

## Problem Statement

You're given the following unstructured content outline for a documentation page. Convert it into proper HTML with a correct, continuous heading hierarchy (no skipped levels going down) and appropriate sectioning elements.

```
Page: "Deploying Your App"
- Intro paragraph
- Overview (with sub-points: "What You'll Need", "Estimated Time")
- Step 1: Build the Project
- Step 2: Configure Environment Variables
    - Local vs. Production Values
- Step 3: Deploy
    - Deploying to Provider A
    - Deploying to Provider B
- Troubleshooting
    - Common Error: Build Fails
    - Common Error: Env Vars Not Loading
```

## Constraints

- Exactly one `<h1>` (the page title).
- Every other listed item must map to the correct heading level based on its nesting in the outline above — no arbitrary level choices.
- Wrap the whole thing in `<main>`, and use `<article>` or `<section>` where appropriate for the top-level content vs. sub-groupings.

## Solution

```html
<main>
  <article>
    <h1>Deploying Your App</h1>
    <p>This guide walks you through deploying your app to production.</p>

    <section>
      <h2>Overview</h2>
      <h3>What You'll Need</h3>
      <p>...</p>
      <h3>Estimated Time</h3>
      <p>...</p>
    </section>

    <section>
      <h2>Step 1: Build the Project</h2>
      <p>...</p>
    </section>

    <section>
      <h2>Step 2: Configure Environment Variables</h2>
      <p>...</p>
      <h3>Local vs. Production Values</h3>
      <p>...</p>
    </section>

    <section>
      <h2>Step 3: Deploy</h2>
      <h3>Deploying to Provider A</h3>
      <p>...</p>
      <h3>Deploying to Provider B</h3>
      <p>...</p>
    </section>

    <section>
      <h2>Troubleshooting</h2>
      <h3>Common Error: Build Fails</h3>
      <p>...</p>
      <h3>Common Error: Env Vars Not Loading</h3>
      <p>...</p>
    </section>
  </article>
</main>
```

**Why this mapping is correct:** the whole guide is one `<article>` (it's a complete, standalone document — it would make sense as a single page in a syndicated docs export), broken into `<section>`s for each top-level outline item (each has its own `<h2>` and thematic identity within the article). Nested outline items ("What You'll Need," "Local vs. Production Values," each provider, each troubleshooting error) become `<h3>` — one level below their parent `<h2>` — producing a continuous `h1 → h2 → h3` sequence throughout with zero downward skips, even though the *visual* indentation in the source outline varies in depth at different points.
