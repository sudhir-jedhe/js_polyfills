/**
 * Find the inorder predecessor (and successor) of a key in a BST.
 *
 * Predecessor: the largest value smaller than the key.
 * Successor: the smallest value larger than the key.
 *
 * Walking down the tree gives O(h) without any traversal or extra space.
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
 * @param {number} key
 * @returns {TreeNode | null}
 */
function inorderPredecessor(root, key) {
  let predecessor = null;
  let node = root;

  while (node) {
    if (node.val < key) {
      predecessor = node;  // a candidate; look for a bigger one on the right
      node = node.right;
    } else {
      node = node.left;    // too big, go smaller
    }
  }

  return predecessor;
}

/** The mirror walk. */
function inorderSuccessor(root, key) {
  let successor = null;
  let node = root;

  while (node) {
    if (node.val > key) {
      successor = node;
      node = node.left;
    } else {
      node = node.right;
    }
  }

  return successor;
}

/** Both in one pass. */
function findPredecessorAndSuccessor(root, key) {
  return {
    predecessor: inorderPredecessor(root, key)?.val ?? null,
    successor: inorderSuccessor(root, key)?.val ?? null,
  };
}

/** Inorder traversal — a BST's inorder walk is sorted. */
function inorder(root) {
  const out = [];
  const stack = [];
  let node = root;

  while (node || stack.length) {
    while (node) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop();
    out.push(node.val);
    node = node.right;
  }

  return out;
}

/** Insert into a BST. */
function insert(root, value) {
  if (!root) return new TreeNode(value);
  if (value < root.val) root.left = insert(root.left, value);
  else if (value > root.val) root.right = insert(root.right, value);
  return root;
}

/** Build a BST from values. */
const buildBst = (values) => values.reduce((root, v) => insert(root, v), null);

// ---- Examples ----
const bst = buildBst([20, 8, 22, 4, 12, 10, 14]);

console.log(inorder(bst));                        // [4, 8, 10, 12, 14, 20, 22]
console.log(inorderPredecessor(bst, 12)?.val);    // 10
console.log(inorderSuccessor(bst, 12)?.val);      // 14
console.log(findPredecessorAndSuccessor(bst, 4)); // { predecessor: null, successor: 8 }
console.log(findPredecessorAndSuccessor(bst, 13));// { predecessor: 12, successor: 14 }

module.exports = { TreeNode, inorderPredecessor, inorderSuccessor, findPredecessorAndSuccessor, inorder, insert, buildBst };
