/**
 * Add Two Numbers (LeetCode 2).
 *
 * Two non-empty linked lists represent non-negative integers with the
 * digits stored in REVERSE order. Add them and return the sum as a list.
 *
 * 342 + 465 = 807  ->  [2,4,3] + [5,6,4] = [7,0,8]
 *
 * Time  O(max(m, n))
 * Space O(max(m, n)) for the output
 */

class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

const fromArray = (arr) => arr.reduceRight((next, val) => new ListNode(val, next), null);

function toArray(head) {
  const out = [];
  for (let node = head; node; node = node.next) out.push(node.val);
  return out;
}

/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @returns {ListNode}
 */
function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(); // sentinel so we never special-case the head
  let tail = dummy;
  let carry = 0;

  let a = l1;
  let b = l2;

  while (a || b || carry) {
    const sum = (a?.val ?? 0) + (b?.val ?? 0) + carry;

    carry = sum >= 10 ? 1 : 0;
    tail.next = new ListNode(sum % 10);
    tail = tail.next;

    a = a?.next ?? null;
    b = b?.next ?? null;
  }

  return dummy.next;
}

/**
 * Forward-order variant (LeetCode 445): digits stored most-significant
 * first. Reverse, add, reverse back — or use stacks, as here.
 */
function addTwoNumbersForward(l1, l2) {
  const stackA = toArray(l1);
  const stackB = toArray(l2);

  let carry = 0;
  let head = null;

  while (stackA.length || stackB.length || carry) {
    const sum = (stackA.pop() ?? 0) + (stackB.pop() ?? 0) + carry;
    carry = sum >= 10 ? 1 : 0;
    head = new ListNode(sum % 10, head); // prepend
  }

  return head;
}

/** Sanity check with BigInt, since the numbers can exceed Number precision. */
const listToBigInt = (head) => BigInt(toArray(head).reverse().join('') || '0');

// ---- Examples ----
console.log(toArray(addTwoNumbers(fromArray([2, 4, 3]), fromArray([5, 6, 4])))); // [7,0,8]
console.log(toArray(addTwoNumbers(fromArray([0]), fromArray([0]))));             // [0]
console.log(toArray(addTwoNumbers(fromArray([9, 9, 9]), fromArray([1]))));       // [0,0,0,1]
console.log(toArray(addTwoNumbersForward(fromArray([7, 2, 4, 3]), fromArray([5, 6, 4])))); // [7,8,0,7]
console.log(listToBigInt(fromArray([2, 4, 3])).toString()); // '342'

module.exports = { ListNode, addTwoNumbers, addTwoNumbersForward, fromArray, toArray };
