```js
function isNumber(value) {
  if (typeof value === "number") {
    return true;
  }
}

let data = [10, null, "30", 1.4, "falcon", undefined, true, 17];

let res = data.filter(isNumber);
console.log(res);
```