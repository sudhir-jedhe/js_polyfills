1. Show the different ways of selecting an element from DOM
The element can be selected using its tagname, id, attribute, value etc
document.getElementById("elementId"); // elementId is id of the element
document.querySelector(".my-class"); // element having a class 'my-class'

Notes

Above selectors are used to select a first matching element reference even if mutliple matches be there

References

https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
2. Show the ways to loop over the Nodelist obtained after querying for the elements
The Nodelist can be obtained by queryng for multiple elements
As list of elements are array like object (not pure JS array), all the array methods can't be directly used
// Lets assume DOM elements are fetched in the variable domElements
for (let element of domElements) {
  // perform operation on element
}

References

https://developer.mozilla.org/en-US/docs/Web/API/NodeList
3. Design and Implement a Node Store, which supports DOM element as key
Implement it without using inbuilt Map
Can you do it in O(1) Time complexity?
class NodeStore {
  constructor() {
    this.store = {};
  }
  /**
   * @param {Node} node
   * @param {any} value
   */
  set(node, value) {
    node.__nodeIdentifier__ = Symbol();
    this.store[node.__nodeIdentifier__] = value;
  }
  /**
   * @param {Node} node
   * @return {any}
   */
  get(node) {
    return this.store[node.__nodeIdentifier__];
  }
 
  /**
   * @param {Node} node
   * @return {Boolean}
   */
  has(node) {
    return !!this.store[node.__nodeIdentifier__];
  }
}

References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
4. Implement a function to find the closest ancestor with the provided selector (Element.closest() method)
The closest() method traverses the Element and its parents (heading toward the document root) until it finds a node that matches the provided selector string. Will return itself or the matching ancestor. If no such element exists, it returns null.
Element.prototype.closest = function (selector) {
  var el = this;
  while (el) {
    if (el.matches(selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
};

References

https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
5. Write a function to find the corresponding node in two identical DOM trees
Given two same DOM tree A, B, and an Element a in A, find the corresponding Element b in B. By corresponding, we mean a and b have the same relative position to their DOM tree root.
const A = document.createElement("div");
A.innerHTML = `
<div>
<div>
  <div>
    <div id="node1"></div>
  </div>
  <div>
  </div>
  <div>
    <div>
      <p id="node2"></p>
    </div>
  </div>
<div>
</div>`;
 
const B = A.cloneNode(true);
const node1 = A.querySelector("#node1");
const node2 = A.querySelector("#node2");
const node1Target = B.querySelector("#node1");
const node2Target = B.querySelector("#node2");
 
findCorrespondingNode(A, B, node1); // node1Target
findCorrespondingNode(A, B, node2); // node2Target

const findCorrespondingNode = (rootA, rootB, target) => {
  if (rootA === target) return rootB;
 
  if (rootA.childElementCount) {
    for (let i = 0; i < rootA.childElementCount; i++) {
      let result = findCorrespondingNode(
        rootA.children[i],
        rootB.children[i],
        target
      );
      if (result) {
        return result;
      }
    }
  }
};

References

https://bigfrontend.dev/problem/find-corresponding-node-in-two-identical-DOM-tree
6. Write a function to get depth of a given DOM tree
A depth of a given DOM tree is the max depth till which DOM nodes are nested
/**
 * @param {HTMLElement | null} tree
 * @return {number}
 */
function getHeight(root) {
  if (!root) return 0;
 
  let maxDepth = 0;
 
  const helper = (current, depth = 1) => {
    if (current.hasChildNodes()) {
      for (let child of current.children) {
        helper(child, depth + 1);
      }
    }
    maxDepth = Math.max(maxDepth, depth);
  };
 
  helper(root);
  return maxDepth;
}

/***************************************** */
DFS
function getHeight(tree) {
  let maxHeight = 0;
  
  if (!tree) {
    return maxHeight;
  }
    
  for (let chid of tree.children) {
    maxHeight = Math.max(maxHeight, getHeight(chid)); 
  }
  return maxHeight + 1;
}


BFS
/**
 * @param {HTMLElement | null} tree
 * @return {number}
 */
function getHeight(tree) {
  let height = 0;
  if (!tree) return height;
  let q = [[tree, 1]];
  while(q.length) {
    const [node, h] = q.shift();
    height = Math.max(h, height);
    for(let child of node.children) {
      q.push([child, h + 1]);
    }
  }
  return height;
}


function getHeight(tree) {
  // your code here
  if (tree === null) return 0
  const queue = [tree]
  let height = 0
  while (queue.length > 0) {
    let count = queue.length
    height += 1
    while (count > 0) {
      const head = queue.shift()
      queue.push(...head.children)
      count -= 1
    }
  }
  return height
}

<div>
  <div>
    <p>
      <button>Hello</button>
    </p>
  </div>
  <p>
    <span>World!</span>
  </p>
</div>

// Height of a tree is the maximum depth from root node. Empty root node have a height of 0.

// If given DOM tree, can you create a function to get the height of it?

// For the DOM tree below, we have a height of 4
====> 4

7. Implement a function to get the root node of a given DOM fragment (document.getRootNode() method)
Root node is the topmost parent node of any given DOM fragment
/**
 * @param {HTMLElement | null} tree
 * @return {HTMLElement | null}
 */
function getRootNode(tree) {
  if (!tree) return null;
 
  while (tree.parentElement) {
    tree = tree.parentElement;
  }
 
  return tree;
}

References

https://javascript.info/dom-navigation
8. Implement a function to get unique tag names in a given DOM tree
/**
 * @param {HTMLElement | null} tree
 * @return {Array}
 */
function getUniqueTags(root, result = new Set()) {
  if (!root) return [];
 
  if (!result.has(root.tagName)) {
    result.add(root.tagName);
  }
 
  if (root.hasChildNodes()) {
    for (let child of root.children) {
      getUniqueTags(child, result);
    }
  }
 
  return [...result];
}

References

https://bigfrontend.dev/problem/get-DOM-tags
9. Implement a function to get elements by tag name (document.getElementsByTagName() method)
The getElementsByTagName method of Document interface returns an HTMLCollection of elements with the given tag name.
For example, document.getElementsByTagName('div') returns a collection of all div elements in the document.
/**
 * @param {HTMLElement | null} tree
 * @return {Array}
 */
function getElementsByTagName(root, tagName) {
  if (!root) return [];
 
  let result = [];
 
  if (root.tagName.toLowerCase() === tagName.toLowerCase()) {
    result.push(root);
  }
 
  if (root.hasChildNodes()) {
    for (let child of root.children) {
      result = result.concat(getElementsByTagName(child, tagName));
    }
  }
 
  return result;
}

References

https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName
10. Implement a function to check if a given DOM tree has duplicate IDs
In a given DOM tree, the id on each node has be unique
Although HTML is very forgiving, but we should avoid duplicate identifiers
/**
 * @param {HTMLElement | null} tree
 * @return {Boolean}
 */
function hasDuplicateId(tree, idSet = new Set()) {
  if (!tree) return false;
 
  if (idSet.has(tree.id)) return true;
 
  tree.id && idSet.add(tree.id);
 
  if (tree.hasChildNodes()) {
    for (let child of tree.children) {
      const result = hasDuplicateId(child, idSet);
      if (result) return true;
    }
  }
 
  return false;
}