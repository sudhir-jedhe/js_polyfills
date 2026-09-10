/**
 * Left view of a binary tree.
 *
 * The first node encountered at each level, i.e. what you would see
 * standing to the left of the tree.
 *
 * Time  O(n)
 * Space O(w) for the widest level
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/** Level-order: take the first node of each level. */
function leftView(root) {
  const out = [];
  let level = root ? [root] : [];

  while (level.length) {
    out.push(level[0].val);
    level = level.flatMap((n) => [n.left, n.right].filter(Boolean));
  }

  return out;
}

/**
 * Depth-first: visit left before right and record the first node seen at
 * each new depth. O(h) space instead of O(w).
 */
function leftViewDFS(root) {
  const out = [];

  function walk(node, depth) {
    if (!node) return;

    if (depth === out.length) out.push(node.val); // first at this depth

    walk(node.left, depth + 1);
    walk(node.right, depth + 1);
  }

  walk(root, 0);
  return out;
}

/** Right view — the same walk with the children swapped (LeetCode 199). */
function rightView(root) {
  const out = [];

  function walk(node, depth) {
    if (!node) return;
    if (depth === out.length) out.push(node.val);

    walk(node.right, depth + 1);
    walk(node.left, depth + 1);
  }

  walk(root, 0);
  return out;
}

/** Full level-order traversal. */
function levelOrder(root) {
  const out = [];
  let level = root ? [root] : [];

  while (level.length) {
    out.push(level.map((n) => n.val));
    level = level.flatMap((n) => [n.left, n.right].filter(Boolean));
  }

  return out;
}

/** Boundary traversal: left view + leaves + reversed right view. */
function boundaryTraversal(root) {
  if (!root) return [];

  const leaves = [];
  const collectLeaves = (node) => {
    if (!node) return;
    if (!node.left && !node.right) leaves.push(node.val);
    collectLeaves(node.left);
    collectLeaves(node.right);
  };
  collectLeaves(root);

  const left = leftView(root).filter((v) => !leaves.includes(v));
  const right = rightView(root).filter((v) => !leaves.includes(v)).reverse();

  return [...new Set([...left, ...leaves, ...right.slice(0, -1)])];
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
const tree = fromLevelOrder([1, 2, 3, 4, 5, null, 6]);

console.log(leftView(tree));     // [1, 2, 4]
console.log(leftViewDFS(tree));  // [1, 2, 4]
console.log(rightView(tree));    // [1, 3, 6]
console.log(levelOrder(tree));   // [[1], [2,3], [4,5,6]]

module.exports = { TreeNode, leftView, leftViewDFS, rightView, levelOrder, boundaryTraversal, fromLevelOrder };
