```js
const arr = [2, 3];
arr.push(4); // [2, 3, 4]
arr.unshift(1); // [1, 2, 3, 4]


const arr = [3, 4];
arr.push(5, 6); // [3, 4, 5, 6]
arr.unshift(1, 2); // [1, 2, 3, 4, 5, 6]

const arr = [1, 2, 3];
const otherArr = [4, 5, 6];
arr.push(...otherArr); // [1, 2, 3, 4, 5, 6]
arr.unshift(...otherArr); // [4, 5, 6, 1, 2, 3, 4, 5, 6]
```