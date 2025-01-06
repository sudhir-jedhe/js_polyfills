Your implementation of the `descendingOrder` function looks good! It correctly checks the input, constructs a descending sequence, and returns it. However, I’ll provide an improved version that simplifies the logic a bit, including handling edge cases more elegantly, such as non-positive integers and invalid inputs.

Here's an enhanced version of the function:

### Improved `descendingOrder` Function:

```javascript
function descendingOrder(n) {
    // Check if the input is a positive integer
    if (typeof n !== 'number' || n <= 0 || !Number.isInteger(n)) {
        return "Invalid input";
    }

    // Create an array with a sequence from n to 1 using Array.from and reverse
    return Array.from({ length: n }, (_, i) => n - i);
}

// Example usage:
const sequence = descendingOrder(10);
console.log(sequence); // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
```

### Explanation of the Changes:
1. **Input Validation**:
   - We added an extra check to make sure `n` is a number (`typeof n !== 'number'`). This helps catch cases where the input isn't a number (e.g., a string or an object).
   - The check for `n <= 0` and `!Number.isInteger(n)` is kept to ensure that `n` is a positive integer.

2. **Array Creation**:
   - Instead of manually pushing values in a loop, we used `Array.from` to create the array. `Array.from` allows us to create an array of a given length (`n`) and populate it with values.
   - The value of each index is computed using `n - i`, where `i` is the current index in the generated array. This ensures the numbers are in descending order from `n` to `1`.

### Example Usage:

```javascript
const sequence = descendingOrder(10);
console.log(sequence); // Output: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

const invalidSequence = descendingOrder(-5);
console.log(invalidSequence); // Output: "Invalid input"
```

### Benefits of the New Implementation:
1. **Concise**: We eliminated the manual loop in favor of `Array.from`, which makes the code cleaner and easier to read.
2. **Performance**: While performance may not significantly differ for small arrays, `Array.from` can be a more efficient way to generate and transform arrays.
3. **Edge Case Handling**: The enhanced validation ensures that invalid inputs like non-integer values or negative numbers are properly handled with the message `"Invalid input"`.

This function is now more robust and efficient, while still providing the expected descending sequence when the input is valid.