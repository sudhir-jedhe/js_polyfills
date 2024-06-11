const smallestDifference = (arr1, arr2) => {
    arr1.sort((a, b) => a - b);
    arr2.sort((a, b) => a - b);
  
    let i = 0;
    let j = 0;
    let smallest = Infinity;
    let current = Infinity;
    let smallestPair = [];
  
    while (i < arr1.length && j < arr2.length) {
      let firstNum = arr1[i];
      let secondNum = arr2[j];
      if (firstNum < secondNum) {
        current = secondNum - firstNum;
        i++;
      } else if (firstNum > secondNum) {
        current = firstNum - secondNum;
        j++;
      } else {
        return [firstNum, secondNum];
      }
  
      if (current < smallest) {
        smallest = current;
        smallestPair = [firstNum, secondNum];
      }
    }
    return smallestPair;
  };
  const arr1 = [1, 2, 3, 4, 5, 6];
  const arr2 = [12, 13, 14, 15, 16, 17];
  
  console.log(smallestDifference(arr1, arr2));
  

//   Smallest Difference
// Given two arrays of integers, find the pair of values (one value in each array) with the smallest (non-negative) difference.

// Note: Pick only one element from each of the arrays.

// Example 1
// Input
// arr1 = [-1, 5, 10, 20, 28, 3]
// arr2 = [26, 134, 135, 15, 17]
// Output
// [ 28, 26 ]
// Explanation
// The smallest difference between elements from the first array and elements from the second array is = 2. This comes when 5th element from arr1 i.e. 28 is subtracted from the first element from arr2 i.e. 26. Hence, the answer is [28, 26]

// Example 2
// Input
// arr1 = [1, 2, 3, 4, 5, 6]
// arr2 = [12, 13, 14, 15, 16, 17]
// Output
// [ 6, 12 ]
// Explanation
// The smallest difference will be 12 - 6 = 6. Hence, [6, 12] is returned.

// Constraints
// -10^6 <= arr1[i] <= 10^6
// -10^6 <= arr2[i] <= 10^6

// 1 <= arr1.length <= 1000
// 1 <= arr2.length <= 1000