/**
 * Remove n elements from the end of an array.
 *
 * slice with a negative offset is the clean answer; the guard for n <= 0
 * matters because slice(0, -0) returns an empty array.
 */

/** Drop the last n — non-mutating. */
const dropLast = (arr, n = 1) => (n <= 0 ? [...arr] : arr.slice(0, -n));

/** Drop the last n — MUTATES by shortening. */
function dropLastInPlace(arr, n = 1) {
  arr.length = Math.max(0, arr.length - n);
  return arr;
}

/** splice version — MUTATES and returns what was removed. */
const spliceLast = (arr, n = 1) => arr.splice(Math.max(0, arr.length - n), n);

/** Drop the first n. */
const dropFirst = (arr, n = 1) => arr.slice(Math.max(0, n));

/** Keep only the last n. */
const keepLast = (arr, n = 1) => (n <= 0 ? [] : arr.slice(-n));

/** Drop from the end while a predicate holds. */
function dropLastWhile(arr, predicate) {
  let end = arr.length;
  while (end > 0 && predicate(arr[end - 1], end - 1, arr)) end--;
  return arr.slice(0, end);
}

/**
 * Remove the nth node from the END of a linked list (LeetCode 19).
 * One pass with two pointers separated by n.
 */
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);

  let lead = dummy;
  for (let i = 0; i <= n; i++) {
    if (!lead) return head;
    lead = lead.next;
  }

  let trail = dummy;
  while (lead) {
    lead = lead.next;
    trail = trail.next;
  }

  trail.next = trail.next.next;
  return dummy.next;
}

const fromArray = (arr) => arr.reduceRight((next, val) => new ListNode(val, next), null);
const toArray = (head) => {
  const out = [];
  for (let n = head; n; n = n.next) out.push(n.val);
  return out;
};

// ---- Examples ----
console.log(dropLast([1, 2, 3, 4, 5], 2));   // [1, 2, 3]
console.log(dropLast([1, 2, 3], 0));         // [1, 2, 3]
console.log(dropLast([1, 2], 10));           // []
console.log(dropFirst([1, 2, 3], 1));        // [2, 3]
console.log(keepLast([1, 2, 3, 4], 2));      // [3, 4]
console.log(dropLastWhile([1, 2, 5, 6], (n) => n > 3)); // [1, 2]
console.log(toArray(removeNthFromEnd(fromArray([1, 2, 3, 4, 5]), 2))); // [1,2,3,5]

module.exports = { dropLast, dropLastInPlace, spliceLast, dropFirst, keepLast, dropLastWhile, removeNthFromEnd, ListNode, fromArray, toArray };
