/**
 * Palindrome Linked List (LeetCode 234).
 *
 * The O(1)-space answer: find the middle with slow/fast pointers, reverse
 * the second half, compare the two halves, then restore the list.
 *
 * Time  O(n)
 * Space O(1)
 */

class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

/** Build a list from an array. */
const fromArray = (arr) => arr.reduceRight((next, val) => new ListNode(val, next), null);

/** Read a list back into an array. */
function toArray(head) {
  const out = [];
  for (let node = head; node; node = node.next) out.push(node.val);
  return out;
}

/** Reverse a list in place and return the new head. */
function reverseList(head) {
  let prev = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}

/**
 * @param {ListNode | null} head
 * @returns {boolean}
 */
function isPalindrome(head) {
  if (!head || !head.next) return true;

  // 1. Find the middle: fast moves twice as fast as slow.
  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 2. Reverse the second half.
  let secondHalf = reverseList(slow.next);
  const secondHalfHead = secondHalf;

  // 3. Compare.
  let first = head;
  let equal = true;
  while (secondHalf) {
    if (first.val !== secondHalf.val) {
      equal = false;
      break;
    }
    first = first.next;
    secondHalf = secondHalf.next;
  }

  // 4. Restore the list so the caller's data is untouched.
  slow.next = reverseList(secondHalfHead);

  return equal;
}

/** O(n) space version — simpler, and fine when the list is small. */
function isPalindromeArray(head) {
  const values = toArray(head);
  for (let i = 0, j = values.length - 1; i < j; i++, j--) {
    if (values[i] !== values[j]) return false;
  }
  return true;
}

// ---- Examples ----
console.log(isPalindrome(fromArray([1, 2, 2, 1])));    // true
console.log(isPalindrome(fromArray([1, 2, 3, 2, 1]))); // true
console.log(isPalindrome(fromArray([1, 2])));          // false
console.log(isPalindrome(fromArray([1])));             // true

const list = fromArray([1, 2, 2, 1]);
isPalindrome(list);
console.log(toArray(list)); // [1,2,2,1] — restored, not left reversed

module.exports = { ListNode, isPalindrome, isPalindromeArray, reverseList, fromArray, toArray };
