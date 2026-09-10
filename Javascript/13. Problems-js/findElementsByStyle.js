/**
 * Find DOM elements by computed style.
 *
 * Return every element whose computed value for `property` equals `value`.
 * Browser-only: needs `document` and `window.getComputedStyle`.
 */

/**
 * @param {string} property CSS property name, e.g. 'color', 'display'
 * @param {string} value    expected computed value, e.g. 'rgb(255, 0, 0)'
 * @param {ParentNode} [root=document] subtree to search
 * @returns {Element[]}
 */
function findElementsByStyle(property, value, root = typeof document !== 'undefined' ? document : null) {
  if (!root || typeof window === 'undefined') {
    throw new Error('findElementsByStyle requires a browser environment');
  }

  const matches = [];

  for (const el of root.querySelectorAll('*')) {
    const computed = window.getComputedStyle(el).getPropertyValue(property).trim();
    if (computed === value) matches.push(el);
  }

  return matches;
}

/**
 * Recursive walk — same result without querySelectorAll,
 * and it descends into open shadow roots.
 */
function findElementsByStyleDeep(property, value, node = document.body, out = []) {
  if (node.nodeType === 1) {
    const computed = window.getComputedStyle(node).getPropertyValue(property).trim();
    if (computed === value) out.push(node);
    if (node.shadowRoot) {
      for (const child of node.shadowRoot.children) {
        findElementsByStyleDeep(property, value, child, out);
      }
    }
  }
  for (const child of node.children || []) {
    findElementsByStyleDeep(property, value, child, out);
  }
  return out;
}

// ---- Example (run in a browser) ----
// const redText = findElementsByStyle('color', 'rgb(255, 0, 0)');
// const hidden  = findElementsByStyle('display', 'none');

module.exports = { findElementsByStyle, findElementsByStyleDeep };
