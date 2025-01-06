Here is the full solution with code that demonstrates how to create a target array based on the given `nums` and `index` arrays.

### `createTargetArray.js`

```javascript
export function createTargetArray(nums, index) {
  const target = [];  // Initialize the target array
  for (let i = 0; i < nums.length; i++) {
    // Insert the element nums[i] at the position index[i] in the target array
    target.splice(index[i], 0, nums[i]);
  }
  return target;  // Return the final target array
}
```

### `main.js`

```javascript
import { createTargetArray } from "./createTargetArray.js";

// Example 1
const nums1 = [0, 1, 2, 3, 4];
const index1 = [0, 1, 2, 2, 1];
console.log(createTargetArray(nums1, index1));  // Output: [0, 4, 1, 3, 2]

// Example 2
const nums2 = [1, 2, 3, 4, 0];
const index2 = [0, 1, 2, 3, 0];
console.log(createTargetArray(nums2, index2));  // Output: [0, 1, 2, 3, 4]

// Example 3
const nums3 = [1];
const index3 = [0];
console.log(createTargetArray(nums3, index3));  // Output: [1]
```

### Explanation of Code:

1. **`createTargetArray.js`**:
   - The function `createTargetArray` takes two arguments: `nums` and `index`.
   - It initializes an empty `target` array.
   - It loops through the `nums` array and inserts each element into the `target` array at the position specified by the corresponding value in the `index` array using `splice`.

2. **`main.js`**:
   - The examples demonstrate how the function works with different inputs.
   - For each example, it prints the result of calling `createTargetArray` with different `nums` and `index` arrays.

### Example Outputs:

1. **Example 1**:
   - Input: `nums = [0, 1, 2, 3, 4]`, `index = [0, 1, 2, 2, 1]`
   - Output: `[0, 4, 1, 3, 2]`

2. **Example 2**:
   - Input: `nums = [1, 2, 3, 4, 0]`, `index = [0, 1, 2, 3, 0]`
   - Output: `[0, 1, 2, 3, 4]`

3. **Example 3**:
   - Input: `nums = [1]`, `index = [0]`
   - Output: `[1]`

### Time and Space Complexity:

- **Time Complexity**: The time complexity is **O(n * m)** where `n` is the length of the `nums` array, and `m` is the number of elements that need to be shifted for each insertion. `splice` performs this operation, and it can take linear time based on the array's length.
  
- **Space Complexity**: The space complexity is **O(n)** because the target array is built based on the size of the `nums` array.

This solution works correctly for moderate-sized inputs.