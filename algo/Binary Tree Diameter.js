// Binary Tree Diameter
// Given the root to a Binary Tree, Return an integer that represents the diameter of the Binary Tree.

// A Diameter is the length of the longest path in the Binary Tree.

// Note: This not necessarily means that the path starts from the root node.

// Example
// Input Binary Tree

// Output
// Output = 6
// Explanation
// The longest path in the binary tree is 9->8->7->3->4->5->6. The number of edges are 6. Hence, the diameter of the Binary Tree is 6.


// The orange color highlight denotes the path of the diameter of the Binary Tree


class TreeInfo {
    constructor(diameter, height) {
      this.diameter = diameter
      this.height = height
    }
  }
  
  const diameterOfBinaryTree = (root) => {
    return getTreeInfo(root).diameter
  }
  
  const getTreeInfo = (tree) => {
    if (!tree) {
      return new TreeInfo(0, 0)
    }
  
    let leftTreeInfo = getTreeInfo(tree.left)
    let rightTreeInfo = getTreeInfo(tree.right)
    let longestPathThroughRoot = leftTreeInfo.height + rightTreeInfo.height
    let maximumDiameterSoFar = Math.max(
      leftTreeInfo.diameter,
      rightTreeInfo.diameter
    )
    let currentDiameter = Math.max(longestPathThroughRoot, maximumDiameterSoFar)
    let currentHeight = 1 + Math.max(leftTreeInfo.height, rightTreeInfo.height)
  
    return new TreeInfo(currentDiameter, currentHeight)
  }
  
  // Driver Code
  class BinaryTree {
    constructor(val) {
      this.left = null
      this.right = null
      this.val = val
    }
  }
  
  let root = new BinaryTree(1)
  root.left = new BinaryTree(3)
  root.right = new BinaryTree(2)
  root.left.left = new BinaryTree(7)
  root.left.left.left = new BinaryTree(8)
  root.left.left.left.left = new BinaryTree(9)
  
  root.left.right = new BinaryTree(4)
  root.left.right.right = new BinaryTree(5)
  root.left.right.right.right = new BinaryTree(6)
  
  // console.log('root', root)
  
  console.log(diameterOfBinaryTree(root))
  