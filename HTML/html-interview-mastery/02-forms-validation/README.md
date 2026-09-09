***  README.md ***

# Forms & Validation

HTML forms are the primary way users send data back to a server, and the platform ships an enormous amount of built-in behavior for free: input types with native pickers and virtual-keyboard hints, constraint validation (`required`, `pattern`, `min`/`max`) with zero JavaScript, and a `FormData` API that handles serialization including file uploads. Interviewers probe this topic because it's easy to reach for a JS validation library or a controlled-React-input pattern without knowing what the browser already does natively — and because forms are the single most accessibility-sensitive part of most applications (a form a screen reader user can't complete is a form that doesn't work for them at all).

## Folder structure

- **`theory/`** — form elements and input types, native HTML5 validation attributes, the Constraint Validation API and `setCustomValidity`, submission mechanics (GET vs. POST, `enctype`, `FormData`), labels/fieldset/legend/accessibility, and autocomplete plus controlled vs. uncontrolled inputs.
- **`snippets/`** — 7 runnable form examples: a basic login form, newer input types, validation attributes, custom validity, `FormData` + `fetch`, fieldset/legend grouping, and autocomplete.
- **`output-based/`** — 6 "what happens on submit/interaction?" questions covering validation, GET vs. POST, and label behavior.
- **`scenarios/`** — 5 real-world situations: multi-step form validation, accessible error messaging, file uploads, password-confirmation custom validity, and controlled vs. uncontrolled forms in React.
- **`interview-qa/`** — 3 themed files: elements/input types, validation/constraint API, and accessibility/submission mechanics.
- **`problems/`** — 4 hands-on build challenges: a fully validated signup form, custom password-confirmation validity, a checkbox group with `FormData`, and an accessible fieldset survey.
- **`assets/`** — placeholder for diagrams/images (see `assets/README.md`).

## What's covered

- The full input type set, including newer types (`date`, `email`, `tel`, `number`, `range`, `color`, `search`, `url`) and what native UI/validation each provides
- Native HTML5 validation: `required`, `pattern`, `min`/`max`/`step`, `minlength`/`maxlength`, and the pseudo-classes (`:valid`, `:invalid`, `:required`) they trigger
- The Constraint Validation API in JavaScript: `checkValidity()`, `reportValidity()`, `setCustomValidity()`, and the `ValidityState` object
- Form submission mechanics: `GET` vs. `POST`, `enctype` (`application/x-www-form-urlencoded` vs. `multipart/form-data`), and the `FormData` API for serialization including file inputs
- Labels (`<label for>` vs. wrapping), `<fieldset>`/`<legend>` for grouping, and what makes a form actually usable with a screen reader
- `autocomplete` attribute values and why they matter for both UX and accessibility
- Controlled vs. uncontrolled inputs as a concept, and how it maps (or doesn't) onto native HTML forms vs. frameworks like React
