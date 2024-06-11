```js
export function construct2DArray(original, m, n) {
  const totalElements = m * n;
  if (original.length !== totalElements) {
    return []; // Impossible to construct the 2D array
  }

  const result = [];
  let index = 0;

  for (let i = 0; i < m; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      row.push(original[index]);
      index++;
    }
    result.push(row);
  }

  return result;
}


const original = [1, 2, 3, 4, 5, 6];
const m = 2;
const n = 3;
console.log(construct2DArray(original, m, n)); // Output: [[1, 2, 3], [4, 5, 6]]

console.log(construct2DArray([1,2,3,4], 2, 2)); // Output: [[1,2],[3,4]]
console.log(construct2DArray([1,2,3], 1, 3)); // Output: [[1,2,3]]
console.log(construct2DArray([1,2], 1, 1)); // Output: []

```