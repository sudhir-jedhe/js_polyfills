/**
 * Top view of a binary tree.
 *
 * Assign each node a horizontal distance (root 0, left -1, right +1). The
 * top view keeps the FIRST node seen at each distance in a level-order
 * traversal — level order matters, because a DFS could reach a deeper node
 * at a new distance before a shallower one.
 *
 * Time  O(n log n) for the final sort
 * Space O(n)
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/** First node at each horizontal distance, level order. */
function topView(root) {
  if (!root) return [];

  const seen = new Map(); // hd -> value
  const queue = [{ node: root, hd: 0 }];

  while (queue.length) {
    const { node, hd } = queue.shift();

    if (!seen.has(hd)) seen.set(hd, node.val);

    if (node.left) queue.push({ node: node.left, hd: hd - 1 });
    if (node.right) queue.push({ node: node.right, hd: hd + 1 });
  }

  return [...seen.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v);
}

/** Bottom view: the LAST node at each horizontal distance. */
function bottomView(root) {
  if (!root) return [];

  const seen = new Map();
  const queue = [{ node: root, hd: 0 }];

  while (queue.length) {
    const { node, hd } = queue.shift();
    seen.set(hd, node.val);

    if (node.left) queue.push({ node: node.left, hd: hd - 1 });
    if (node.right) queue.push({ node: node.right, hd: hd + 1 });
  }

  return [...seen.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v);
}

/**
 * Vertical order traversal (LeetCode 987): every node grouped by
 * horizontal distance, ordered by depth then value within a column.
 */
function verticalOrder(root) {
  if (!root) return [];

  const columns = new Map();

  (function walk(node, hd, depth) {
    if (!node) return;

    if (!columns.has(hd)) columns.set(hd, []);
    columns.get(hd).push({ depth, val: node.val });

    walk(node.left, hd - 1, depth + 1);
    walk(node.right, hd + 1, depth + 1);
  })(root, 0, 0);

  return [...columns.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, nodes]) =>
      nodes.sort((a, b) => a.depth - b.depth || a.val - b.val).map((n) => n.val)
    );
}

/** The horizontal distance of every node, for inspection. */
function horizontalDistances(root) {
  const out = [];

  (function walk(node, hd) {
    if (!node) return;
    out.push({ value: node.val, hd });
    walk(node.left, hd - 1);
    walk(node.right, hd + 1);
  })(root, 0);

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
//        1
//      /   \
//     2     3
//      \      \
//       4      5
//        \
//         6
const root = fromLevelOrder([1, 2, 3, null, 4, null, 5]);
root.left.right.right = new TreeNode(6);

console.log(topView(root));    // [2, 1, 3, 5]
console.log(bottomView(root));
console.log(verticalOrder(root));
console.log(horizontalDistances(root));

module.exports = { TreeNode, topView, bottomView, verticalOrder, horizontalDistances, fromLevelOrder };
