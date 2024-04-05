```javascript
export function map(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i], i));
  }
  return result;
}


const arr = [1, 2, 3, 4, 5];
const callback = (num, index) => num * index;
console.log(map(arr, callback)); // Output: [0, 2, 6, 12, 20]

```