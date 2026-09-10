/**
 * Get the nth element of an array.
 *
 * `at()` accepts negative indexes and is the modern answer; the older forms
 * differ in what they return when the index is out of range.
 */

/** ES2022 at() — negative indexes count from the end. */
const nth = (arr, n = 0) => arr.at(n);

/** Bracket indexing — undefined when out of range, no negative support. */
const nthBracket = (arr, n) => arr[n];

/** at() with an explicit fallback. */
const nthOr = (arr, n, fallback) => arr.at(n) ?? fallback;

/** Every nth element: step through the array. */
const everyNth = (arr, step, offset = 0) =>
  arr.filter((_, i) => (i - offset) % step === 0 && i >= offset);

/** The nth element from the END. */
const nthFromEnd = (arr, n = 1) => arr.at(-n);

/** Wrap around: index 7 of a 3-element array is index 1. */
const nthCyclic = (arr, n) => arr[((n % arr.length) + arr.length) % arr.length];

/**
 * The nth node from the end of a linked list (LeetCode 19) — the two-pointer
 * version of the same idea.
 */
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function nthFromEndOfList(head, n) {
  let lead = head;
  for (let i = 0; i < n; i++) {
    if (!lead) return null;
    lead = lead.next;
  }

  let trail = head;
  while (lead) {
    lead = lead.next;
    trail = trail.next;
  }

  return trail;
}

const fromArray = (arr) => arr.reduceRight((next, val) => new ListNode(val, next), null);

// ---- Examples ----
const arr = ['a', 'b', 'c', 'd', 'e'];

console.log(nth(arr, 2));         // 'c'
console.log(nth(arr, -1));        // 'e'
console.log(nth(arr, 99));        // undefined
console.log(nthOr(arr, 99, '?')); // '?'
console.log(everyNth([1, 2, 3, 4, 5, 6], 2));    // [1, 3, 5]
console.log(everyNth([1, 2, 3, 4, 5, 6], 3, 1)); // [2, 5]
console.log(nthFromEnd(arr, 2));  // 'd'
console.log(nthCyclic(arr, 7));   // 'c'
console.log(nthFromEndOfList(fromArray([1, 2, 3, 4, 5]), 2).val); // 4

module.exports = { nth, nthBracket, nthOr, everyNth, nthFromEnd, nthCyclic, nthFromEndOfList, ListNode, fromArray };
