// Nested Array Inorder Traversal Generator Medium 29 35.8% Acceptance In this
// lab, you will implement a generator function that performs an inorder
// traversal of a given multi-dimensional array of integers. The generator
// object should yield integers in the same order as the inorder traversal.

// A multi-dimensional array is a recursive data structure that contains both
// integers and other multi-dimensional arrays.

// Inorder traversal iterates over each array from left to right, yielding any
// integers it encounters or applying inorder traversal to any arrays it
// encounters.

// Examples

const arr = [[[6]], [1, 3], []];
const generator = inorderTraversal(arr);
generator.next().value; // 6
generator.next().value; // 1
generator.next().value; // 3
generator.next().done; // true

const arr = [];
const generator = inorderTraversal(arr);
generator.next().done; // true

// arr = [[[6]], [1, 3], []] will produce the output [6, 1, 3] after performing
// inorder traversal.

function* inorderTraversal(arr) {
  for (const element of arr) {
    if (Array.isArray(element)) {
      yield* inorderTraversal(element); // Recursively traverse sub-array
    } else {
      yield element; // Yield integer
    }
  }
}

// Example usage:
const multiDimensionalArray = [1, [2, 3], [4, [5, 6]]];
const generator = inorderTraversal(multiDimensionalArray);

for (const value of generator) {
  console.log(value);
}
