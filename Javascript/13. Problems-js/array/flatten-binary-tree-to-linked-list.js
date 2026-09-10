/**
 * Flatten a binary tree to a linked list (LeetCode 114).
 *
 * The list follows PREORDER, and reuses the `right` pointer as `next` with
 * every `left` set to null.
 *
 * Morris-style flattening does it in O(1) extra space.
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * O(1) space: for each node with a left subtree, find that subtree's
 * rightmost node, graft the current right subtree onto it, then move the
 * left subtree across.
 */
function flatten(root) {
  let node = root;

  while (node) {
    if (node.left) {
      // Rightmost node of the left subtree — the predecessor in preorder.
      let predecessor = node.left;
      while (predecessor.right) predecessor = predecessor.right;

      predecessor.right = node.right;
      node.right = node.left;
      node.left = null;
    }

    node = node.right;
  }

  return root;
}

/** Recursive version — reverse preorder, keeping a running "previous". */
function flattenRecursive(root) {
  let previous = null;

  const walk = (node) => {
    if (!node) return;

    walk(node.right);
    walk(node.left);

    node.right = previous;
    node.left = null;
    previous = node;
  };

  walk(root);
  return root;
}

/** Preorder traversal, iterative. */
function preorder(root) {
  const out = [];
  const stack = root ? [root] : [];

  while (stack.length) {
    const node = stack.pop();
    out.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }

  return out;
}

/** Read a flattened tree as a list. */
function toList(root) {
  const out = [];
  for (let node = root; node; node = node.right) out.push(node.val);
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
const tree = fromLevelOrder([1, 2, 5, 3, 4, null, 6]);
console.log(preorder(tree));           // [1, 2, 3, 4, 5, 6]
console.log(toList(flatten(tree)));    // [1, 2, 3, 4, 5, 6]

const tree2 = fromLevelOrder([1, 2, 5, 3, 4, null, 6]);
console.log(toList(flattenRecursive(tree2))); // [1, 2, 3, 4, 5, 6]

module.exports = { TreeNode, flatten, flattenRecursive, preorder, toList, fromLevelOrder };
