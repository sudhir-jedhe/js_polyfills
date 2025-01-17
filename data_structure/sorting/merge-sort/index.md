// Implement a function that performs a recursive merge sort. The function should be recursive and takes in an array of integers. The output should be an array with the input sorted in ascending order.

// Recursive Merge Sort expected input and output

// Examples
// mergeSort([9, 3, 6, 2, 1, 11]); // [1, 2, 3, 6, 9, 11]
// mergeSort([12, 16, 14, 1, 2, 3]); // [1, 2, 3, 12, 14, 16]
// Recap
// Merge sort is a recursive algorithm that divides and conquers - it continuously divides the input array into two halves until it cannot be further divided (i.e. reaches the base case of array <= 1 element(s) - which by definition, is sorted). The "merge" section of the algorithm then repeatedly merges individually sorted subarrays into larger arrays until the entire array is merged.

// The merging process involves creating a new empty array and repeatedly taking the smallest element from either the first or second half. When one half is empty, we append all elements from the other half to the new array and return it.

// Recursive Merge Sort explanation

// Similar Questions
