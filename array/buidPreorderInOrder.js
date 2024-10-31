class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function buildTree(preorder, inorder) {
    // Map to store indices of inorder elements for quick lookup
    const inorderMap = new Map();
    inorder.forEach((val, idx) => inorderMap.set(val, idx));
    
    // Recursive helper function
    function buildTreeHelper(preorder, inorder, preorderStart, preorderEnd, inorderStart, inorderEnd) {
        if (preorderStart > preorderEnd || inorderStart > inorderEnd) {
            return null;
        }
        
        // Root value from preorder
        const rootValue = preorder[preorderStart];
        const root = new TreeNode(rootValue);
        
        // Find index of rootValue in inorder array
        const rootIndexInorder = inorderMap.get(rootValue);
        
        // Calculate sizes of left and right subtrees
        const leftSubtreeSize = rootIndexInorder - inorderStart;
        const rightSubtreeSize = inorderEnd - rootIndexInorder;
        
        // Recursively build left and right subtrees
        root.left = buildTreeHelper(preorder, inorder, 
                                    preorderStart + 1, preorderStart + leftSubtreeSize, 
                                    inorderStart, rootIndexInorder - 1);
        root.right = buildTreeHelper(preorder, inorder, 
                                     preorderEnd - rightSubtreeSize + 1, preorderEnd, 
                                     rootIndexInorder + 1, inorderEnd);
        
        return root;
    }
    
    // Start the recursive build
    return buildTreeHelper(preorder, inorder, 0, preorder.length - 1, 0, inorder.length - 1);
}

// Example usage:
const preorder1 = [3,9,20,15,7];
const inorder1 = [9,3,15,20,7];
console.log(buildTree(preorder1, inorder1));


/************************************************ */

function TreeNode(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
  
  function buildTree(preorder, inorder) {
    if (!preorder || !inorder) return null;
  
    const rootVal = preorder[0];
    const rootIndex = inorder.indexOf(rootVal);
  
    const leftPreorder = preorder.slice(1, rootIndex + 1);
    const rightPreorder = preorder.slice(rootIndex + 1);
    const leftInorder = inorder.slice(0, rootIndex);
    const rightInorder = inorder.slice(rootIndex + 1);
  
    const root = new TreeNode(rootVal);
    root.left = buildTree(leftPreorder, leftInorder);
    root.right = buildTree(rightPreorder, rightInorder);
  
    return root;
  }
  
  // Example usage
  const preorder = [3, 9, 20, 15, 7];
  const inorder = [9, 3, 15, 20, 7];
  const root = buildTree(preorder, inorder);
  console.log(root); // Output: TreeNode { val: 3, left: TreeNode { val: 9, left: null, right: null }, right: TreeNode { val: 20, left: TreeNode { val: 15, left: null, right: null }, right: TreeNode { val: 7, left: null, right: null } } }
  