/**
 * Bottom view of a binary tree.
 *
 * Assign each node a horizontal distance (hd): root is 0, left child is
 * hd - 1, right child is hd + 1. The bottom view keeps, for each hd, the
 * node seen LAST in a level-order traversal.
 *
 * Time  O(n)
 * Space O(n)
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * @param {TreeNode | null} root
 * @returns {number[]} left to right
 */
function bottomView(root) {
  if (!root) return [];

  const byDistance = new Map(); // hd -> value
  const queue = [{ node: root, hd: 0 }];

  while (queue.length) {
    const { node, hd } = queue.shift();

    // Level order means later writes are lower down, so overwrite freely.
    byDistance.set(hd, node.val);

    if (node.left) queue.push({ node: node.left, hd: hd - 1 });
    if (node.right) queue.push({ node: node.right, hd: hd + 1 });
  }

  return [...byDistance.entries()].sort((a, b) => a[0] - b[0]).map(([, val]) => val);
}

/** Top view: keep the FIRST node seen at each horizontal distance. */
function topView(root) {
  if (!root) return [];

  const byDistance = new Map();
  const queue = [{ node: root, hd: 0 }];

  while (queue.length) {
    const { node, hd } = queue.shift();

    if (!byDistance.has(hd)) byDistance.set(hd, node.val);

    if (node.left) queue.push({ node: node.left, hd: hd - 1 });
    if (node.right) queue.push({ node: node.right, hd: hd + 1 });
  }

  return [...byDistance.entries()].sort((a, b) => a[0] - b[0]).map(([, val]) => val);
}

/** Left view: the first node of every level. */
function leftView(root) {
  const out = [];
  if (!root) return out;

  let level = [root];
  while (level.length) {
    out.push(level[0].val);
    level = level.flatMap((n) => [n.left, n.right].filter(Boolean));
  }

  return out;
}

/** Right view: the last node of every level (LeetCode 199). */
function rightView(root) {
  const out = [];
  if (!root) return out;

  let level = [root];
  while (level.length) {
    out.push(level[level.length - 1].val);
    level = level.flatMap((n) => [n.left, n.right].filter(Boolean));
  }

  return out;
}

// ---- Examples ----
//        20
//      /    \
//     8      22
//    / \    /  \
//   5   3  4    25
//      / \
//     10  14
const root = new TreeNode(
  20,
  new TreeNode(8, new TreeNode(5), new TreeNode(3, new TreeNode(10), new TreeNode(14))),
  new TreeNode(22, new TreeNode(4), new TreeNode(25))
);

console.log(bottomView(root)); // [5, 10, 4, 14, 25]
console.log(topView(root));    // [5, 8, 20, 22, 25]
console.log(leftView(root));   // [20, 8, 5, 10]
console.log(rightView(root));  // [20, 22, 25, 14]

module.exports = { TreeNode, bottomView, topView, leftView, rightView };
