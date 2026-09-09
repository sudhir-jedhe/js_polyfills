***  06-proptypes-vs-typescript.md ***

# PropTypes vs. TypeScript for Prop Validation

`PropTypes` does runtime prop validation with console warnings in development — useful in plain JavaScript codebases but adds zero compile-time safety and no editor autocomplete. TypeScript validates prop shapes at compile time and gives IDE autocomplete, which is why most modern codebases prefer it over `PropTypes` when using a typed setup. TypeScript-specific typing patterns for props have their own dedicated repo/topic.

## Comparison

| Aspect | PropTypes | TypeScript |
|---|---|---|
| When errors surface | Runtime, console warning in dev only | Compile time, in the editor and build |
| Autocomplete/IDE support | None | Full IDE autocomplete and refactor support |
| Production overhead | Slight runtime cost (usually stripped in prod) | Zero runtime cost (types erased at build) |

Use TypeScript by default on any new project needing prop validation; `PropTypes` is mainly relevant for legacy plain-JavaScript codebases that aren't migrating to TS. The common mistake is treating `PropTypes` as equivalent safety to TypeScript — it only catches issues when the component actually renders with bad props during development, not before you ship. Deeper TypeScript prop-typing patterns live in a separate TypeScript-focused repo. See `../problems/03-lightweight-proptypes-validator.md` for a from-scratch look at how PropTypes-style runtime validation actually works under the hood.
