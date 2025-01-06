Your code is almost perfect for implementing the `groupBy` function using JavaScript's `reduce` method. This function groups the objects in an array by the specified key, which in your case is the `age` property. Here's a breakdown and clarification of your code:

### Explanation:
1. **Input**: An array of objects and a key to group by (in this case, `age`).
2. **Logic**:
   - The `reduce` method is used to iterate over the `array` of objects.
   - For each object, it checks if there’s already a key in the accumulator (`rv`) corresponding to the `obj[key]`. 
   - If it doesn’t exist, it initializes an empty array (`[]`) for that key. Then, it pushes the current object (`obj`) into the corresponding array.
   - Finally, it returns the accumulator (`rv`), which contains the grouped results.
3. **Output**: The result will be an object where the keys are the values of `age`, and the values are arrays of people who have that `age`.

### Code:
```javascript
const people = [
  { name: "Alice", age: 28 },
  { name: "Bob", age: 35 },
  { name: "Charlie", age: 28 },
  { name: "David", age: 42 },
];

const groupBy = (array, key) => {
  return array.reduce(function (rv, obj) {
    // If the key doesn't exist in the accumulator, initialize it as an empty array
    (rv[obj[key]] = rv[obj[key]] || []).push(obj);
    return rv;
  }, {});
};

const result = groupBy(people, "age");
console.log(result);
```

### Expected Output:
```javascript
{
  28: [
    { name: 'Alice', age: 28 },
    { name: 'Charlie', age: 28 }
  ],
  35: [
    { name: 'Bob', age: 35 }
  ],
  42: [
    { name: 'David', age: 42 }
  ]
}
```

### Key Details:
- The key `age` is used to group people in the resulting object.
- Each key in the resulting object is an age, and the corresponding value is an array of people with that age.
- If there are multiple people with the same age, they will be placed in an array under that age key.

### Edge Cases:
- **Empty Array**: If the input array is empty, the result will also be an empty object.
- **Non-Existing Key**: If you pass a key that doesn’t exist in any of the objects, the result will be an empty object (`{}`).
- **Different Types for the Key**: If the key has mixed types (like `string` and `number`), it will treat them as separate keys in the object. For instance, if some people have an age represented as a string (`"28"`) and others as a number (`28`), they will be grouped under different keys.

### Example of Edge Case:
```javascript
const people2 = [
  { name: "Alice", age: "28" },
  { name: "Bob", age: 28 }
];

const result2 = groupBy(people2, "age");
console.log(result2);
// Output:
// {
//   "28": [ { name: 'Alice', age: '28' } ],
//   28: [ { name: 'Bob', age: 28 } ]
// }
```

To handle cases where the key might appear in different types (like `string` vs `number`), you can convert the key to a consistent type (e.g., `String` or `Number`) before grouping.

### Improved version to handle mixed types:
```javascript
const groupBy = (array, key) => {
  return array.reduce(function (rv, obj) {
    // Ensure the key is treated as a string (or any other desired type)
    const keyValue = String(obj[key]); // Ensures uniformity
    (rv[keyValue] = rv[keyValue] || []).push(obj);
    return rv;
  }, {});
};
```

This ensures that `"28"` and `28` are grouped together under the same key.