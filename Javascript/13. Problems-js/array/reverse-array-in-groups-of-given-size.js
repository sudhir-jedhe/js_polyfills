/**
 * Reverse an array in groups of a given size.
 *
 * Reverse each consecutive block of k elements; the final block is reversed
 * even when it is shorter than k.
 *
 * Time  O(n)
 * Space O(1) for the in-place version
 */

/** In place, using a two-pointer reversal per block. */
function reverseInGroups(arr, k) {
  if (k <= 1) return arr;

  for (let start = 0; start < arr.length; start += k) {
    let lo = start;
    let hi = Math.min(start + k - 1, arr.length - 1);

    while (lo < hi) {
      [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
      lo++;
      hi--;
    }
  }

  return arr;
}

/** Non-mutating: slice each block and reverse it. */
function reverseInGroupsCopy(arr, k) {
  if (k <= 1) return [...arr];

  const out = [];
  for (let i = 0; i < arr.length; i += k) {
    out.push(...arr.slice(i, i + k).reverse());
  }

  return out;
}

/** Leave the trailing partial group untouched (a common variant). */
function reverseFullGroupsOnly(arr, k) {
  const out = [...arr];

  for (let start = 0; start + k <= out.length; start += k) {
    const block = out.slice(start, start + k).reverse();
    for (let i = 0; i < k; i++) out[start + i] = block[i];
  }

  return out;
}

/** Split into chunks of k. */
const chunk = (arr, k) =>
  Array.from({ length: Math.ceil(arr.length / k) }, (_, i) => arr.slice(i * k, i * k + k));

/**
 * Reverse Nodes in k-Group (LeetCode 25) — the linked-list version.
 * Only complete groups are reversed.
 */
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseKGroup(head, k) {
  // Check that k nodes remain.
  let node = head;
  for (let i = 0; i < k; i++) {
    if (!node) return head;
    node = node.next;
  }

  // Reverse this group; `node` is the head of the rest.
  let prev = reverseKGroup(node, k);
  let current = head;

  for (let i = 0; i < k; i++) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}

const fromArray = (arr) => arr.reduceRight((next, val) => new ListNode(val, next), null);
const toArray = (head) => {
  const out = [];
  for (let n = head; n; n = n.next) out.push(n.val);
  return out;
};

// ---- Examples ----
console.log(reverseInGroupsCopy([1, 2, 3, 4, 5], 3));   // [3,2,1,5,4]
console.log(reverseInGroups([1, 2, 3, 4, 5, 6], 2));    // [2,1,4,3,6,5]
console.log(reverseFullGroupsOnly([1, 2, 3, 4, 5], 2)); // [2,1,4,3,5]
console.log(chunk([1, 2, 3, 4, 5], 2));                 // [[1,2],[3,4],[5]]
console.log(toArray(reverseKGroup(fromArray([1, 2, 3, 4, 5]), 2))); // [2,1,4,3,5]

module.exports = { reverseInGroups, reverseInGroupsCopy, reverseFullGroupsOnly, chunk, reverseKGroup, ListNode, fromArray, toArray };
