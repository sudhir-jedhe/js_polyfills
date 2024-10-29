/**
 * @param {HTMLElement | null} root
 * @return {HTMLElement[]}
 */
function flatten(root) {
    const result = [];
    if (!root) {
      return result;
    }
    const queue = [root];
    while (queue.length) {
      const node = queue.shift();
      result.push(node);
      for (const child of node.children) {
        queue.push(child);
      }
    }
    return result;
  }

  /************************* */

  function flatten(root) {
  
    const result = [];
    const q = new Queue(root ? [root] : []);
    while(q.size) {
      const node = q.dequeue();
      result.push(node);
      for(const child of node.children) {
        q.enqueue(child);
      }
    }
    return result;
  }
  class Queue {
    constructor(arr) {
      this.front = 0;
      this.back = 0;
      this.data = new Map();
      for(const item of arr) {
        this.enqueue(item);
      }
    }
    get size() {
      return this.data.size;
    }
    enqueue(item) {
      this.data.set(this.back++, item);
    }
    dequeue() {
      if (!this.size) return null;
      const item = this.data.get(this.front);
      this.data.delete(this.front++);
      return item;
    }
  }
   5
   mute

   /********************************* */


   
/**
 * @param { HTMLElement } root
 * @returns { HTMLElement[] }
 */
function flatten(root) {
    if (root === null) return []
    
    const queue = [root]
    
    const result = []
    
    while (queue.length > 0) {
      const head = queue.shift()
      result.push(head)
      queue.push(...head.children)
    }
    
    return result
  }


  function flatten(root) {
    if(!root) return [];
    const result = [];
    const queue = [root];
    while(queue.length !== 0) {
      const current = queue.shift();
      result.push(current);
      if(current.hasChildNodes()) {
        queue.push(...current.children);
      }
    }
    return result;
  }

  // Given a DOM tree, flatten it into an one dimensional array, in the order of layer by layer, like below.