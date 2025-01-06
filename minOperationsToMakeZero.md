The provided function `minOperationsToMakeZero` aims to compute the minimum number of operations needed to make all elements of the `nums` array equal to zero. In each operation, it subtracts the smallest non-zero element from all non-zero elements of the array.

Let's break down your solution:

### **Logic**
1. **Find the smallest non-zero element**:
   - The smallest non-zero element is identified and stored in `minNonZero`.
   - The algorithm will perform operations until all elements are reduced to zero.

2. **Subtract the smallest non-zero element**:
   - In each operation, the smallest non-zero element is subtracted from all non-zero elements of the array.
   - The number of operations is counted.

3. **Repeat until all elements become zero**:
   - After each operation, the smallest non-zero element is recalculated because it might change once some elements are reduced to zero.

### **Analysis**
This approach works correctly, but it has some inefficiencies:
1. **Finding the smallest non-zero element repeatedly**: This is done twice for every iteration: once before the loop starts and once at the end of each operation. This can be optimized to reduce redundant work.

2. **Subtracting the same value from all elements in each iteration**: This is fine, but the way the smallest non-zero element is recalculated can be optimized by leveraging the set of distinct non-zero elements.

### **Optimization**
Instead of recalculating the smallest non-zero element in every iteration, we can:
- **Sort the array** once and remove zeros.
- **Subtract the distinct values in order** from the array, counting each distinct subtraction as one operation.

### **Optimized Solution**

Here's the optimized version of the function:

```javascript
function minOperationsToMakeZero(nums) {
    // Remove zeros and sort the array in ascending order
    const distinctNonZero = [...new Set(nums.filter(num => num !== 0))].sort((a, b) => a - b);
    
    // The number of operations is equal to the number of distinct non-zero values
    return distinctNonZero.length;
}

// Test cases
console.log(minOperationsToMakeZero([1, 5, 0, 3, 5])); // Output: 3
console.log(minOperationsToMakeZero([0])); // Output: 0
```

### **Explanation of Optimized Code:**
1. **Removing Zeros**:
   - `nums.filter(num => num !== 0)` filters out all zeros from the array.
   
2. **Distinct Values**:
   - `[...new Set(...)]` ensures that we only get distinct non-zero values.
   
3. **Sorting**:
   - `.sort((a, b) => a - b)` sorts the distinct values in ascending order.
   
4. **Result**:
   - The minimum operations required to reduce all elements to zero are equal to the number of distinct non-zero values in the array.

### **Why This Optimization Works**:
1. **Efficient Calculation**:
   - Instead of repeatedly finding the smallest non-zero element after each operation, the distinct non-zero elements are sorted and counted only once.
   
2. **Performance**:
   - Sorting the array takes `O(n log n)` time where `n` is the number of elements in `nums`, and removing duplicates using `Set` operates in `O(n)`. Thus, this solution is much more efficient, especially for larger arrays.

### **Test Cases**

1. **Test Case 1:**
   ```javascript
   console.log(minOperationsToMakeZero([1, 5, 0, 3, 5])); // Output: 3
   ```
   - **Distinct non-zero values**: `[1, 3, 5]`
   - **Number of operations**: 3 (subtracting 1, then 3, then 5)

2. **Test Case 2:**
   ```javascript
   console.log(minOperationsToMakeZero([0])); // Output: 0
   ```
   - **No non-zero elements**: `[]`
   - **Number of operations**: 0

3. **Test Case 3:**
   ```javascript
   console.log(minOperationsToMakeZero([3, 3, 3, 3])); // Output: 1
   ```
   - **Distinct non-zero values**: `[3]`
   - **Number of operations**: 1 (subtracting 3)

### **Conclusion**
This optimized version ensures that the problem is solved with minimal computational overhead. The solution leverages sorting and unique values to efficiently calculate the number of operations needed.