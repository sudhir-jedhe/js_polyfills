```js

function isInRange(val) {
  return val >= this.lower && val <= this.upper;
}

let range = {
  lower: 1,
  upper: 10,
};

let data = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

let res = data.filter(isInRange, range);
console.log(res);

```