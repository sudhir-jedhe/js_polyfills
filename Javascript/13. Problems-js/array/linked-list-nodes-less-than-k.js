/**
 * Sum and product of all the nodes in a linked list whose values are less
 * than k.
 *
 * One traversal, accumulating both. The product starts at 1, and returning
 * null when nothing qualifies is clearer than returning a bare 1.
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

/**
 * @param {ListNode | null} head
 * @param {number} k
 * @returns {{ sum: number, product: number | null, count: number }}
 */
function sumAndProductLessThanK(head, k) {
  let sum = 0;
  let product = 1;
  let count = 0;

  for (let node = head; node; node = node.next) {
    if (node.val < k) {
      sum += node.val;
      product *= node.val;
      count++;
    }
  }

  return { sum, product: count ? product : null, count };
}

/** The same for values GREATER than k. */
function sumAndProductGreaterThanK(head, k) {
  let sum = 0;
  let product = 1;
  let count = 0;

  for (let node = head; node; node = node.next) {
    if (node.val > k) {
      sum += node.val;
      product *= node.val;
      count++;
    }
  }

  return { sum, product: count ? product : null, count };
}

/** With any predicate. */
function aggregateWhere(head, predicate) {
  let sum = 0;
  let product = 1;
  let count = 0;
  let min = Infinity;
  let max = -Infinity;

  for (let node = head; node; node = node.next) {
    if (!predicate(node.val)) continue;

    sum += node.val;
    product *= node.val;
    count++;
    min = Math.min(min, node.val);
    max = Math.max(max, node.val);
  }

  return count
    ? { sum, product, count, min, max, mean: sum / count }
    : { sum: 0, product: null, count: 0, min: null, max: null, mean: null };
}

/** Remove every node whose value is less than k. */
function removeLessThanK(head, k) {
  const dummy = new ListNode(0, head);
  let previous = dummy;

  while (previous.next) {
    if (previous.next.val < k) previous.next = previous.next.next;
    else previous = previous.next;
  }

  return dummy.next;
}

const fromArray = (arr) => arr.reduceRight((next, val) => new ListNode(val, next), null);
const toArray = (head) => {
  const out = [];
  for (let n = head; n; n = n.next) out.push(n.val);
  return out;
};

// ---- Examples ----
const list = fromArray([2, 5, 1, 8, 3]);

console.log(sumAndProductLessThanK(list, 5));    // { sum: 6, product: 6, count: 3 }
console.log(sumAndProductGreaterThanK(list, 5)); // { sum: 8, product: 8, count: 1 }
console.log(aggregateWhere(list, (v) => v % 2 === 0));
console.log(toArray(removeLessThanK(fromArray([2, 5, 1, 8, 3]), 3))); // [5, 8, 3]
console.log(sumAndProductLessThanK(fromArray([9, 9]), 5)); // product null

module.exports = { ListNode, sumAndProductLessThanK, sumAndProductGreaterThanK, aggregateWhere, removeLessThanK, fromArray, toArray };
