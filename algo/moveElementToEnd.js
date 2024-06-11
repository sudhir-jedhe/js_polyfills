// Move Element
// Given an array and a target value, move all instances of that target value to the end end of the array

// Example
// Input
// Input: [2, 1, 2, 2, 2, 3, 4, 2];
// Target: 2
// Output
// Output: [4, 1, 3, 2, 2, 2, 2, 2]
// Explanation
// All the occurences of 2 are moved at the end of the array.

// Example
// Input
// Input: [1, 1, 1, 1, 1, 4, 1, 1, 1, 1];
// Target: 1
// Output
// Output: [4, 1, 1, 1, 1, 1, 1, 1, 1, 1]
// Explanation
// All the occurences of 1 are moved at the end of the array.

// Constraints
// 0 <= Input Array <= 10^3


// Time: O(N)
const moveElementToEnd = (arr, val) => {
    let left = 0;
    let right = arr.length - 1;
  
    while (left < right) {
      if (arr[left] === val) {
        let temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        right--;
      } else {
        left++;
      }
    }
    return arr;
  };
  
  const arr = [2, 1, 2, 2, 2, 3, 4, 2];
  console.log(moveElementToEnd(arr, 2));
  