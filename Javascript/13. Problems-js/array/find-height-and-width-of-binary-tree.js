/**
 * Find the height and the maximum width of a binary tree.
 *
 * Height: longest root-to-leaf path, counted in nodes.
 * Width: the largest number of nodes on any single level. The version that
 * counts null gaps too (LeetCode 662) uses index arithmetic.
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/** Height in nodes. An empty tree has height 0. Time O(n), Space O(h). */
const height = (root) => (root ? 1 + Math.max(height(root.left), height(root.right)) : 0);

/** Height measured in edges — one less, and -1 for an empty tree. */
const heightInEdges = (root) => height(root) - 1;

/** Iterative height, level by level — avoids deep recursion. */
function heightIterative(root) {
  if (!root) return 0;

  let level = [root];
  let levels = 0;

  while (level.length) {
    levels++;
    level = level.flatMap((n) => [n.left, n.right].filter(Boolean));
  }

  return levels;
}

/** Maximum number of actual nodes on one level. */
function maxWidth(root) {
  if (!root) return 0;

  let best = 0;
  let level = [root];

  while (level.length) {
    best = Math.max(best, level.length);
    level = level.flatMap((n) => [n.left, n.right].filter(Boolean));
  }

  return best;
}

/**
 * Maximum width counting the null gaps between the outermost nodes
 * (LeetCode 662). Each node carries its position index in a complete tree.
 */
function maxWidthWithGaps(root) {
  if (!root) return 0;

  let best = 0;
  let level = [{ node: root, index: 0n }];

  while (level.length) {
    const first = level[0].index;
    const last = level[level.length - 1].index;
    best = Math.max(best, Number(last - first + 1n));

    const next = [];
    for (const { node, index } of level) {
      // Re-base the index each level so BigInt values stay small.
      const base = (index - first) * 2n;
      if (node.left) next.push({ node: node.left, index: base });
      if (node.right) next.push({ node: node.right, index: base + 1n });
    }

    level = next;
  }

  return best;
}

/** Number of nodes at each level. */
function levelSizes(root) {
  const out = [];
  let level = root ? [root] : [];

  while (level.length) {
    out.push(level.length);
    level = level.flatMap((n) => [n.left, n.right].filter(Boolean));
  }

  return out;
}

/** Is the tree height-balanced (LeetCode 110)? */
function isBalanced(root) {
  const check = (node) => {
    if (!node) return 0;

    const left = check(node.left);
    if (left === -1) return -1;

    const right = check(node.right);
    if (right === -1 || Math.abs(left - right) > 1) return -1;

    return 1 + Math.max(left, right);
  };

  return check(root) !== -1;
}

// ---- Examples ----
//     1
//    / \
//   2   3
//  / \   \
// 4   5   6
const root = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3, null, new TreeNode(6))
);

console.log(height(root));           // 3
console.log(heightInEdges(root));    // 2
console.log(heightIterative(root));  // 3
console.log(maxWidth(root));         // 3
console.log(maxWidthWithGaps(root)); // 4
console.log(levelSizes(root));       // [1, 2, 3]
console.log(isBalanced(root));       // true

module.exports = { TreeNode, height, heightInEdges, heightIterative, maxWidth, maxWidthWithGaps, levelSizes, isBalanced };
