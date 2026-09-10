/**
 * Implement getElementsByClassName.
 *
 * Walk the DOM and collect every element carrying the given class name,
 * without using the built-in querySelectorAll / getElementsByClassName.
 */

/**
 * @param {string} className
 * @param {Element} [root=document.body]
 * @returns {Element[]}
 */
function getElementsByClassName(className, root = typeof document !== 'undefined' ? document.body : null) {
  if (!root) throw new Error('Requires a browser environment');

  const result = [];

  /** @param {Element} node */
  function walk(node) {
    if (node.nodeType === 1 && node.classList.contains(className)) {
      result.push(node);
    }
    for (const child of node.children) walk(child);
  }

  walk(root);
  return result;
}

/** Iterative version using an explicit stack (no recursion depth limit). */
function getElementsByClassNameIterative(className, root = document.body) {
  const result = [];
  const stack = [root];

  while (stack.length) {
    const node = stack.pop();
    if (node.nodeType === 1 && node.classList.contains(className)) {
      result.push(node);
    }
    // push in reverse so children are visited left-to-right
    for (let i = node.children.length - 1; i >= 0; i--) stack.push(node.children[i]);
  }

  return result;
}

// ---- Example (run in a browser) ----
// getElementsByClassName('btn');

module.exports = { getElementsByClassName, getElementsByClassNameIterative };
