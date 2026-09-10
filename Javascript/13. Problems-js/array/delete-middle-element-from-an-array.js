/**
 * Delete the middle element from an array.
 *
 * Odd length: one middle element. Even length: two, so decide which
 * convention you want.
 */

/** Remove the single middle element (odd length) or the lower-middle one. */
function deleteMiddle(arr) {
  const copy = [...arr];
  if (copy.length === 0) return copy;

  copy.splice(Math.floor((copy.length - 1) / 2), 1);
  return copy;
}

/** Remove BOTH middle elements when the length is even. */
function deleteMiddleBoth(arr) {
  const copy = [...arr];
  const n = copy.length;
  if (n === 0) return copy;

  if (n % 2 === 1) copy.splice((n - 1) / 2, 1);
  else copy.splice(n / 2 - 1, 2);

  return copy;
}

/** Non-mutating via slice, no splice. */
function deleteMiddleSlice(arr) {
  const mid = Math.floor((arr.length - 1) / 2);
  return [...arr.slice(0, mid), ...arr.slice(mid + 1)];
}

/** The middle element(s) themselves. */
function middleOf(arr) {
  const n = arr.length;
  if (n === 0) return [];
  return n % 2 === 1 ? [arr[(n - 1) / 2]] : [arr[n / 2 - 1], arr[n / 2]];
}

/**
 * The linked-list version (LeetCode 2095): delete the middle node with
 * slow/fast pointers, keeping a reference to the node before slow.
 */
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function deleteMiddleNode(head) {
  if (!head || !head.next) return null;

  let prev = null;
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    prev = slow;
    slow = slow.next;
    fast = fast.next.next;
  }

  prev.next = slow.next;
  return head;
}

const fromArray = (arr) => arr.reduceRight((next, val) => new ListNode(val, next), null);
const toArray = (head) => {
  const out = [];
  for (let n = head; n; n = n.next) out.push(n.val);
  return out;
};

// ---- Examples ----
console.log(deleteMiddle([1, 2, 3, 4, 5]));      // [1, 2, 4, 5]
console.log(deleteMiddle([1, 2, 3, 4]));         // [1, 2, 4]
console.log(deleteMiddleBoth([1, 2, 3, 4]));     // [1, 4]
console.log(deleteMiddleSlice([1, 2, 3]));       // [1, 3]
console.log(middleOf([1, 2, 3, 4]));             // [2, 3]
console.log(toArray(deleteMiddleNode(fromArray([1, 3, 4, 7, 1, 2, 6])))); // [1,3,4,1,2,6]

module.exports = { deleteMiddle, deleteMiddleBoth, deleteMiddleSlice, middleOf, deleteMiddleNode, ListNode, fromArray, toArray };
