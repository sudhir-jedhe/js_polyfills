/**
 * Invert a binary tree (LeetCode 226) — recursive and iterative.
 *
 * Swap the left and right child of every node.
 *
 * Time  O(n)
 * Space O(h) recursive, O(n) iterative in the worst case
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/** Recursive, mutating in place. */
function invertTree(root) {
  if (!root) return null;

  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}

/** Recursive, returning a NEW tree and leaving the original untouched. */
const invertTreeImmutable = (root) =>
  root ? new TreeNode(root.val, invertTreeImmutable(root.right), invertTreeImmutable(root.left)) : null;

/** Iterative, breadth-first with a queue. */
function invertTreeBFS(root) {
  const queue = root ? [root] : [];

  while (queue.length) {
    const node = queue.shift();
    [node.left, node.right] = [node.right, node.left];

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return root;
}

/** Iterative, depth-first with a stack. */
function invertTreeDFS(root) {
  const stack = root ? [root] : [];

  while (stack.length) {
    const node = stack.pop();
    [node.left, node.right] = [node.right, node.left];

    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }

  return root;
}

/** Level-order output, so the inversion is visible. */
function levelOrder(root) {
  const out = [];
  let level = root ? [root] : [];

  while (level.length) {
    out.push(level.map((n) => n.val));
    level = level.flatMap((n) => [n.left, n.right].filter(Boolean));
  }

  return out;
}

/** Build from a level-order array with nulls. */
function fromLevelOrder(values) {
  if (!values.length || values[0] == null) return null;

  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;

  while (queue.length && i < values.length) {
    const node = queue.shift();

    const l = values[i++];
    if (l != null) queue.push((node.left = new TreeNode(l)));

    const r = values[i++];
    if (r != null) queue.push((node.right = new TreeNode(r)));
  }

  return root;
}

// ---- Examples ----
console.log(levelOrder(invertTree(fromLevelOrder([4, 2, 7, 1, 3, 6, 9]))));
// [[4], [7, 2], [9, 6, 3, 1]]

console.log(levelOrder(invertTreeBFS(fromLevelOrder([1, 2, 3]))));  // [[1], [3, 2]]
console.log(levelOrder(invertTreeDFS(fromLevelOrder([1, 2]))));     // [[1], [2]]

const original = fromLevelOrder([1, 2, 3]);
const inverted = invertTreeImmutable(original);
console.log(levelOrder(original), levelOrder(inverted)); // original untouched

module.exports = { TreeNode, invertTree, invertTreeImmutable, invertTreeBFS, invertTreeDFS, levelOrder, fromLevelOrder };
