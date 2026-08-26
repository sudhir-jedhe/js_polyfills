*** copy customFlat.md ***

Here is the complete translation and step-by-step solution to the depth-controlled array flattening challenge.

---

### Solution: Recursive Array Flatten with Depth Control

To implement custom depth control (replicating `Array.prototype.flat(depth)`), add a `depth` parameter (defaulting to `1`). On every recursive step, decrement `depth - 1` until `depth === 0`.

```javascript
function customFlat(arr, depth = 1) {
  const result = [];

  for (const item of arr) {
    // If the item is an array AND we still have depth remaining to flatten
    if (Array.isArray(item) && depth > 0) {
      // Recursively flatten with decremented depth and spread the output
      result.push(...customFlat(item, depth - 1));
    } else {
      // Push element as-is (either primitive or nested array beyond depth limit)
      result.push(item);
    }
  }

  return result;
}

```

---

### Test Cases & Output Verification

```javascript
const nestedArray = [1, [2, [3, [4, 5]]]];

// Depth 0: No flattening
console.log(customFlat(nestedArray, 0));
// Output: [1, [2, [3, [4, 5]]]]

// Depth 1: Flattens 1 level (default behavior of Array.prototype.flat())
console.log(customFlat(nestedArray, 1));
// Output: [1, 2, [3, [4, 5]]]

// Depth 2: Flattens 2 levels
console.log(customFlat(nestedArray, 2));
// Output: [1, 2, 3, [4, 5]]

// Infinite depth (flattens completely)
console.log(customFlat(nestedArray, Infinity));
// Output: [1, 2, 3, 4, 5]

```

---

### Alternative: Using `Array.prototype.reduce`

Interviewers frequently ask for a functional programming version of this exact logic:

```javascript
const flattenWithDepth = (arr, depth = 1) =>
  depth > 0
    ? arr.reduce(
        (acc, val) =>
          acc.concat(Array.isArray(val) ? flattenWithDepth(val, depth - 1) : val),
        []
      )
    : arr.slice();

```

---

### Alternative: Iterative Solution (Avoiding Call Stack Overflow)

For ultra-deep arrays where recursion exceeds the maximum call stack limit:

```javascript
function iterativeFlat(arr, depth = 1) {
  // Store pairs of [item, currentRemainingDepth]
  const stack = arr.map((item) => [item, depth]);
  const result = [];

  while (stack.length > 0) {
    const [current, currentDepth] = stack.pop();

    if (Array.isArray(current) && currentDepth > 0) {
      // Push items back onto stack with decremented depth
      for (let i = current.length - 1; i >= 0; i--) {
        stack.push([current[i], currentDepth - 1]);
      }
    } else {
      result.push(current);
    }
  }

  return result;
}

```
