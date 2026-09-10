/**
 * Path Sum (LeetCode 112 / 113 / 437).
 *
 * 112: does any ROOT-TO-LEAF path add up to the target?
 * 113: return all such paths.
 * 437: count paths that sum to the target, starting and ending anywhere.
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * Does a root-to-leaf path sum to `target`?
 * Time  O(n)
 * Space O(h)
 */
function hasPathSum(root, target) {
  if (!root) return false;

  // A leaf is the only place a path may end.
  if (!root.left && !root.right) return root.val === target;

  const remaining = target - root.val;
  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}

/** Every root-to-leaf path that reaches the target. */
function pathSumAll(root, target) {
  const out = [];
  const path = [];

  function walk(node, remaining) {
    if (!node) return;

    path.push(node.val);
    const left = remaining - node.val;

    if (!node.left && !node.right && left === 0) {
      out.push([...path]);
    } else {
      walk(node.left, left);
      walk(node.right, left);
    }

    path.pop(); // backtrack
  }

  walk(root, target);
  return out;
}

/**
 * Count paths summing to target, starting and ending at ANY node
 * (downward only). Prefix-sum map gives O(n) instead of O(n^2).
 */
function countPathSum(root, target) {
  const prefixCounts = new Map([[0, 1]]); // running sum -> how many times seen
  let count = 0;

  function walk(node, running) {
    if (!node) return;

    const sum = running + node.val;
    // Any earlier prefix equal to (sum - target) closes a valid path here.
    count += prefixCounts.get(sum - target) || 0;

    prefixCounts.set(sum, (prefixCounts.get(sum) || 0) + 1);
    walk(node.left, sum);
    walk(node.right, sum);
    prefixCounts.set(sum, prefixCounts.get(sum) - 1); // backtrack
  }

  walk(root, 0);
  return count;
}

/** Maximum root-to-leaf sum. */
function maxRootToLeafSum(root) {
  if (!root) return -Infinity;
  if (!root.left && !root.right) return root.val;
  return root.val + Math.max(maxRootToLeafSum(root.left), maxRootToLeafSum(root.right));
}

// ---- Examples ----
//       5
//      / \
//     4   8
//    /   / \
//   11  13  4
//  /  \      \
// 7    2      1
const root = new TreeNode(
  5,
  new TreeNode(4, new TreeNode(11, new TreeNode(7), new TreeNode(2))),
  new TreeNode(8, new TreeNode(13), new TreeNode(4, null, new TreeNode(1)))
);

console.log(hasPathSum(root, 22));   // true  (5 -> 4 -> 11 -> 2)
console.log(hasPathSum(root, 100));  // false
console.log(pathSumAll(root, 22));   // [[5,4,11,2]]
console.log(countPathSum(root, 22)); // paths anywhere in the tree
console.log(maxRootToLeafSum(root)); // 27  (5 + 8 + 13 ... check)

module.exports = { TreeNode, hasPathSum, pathSumAll, countPathSum, maxRootToLeafSum };
