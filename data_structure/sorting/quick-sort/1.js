Quick sort

Definition
Quicksort is a divide and conquer sorting algorithm. It first divides a large array into two smaller subarrays and then recursively sorts the subarrays.

Implementation
Use recursion.
Use the spread operator (...) to clone the original array, arr.
If the length of the array is less than 2, return the cloned array.
Use Math.floor() to calculate the index of the pivot element.
Use Array.prototype.reduce() and Array.prototype.push() to split the array into two subarrays. The first one contains elements smaller than or equal to pivot and the second on elements greater than it. Destructure the result into two arrays.
Recursively call quickSort() on the created subarrays.
const quickSort = arr => {
  const a = [...arr];
  if (a.length < 2) return a;
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = a[pivotIndex];
  const [lo, hi] = a.reduce(
    (acc, val, i) => {
      if (val < pivot || (val === pivot && i != pivotIndex)) {
        acc[0].push(val);
      } else if (val > pivot) {
        acc[1].push(val);
      }
      return acc;
    },
    [[], []]
  );
  return [...quickSort(lo), pivot, ...quickSort(hi)];
};

quickSort([1, 6, 1, 5, 3, 2, 1, 4]); // [1, 1, 1, 2, 3, 4, 5, 6]
Complexity
The algorithm has an average time complexity of O(n log n), where n is the size of the input array.