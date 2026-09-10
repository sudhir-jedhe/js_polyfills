/**
 * Right view of a binary tree (LeetCode 199).
 *
 * The last node at each level — what you would see standing to the right.
 *
 * Time  O(n)
 * Space O(h) for the DFS, O(w) for the BFS
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/** Level order: take the last node of each level. */
function rightView(root) {
  const out = [];
  let level = root ? [root] : [];

  while (level.length) {
    out.push(level[level.length - 1].val);
    level = level.flatMap((n) => [n.left, n.right].filter(Boolean));
  }

  return out;
}

/**
 * DFS visiting RIGHT before left, recording the first node seen at each new
 * depth. O(h) space.
 */
function rightViewDFS(root) {
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

/** Left view — the mirror. */
function leftView(root) {
  const out = [];

  function walk(node, depth) {
    if (!node) return;
    if (depth === out.length) out.push(node.val);

    walk(node.left, depth + 1);
    walk(node.right, depth + 1);
  }

  walk(root, 0);
  return out;
}

/** Top view: the first node at each horizontal distance from the root. */
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

  return [...byDistance.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v);
}

/** Bottom view: the LAST node at each horizontal distance. */
function bottomView(root) {
  if (!root) return [];

  const byDistance = new Map();
  const queue = [{ node: root, hd: 0 }];

  while (queue.length) {
    const { node, hd } = queue.shift();
    byDistance.set(hd, node.val);

    if (node.left) queue.push({ node: node.left, hd: hd - 1 });
    if (node.right) queue.push({ node: node.right, hd: hd + 1 });
  }

  return [...byDistance.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v);
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
const tree = fromLevelOrder([1, 2, 3, null, 5, null, 4]);

console.log(rightView(tree));    // [1, 3, 4]
console.log(rightViewDFS(tree)); // [1, 3, 4]
console.log(leftView(tree));     // [1, 2, 5]
console.log(topView(tree));
console.log(bottomView(tree));

module.exports = { TreeNode, rightView, rightViewDFS, leftView, topView, bottomView, fromLevelOrder };
