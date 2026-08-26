*** copy 03-lightweight-proptypes-validator.md ***

# Problem: Implement a Lightweight Runtime Prop-Type Validator (Simplified PropTypes)

## Problem Statement

Implement a simplified `checkPropTypes(propTypeSpec, props, componentName)` function — a miniature version of what the real `prop-types` package does — that validates a props object against a spec of validator functions and logs a `console.warn` for each mismatch, without throwing or altering rendering.

## Requirements

- Provide a small set of built-in validators: `PropTypes.string`, `PropTypes.number`, `PropTypes.bool`, `PropTypes.func`, `PropTypes.array`, `PropTypes.object` — each is a function that returns an error message string (or `undefined`/`null` if valid) given `(props, propName, componentName)`.
- Support `.isRequired` on any validator (e.g. `PropTypes.string.isRequired`) that additionally fails when the prop is `undefined`.
- `checkPropTypes(spec, props, componentName)` runs every validator in `spec` against `props` and `console.warn`s once per failing prop, in development only — never throws, and never blocks rendering (matching how the real PropTypes warns without crashing).
- Include a component using it via a `useEffect`-free, render-time check (the real `prop-types` package validates synchronously wherever `checkPropTypes` is called, typically inside the component or via `Component.propTypes` — this problem does it as an explicit call for simplicity).

## Approach

Each validator is a plain function of shape `(props, propName, componentName) => string | undefined`, matching a message-or-nothing contract. `.isRequired` is implemented by wrapping the base validator in another function that first checks for `undefined`, then delegates to the base validator otherwise — the same "decorator" pattern the real library uses. `checkPropTypes` just iterates the spec's keys, calls each validator, and warns for any non-empty return value.

## Solution

```jsx
// --- validator factory: wraps a raw type-check into the (props, propName, componentName) shape ---
function createValidator(typeName, checkFn) {
  const validator = (props, propName, componentName) => {
    const value = props[propName];
    if (value === undefined) return undefined; // optional by default — isRequired handles required-ness
    if (!checkFn(value)) {
      return `Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected \`${typeName}\`.`;
    }
    return undefined;
  };

  // .isRequired decorates the base validator with an undefined check.
  validator.isRequired = (props, propName, componentName) => {
    if (props[propName] === undefined) {
      return `The prop \`${propName}\` is marked as required in \`${componentName}\`, but its value is \`undefined\`.`;
    }
    return validator(props, propName, componentName);
  };

  return validator;
}

const PropTypes = {
  string: createValidator('string', (v) => typeof v === 'string'),
  number: createValidator('number', (v) => typeof v === 'number' && !Number.isNaN(v)),
  bool: createValidator('bool', (v) => typeof v === 'boolean'),
  func: createValidator('func', (v) => typeof v === 'function'),
  array: createValidator('array', (v) => Array.isArray(v)),
  object: createValidator('object', (v) => typeof v === 'object' && v !== null && !Array.isArray(v)),
};

// --- checkPropTypes: runs every validator in the spec, warns per-failure, dev-only ---
function checkPropTypes(propTypeSpec, props, componentName) {
  if (process.env.NODE_ENV === 'production') return;

  Object.keys(propTypeSpec).forEach((propName) => {
    const validator = propTypeSpec[propName];
    const error = validator(props, propName, componentName);
    if (error) {
      console.warn(`Warning: Failed prop type: ${error}`);
    }
  });
}

// --- usage ---
function Button({ label, onClick, disabled }) {
  checkPropTypes(
    {
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      disabled: PropTypes.bool,
    },
    { label, onClick, disabled },
    'Button'
  );

  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// --- verification ---
checkPropTypes(
  { label: PropTypes.string.isRequired, onClick: PropTypes.func.isRequired },
  { label: 42, onClick: undefined },
  'Button'
);
// console.warn x2:
// "Warning: Failed prop type: Invalid prop `label` of type `number` supplied to `Button`, expected `string`."
// "Warning: Failed prop type: The prop `onClick` is marked as required in `Button`, but its value is `undefined`."

checkPropTypes(
  { label: PropTypes.string.isRequired, onClick: PropTypes.func.isRequired },
  { label: 'Save', onClick: () => {} },
  'Button'
);
// no warnings — both props are valid
```

**Why this works:** Modeling each validator as `(props, propName, componentName) => message | undefined` (rather than a plain boolean) directly mirrors the real `prop-types` library's contract, which is what lets `.isRequired` compose cleanly as a wrapper around any base validator instead of needing a separate required-variant of every type. Gating `checkPropTypes` on `process.env.NODE_ENV !== 'production'` matches how the real library strips its runtime cost from production builds (this simplified version still calls the validator functions in production if not statically stripped by a bundler, but does not attempt to `console.warn`, which is the only user-visible/behavioral cost).

**Known limitation:** this implementation only validates flat, first-level prop shapes (`PropTypes.string`, etc.) and has no equivalents for `PropTypes.shape({...})`, `PropTypes.oneOf([...])`, or `PropTypes.arrayOf(...)` — the real library supports nested shape validation recursively. It also warns on every render where it's called rather than de-duplicating identical warnings across renders the way the real library's internal `loggedTypeFailures` cache does.
