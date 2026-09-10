/**
 * Check whether a binary tree is symmetric (LeetCode 101).
 *
 * A tree is symmetric when its left subtree mirrors its right subtree:
 * left.left mirrors right.right, and left.right mirrors right.left.
 *
 * Time  O(n)
 * Space O(h) for recursion, O(n) for the iterative queue
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/** Build a tree from a level-order array with nulls, like LeetCode input. */
function fromLevelOrder(values) {
  if (!values.length || values[0] == null) return null;

  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;

  while (queue.length && i < values.length) {
    const node = queue.shift();

    if (i < values.length) {
      const v = values[i++];
      if (v != null) {
        node.left = new TreeNode(v);
        queue.push(node.left);
      }
    }

    if (i < values.length) {
      const v = values[i++];
      if (v != null) {
        node.right = new TreeNode(v);
        queue.push(node.right);
      }
    }
  }

  return root;
}

/** Recursive mirror check. */
function isSymmetric(root) {
  const isMirror = (a, b) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.val === b.val && isMirror(a.left, b.right) && isMirror(a.right, b.left);
  };

  return !root || isMirror(root.left, root.right);
}

/** Iterative version with an explicit queue of pairs. */
function isSymmetricIterative(root) {
  if (!root) return true;

  const queue = [[root.left, root.right]];

  while (queue.length) {
    const [a, b] = queue.shift();

    if (!a && !b) continue;
    if (!a || !b || a.val !== b.val) return false;

    queue.push([a.left, b.right], [a.right, b.left]);
  }

  return true;
}

/** Produce the mirror image of a tree (LeetCode 226). */
function invertTree(root) {
  if (!root) return null;
  return new TreeNode(root.val, invertTree(root.right), invertTree(root.left));
}

/** Are two trees identical (LeetCode 100)? */
const isSameTree = (a, b) => {
  if (!a && !b) return true;
  if (!a || !b || a.val !== b.val) return false;
  return isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
};

// ---- Examples ----
console.log(isSymmetric(fromLevelOrder([1, 2, 2, 3, 4, 4, 3])));      // true
console.log(isSymmetric(fromLevelOrder([1, 2, 2, null, 3, null, 3])));// false
console.log(isSymmetricIterative(fromLevelOrder([1, 2, 2])));         // true
console.log(isSymmetric(null));                                       // true
console.log(isSameTree(fromLevelOrder([1, 2]), fromLevelOrder([1, 2])));// true

module.exports = { TreeNode, isSymmetric, isSymmetricIterative, invertTree, isSameTree, fromLevelOrder };
