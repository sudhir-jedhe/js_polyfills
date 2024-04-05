```js
let arr = [23, 0, "gfg", false, true, NaN, 12, "hi", undefined, [], ""];

function removeFalse(arr) {
  // Return the first parameter of the callback function
  return arr.filter((val) => val);
}

console.log(removeFalse(arr));
```

```js
let arr = [23, 0, "gfg", false, true, NaN, 12, "hi", undefined, [], ""];

function removeFalse(arr) {
  // Passing Boolean constructor inside filter
  return arr.filter(Boolean);
}

console.log(removeFalse(arr));
```