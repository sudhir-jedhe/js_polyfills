/**
 * Serialize and deserialize a binary tree (LeetCode 297).
 *
 * The key requirement: nulls must be encoded too, otherwise the structure
 * cannot be rebuilt. Preorder with null markers is the simplest correct
 * format; level order matches LeetCode's own input notation.
 *
 * Time  O(n) both ways
 * Space O(n)
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

const NULL = '#';
const SEP = ',';

/** Preorder with '#' for null. */
function serialize(root) {
  const parts = [];

  (function walk(node) {
    if (!node) {
      parts.push(NULL);
      return;
    }
    parts.push(String(node.val));
    walk(node.left);
    walk(node.right);
  })(root);

  return parts.join(SEP);
}

/** Rebuild from the preorder string. */
function deserialize(data) {
  const parts = String(data).split(SEP);
  let index = 0;

  function build() {
    const token = parts[index++];
    if (token === NULL || token === undefined) return null;

    const node = new TreeNode(Number(token));
    node.left = build();
    node.right = build();
    return node;
  }

  return build();
}

/** Level-order serialisation, matching LeetCode's array notation. */
function serializeLevelOrder(root) {
  if (!root) return '[]';

  const out = [];
  const queue = [root];

  while (queue.length) {
    const node = queue.shift();

    if (node) {
      out.push(node.val);
      queue.push(node.left, node.right);
    } else {
      out.push(null);
    }
  }

  // Trailing nulls carry no information.
  while (out.length && out[out.length - 1] === null) out.pop();
  return JSON.stringify(out);
}

/** Rebuild from level-order notation. */
function deserializeLevelOrder(data) {
  const values = JSON.parse(data);
  if (!values.length || values[0] == null) return null;

  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;

  while (queue.length && i < values.length) {
    const node = queue.shift();

    if (i < values.length) {
      const v = values[i++];
      if (v != null) queue.push((node.left = new TreeNode(v)));
    }

    if (i < values.length) {
      const v = values[i++];
      if (v != null) queue.push((node.right = new TreeNode(v)));
    }
  }

  return root;
}

/** Structural equality, to verify a round trip. */
const treesEqual = (a, b) => {
  if (!a && !b) return true;
  if (!a || !b || a.val !== b.val) return false;
  return treesEqual(a.left, b.left) && treesEqual(a.right, b.right);
};

/** Inorder traversal, for a quick look at the contents. */
function inorder(root) {
  const out = [];
  (function walk(node) {
    if (!node) return;
    walk(node.left);
    out.push(node.val);
    walk(node.right);
  })(root);
  return out;
}

// ---- Examples ----
const tree = deserializeLevelOrder('[1,2,3,null,null,4,5]');

const encoded = serialize(tree);
console.log(encoded);                      // '1,2,#,#,3,4,#,#,5,#,#'
console.log(inorder(deserialize(encoded)));// same contents
console.log(treesEqual(tree, deserialize(encoded))); // true

console.log(serializeLevelOrder(tree));    // '[1,2,3,null,null,4,5]'
console.log(serialize(null));              // '#'
console.log(deserialize('#'));             // null

module.exports = { TreeNode, serialize, deserialize, serializeLevelOrder, deserializeLevelOrder, treesEqual, inorder };
