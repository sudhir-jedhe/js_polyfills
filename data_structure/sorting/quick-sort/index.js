// Implement a function that performs a recursive quick sort.
// The function should take in an array of integers.
// The output should be an array with the input sorted in ascending order.

// Examples
// quickSort([9, 3, 6, 2, 1, 11]); // [1, 2, 3, 6, 9, 11]
// quickSort([12, 16, 14, 1, 2, 3]); // [1, 2, 3, 12, 14, 16]
// Recap
// Quick sort is an efficient, in-place, recursive sorting algorithm that selects a "pivot" element and partitions all other elements into 2 subarrays:

// Elements that are smaller than the pivot are added in 1 subarray that is placed before the pivot.
// Elements that are larger than the pivot are added in 1 subarray that is placed after the pivot.
// The quick sort is then recursively applied to each subarray. and once the subarrays are sorted they are then merged back with the pivot element between them as per above.
