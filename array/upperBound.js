// In JavaScript, finding the upper bound of an array typically refers to determining the smallest element in the array that is strictly greater than a given value. This is commonly used in binary search algorithms or in problems where you want to find the "next higher" element in a sorted array.

// However, JavaScript doesn't provide a built-in function specifically for the upper bound. Instead, you can achieve this behavior using binary search on a sorted array.

// Upper Bound in a Sorted Array
// Given a sorted array arr and a target value x, the upper bound is the index of the first element in the array that is strictly greater than x. If no such element exists (i.e., all elements in the array are less than or equal to x), the upper bound would be the length of the array, indicating that no greater element exists.

// Algorithm:
// Binary Search: You perform a binary search to find the smallest element strictly greater than the target x.
// If such an element exists, return its index.
// If no such element exists, return the length of the array.



function upperBound(arr, x) {
    let left = 0;
    let right = arr.length;
  
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] <= x) {
        left = mid + 1;  // The element at mid is not greater than x, so move right
      } else {
        right = mid;  // We found a potential upper bound, so narrow the search to the left half
      }
    }
  
    return left;  // Left is the index of the first element greater than x
  }

  
  const arr = [1, 3, 5, 7, 9];
console.log(upperBound(arr, 5));  // Output: 3, since arr[3] = 7 is the smallest element greater than 5.
console.log(upperBound(arr, 4));  // Output: 2, since arr[2] = 5 is the smallest element greater than 4.
console.log(upperBound(arr, 9));  // Output: 5, because there's no element greater than 9, so the upper bound is the length of the array.
