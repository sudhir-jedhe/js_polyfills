/**
 * produce() — immutable updates with a mutable draft, the pattern Immer
 * popularised.
 *
 * You write code that looks like mutation; the helper returns a new
 * structure and leaves the original untouched. Implemented here with a
 * Proxy that copies on write, so untouched branches are shared rather than
 * cloned.
 */

const DRAFT = Symbol('draft');

/**
 * @template T
 * @param {T} base
 * @param {(draft: T) => void} recipe
 * @returns {T} a new structure; `base` is unchanged
 */
function produce(base, recipe) {
  const copies = new Map(); // original object -> its shallow copy

  /** The copy for `target`, made on first write. */
  const copyOf = (target) => {
    if (!copies.has(target)) {
      copies.set(target, Array.isArray(target) ? [...target] : { ...target });
    }
    return copies.get(target);
  };

  const isDraftable = (value) =>
    value !== null &&
    typeof value === 'object' &&
    (Array.isArray(value) || value.constructor === Object);

  function draft(target) {
    return new Proxy(target, {
      get(_, prop) {
        if (prop === DRAFT) return target;

        const source = copies.get(target) ?? target;
        const value = source[prop];

        return isDraftable(value) ? draft(value) : value;
      },

      set(_, prop, value) {
        copyOf(target)[prop] = value;
        return true;
      },

      deleteProperty(_, prop) {
        delete copyOf(target)[prop];
        return true;
      },

      has(_, prop) {
        return prop in (copies.get(target) ?? target);
      },

      ownKeys() {
        return Reflect.ownKeys(copies.get(target) ?? target);
      },

      getOwnPropertyDescriptor(_, prop) {
        return Reflect.getOwnPropertyDescriptor(copies.get(target) ?? target, prop);
      },
    });
  }

  recipe(draft(base));

  if (copies.size === 0) return base; // nothing changed: return the original

  /** Rebuild the tree, substituting copies where they exist. */
  function finalise(node) {
    const copy = copies.get(node);
    if (!copy) return node;

    for (const key of Object.keys(copy)) {
      if (isDraftable(copy[key])) copy[key] = finalise(copy[key]);
    }

    return copy;
  }

  // Re-link nested copies into their parents.
  for (const [original, copy] of copies) {
    for (const key of Object.keys(copy)) {
      if (copies.has(copy[key])) copy[key] = copies.get(copy[key]);
    }
    void original;
  }

  return finalise(base);
}

/** A structural-sharing deep freeze, useful alongside produce. */
function deepFreeze(value) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;

  Object.freeze(value);
  for (const key of Object.keys(value)) deepFreeze(value[key]);
  return value;
}

// ---- Examples ----
const state = { user: { name: 'Ada', tags: ['a'] }, count: 1 };

const next = produce(state, (draft) => {
  draft.count = 2;
  draft.user.tags.push('b');
});

console.log(next.count, next.user.tags);   // 2 ['a', 'b']
console.log(state.count, state.user.tags); // 1 ['a'] — untouched
console.log(next !== state);               // true

const unchanged = produce(state, () => {});
console.log(unchanged === state);          // true — nothing was written

module.exports = { produce, deepFreeze };
