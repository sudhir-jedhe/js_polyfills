//

// Implement a function that performs a heap sort. The function should take in an array of integers and return an array with the integers sorted in ascending order. The input array is modified in-place.

// Examples
// heapSort([9, 3, 6, 2, 1, 11]); // [1, 2, 3, 6, 9, 11]
// heapSort([12, 16, 14, 1, 2, 3]); // [1, 2, 3, 12, 14, 16]
// Recap

// Heap sort is a comparison-based sorting algorithm that iteratively builds the unsorted array into a max heap data structure to identify the max element, and progressively swaps it to the end of the unsorted array to build a sorted array.

// Max Heaps
// To understand heap sort, we need to first understand the heap data structure:

// A binary heap is a partially ordered, complete binary tree which satisfies a heap property, similar to binary search trees, but with different ordering.
// Heap property = Specific relationship between the parent and child nodes which specifies their order. One example is the max heap property, which specifies that all parent nodes have to >= than their child nodes. The order between child nodes on the same level does not matter. Hence, the largest nodes are always on the top, and the smallest nodes are at the bottom. Nodes on the same level are unordered:Max heap illustration
// Complete binary tree = All levels of the tree are completely filled. If the last level is partially filled, it is filled first from left to right.
// Heaps are frequently implemented as arrays. We can use the following formula to compute the parent, left child and right child's indexes within the array representation of a heap:
// Left child idx = 2 * parentIdx + 1
// Right child idx = 2 * parentIdx + 2
// Max heap array representation
// How Heap Sort Works
// A heap sort essentially works by the following steps:

// Heap sort steps
