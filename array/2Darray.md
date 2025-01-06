Certainly! Here's the full code for each of the functions described earlier:

### 1. **`initialize2DArray(width, height, val = null)`**

```javascript
const initialize2DArray = (width, height, val = null) =>
  Array.from({ length: height }).map(() =>
    Array.from({ length: width }).fill(val)
  );

// Example usage:
console.log(initialize2DArray(2, 2, 0)); // [[0, 0], [0, 0]]
```

---

### 2. **`initializeNDArray(val, ...args)`**

```javascript
const initializeNDArray = (val, ...args) =>
  args.length === 0
    ? val
    : Array.from({ length: args[0] }).map(() =>
        initializeNDArray(val, ...args.slice(1))
      );

// Example usage:
console.log(initializeNDArray(1, 3)); // [1, 1, 1]
console.log(initializeNDArray(5, 2, 2, 2)); // [[[5, 5], [5, 5]], [[5, 5], [5, 5]]]
```

---

### 3. **`initializeMapped2DArray(width, height, mapFn = () => null)`**

```javascript
const initializeMapped2DArray = (width, height, mapFn = () => null) =>
  Array.from({ length: height }).map((_, i) =>
    Array.from({ length: width }).map((_, j) => mapFn(i, j))
  );

// Example usage:
console.log(initializeMapped2DArray(2, 2, (x, y) => `(${x}, ${y})`));
// [['(0, 0)', '(0, 1)'], ['(1, 0)', '(1, 1)']]
```

---

### 4. **`initializeSkewed2DArray(heigh, widthFn = () => h, mapFn = () => null)`**

```javascript
const initializeSkewed2DArray = (heigh, widthFn = () => h, mapFn = () => null) =>
  Array.from({ length: heigh }, (_, i) =>
    Array.from({ length: widthFn(i) }).map((_, j) => mapFn(i, j))
  );

// Example usage:
console.log(initializeSkewed2DArray(5, i => i + 1, (x, y) => x * y));
// [[0], [0, 1], [0, 2, 4], [0, 3, 6, 9], [0, 4, 8, 12, 16]]
```

---

### Explanation:

1. **`initialize2DArray(2, 2, 0)`**:
   - Creates a 2x2 array where all elements are `0`.
   - Output: `[[0, 0], [0, 0]]`.

2. **`initializeNDArray(1, 3)`**:
   - Creates a 1-dimensional array with 3 elements, each initialized to `1`.
   - Output: `[1, 1, 1]`.

3. **`initializeNDArray(5, 2, 2, 2)`**:
   - Creates a 3-dimensional array with size `2x2x2`, each initialized to `5`.
   - Output: `[[[5, 5], [5, 5]], [[5, 5], [5, 5]]]`.

4. **`initializeMapped2DArray(2, 2, (x, y) => \`(${x}, ${y})\`)`**:
   - Creates a 2x2 array with each element being a string with its row and column indices.
   - Output: `[['(0, 0)', '(0, 1)'], ['(1, 0)', '(1, 1)']]`.

5. **`initializeSkewed2DArray(5, i => i + 1, (x, y) => x * y)`**:
   - Creates a skewed 2D array where the number of elements in each row increases with the row index and each element is the product of row and column indices.
   - Output: `[[0], [0, 1], [0, 2, 4], [0, 3, 6, 9], [0, 4, 8, 12, 16]]`.

These functions are flexible and can be used to generate multi-dimensional arrays with customized dimensions and initial values.