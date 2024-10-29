/**
 * @param {HTMLElement} tree
 * @return {string[]}
 */
function getTags(tree) {
    const result = {};
    const dfs = (node, result) => {
      if(!node) {
        return;
      }
      result[node.tagName.toLowerCase()] = 1;
      for (const child of node.children) {
        dfs(child, result);
      }
    }
    dfs(tree, result);
    return Object.keys(result);
  }


  /*********************** */

  
/**
 * @param {HTMLElement} tree
 * @return {string[]}
 */
function getTags(tree) {
    // your code here
    const treeWalker = document.createTreeWalker(tree, NodeFilter.SHOW_ELEMENT=true);
    ans = new Set();
    let cur = treeWalker.currentNode;
    while(cur){
      ans.add(cur.tagName.toLowerCase());
      cur = treeWalker.nextNode();
    }
    return Array.from(ans);
  }

  /**************************** */


  
/**
 * @param {HTMLElement} tree
 * @return {string[]}
 */
function getTags(tree) {
    const set = new Set()
    
    const stack = [tree]
    
    while (stack.length > 0) {
      const top = stack.pop()
      set.add(top.tagName.toLowerCase())
      stack.push(...top.children)
    }
    
    return [...set]
  }


//   Given a DOM tree, please return all the tag names it has.

// Your function should return a unique array of tags names in lowercase, order doesn't matter.