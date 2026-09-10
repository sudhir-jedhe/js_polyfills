/**
 * Truncate an array to a given length.
 *
 * Setting `length` truncates IN PLACE and keeps every existing reference
 * pointing at the shortened array; slice returns a new one.
 */

/** In place — MUTATES, and all references see the change. */
function truncateInPlace(arr, length) {
  arr.length = Math.max(0, length);
  return arr;
}

/** Non-mutating. */
const truncate = (arr, length) => arr.slice(0, Math.max(0, length));

/** splice version — MUTATES and returns the removed tail. */
const truncateSplice = (arr, length) => arr.splice(length);

/** Truncate and report what was dropped. */
function truncateWithOverflow(arr, length) {
  return { kept: arr.slice(0, length), dropped: arr.slice(length) };
}

/** Truncate to a total "size" measured by a weight function. */
function truncateByWeight(arr, maxWeight, weightFn = () => 1) {
  const out = [];
  let total = 0;

  for (const item of arr) {
    const weight = weightFn(item);
    if (total + weight > maxWeight) break;
    out.push(item);
    total += weight;
  }

  return out;
}

/** Pad OR truncate to an exact length. */
function toLength(arr, length, fill = undefined) {
  if (arr.length >= length) return arr.slice(0, length);
  return [...arr, ...new Array(length - arr.length).fill(fill)];
}

/** Keep the LAST n instead of the first. */
const truncateFromStart = (arr, length) => (length <= 0 ? [] : arr.slice(-length));

/**
 * A bounded buffer that drops the oldest entries — the practical use of
 * truncation, for logs and recent-items lists.
 */
class BoundedList {
  #items = [];

  constructor(max) {
    this.max = max;
  }

  push(item) {
    this.#items.push(item);
    if (this.#items.length > this.max) this.#items.splice(0, this.#items.length - this.max);
    return this;
  }

  toArray() {
    return [...this.#items];
  }
}

// ---- Examples ----
console.log(truncate([1, 2, 3, 4, 5], 3));        // [1, 2, 3]
console.log(truncate([1, 2], 10));                // [1, 2]

const arr = [1, 2, 3, 4, 5];
const alias = arr;
truncateInPlace(arr, 2);
console.log(arr, alias);                          // [1,2] [1,2] — same reference

console.log(truncateWithOverflow([1, 2, 3, 4], 2)); // { kept: [1,2], dropped: [3,4] }
console.log(truncateByWeight(['aa', 'bbb', 'c'], 5, (s) => s.length)); // ['aa','bbb']
console.log(toLength([1, 2], 4, 0));              // [1, 2, 0, 0]
console.log(truncateFromStart([1, 2, 3, 4], 2));  // [3, 4]

const recent = new BoundedList(3);
[1, 2, 3, 4, 5].forEach((n) => recent.push(n));
console.log(recent.toArray());                    // [3, 4, 5]

module.exports = { truncate, truncateInPlace, truncateSplice, truncateWithOverflow, truncateByWeight, toLength, truncateFromStart, BoundedList };
